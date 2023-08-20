import React,{ useState } from "react";
import Axios from 'axios';
import { useRecoilValue,useRecoilState,atom } from "recoil";
import { chatReqData } from "./Weather";
import { Quill } from "react-quill";


export const lastRecoil = atom({
  key:"마지막 전달",
  default:""
})

function Chatting(){
  const [last, setLast] = useRecoilState(lastRecoil);
  
  const askData = useRecoilValue(chatReqData);

  

  //필요한 정보 : 
  //오늘 가장 많은 지분을 차지한 날씨
  

  //할일 완료 횟수
  //완료한 할일 종류
  //이번달에 있을 일정들
  
  function requestChat(){
    var question ='';
    question+='날씨 '+askData[0]+',';
    question+='할일 '+askData[1].toFixed(2)+'%완료,';
    if(askData[2]){
      askData[2].map(data => question+=(data+' 완료,'))
    }
    
    askData[3].map(data => question+=(data+' 미완료,'))
    question += '다가올 '+askData[4][0].slice(0,askData[4][0].indexOf('_'))+'월' + askData[4][0].slice(askData[4][0].indexOf('_')+1)+'일의 일정은 '
    askData[4][1].map(data=>question+=(data+','))
    question+="이(가) 있습니다"
    console.log(question);

    Axios.post('https://api.openai.com/v1/chat/completions',{
      "model":"gpt-3.5-turbo",
      "messages":[{
        "role":"user", 
        "content":`[${question}] 이 배열의 내용들을 바탕으로 블로그에 올릴 일기를 작성해주세요`
      }],
      "temperature":0.7
    },{
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer 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"
      }
    }).then(res=>{
      console.log(res);
      setLast(res.data.choices[0].message.content);
      console.log(res.data.choices[0].message.content);
    })


  }  

  
  return(
    <>
      
      <br/>
      <button className="autoBtn" onClick={()=>requestChat()}>오늘의 일기 자동 생성</button>
  
          
      
    </>
  )
}


export default Chatting;