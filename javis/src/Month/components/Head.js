import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Head = (props) => {
  const { year, month, goToday, setMonth } = props;

  function notMinus(){
    if(month===1){
      return;
    }
    setMonth(month-1);
  }

  function notPlus(){
    if(month===12){
      return;
    }
    setMonth(month+1);
  }

  function resetAll(){
    window.localStorage.removeItem("MthEvt");
  }
  return (
    <Form>
      <Nav>
        <Year>
          {year}년 {month}월
        </Year>
        <button onClick={()=>resetAll()}>초기화</button>
        
        <BtnBox>
          
          
          <Btn onClick={() => notMinus()}>&lt;</Btn>
          <Btn width="3vw" onClick={() => goToday()}>
            오늘
          </Btn>
          <Btn onClick={() => notPlus()}>&gt;</Btn>
        </BtnBox>
      </Nav>
      <Days>
        {DAY.map((elm, idx) => {
          return <Day key={idx}>{elm}</Day>;
        })}
      </Days>
    </Form>
  );
};

const Form = styled.section`
  display: flex;
  flex-direction: column;
  width: 891px;
  border: 2px solid #e4e3e6;
  border-radius: 2px;
`;
const Nav = styled.section`
  ${({ theme }) => theme.flexSet('space-between', 'center')}
  margin:.7vw;
`;
const Year = styled.div`
  font-size: 2rem;
  font-weight: 700;
`;
const BtnBox = styled.div`
  ${({ theme }) => theme.flexSet('space-between', 'center')}
  margin: 0 1vw 0 0;
  width: 6vw;
`;
const Btn = styled.li`
  padding: 0.2vw 0.2vw 0.1vw;
  width: ${(props) => {
    return props.width || '1.3vw';
  }};
  border: 0.5px solid #e4e3e6;
  border-radius: 5px;
  text-align: center;
  font-size: 0.78rem;
  cursor: pointer;
`;


const Days = styled.div`
  display: flex;
  margin-bottom: 0.5vw;
`;
const Day = styled.li`
  padding-right: 1.5vw;
  width: calc(100%/7);
  text-align: right;

  :nth-child(7n + 1),
  :nth-child(7n) {
    color: #969696;
  }
`;

const DAY = ['일', '월', '화', '수', '목', '금', '토'];
export default Head;