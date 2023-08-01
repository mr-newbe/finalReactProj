
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
    
      <ThirdStep/>
      <SecondStep/>
      <FirstStep/>

    </RecoilRoot>
    
  );
}

export default App;
