import { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
/* import reactLogo from "./assets/react.svg"; */

import { listen } from '@tauri-apps/api/event'
import { appWindow } from '@tauri-apps/api/window'

import BButton from 'react-bootstrap/Button';
import BModal from 'react-bootstrap/Modal';

import { Button, Modal, Select, message, Row, Col } from 'antd';
const { Option } = Select;

import { Accounts } from './components/Accounts';

import { removeToast } from './redux/messageSlice';

import { Store } from 'tauri-plugin-store-api';
const store = new Store('.settings.dat');

import axios from 'axios';

import "./App.css";

import { invoke } from '@tauri-apps/api/tauri';

function App() {
  appWindow.maximize();
  const [show, setShow] = useState(false);
  const [token, setToken] = useState("");
  const [accs, setAccs] = useState(null);
  const [ranks, setRanks] = useState(null);
  const [createState, setCreateState] = useState(0);

  const [isAccEditModalOpen, setIsAccEditModalOpen] = useState(false);
  const [AccEditId, setAccEditId] = useState(-1);


  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.message.toasts);

  useEffect(() => {
    if (toasts && toasts.length > 0) {
      toasts.forEach((toast) => {
        messageApi.open({
          type: toast.type,
          content: toast.content,
        });
        dispatch(removeToast(toast.id));
      });
    }
  }, [toasts, messageApi, dispatch]);

  const handleClose = () => {
    setIsAccEditModalOpen(false);
    setShow(false);
  }

  const handleShow = async() => {
    /* console.log(document.querySelector("input.token")) */
    /* document.querySelector("input.token").value = await store.get('token') */
    /* console.log(await store.get('token')) */
    setToken(await store.get('token'))
    return setShow(true);
  }

  const handleAccEditShow = (e) =>{
    let { currentTarget } = e;
    setAccEditId(currentTarget.id)
    setCreateState(false);
    setIsAccEditModalOpen(true);
  }

  const handleAccAddShow = () =>{
    
  }

  async function loadAccs(){
    axios.post('https://vaccs-express.vercel.app/',{
        token:await store.get('token')
    }).then(res=>{
        setAccs(res.data)
    }).catch(err=>{
        if(err.response.request.status==403)
            setAccs(403)
        else
            console.log(err)
    })
  }

  async function loadRanks(){
    try{
      const raw = await fetch('https://vranks.rkrao.me/ranks.json', {
        header: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'}
      })
      const res = await raw.json()
      setRanks(res);
    }
    catch(err){
      console.log(err)
    }
    /* await axios.get('https://rajeevkrao.github.io/valorant-ranks/ranks.json', {mode: 'no-cors'}).then(res=>{
        setRanks(res.data)
    }).catch(err=>{
        console.log(err)
    }) */
  }

  useEffect(()=>{
    loadAccs()
    loadRanks()
  },[])

  appWindow.setTitle('Valorant Smurf Accounts')

  const saveToken = async() => {
    await store.set('token', token);
    return handleClose()
  }




  listen('addToken',e=>{
    handleShow()
  })

  listen('addAccount',e=>{
    setCreateState(true);
    setIsAccEditModalOpen(true);
  })

  listen('refresh',e=>{
    location.reload();
  })

  let ChangeData = () => {
    const [name,setName] = useState(AccEditId!=-1?accs[AccEditId].name?accs[AccEditId].name:"":"");
    const [password,setPassword] = useState(AccEditId!=-1?accs[AccEditId].password:"");
    const [rank,setRank] = useState(AccEditId!=-1?accs[AccEditId].rank:"Unranked");
    const [username,setUsername] = useState("");
    console.log(createState)

    const reset = () =>{
      setUsername("")
      setName("")
      setPassword("")
      setRank("Unranked")
    }

    async function handleEditChange(e){
      setRank(e)
    }

    async function save(){
      if(createState&&!username){
        messageApi.open({
          type: 'error',
          content: "Cannot save without Username",
        });
        return;
      }
      if(!password){
        messageApi.open({
          type: 'error',
          content: "Cannot save without Password",
        });
        return;
      }
      if(createState){
        axios.post('https://vaccs-express.vercel.app/addid',{
        token:await store.get('token'),
        username,name,password,rank
      }).then(()=>{
        messageApi.open({
          type: 'success',
          content: 'Account Added',
        });
        setIsAccEditModalOpen(false)
        loadAccs();
      }).catch(err=>{
        messageApi.open({
          type: 'error',
          content: "Couldn't save the credentials",
        });
      })
      }
      else
      axios.post('https://vaccs-express.vercel.app/changedata',{
        token:await store.get('token'),
        username:accs[AccEditId].username,
        name,password,rank
      }).then(()=>{
        /* location.reload(); */
        messageApi.open({
          type: 'success',
          content: 'Credentials Changed',
        });
        setIsAccEditModalOpen(false)
        loadAccs();
        setAccEditId(-1)
      }).catch(err=>{
        messageApi.open({
          type: 'error',
          content: "Couldn't save the credentials",
        });
      })
    }

    const handleEditModalClose = () =>{
      setAccEditId(-1)
      setIsAccEditModalOpen(false)
    }

    const Username = () =>{
      if(createState)
        return(
          <>
          <label htmlFor="name">Username:</label><br/>
          <input id="username" type="text" value={username} onChange={(e)=>{setUsername(e.currentTarget.value)}}/><br/><br/>
          </>
        )
    }

    let SelectRanks = ()  =>{
      if(ranks)
        return(
          <>
          <Select
            defaultValue={rank}
            style={{ width: 150 }}
            onChange={handleEditChange}
          >
            {
              Object.keys(ranks).map(function(item,index){
                if(ranks[item])
                  var rankImage = ranks[item]
                return<Option key={index} value={item}>{item}<img style={{width:"2vw"}} src={rankImage}/></Option>
              })
            }
          </Select>
          </>
        )
    }

    const updateRankApi = async() => {
      try{
        const { data } = await axios.post('http://localhost:3000/updateRank', {username: accs[AccEditId].username})
        console.log({data})
      }
      catch(err){
        console.log(err);
      }
      
    }
    
    if(AccEditId != -1)
      var title = "Editting for Username: "+accs[AccEditId].username
      if(createState)
        title = "Add new Valorant ID"
      return(
        <>
        <Modal title={title} open={isAccEditModalOpen} onOk={(e)=>{save()}} onCancel={handleEditModalClose}>
          <Row justify="space-between">
            <Col span={12}>
              {
                createState?
                <>
                <label htmlFor="name">Username:</label><br/>
                <input id="username" type="text" value={username} onChange={(e)=>{setUsername(e.currentTarget.value)}}/><br/><br/>
                </>:
                <></>
              }
              <label htmlFor="name">Name:</label><br/>
              <input id="name" type="text" value={name} onChange={(e)=>{setName(e.currentTarget.value)}}/><br/><br/>
              <label htmlFor="password">Password:</label><br/>
              <input id="password" type="text" value={password} onChange={(e)=>{setPassword(e.currentTarget.value)}} /><br/><br/>
              <label>Rank:</label><br/>
              <SelectRanks/>
            </Col>
            <Col style={{textAlign:"right"}} span={12}>
              <Button onClick={(e)=>{updateRankApi()}} type='primary'>Refresh Rank</Button>
            </Col>
          </Row>
        </Modal>
        </>
      )
  }

  return (
    <div>
      {/* <p>Click on the Tauri, Vite, and React logos to learn more.</p>
      <button onClick={()=>{test()}}>Click me </button>

      <div className="row">
        <div>
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="button" onClick={() => greet()}>
            Greet
          </button>
        </div>
      </div>

      <p>{greetMsg}</p> */}
      
      {contextHolder}
      <div className="container">
        <div className="row">
        <Accounts accs={accs} ranks={ranks} handleAccEdit={handleAccEditShow}/>
        </div>
      </div>
      
      <ChangeData/>

      <BModal show={show} onHide={handleClose}>
        <BModal.Header closeButton>
          <BModal.Title>Manage Token</BModal.Title>
        </BModal.Header>
        <BModal.Body>
            <input className="token"
                onChange={(e)=>{
                    setToken(e.currentTarget.value)
                }}
                value={token}
            />
            </BModal.Body>
        <BModal.Footer>
          <BButton variant="secondary" onClick={handleClose}>
            Close
          </BButton>
          <BButton variant="primary" onClick={saveToken}>
            Save
          </BButton>
        </BModal.Footer>
      </BModal>
    </div>
  );
}

export default App;
