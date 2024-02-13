import React from 'react'

interface MessageProps {
  type:string;
  canActivateIndex?:number;
  validatorsAhead?:number;
  timeLeft?:Array<number>;
}

const Message = ({type, canActivateIndex, validatorsAhead, timeLeft}:MessageProps) => {
  switch (type) {
    case "readyToClaim":
      return (  
        <>
          <p> ✅ Your stake is ready or almost ready to claim</p>
        </>
      )
    case "notReadyToClaim":
      return (  
        <>
          <p>You have <strong>{validatorsAhead}</strong> validators yet to be activated until you can claim your sLYX.</p>
          <p>Your estimated wait time is <strong>{(timeLeft as Array<number>)[0]} days</strong> and <strong>{(timeLeft as Array<number>)[1]} hours</strong></p>
        </>
      )
    case "zeroRequestsFound":
      return (  
        <>
          <p> ❌ No queued stake requests found for address</p>
        </>

      )
    default:
      return (
        <>
          <p> Error: Unhandled exception</p>
        </>
      )
    }
}

export default Message
