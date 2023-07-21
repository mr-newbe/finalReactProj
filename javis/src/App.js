import GLogin from './components/Glogin';
import { Blog } from './components/Blog';
import Chatting from './components/Chat';
import { 
  RecoilRoot,
  atom, 
  useRecoilValue, 
  useSetRecoilState 
} from "recoil";


function App() {
  return (
    <RecoilRoot>
      <GLogin/>
      <Blog/>
      <Chatting/>
    </RecoilRoot>
    
  );
}

export default App;
