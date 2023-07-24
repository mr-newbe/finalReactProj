import React,{ useState } from "react";
import Axios from 'axios';


function Chatting(){
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');

  /*
  const handleAskQuestion = async ()=>{
    const apiKey = "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";
    const apiUrl = 'https://api.openai.com/v1/chat/gpt-3.5-turbo/completions';

    try{
      const response = await Axios.post(apiUrl,{
        prompt:question,
        max_tokens:150,
      },{
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${apiKey}`,
        },
      });

      setResponse(response.data.choices[0].text);
    } catch(err){
      console.log(err);
    }
  }
  */
  
  function requestChat(){
    Axios.post('https://api.openai.com/v1/chat/completions',{
      "model":"gpt-3.5-turbo",
      "messages":[{
        "role":"user", 
        "content":"[날씨 좋음, 오늘의 할일 완료 횟수(5/10), 영어 10단어 공부하기 완료, 리액트 프로젝트 완료, 20일 뒤에 프로젝트 발표회라는 큰 일이 있음] 이 배열의 내용들을 바탕으로 블로그에 올릴 일기를 작성해주세요"
      }],
      "temperature":0.7
    },{
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer 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"
      }
    }).then(res=>{
      setResponse(res);
    })
  }  

  
  function talkWithAi(){
  
    
    Axios.get('https://api.openai.com/v1/models',{
      headers:{
        Authorization:"Bearer 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",
        //"OpenAI-Organization":"org-zGIBxCz4ghO934lZXWjw66Lb"
      }
    }).then(()=>{
      console.log("응답 완료");
    })
    
  }

  
  return(
    <>
      <button onClick={()=>talkWithAi()}>axios chat gpt 요청</button>
      <br/>
      <br/>
      <input 
        type="text" 
        value={question} 
        onChange={(e)=>setQuestion(e.target.value)}
      />
      <button onClick={()=>requestChat()}>Ask</button>
      <div>
        <p>
          {response}
        </p>
      </div>
          
      
    </>
  )
}


export default Chatting;