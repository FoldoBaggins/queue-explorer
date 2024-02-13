import { useEffect, useState } from 'react'
import { _timeLeft, applyDilutionTolerance, fetchExitedValidators, fetchLatestActivated, fetchStakerIndexes } from '../utils';
import Form from './Form';
import Message from './Message';
import ListItem from './ListItem';

const Dashboard = () => {
  const [claimableIndex, setclaimableIndex] = useState(0)
  const [exitedValidators, setExitedValidators] = useState(0)
  
  const [stakerIndexes, setstakerIndexes] = useState<Array<number>>([])

  const [address, setAddress] = useState('')

  useEffect(() => {
    // Read the contract
    fetchExitedValidators()
    .then((exitedValidators:number) => {
      setExitedValidators(exitedValidators)
      fetchLatestActivated()
      .then((latestclaimableIndex:number) => {
        setclaimableIndex(applyDilutionTolerance(latestclaimableIndex, exitedValidators))
      })
    })
  }, []); 

  useEffect(() => {
    // Make the API request
    if (address) {
      fetchStakerIndexes(address)
      .then((indexes:Array<number> | null) => {
        if (indexes) {
          setstakerIndexes(indexes)
        }
        else {
          setstakerIndexes([])
        }
      })
    }
  }, [address, exitedValidators]); 

  function handleFormSubmit(value:string) {
    setAddress(value)
  }

  function requestFound() {
    return stakerIndexes.length !== 0 && claimableIndex !== 0
  }

  function readyToClaim(index:number) {
    return index < (claimableIndex as number)
  }

  function validatorsAhead(index:number) {
    return index - (claimableIndex as number); 
  }

  function timeLeft(index:number) {
    return _timeLeft(validatorsAhead(index))
  }

  function waitingInput() {
    return address === '';
  }

  return (
    <div className="container">
      <Form onSubmit={handleFormSubmit} />
      <ul>
        {!waitingInput() && requestFound() && 
          stakerIndexes.map((ele, index) => {
            if (readyToClaim(ele)) 
            return <ListItem type="readyToClaim" key={index} counter={index} />
            return <ListItem type="notReadyToClaim" 
                            key={index}
                            counter={index}
                            validatorsAhead={validatorsAhead(ele)} 
                            timeLeft={timeLeft(ele)} 
                    />
          })
        }
      </ul>
     

      {!waitingInput() && !requestFound() && 
        <Message type="zeroRequestsFound" />
      }
      <p className='disclaimer'>
        Please note that activations are updated by the LEEQUID Oracles every 12h. 
        Because of that, you should expect waiting an extra 0 to 12h once your position in queue is reached.
        <br />
        This is a community made app to support the stakers of LEEQUID.
        You can reach me at foldobaggins@gmail.com 
      </p>
    </div>
  )
}

export default Dashboard
