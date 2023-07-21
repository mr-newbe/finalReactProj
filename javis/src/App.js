import GLogin from './components/Glogin';
import { Blog } from './components/Blog';
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
    </RecoilRoot>
    
  );
}

export default App;
