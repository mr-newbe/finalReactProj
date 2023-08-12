import Month from "../Month/Month"
import { TodoLoc } from "../api_todo/TodoLocator"
import TaskForRecoil from "../api_todo/TodoReview"
import { Blog } from "../components/Blog"
import Chatting from "../components/Chat"
import { Location } from "../components/Glocation"
import { TimeListener } from "../components/Time"
import Weather, { chatReqData } from "../components/Weather"
import "../styles/Main.css"
import React, { useState } from "react";
import Axios from 'axios';
import {v4 as uuidv4} from 'uuid';

import { 
  RecoilRoot,
  atom, 
  useRecoilState, 
  useRecoilValue, 
  useSetRecoilState 
} from "recoil";
import QuillEditor from "../components/Quill"
import { MiddleComp } from "../components/TodoCheck"

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
      
      <QuillEditor/>
      
      <Blog/>
      <button onClick={()=>chpgBtn()}>하루를 마무리하는 버튼</button>
    </div>
  )
}

export function MiddleMan(){
  const [chPg, setChPg] = useRecoilState(sectionSep); 
  
  let threeShow = document.getElementById("three");
  let middleShow = document.getElementById("twoMiddleThree");

  
  function chpgBtn(){
    setChPg(3);
    threeShow.style = "display:block";
    middleShow.style = "display:none";
    
  }
  

  return(
    <div id="twoMiddleThree">

      <MiddleComp/>
      <button className="diaryMove" onClick={()=>chpgBtn()}>일기로 이동하는 버튼</button>
    </div>
  )
}

export function SecondStep(){

  const [chPg, setChPg] = useRecoilState(sectionSep); 
  const [chatD, setChatD] = useRecoilState( chatReqData)

  let twoShow = document.getElementById("two");
  let middleShow = document.getElementById("twoMiddleThree");


  function twoCG(){
    const uploadTask = document.getElementsByClassName('tempUn');
    console.log("업로드 지지지지징")
    console.log(uploadTask);
    var tempARR = []
    for(let i=0;i<24;i++){
      tempARR.push(uploadTask[i].innerText);
    }
    console.log(tempARR);

    //chat에 필요한 두번째 데이터 전달
    const arrString = JSON.stringify(tempARR);

    window.localStorage.setItem('todo',arrString);

    
    var dataD = [...chatD];
    dataD[1] = tempARR;
    setChatD(dataD);
    
    var startT = new Object();
    var endT = new Object();
    var keepGoo = false;

    for(let i=0;i<24;i++){
      if(tempARR[i]!=="미정"){
        if(keepGoo===false){
          keepGoo = true;
          startT[i] = tempARR[i];
        }else{ //keepGoo = TRUE, THIS IS NOT 미정
          if(tempARR[i-1] !== tempARR[i]){
            endT[tempARR[i-1]] = i-1;
            startT[i] = tempARR[i];
            keepGoo = false;
          }else{ //keepGoo = TRUE, 
            console.log(i);
            endT[tempARR[i]] = i;
          }
        }
      }else{
        if(keepGoo===true && tempARR[i-1]!=="미정"){
          endT[tempARR[i-1]] = i-1;
        }
        keepGoo = false;
      }
    }
    console.log("시작, 종료시간 확인");
    console.log(startT);
    console.log(endT);


    alarmSetting(startT, endT);
    alert("미리알림 설정이 완료되었습니다. 오늘의 일정표가 이대로 적용됩니다.")
    chpgBtn();
  }

  const [todoList, setTodoList] = useState([]);
  function alarmSetting(startT, endT){
    setTodoList([])
    apiExec();
    console.log("스타라잇");
    console.log(todoList);
    //배열속의 배열로 만들어진다
    const keys = Object.entries(startT);
    console.log(keys);
    for(let i=0;i<keys.length;i++){
      for(let j=0;j<todoList.length;j++){
        if(todoList[j].content===keys[i][1]){
          axiosReq(todoList[j].id,keys[i][0])
        }
      }
    }
    
  }
  function axiosReq(id, startTime){
    
    
    

    let today = new Date();
    
    


    // Date 객체 생성
    const date = new Date(today.getFullYear(),today.getMonth(),today.getDate(),startTime);

    
    
    // ISO-8601 형식으로 변환
    const iso = date.toISOString();

    // 결과 출력
    console.log("iso : "+iso);

     

    const data = {
      commands: [
        {
          type: 'reminder_add',
          temp_id: uuidv4(),
          uuid: uuidv4(),
          args: {
            item_id: id,
            due: {
              date: iso
            }
          }
        }
      ]
    };
    const config = {
      headers: { Authorization: 'Bearer 1a5cfa550336f246d80e0b43f8045d003b034002' }
    };
    Axios.post('https://api.todoist.com/sync/v9/sync', data, config)
      .then((result) => {
        console.log(result.data);
      })
      .catch((error) => {
        console.error(error);
      });
    
  }
  
  function apiExec(){
    
    Axios.get(`https://api.todoist.com/rest/v2/tasks?project_id=2315922358`,{
      headers:{
        Authorization:`Bearer 1a5cfa550336f246d80e0b43f8045d003b034002`,
        
      }
    }).then(
      (response)=>{
        console.log("bring data from api");
        
        response.data.map((task)=>{
          setTodoList((prevlist)=>[
            ...prevlist,
            {
              id: task.id, //not fixed!!
              content:task.content,
            }
          ]);
        })

      }
    )
  }
    

  function chpgBtn(){
    setChPg(2.5);
    middleShow.style = "display:block";
    twoShow.style = "display:none";
    
  }

  

  return(
    <div id="two">
      <div class="flexContent">
        <div className="towL">
          
          <TaskForRecoil/>
          
          <Location/>
        </div>
        <div className="towRone">
          <div className="todoDragTime">
            <TodoLoc/>
          </div>
          

          <button className="chTowBtn" onClick={()=>twoCG()}>이곳의 버튼으로 오늘자의 todo가 제출, 저장될 것입니다. </button>
        </div>
        <div className="towRtow">
          <Month/>
        </div>
      </div>
      
      
      
    </div>
  )
}

export function FirstStep(){
  
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