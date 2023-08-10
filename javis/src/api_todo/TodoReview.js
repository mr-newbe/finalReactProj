import { TaskProvider } from "./ContentProv"
import AddTask from "./Adder"
import TaskList from "./ListShow"
//import "../styles/Main.css"

export default function TaskForRecoil(){
  return (
    <TaskProvider>
      <div id="secFont">task generator</div>
      
      
      <div className="adderBX"><AddTask/></div>
      <br/>
      
      <div className="checkBX">
        <TaskList/>
      </div>
      <br/>
      
    </TaskProvider>
  )
}