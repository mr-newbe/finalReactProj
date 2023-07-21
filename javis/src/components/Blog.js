import {useState} from 'react';
import Axios from 'axios';
import { access_token } from './Glogin';
//client id : 885177554577-t14gs23qtksh096d0huoihsb1fdors76.apps.googleusercontent.com
//client security pw : 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
import {gapi} from 'gapi-script';

import { 
  RecoilRoot,
  atom, 
  useRecoilState, 
  useRecoilValue, 
  useSetRecoilState 
} from "recoil";


export function Blog(){
  function authenticate(){
    return gapi.auth2.getAuthInstance()
      .signIn({scope:"https://www.googleapis.com/auth/blogger"})
      .then(function() {console.log("Sign-in successful");},
      function(err){console.error("Error signin in",err);});
  }

  function loadClient(){
    gapi.client.setApiKey("AIzaSyDMSUsUyVl6GArWxsNrInQdSODQKiKUWds");
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/blogger/v3/rest")
        .then(function() {console.log("GAPI client loaded for API");},
              function(err){console.error("Error loading GAPI client for API",err);});

  }

  function execute(){
    return gapi.client.blogger.posts.insert({
      "blogId":"1241398970422264012",
      "fetchBody":true,
      "fetchImages":false,
      "isDraft":false,
      "resource":{
        "title":"my local upload",
        "content":"rap is the worst study",
      }
    })
    .then(function(response){
      console.log("Response",response);
    },
    function(err){console.log("Execute error",err); });
  }
  gapi.load("client:auth2",function(){
    gapi.auth2.init({client_id:"415106374921-8mar6lmc9qcuje4d1jsu2t3rs738pqph.apps.googleusercontent.com"});
  });


  return(
    <div>
      <button onClick={()=>authenticate().then(loadClient)}>authorize and load</button>
      <button onClick={()=>execute()}>execute</button>
    </div>
  )
}