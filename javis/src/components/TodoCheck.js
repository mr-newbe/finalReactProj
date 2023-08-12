import { useRecoilState } from "recoil"
import { dragState } from "../api_todo/TodoLocator"
import { chatReqData } from "./Weather";

export function MiddleComp(){
  console.log("반복 확인")
  const [items, setItems] = useRecoilState(dragState);
  console.log(items);

  const [chatD, setChatD] = useRecoilState(chatReqData);
  

  function midCtrl(e){
    e.target.style="background-color:green";
    window.localStorage.setItem
  }
  return(
    <div className="middleWrapper">
      <div className="middleBox">
        {items.map(data=><button className="MidBtn" onClick={(event)=>midCtrl(event)}>{data}</button>)}
      </div>
    </div>
  )
}

