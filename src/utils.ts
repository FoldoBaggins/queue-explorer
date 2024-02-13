import { BaseContract, EventLog, JsonRpcProvider, Log, ethers } from 'ethers';
import { RPC_PROVIDER, POOL_ADDRESS, REOPEN_BLOCK, DILUTION_PERCENTAGE, VALIDATORS_ACTIVATED_DAILY } from './constants';
import poolABI from './contracts/poolABI';

function connectToBlockchain():JsonRpcProvider {
  try {
    let provider = new JsonRpcProvider(RPC_PROVIDER);
    return provider;
  } catch (error) {
    console.log("Unable to create Blockchain provider")
    throw new Error((error as any).message)
  }
}


function getPoolContract(provider:JsonRpcProvider):BaseContract {
  return new ethers.BaseContract(POOL_ADDRESS,
    poolABI,
    provider
  );
}

export const fetchStakerIndexes = async (address:string):Promise<Array<number> | null> => {
  // Set the stakerIndex
  const logs:Array<EventLog | Log> = await fetchScheduledActivations(address)
  if (logs.length === 0) return null
  const stakerIndexes:Array<number> = logs.map((log:EventLog | Log) => {
    const startIndex:number = (log as EventLog).args[1];
    const offset:bigint = (log as EventLog).args[2] / ethers.parseUnits("32","ether");
    console.log("start index: ",startIndex)
    console.log("Staked value: ", (log as EventLog).args[2])
    console.log("32 ether in WEI: ",ethers.parseUnits("32","ether"))
    return Number(offset)+Number(startIndex)
  })
 
  return stakerIndexes
}

export const fetchScheduledActivations = async(address:string):Promise<Array<EventLog | Log>> => {
  const provider = connectToBlockchain();
  const poolContract = getPoolContract(provider);
  
  // Look for events only after staking re-opened (31 January. Block 1751747)
  const logs:Array<EventLog | Log> = await poolContract.queryFilter("ActivationScheduled(address,uint256,uint256)", REOPEN_BLOCK)
  console.log("Found "+logs.length+" total activationSchedule events.");

  const activationsScheduled:Array<EventLog | Log> = 
    logs.filter((log: EventLog | Log) => {
      return ((log as EventLog).args[0] as string).toLowerCase() === address.toLowerCase()
    })
  console.log(activationsScheduled.length + " activations scheduled for address " + address )
  return activationsScheduled;
}

export const fetchLatestActivated = async():Promise<number> => {
  const provider = connectToBlockchain();
  const poolContract = getPoolContract(provider);
  
  // Look for events only after staking re-opened (31 January. Block 1751747)
  const index:number = Number(await (poolContract as any).activatedValidators());
  console.log("Latest Activated Validator Index: " + index);

  return index;
}

export const fetchExitedValidators = async():Promise<number> => {
  const provider = connectToBlockchain();
  const poolContract = getPoolContract(provider);
  return Number(await (poolContract as any).exitedValidators());
}

export const applyDilutionTolerance = (activatedIndex:number, exitedValidators:number) => {

  console.log("indexWithDilutionTolerance: ",Math.ceil(activatedIndex+(activatedIndex-1305)*DILUTION_PERCENTAGE))
  return Math.ceil(activatedIndex+(activatedIndex-exitedValidators)*DILUTION_PERCENTAGE)
}

export const _timeLeft= (validatorsAhead:number):Array<number>  => {
  return [
          Math.floor(validatorsAhead / VALIDATORS_ACTIVATED_DAILY), // Days
          Math.ceil((validatorsAhead % VALIDATORS_ACTIVATED_DAILY) / (VALIDATORS_ACTIVATED_DAILY / 24)) // Hours
        ]
}