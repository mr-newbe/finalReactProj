
import { 
  RecoilRoot,
  atom, 
  useRecoilValue, 
  useSetRecoilState 
} from "recoil";
import { FirstStep, SecondStep, ThirdStep } from './controlSYS/PageSplit';

function App() {

  return (
    <RecoilRoot>
      <FirstStep/>
      <SecondStep/>
      <ThirdStep/>
    </RecoilRoot>
    
  );
}

export default App;
