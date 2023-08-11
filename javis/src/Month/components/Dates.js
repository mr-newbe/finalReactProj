import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal';



const Dates = (props) => {
  const { allArr,lastDate, firstDate, elm, findToday, month, year, idx, holiday } =
    props;

  const [userInput, setUserInput] = useState({});
  const [evtList, setEvtList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  
  let dateKey = `${month}` + `${elm}`;
  const registEvent = (value) => {
    setEvtList([...evtList, value]);
    setUserInput('');
    setOpenModal(false);
  };

  useEffect(()=>{
    try{
      var arrLocal = window.localStorage.getItem('MthEvt');  
    }catch(error){
      console.error(error);
    }
    
    if(arrLocal!==null){
      const chg = JSON.parse(arrLocal);
      
      if(chg[dateKey]===undefined){
        return;
      }

     
      console.log(chg[dateKey].length)
      
      for(let i=0;i<chg[dateKey].length;i++){
        const value = dateKey+'_'+chg[dateKey][i]
        setEvtList((evtList)=>[...evtList, value]);

        //registEvent(dateKey+'_'+chg[dateKey][i])
    
        console.log(chg[dateKey][i])
      }
      
    }
  },[])

  const saveToLocal = (lister)=>{
    
    console.log("인풋과 유저인풋이 차례로 나타납니다.");
    const input = lister.slice(lister.indexOf('_')+1);
    console.log(input);


    try{
      var arrLocal = window.localStorage.getItem('MthEvt');  
    }catch(error){
      console.error(error);
    }
    

    var objNew = new Object();
    console.log(arrLocal);
    if(arrLocal===null){
      var arrNew = [input]
      objNew[dateKey] = arrNew;
      console.log(objNew);
      const toLoc = JSON.stringify(objNew);
      window.localStorage.setItem('MthEvt',toLoc);
    }else{

      const chg = JSON.parse(arrLocal);
      console.log(chg);
      const localKeys = Object.keys(chg);
      
      var keyLeng = localKeys.length;
      var ifCheck = false;
      for(let i=0;i<keyLeng;i++){
        console.log(i);
        if(localKeys[i]===dateKey){
          objNew[localKeys[i]] = [...chg[localKeys[i]],input];
          ifCheck = true;
        }else{
          objNew[localKeys[i]] = [...chg[localKeys[i]]];
        }
      }
      if(ifCheck===false){
        objNew[dateKey] = [input];
      }


      window.localStorage.removeItem('MthEvt');
      const toLoc = JSON.stringify(objNew);
      window.localStorage.setItem('MthEvt',toLoc);

    }

    
  }
  //console.log(holiday)
  return (
    <>
      <Form
        onDoubleClick={() => {
          setOpenModal(true);
        }}
      >
        <DateNum
          idx={idx}
          lastDate={lastDate}
          firstDate={firstDate}
          findToday={findToday}
        >
          <TodayCSS findToday={findToday}>{elm}</TodayCSS>일
        </DateNum>
        {openModal && (
          <Modal
            elm={elm}
            month={month}
            year={year}
            registEvent={registEvent}
            setOpenModal={setOpenModal}
            openModal={openModal}
            userInput={userInput}
            setUserInput={setUserInput}
            saveLocal={saveToLocal}
          />
        )}
        {holiday !== undefined && (
          <Holidays>
            {holiday !== undefined &&
              //console.log(holiday)
              holiday.map((evt, index) => {
                console.log("evttttttt");
                console.log(evt);
                let key =
                  elm.length < 2
                    ? `${year}` + `${month}` + `${elm}`
                    : `${year}` + `${month}` + '0' + `${elm}`;
                return (
                  Number(key) === evt.locdate && (
                    <Holiday key={index}>{evt.dateName}</Holiday>
                  )
                );
              })}
          </Holidays>
        )}
        {Boolean(evtList[0]) && (
          <Lists>
            {console.log(evtList)}
            {evtList.map((list, index) => {
              return (
                list.slice(0, list.indexOf('_')) === dateKey && (
                  <List
                    key={index}
                    onClick={() => {
                      setOpenModal(true);
                    }}
                  >
                    {list.slice(list.indexOf('_') + 1, list.length)}
                  </List>
                )
              );
            })}
          </Lists>
        )}
      </Form>
    </>
  );
};
const Form = styled.li`
  position: relative;
  padding: 0 0.6vw;
  width: calc(100% / 7);
  height: 120px;
  text-align: right;
  border-bottom: 1px solid #e4e3e6;
  border-left: 1px solid #e4e3e6;
  
`;

const DateNum = styled.div`
  padding: 1vw 0.9vw 0 0;
  ${(props) => props.idx < props.lastDate && `color: #969696;`};

  ${(props) =>
    props.firstDate > 0 &&
    props.idx > props.firstDate - 1 &&
    `
    color: #969696;
  `};
`;

const TodayCSS = styled.span`
  ${(props) =>
    props.findToday &&
    ` position: relative;
    padding: .5vw;
    border-radius: 5px;
    font-size: 1.2vw;
    font-weight: 700;
    color: #FFFFFF !important;
    background-color:blue !important;
 `}
`;

const Lists = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  overflow: auto;
  height: 85px;

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #2f3542;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: grey;
    border-radius: 10px;
    box-shadow: inset 0px 0px 5px white;
  }
  /*
  :nth-child(7n + 1),
  :nth-child(7n) {
    color: #969696;
    background-color: #f5f5f5;
  }
  */
`;

const List = styled.span`
  margin-top: 0.3vw;
  padding-left: 0.5vw;
  background-color: #f7ced9;
  border-radius: 5px;
`;
const Holidays = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;
const Holiday = styled.div`
  margin-top: 0.3vw;
  padding-left: 0.5vw;
  color: red;
  font-weight: 700;
  background-color: skyblue;
  border-radius: 5px;
`;

export default Dates;