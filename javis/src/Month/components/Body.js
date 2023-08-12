import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Dates from './Dates';
import axios from 'axios';

const Body = (props) => {
  const { totalDate, today, month, year } = props;
  const lastDate = totalDate.indexOf(1);
  const firstDate = totalDate.indexOf(1, 7);

  const [holiday, setHoliday] = useState([]);

  //today
  const findToday = totalDate.indexOf(today);
  console.log("프롭스 확인")
  console.log(totalDate);
  console.log(firstDate);
  const getMonth = new Date().getMonth() + 1;
  console.log("년월 확인 콘솔"+year+('0'+month));
  var rlmonth = month;
  if(month<10){
    rlmonth = '0'+month;
  }
  const runAxios = async () => {
    try {
       
      axios.get(
        `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?solYear=${year}&solMonth=${rlmonth}&ServiceKey=5Ye9UdQcJpPD%2Fl%2F%2B9qyWYs8Uh8Rx97zUo23NJa5BqdGISztWfOJ1wOKQjhjQbXotKJLLkJd%2BtNlikhqcnDnjfA%3D%3D`
      )
      .then((json) => {
        console.log(json.data.response.body.items);
        if(Array.isArray(json.data.response.body.items)){
          setHoliday(json.data.response.body.items);
        }else{
          setHoliday([json.data.response.body.items]);
          
        }
        
      });
      
    } catch (e) {
      
      console.log(e);
    }
  };

  

  useEffect(() => {
    runAxios();
  }, [month]);
  return (
    <Form>
      {totalDate.map((elm, idx) => {
        return (
          
          
          <Dates
            key={idx}
            idx={idx}
            lastDate={lastDate}
            firstDate={firstDate}
            elm={elm}
            findToday={findToday === idx && month === getMonth && findToday}
            month={month}
            year={year}
            holiday={holiday.item}
          ></Dates>
          
        );
      })}
    </Form>
  );
};

const Form = styled.div`
  display: flex;
  flex-flow: row wrap;
  :nth-child(7n + 1),
  :nth-child(7n) {
    //color: #969696;
    background-color: #f5f5f5;
  }
`;
export default Body;