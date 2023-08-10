import { useRecoilState, useRecoilValue} from "recoil"
import { Bearer, TaskContent, projID } from "./ContentProv"
import {useEffect, useState} from 'react';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import {ReactSortable, Sortable} from "react-sortablejs"
import styled from "styled-components";
import { dragState } from "./TodoLocator";
import { ContPLT } from "./TodoLocator";

const SItem = styled.div`
  background: lemonchiffon;
  padding: 50px;
`


//task의 변경과 삭제가 이루어져야 하는 곳이다.
export default function TaskList(){
  const [contentArray,setContentArr] = useRecoilState(TaskContent);
  console.log("tasklist open");
  return(
    <>
      

      
      {contentArray.length!==0 ? 
        contentArray.map(data=>(
          <div>
            <TaskItem item={data}/>
          </div>
        )) :
        <div>
          <br/>
          <br/>
          <div>할일을 추가하세요! 시간은 금입니다!!</div>
        </div>  
      }

      
    </>
  )
}




function TaskItem({item}){
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [taskItem,editTaskItem] = useRecoilState(TaskContent);

  const bearerID = useRecoilValue(Bearer);
  const index = taskItem.findIndex((listItem) => listItem===item);

  
  //할일끝냈는지 변경
  const toggleEdit = ()=>{
    const newList = replaceItemAtIndex(taskItem, index, {
      ...item,
      done: !item.done,
    });

    editTaskItem(newList);
  }

  const deleteItem = ()=>{
    const dell = taskItem[index].id;
    console.log(dell.id);

    
    axios.delete(`https://api.todoist.com/rest/v2/tasks/${dell}`,{
      headers:{
        Authorization:`Bearer ${bearerID}`
      }
      
    })
    

    const newList = removeItemAtIndex(taskItem,index);
    editTaskItem(newList);
  };



  const changingInput = ({target: {value}})=>{
    setEditValue(value);
  };


//구현해야 하는 기능 : 
//editValue를 가져와서 바꾸려는 인덱스의 content 값을 바꾼다. 
//여기서 done의 값도 false로 바꿔줘야 한다.

  //수정하는 코드
  const applyEdit = ()=>{
    const newList = replaceItemAtIndex(taskItem,index,{
      ...item,
      content : editValue
    });

    editTaskItem(newList);
    setIsEditing(false);

    console.log(newList);
    //미래에 통신기능을 넣도록 하겠습니다.
    const dell = taskItem[index].id;

    axios.post(`https://api.todoist.com/rest/v2/tasks/${dell}`,{
      content:`${editValue}`
    },
    {headers: {
      'Content-Type' : 'application/json',
      'Authorization': `Bearer ${bearerID}`,
      'X-Request-Id':uuidv4(),
    }}
    ).then(
      console.log("수정 성공")
    )
  };
  
  
  let taskContent;
  if(isEditing===true){
    taskContent = (
      <>
        <input 
          id = {item.id}
          type="text" 
          placeholder={item.content} 
          onChange={changingInput}
        />
        <button id={item.id} onClick={()=>applyEdit()}>
          Save
        </button>
      </>
    ); 
  } else {
    taskContent = (
      <>
        {item.content}
        <button onClick={()=>setIsEditing(true)}>
          Edit
        </button>
      </>
    )
    
  }


  

  const [items, setitems] = useRecoilState(dragState);
  const [limit, setLimit] = useState(0);
  function todragPoint(event){
    const tgList = document.getElementsByClassName('twoRContent');
    const tgListChild = tgList[0].getElementsByClassName('tempUn');
    var temp = [...items];
    console.log(tgListChild);
    for(let i=0;i<24;i++){
      temp[i]=tgListChild[i].innerText;
    }
    console.log(temp);
    setitems(temp);
    

    for(let i=0;i<24;i++){
      if(items[i]==="미정"){
        console.log("체크");
        
        var tempTwo = replaceItemAtIndex(temp,i,event.target.className)
        console.log(tempTwo)
        
        setitems(tempTwo);
        resetTimeL(tempTwo);
        break;
      }
    }
    
    
  }

  


  function resetTimeL(temp){
    const tgList = document.getElementsByClassName('twoRContent');
    const tgListChild = tgList[0].getElementsByClassName('tempUn');
    console.log("확인확인");
    console.log(temp);
    //객체로 받아져오는 map 반환을 고침

    

    for(let i=0;i<24;i++){
      tgListChild[i].innerText = temp[i];
        
    }
    
    setLimit(limit=>limit+1);
  }
  return(
    <>
    <div className="sepEle">
      <label>
        <input
          type="checkbox"
          checked = {item.done}
          onChange = {toggleEdit}
        />
        {taskContent}
        <button onClick={deleteItem}>delete</button>
      </label>
      <button className={item.content} onClick={(event)=>todragPoint(event)}>알림</button>
    </div>
    
    </>
  )
}


export function replaceItemAtIndex(arr, index, newValue){
  return [...arr.slice(0,index), newValue, ...arr.slice(index+1)];
}
//파라미터로 온 인덱스 뒤로 잘라버린다.
function removeItemAtIndex(arr, index){
  return [...arr.slice(0,index), ...arr.slice(index+1)];
}