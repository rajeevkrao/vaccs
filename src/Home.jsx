import { useState,useEffect } from "react";
/* import reactLogo from "./assets/react.svg"; */

import { invoke } from "@tauri-apps/api/tauri";
import { emit, listen } from '@tauri-apps/api/event'
import { appWindow } from '@tauri-apps/api/window'

import BButton from 'react-bootstrap/Button';
import BModal from 'react-bootstrap/Modal';

import { Button, Modal, Select, message } from 'antd';
const { Option } = Select;

import { Spinner } from 'reactstrap';

import { Store } from 'tauri-plugin-store-api';
const store = new Store('.settings.dat');

import axios from 'axios';

import "./App.css";

function App() {
  appWindow.maximize();
  const [show, setShow] = useState(false);
  const [token, setToken] = useState("");
  const [accs, setAccs] = useState(null);
  const [ranks, setRanks] = useState(null);

  const [isAccEditModalOpen, setIsAccEditModalOpen] = useState(false);
  const [AccEditId, setAccEditId] = useState(-1);
  const [name,setName] = useState("");
  const [password,setPassword] = useState("");
  const [rank,setRank] = useState("Unranked");


  const [messageApi, contextHolder] = message.useMessage();

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
    setIsAccEditModalOpen(true);
    if(accs[currentTarget.id].name)
      setName(accs[currentTarget.id].name)
    setPassword(accs[currentTarget.id].password)
    setRank(accs[currentTarget.id].rank)
  }

  const handleAccAddShow = () =>{
    
  }

  async function loadAccs(){
    
    axios.post('https://vaccs.rkrao.repl.co/api/cors/getAccs',{
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
    axios.get('https://vaccs.rkrao.repl.co/ranks.json').then(res=>{
        setRanks(res.data)
    }).catch(err=>{
        console.log(err)
    })
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

  async function copy(e){
    let { currentTarget } = e;
    navigator.clipboard.writeText(accs[currentTarget.id].password)
    setTimeout(()=>{
        navigator.clipboard.writeText(accs[currentTarget.id].username)
    },250)
  }

  async function copyUsername(e){
    let { currentTarget } = e;
    navigator.clipboard.writeText(accs[currentTarget.id].username)
    messageApi.open({
      type: 'success',
      content: 'Username Copied',
    });
  }

  async function copyPassword(e){
    let { currentTarget } = e;
    navigator.clipboard.writeText(accs[currentTarget.id].password)
    messageApi.open({
      type: 'success',
      content: 'Password Copied',
    });
  }
  

  listen('addToken',e=>{
    handleShow()
  })

  listen('addAccount',e=>{
    handleAccAddShow()
  })

  listen('refresh',e=>{
    location.reload();
  })

  let ChangeData = () => {
    const [Tname,setTName] = useState(name);
    const [Tpassword,setTPassword] = useState(password);

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
      axios.post('https://vaccs.rkrao.repl.co/api/cors/changedata',{
        token:await store.get('token'),
        name:Tname,
        password:Tpassword,
        rank
      }).then(()=>{
        location.reload();
      }).catch(err=>{
        messageApi.open({
          type: 'error',
          content: "Couldn't save the credentials",
        });
      })
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
                console.log(item)
                
                if(ranks[item])
                  var rankImage = ranks[item]
                return<Option key={index} value={item}>{item}<img style={{width:"2vw"}} src={rankImage}/></Option>
  
                
              })
            }
          </Select>
          </>
        )
    }
    
    if(AccEditId != -1)
    
      return(
        <>
        <Modal title={"Editting for Username: "+accs[AccEditId].username} open={isAccEditModalOpen} onOk={(e)=>{save()}} onCancel={handleClose}>
          <label htmlFor="name">Name:</label><br/>
          <input id="name" type="text" value={Tname} onChange={(e)=>{setTName(e.currentTarget.value)}}/><br/><br/>
          <label htmlFor="password">Password:</label><br/>
          <input id="password" type="text" value={Tpassword} onChange={(e)=>{setTPassword(e.currentTarget.value)}} /><br/><br/>
          <label>Rank:</label><br/>
          <SelectRanks/>
        </Modal>
        </>
      )
  }

  var Accs = () =>{
    /* console.log(ranks) */
    if(accs && accs!=403)
    return(
        <>
          {accs.map(function(item,index){
              var rankImage = ''
              if(ranks[item.rank])
                rankImage = ranks[item.rank]
                      let title
                      if(item.name)
                          title = "Name: "+item.name
                      else
                          title = "Username: "+item.username
              return<div key={index} className="card">
              <div data-id="{index}" className="card-body">
                <div style={{textAlign:"right", position:"absolute", right:"1vw", bottom:"1vh"}}>
                      <button id={index} onClick={(e)=>{/* Pending Work for Starred */}} className="copy action"><i className="fa-regular fa-star"></i></button><br/>
                      <button id={index} onClick={(e)=>{handleAccEditShow(e)}} className="copy action"><i className="fa-regular fa-pen-to-square"></i></button>
                      <button id={index} onClick={(e)=>{copy(e)}} className="copy action"><i className="fa-regular fa-copy"></i></button><br/>
                      
                </div>
                <h5 className="card-title">{title}
                  
                </h5>
                <p className="card-text">
                  Username: {item.username} <span id={index} onClick={(e)=>{copyUsername(e)}} className="copy"><i className="fa-regular fa-copy"></i></span><br/>
                  Password: ********{/* {item.password} */} <span id={index} onClick={(e)=>{copyPassword(e)}} className="copy"><i className="fa-regular fa-copy"></i></span><br/>
                  Rank: {item.rank}<br/> 
                  <span><img className="rank" src={rankImage}/></span>
                </p>
              </div>
            </div>
          })}
        </>
    )
    else if(accs==403)
        return <div style={{
            margin:"10vh auto",
            fontSize:"5em",
            color:"red"
        }}>Unauthorised</div>
    else
        return <Spinner style={{
            margin:"10vh auto"
        }} color="primary" />
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
        <Accs/>
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
