import { useRecoilState,atom } from "recoil"
import { dragState } from "../api_todo/TodoLocator"
import { chatReqData } from "./Weather";

const doneArr = atom({
  key:"doneStuf",
  default:"",
})

export function MiddleComp(){
  console.log("반복 확인")
  const [items, setItems] = useRecoilState(dragState);
  console.log(items);


  function midCtrl(e){
    console.log(e.target.style.backgroundColor);
    if(e.target.style.backgroundColor==="green"){
      e.target.style="background-color:none";
      return;
    }
    e.target.style="background-color:green";
  }




  return(
    <div className="middleWrapper">
      <div className="middleBox">
        {items.map(data=><button className="MidBtn" onClick={(event)=>midCtrl(event)}>{data}</button>)}
      </div>
    </div>
  )
}

