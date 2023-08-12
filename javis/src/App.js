
import { 
  RecoilRoot,
  atom, 
  useRecoilValue, 
  useSetRecoilState 
} from "recoil";


import { FirstStep, MiddleMan, SecondStep, ThirdStep } from './controlSYS/PageSplit';

function App() {
  
  return (
    <RecoilRoot>
    
      <ThirdStep/>
      <MiddleMan/>
      <SecondStep/>
      <FirstStep/>

    </RecoilRoot>
    
  );
}

export default App;
