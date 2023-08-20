import {useState} from 'react';
import Axios from 'axios';
import { access_token } from './Glogin';
//client id : 885177554577-t14gs23qtksh096d0huoihsb1fdors76.apps.googleusercontent.com
//client security pw : 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


import { 
  RecoilRoot,
  atom, 
  useRecoilState, 
  useRecoilValue, 
  useSetRecoilState 
} from "recoil";

import {gapi} from 'gapi-script';
import { lastRecoil } from './Chat';


export function Blog(){
  function authenticate(){
    const samira = document.getElementById("uploadButton");
    samira.style="display:block";

    return gapi.auth2.getAuthInstance()
      .signIn({scope:"https://www.googleapis.com/auth/blogger"})
      .then(function() {console.log("Sign-in successful");},
      function(err){console.error("Error signin in",err);});
  }

  function loadClient(){
    gapi.client.setApiKey("AIzaSyCpZ1Rd8Q0e7sX52CYBX-FUUSupuzUUaYQ");
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/blogger/v3/rest")
        .then(function() {console.log("GAPI client loaded for API");},
              function(err){console.error("Error loading GAPI client for API",err);});

  }

  const content = useRecoilValue(lastRecoil);


  function execute(){
    const dateCal = new Date();
    
    var caledDate = dateCal.getDate();
    if(dateCal.getHours()<4){
      caledDate --;
    }
    return gapi.client.blogger.posts.insert({
      "blogId":"1241398970422264012",
      "fetchBody":true,
      "fetchImages":false,
      "isDraft":false,
      "resource":{
        "title":`${dateCal.getMonth()+1}월 ${caledDate}일자 일기`,
        "content":content
      }
    })
    .then(function(response){
      console.log("Response",response)
    },
    function(err){console.log("Execute error",err); });
  }
  gapi.load("client:auth2",function(){
    gapi.auth2.init({client_id:"415106374921-8mar6lmc9qcuje4d1jsu2t3rs738pqph.apps.googleusercontent.com"});
  });


  return(
    <div>
      <button onClick={()=>authenticate().then(loadClient)}>일기 업로드 인증</button>
      <button id="uploadButton" onClick={()=>execute()}>만든 일기 게시</button>
    </div>
  )
}