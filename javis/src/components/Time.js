import {useState, useEffect} from 'react';
import { 
  RecoilRoot,
  atom, 
  useRecoilValue, 
  useSetRecoilState 
} from "recoil";

export const dateSet = atom({
  key:'timeShow',
  default:''
})

export const timeSet = atom({
  key:'dateShow',
  default:''
})

export function TimeListener(){
  const [time, setTime] = useState(new Date());
  
  const setterDate = useSetRecoilState(dateSet);
  const setterTime = useSetRecoilState(timeSet);
  setterDate(time.toLocaleDateString());
  setterTime(time.getHours());
  useEffect(()=>{
    const id=setInterval(()=>{
      setTime(new Date());
    }, 1000);
    return (()=>clearInterval(id))
  },[])

  
  return(
    <div>
      
      <span id='date'>{time.toLocaleDateString()}</span>
      <br/>
      <span id='time'>{time.toLocaleTimeString()}</span>
    </div>
  )
  
}