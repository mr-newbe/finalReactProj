import {useEffect,useState} from 'react';
import { useRecoilState, useRecoilValue} from 'recoil';
import { Bearer, TaskContent, projID } from './ContentProv';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';



export default function AddTask(){
  const [inputValue, setInputValue] = useState('');
  const [todoList,setTodoList] = useRecoilState(TaskContent);
  const projectID = useRecoilValue(projID);
  const bearerID = useRecoilValue(Bearer);
  
  //내 기존 totolist와 동기화
  useEffect(() => {
    axios.get(`https://api.todoist.com/rest/v2/tasks?project_id=2315922358`,{
      headers:{
        Authorization:`Bearer 1a5cfa550336f246d80e0b43f8045d003b034002`,
        
      }
    }).then(
      (response)=>{
        console.log("bring data from api");
        
        response.data.map((task)=>{
          setTodoList((prevlist)=>[
            ...prevlist,
            {
              key:task.id,
              id: task.id, //not fixed!!
              content:task.content,
              done:task.is_completed,
            }
          ]);
        })
        
      }
    )
  }, [])
  
  //todo에 할일을 추가하려 하면
  const addItem = ()=>{
    //요청이 들어갈 자리
    axios.post(`https://api.todoist.com/rest/v2/tasks`,{
      //project_id:`${projectID}`,
      content:`${inputValue}`,
      due_string:"tomorrow at 12:15",
      due_lang:"en",
      priority:1,
      is_recurring:true
      
    },
    {headers: {
      'Content-Type' : 'application/json',
      'Authorization': `Bearer ${bearerID}`,
      'X-Request-Id':uuidv4(),
    }}
    ).then(
      (response)=>{
        idUploader(response.data.id);
        console.log(response);

      }
    )
     
    //axios 자체가 비동기 처리이다 보니
    //비동기 형식으로 접근해야 한다.

    
    //배열에 객체를 추가한다.
    function idUploader(id){
      setTodoList((prevlist)=>[
        ...prevlist,
        {
          key:id,
          id: id, //not fixed!!
          content:inputValue,
          done:false,
        }
      ]);
    }
    //요청을 하고 받은 id를 넣는다
    
    setInputValue('');
  };

  const valueChange = ({target: {value}})=>{
    setInputValue(value);
  }

  function syncBtn(){
    axios.post('https://api.todoist.com/sync/v9/sync', {
        sync_token: '*',
        resource_types: '["all"]'
    }, {
        headers: {
            Authorization: `Bearer ${bearerID}`
        }
    }).then((response)=>{
    console.log(response.data.sync_token)
    realSync()
    });
  
  }

  function realSync(){
    axios.post('https://api.todoist.com/sync/v9/sync', {
        commands:[
          {
            type:"reminder_add",
            uuid:uuidv4(),
            temp_id: uuidv4(),
            args:{
            "item_id":"7089953112",
            "minute_offset":30
            }
          }
        ]
        
    }, {
        headers: {
            Authorization: `Bearer ${bearerID}`
        }
    }).then((response)=>{
    console.log(response)
    });

  }

  return(
    <>
      <button onClick={()=>syncBtn()}>시간 체크</button>
      <input type="text" value={inputValue} onChange={valueChange}/>
      <button onClick={addItem}>추가</button>
    </>
  )
}

