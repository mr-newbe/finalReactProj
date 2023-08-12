import "../styles/dragStyled.css";
import Sortable from "sortablejs";
import { useEffect,useState } from "react";
import styled from "styled-components";
import { atom, useRecoilState } from "recoil";
import { TaskContent } from "./ContentProv";
import { ReactSortable } from "react-sortablejs";
import { replaceItemAtIndex } from "./ListShow";

const Container = styled.div`
  display: flex;
  background: hotpink;
  justify-content: center;
`;

const ListContainer = styled.div`
  display: flex;
  padding: 20px;
`;

const List  = styled.div`
  background: pink;
  margin-right: 15px;
  padding: 10px;
`
var arr = []
for(let i=0;i<24;i++){
  arr.push("미정");
}
export const dragState = atom(
  {
    key:"dragState",
    default:arr

  }
)

export function TodoLoc(){
  //0~24까지의 시간대 상자를 그려주기
  //목표 : 같은 페이지 화면에 있는 todo를 드래그 하여 이 시간대 상자에 집어넣을 수 있다.
  //그 상자에 시간을 설정하면 상자의 크기가 늘어나게 한다.
  
  let timeTable = []

  for(let i=0;i<24;i++){
    timeTable.push(i);
  }

  const [items, setItems] = useRecoilState(dragState);
  console.log("아이템즈아리");

  

  useEffect(() => {
    const columns = document.querySelectorAll(".twoRContent");
    columns.forEach((column) => {
      new Sortable(column, {
        animation: 150,
        ghostClass: "blue-background-class"
      });
    });
  });

  useEffect(()=>{
    try{
      const localItem = window.localStorage.getItem('todo');
      const localArr = JSON.parse(localItem);
      setItems(localArr);
    }catch(error){
      console.error(error)
      return;
    }
    
  },[])
  
 

  function resetBtn(event){
    const tgList = document.getElementsByClassName('twoRContent');
    const tgListChild = tgList[0].getElementsByClassName('tempUn');
    var temp = [...items];
    console.log(tgListChild);
    
    //화면 배치도 적용
    for(let i=0;i<24;i++){
      temp[i]=tgListChild[i].innerText;
    }
    temp[event.target.id] = "미정"
    setItems(temp);
    console.log(temp[0]);
    
    
    /*
    var tempTwo = replaceItemAtIndex(temp,event.target.id,"미정");
    console.log("미정으로 바꿈")
    console.log(tempTwo);
    */
    for(let i=0;i<24;i++){
      tgListChild[i].innerText = temp[i];
        
    }
    
  }

  return(
    <div className="wrapperTowR">
    <div className="twoRTime">
      <br/>      
      {timeTable.map(data=><TimePLT time={data}/>)}
    </div>
    
    <div className="twoRContent">    
      {items.map(item=><ContPLT content={item}/>)}
    </div>
    
    <div className="twoRBtn">
      {timeTable.map(data=><button className="RBtn" id={data} onClick={event=>resetBtn(event)}>X</button>)}
    </div>
    
    </div>
  )
}





//현재 작업 현장
export function ContPLT(props){
  
  return(
    <div className="tempUn">
      {props.content}
    </div>
  )
}

function TimePLT(props){
  return(
    <>
      <div className="selTime">
        <br/>
        
        <div className="fulltime">{props.time}시</div>

      </div>
    </>
  )
}