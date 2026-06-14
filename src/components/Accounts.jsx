import { Spinner } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { addToast } from '../redux/messageSlice';
import { AccountCard } from './AccountCard';

export const Accounts = ({ accs, ranks, handleAccEdit }) => {

	const dispatch = useDispatch();

	if(accs && accs!=401)
	return(
			<>
				{accs.map(function(item,index){
					return (
						<AccountCard
							key={index}
							item={item}
							index={index}
							ranks={ranks}
							handleEdit={(idx) => handleAccEdit(idx)}
							onCopy={(msg) => dispatch(addToast({ type: 'success', content: msg }))}
						/>
					);
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