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
      <div>Date</div>
      <span>{time.toLocaleDateString()}</span>
      <div>Clock</div>
      <span>{time.toLocaleTimeString()}</span>
    </div>
  )
  
}