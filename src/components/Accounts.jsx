import { Spinner } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { addToast } from '../redux/messageSlice';

const skinsImage = () => {
	return <img style={{ width: "7rem", position:"absolute", right:"1vw", top:"1vh"}} className="card-img-top" src="https://vranks.rkrao.me/skinsStatus.png" alt="Skins" />
}

export const Accounts = ({ accs, ranks, handleAccEdit }) => {

	const dispatch = useDispatch();

	const handleAccEditShow = (e) => {
		handleAccEdit(e)
	}

	async function copy(e){
		const { currentTarget: { id } } = e;
		const nameToCopy = accs[id].name || accs[id].username;
		navigator.clipboard.writeText(nameToCopy)
		dispatch(addToast({
			type: 'success',
			content: 'Name Copied',
		}));
	}

	async function copyUsername(e){
		const { currentTarget: { id } } = e;
		navigator.clipboard.writeText(accs[id].username)
		dispatch(addToast({
			type: 'success',
			content: 'Username Copied',
		}));
	}
	
	async function copyPassword(e){
		let { currentTarget } = e;
		navigator.clipboard.writeText(accs[currentTarget.id].password)
		dispatch(addToast({
			type: 'success',
			content: 'Password Copied',
		}));
	}
	
	if(accs && accs!=401)
	return(
			<>
				{accs.map(function(item,index){
						var rankImage = ''
						
						if(ranks && ranks[item?.rank])
							rankImage = ranks[item.rank]
							const title = item.name ? `Name: ${item.name}` : `Username: ${item.username}`;
							return<div key={index} className="card">
								<div data-id="{index}" className="card-body">
									<div style={{textAlign:"right", position:"absolute", right:"1vw", bottom:"1vh"}}>
												<button id={index} onClick={(e)=>{handleAccEditShow(e)}} className="copy action"><i className="fa-regular fa-pen-to-square"></i></button>
												<button id={index} onClick={(e)=>{copy(e)}} className="copy action"><i className="fa-regular fa-copy"></i></button><br/>
									</div>
									{item.skins ? skinsImage() : null}
									<h5 className="card-title">{title}
										
									</h5>
									<p className="card-text">
										Username: {item.username} <span id={index} onClick={(e)=>{copyUsername(e)}} className="copy"><i className="fa-regular fa-copy"></i></span><br/>
										Password: ******** <span id={index} onClick={(e)=>{copyPassword(e)}} className="copy"><i className="fa-regular fa-copy"></i></span><br/>
										Rank: {item.rank}<br/> 
										<span><img className="rank" src={rankImage}/></span>
									</p>
								</div>
							</div>
				})}
			</>
	)
	else if(accs==401)
			return <div style={{
					margin:"10vh auto",
					fontSize:"5em",
					color:"red"
			}}>Unauthorised</div>
	else
			return <Spinner style={{
					flexGrow: "0",
					margin:"10vh auto",
			}} color="primary" />
}