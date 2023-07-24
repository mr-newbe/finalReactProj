import GLogin from './components/Glogin';
import { Blog } from './components/Blog';
import Chatting from './components/Chat';
import { Location } from './components/Glocation';
import Weather from './components/Weather';
import { TimeListener } from './components/Time';
import { 
  RecoilRoot,
  atom, 
  useRecoilValue, 
  useSetRecoilState 
} from "recoil";


function App() {
  
  

  return (
    <RecoilRoot>
      <TimeListener/>
      <GLogin/>
      <Blog/>
      <Chatting/>
      <Weather/>
      <Location/>

      
    </RecoilRoot>
    
  );
}

export default App;
