import TaskForRecoil from "../api_todo/TodoReview"
import { Blog } from "../components/Blog"
import Chatting from "../components/Chat"
import { Location } from "../components/Glocation"
import { TimeListener } from "../components/Time"
import Weather from "../components/Weather"
import "../styles/Main.css"
import React from "react";

import { 
  RecoilRoot,
  atom, 
  useRecoilState, 
  useRecoilValue, 
  useSetRecoilState 
} from "recoil";

export const sectionSep = atom({
  key:"sepSection",
  default:1
})




export function ThirdStep(){
  const [chPg, setChPg] = useRecoilState(sectionSep); 
  
  let oneShow = document.getElementById("one");
  let threeShow = document.getElementById("three");
  
  function chpgBtn(){
    setChPg(1);
    oneShow.style = "display:block";
    threeShow.style = "display:none";
    
  }
  return(
    <div id="three">
      <Chatting/>
      <Blog/>
      <div>이곳에는 gpt가 작성해준 일기와 추가적인 작성란이 나타날 것입니다.</div>
      <div>작성이 완료되면 제출 버튼으로 제출합니다.</div>
      <button onClick={()=>chpgBtn()}>하루를 마무리하는 버튼</button>
    </div>
  )
}

export function SecondStep(){

  const [chPg, setChPg] = useRecoilState(sectionSep); 

  let twoShow = document.getElementById("two");
  let threeShow = document.getElementById("three");

  function chpgBtn(){
    setChPg(3);
    threeShow.style = "display:block";
    twoShow.style = "display:none";
    
  }

  return(
    <div id="two">
      <TaskForRecoil/>
      <Location/>
      <div>
        이곳에는 오늘의 todo에 관련된 내용이 나올 것입니다.  
      </div>
      <div>
        버튼을 누르면 선택 창이 나타나서 시간 설정을 시작합니다.
      </div>

      <button onClick={()=>chpgBtn()}>이곳의 버튼으로 오늘자의 todo가 제출, 저장될 것입니다. </button>
    </div>
  )
}

export function FirstStep(){
  let oneShow = document.getElementById("one");
  let twoShow = document.getElementById("two");
  const [chPg, setChPg] = useRecoilState(sectionSep); 

  function chpgBtn(){
    let oneShow = document.getElementById("one");
    let twoShow = document.getElementById("two");
    console.log(oneShow);
    if(oneShow===null){
      return console.error;
    }
    setChPg(2);
    oneShow.style = "display:none";
    twoShow.style = "display:block";
    
    
  }

  return(
    <div id="one">
      <div className="unrevealScreen"></div>
      <video loop autoPlay muted>
        <source src="MandarinDuck.mp4" type="video/mp4"/>
      </video>
      

      

      <div className="oneUp">
        <TimeListener/>
        <br/>
        <br/>
        <br/>
        <br/>
        <Weather/>
        
        <br/>
        <br/>
        <button id="pgOneBtn" onClick={()=>chpgBtn()}>이 버튼으로 다음 페이지로의 이동이 활성화될 것입니다.</button>
      </div>
    </div>
  )
}