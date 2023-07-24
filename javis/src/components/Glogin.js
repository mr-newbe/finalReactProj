import {useGoogleLogin, googleLogout} from '@react-oauth/google';
import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import { 
  RecoilRoot,
  atom, 
  useRecoilValue, 
  useSetRecoilState 
} from "recoil";

export const access_token = atom({
  key:'access_token',
  default:''
})



function GLogin(){
  const tokenSet = useSetRecoilState(access_token);
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState();

  const login = useGoogleLogin({
    onSuccess : (codeResponse)=>setUser(codeResponse),
    onError : (error)=>console.log('Login Failed',error)
  });

  useEffect(
    ()=>{
      if(user){
        Axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,{
          headers:{
            Authorization:`Bearer ${user.access_token}`,
            Accept:'application/json'
          }
        }).then((res)=>{
          console.log(user);
          console.log("access token");
          console.log(user.access_token);
          tokenSet(user.access_token);
          setProfile(res.data);
        }).catch((err)=>console.log(err));
      }
    },
    [user]
  )

  const logOut = ()=>{
    googleLogout();
    setProfile(null);
  };

  return (
    <div>
      <h2>React Google Login</h2>
      
      {profile?(
        
        <div>
          <img src={profile.picture} alt="user image"/>
          <h3>User Logged in</h3>
          <p>Name : {profile.name}</p>
          <p>Email Address:{profile.email}</p>
          
          <button onClick={logOut}>Log out</button>
        </div>
      ):(
        <button onClick={()=>login()}>Sign in with Google</button>
      )}
    </div>
  )
}


export default GLogin;