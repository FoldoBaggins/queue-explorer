import Message from './Message';

interface ListItemProps {
  type:string;
  validatorsAhead?:number;
  timeLeft?:Array<number>;
  counter:number;
}

const ListItem = ({type, validatorsAhead, timeLeft, counter}:ListItemProps) => {
  return (
    <li className='listItem'>
      <h3>Stake request {counter+1}</h3>
      <Message type={type} 
                validatorsAhead={validatorsAhead}
                timeLeft={timeLeft}
      />
    </li>
  )
}

export default ListItem
