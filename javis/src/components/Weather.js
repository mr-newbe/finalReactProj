import axios from "axios"
import { useState } from "react";
import { 
  RecoilRoot,
  atom, 
  useRecoilValue, 
  useSetRecoilState 
} from "recoil";
import { dateSet, timeSet } from "./Time";
import { globLoc } from "./Glocation";

//나에게 지금 필요한 정보 : 내 위치에 대한 오늘의 날씨 정보
export default function Weather(){
  const [pgRender, setPgRender] = useState(true);
  const date = useRecoilValue(dateSet);
  const time = useRecoilValue(timeSet);
  const exLoc = useRecoilValue(globLoc);
  
  const weatherKey = '5Ye9UdQcJpPD%2Fl%2F%2B9qyWYs8Uh8Rx97zUo23NJa5BqdGISztWfOJ1wOKQjhjQbXotKJLLkJd%2BtNlikhqcnDnjfA%3D%3D';
  const sunKey = '5Ye9UdQcJpPD%2Fl%2F%2B9qyWYs8Uh8Rx97zUo23NJa5BqdGISztWfOJ1wOKQjhjQbXotKJLLkJd%2BtNlikhqcnDnjfA%3D%3D';
  
  //날짜 --> baseDate
  var timeShh = date.replace(/ /g,'');
  var timeShh = timeShh.split('.',3);
  timeShh[1] = '0'+timeShh[1];

  const todate = timeShh[0]+timeShh[1]+timeShh[2];
  console.log(todate);

  //시간 --> baseTime
  console.log(time);
  var tmp = 2;
  while(tmp<24){
    if(time<tmp){
      if(tmp>=13){
        var baseTime = `${tmp-3}00`
      }else{
        var baseTime = `0${tmp-3}00`;
      }
      break;
      
    }
    tmp+=3;
  }
  
  //위경도 ==> xy좌표
  const lat = exLoc.Lat;
  const lon = exLoc.Lon;
  
  var xy = dfs_xy_conv("toXY",lat, lon);
  
  //일출, 일몰정보 요청하는 api
  function sunriseAPI(){
    
    var url = 'http://apis.data.go.kr/B090041/openapi/service/RiseSetInfoService/getLCRiseSetInfo';
    var queryParams = '?'+encodeURIComponent('longitude')+`=${lon}`;
    queryParams += '&'+encodeURIComponent('latitude')+`=${lat}`;
    queryParams += '&'+encodeURIComponent('locdate')+`=${todate}`;
    queryParams += '&'+encodeURIComponent('dnYn=Y')+'&'+encodeURIComponent('ServiceKey')+`=${sunKey}`;

    axios.get(url+queryParams).then(
      (response)=>{
        console.log(response.data.response.body.items.item);
        sunfunc(response.data.response.body.items.item);
      }
    )
  }

  


  function requestWeather(){
    var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst'; /*URL*/
    var queryParams = '?' + encodeURIComponent('serviceKey') + `=${weatherKey}`; /*Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('400'); /**/
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('json'); /**/
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(todate); /**/
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(baseTime); /**/
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(xy.x); /**/
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(xy.y); /**/
    



    //axios.get('http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=5Ye9UdQcJpPD%2Fl%2F%2B9qyWYs8Uh8Rx97zUo23NJa5BqdGISztWfOJ1wOKQjhjQbXotKJLLkJd%2BtNlikhqcnDnjfA%3D%3D&pageNo=1&numOfRows=1000&dataType=XML&base_date=20230721&base_time=0500&nx=55&ny=127')
    axios.get(url+queryParams)
      .then(response=>
        parsing(response)

      );
    
  }

  function sunfunc(ans){
    console.log(ans);
    const sunRiseCtn = document.getElementById('sunRiseCtn');

    const sunRiseTime = ans.sunrise;
    const sunSetTime = ans.sunset;
    sunRiseCtn.innerHTML = 
      `일출 시간 : ${sunRiseTime.substr(0,2)}시 ${sunRiseTime.substr(2,4)}분<br/>
      일몰 시간 : ${sunSetTime.substr(0,2)}시 ${sunSetTime.substr(2,4)}분`;
  }
  
  function parsing(ans){
    const saveCtn = document.getElementById('timeCtn');
    saveCtn.innerHTML = '';
    if(ans.status!==200){
      return alert('weather request Error!')
    }
    var timeContent='';
    var obj = ans.data.response.body.items.item;
    //obj = JSON.parse(obj.body);
    console.log(obj);

    const categotyJS = ['SKY','PTY','REH','TMP'];
    const obj2 = obj.filter((data)=>categotyJS.includes(data.category))
    console.log(obj2);
    for(var i=0;i<22;i++){

      //날씨 경보
      var skyState = obj2[i*4+1].fcstValue;
      var skyText;
      switch(skyState){
        case "1":
          skyText = '맑음';
        case "3":
          skyText = '구름 많음';
        case "4":
          skyText = '흐림';
      }

      //비, 눈 경보
      skyState = obj2[i*4+2].fcstValue;
      
      var flyState = '';
  
      switch(skyState){
        case "0":
          flyState = '';
          break;
        case "1":
          flyState = '비';
          break;
        case "2":
          flyState = ' 비 또는 눈';
          break;
        case "3":
          flyState = ' 눈';
          break;
        case "4":
          flyState = '소나기'
          break;
        //tmx : 최고기온, tmn : 최저기온, reh : 습도 

      }
      //나타날 시간 표시
      if((i+time)>23){
        var showCase = i+time-24;
      }else{
        var showCase = i+time;
      }

      //습도 표시
      var rehShow = obj2[i*4+3].fcstValue;

      var tmpShow = obj2[i*4].fcstValue;
      console.log(i*12);
      timeContent += showCase+'&nbsp'
        +`<strong>${skyText}</strong>`+'&nbsp'
        +`<strong>${flyState}</strong>`+'<br/>'
        +'&nbsp'
        +`습도 : ${rehShow}%`
        +`  기온 :${tmpShow}℃`
        +'<br/>'; 
      

    }
    
    saveCtn.innerHTML += timeContent;
    setPgRender((pgRender)=>!pgRender);
    console.log(saveCtn.innerHTML);
    
  }
  return(
    <>
      <button onClick={()=>requestWeather()}>클릭하여 기상정보 가져오기</button>
      <div id="timeCtn"></div>

      <button onClick={()=>sunriseAPI()}>일출/일몰정보 가져오기</button>
      <div id="sunRiseCtn"></div>
    </>
  )
}

//복붙해온 외부 코드
//기상청 api에서 활용되는 xy좌표를 위경도를 활용해 알아내도록 한다.
function dfs_xy_conv(code, v1, v2) {
  var RE = 6371.00877; // 지구 반경(km)
  var GRID = 5.0; // 격자 간격(km)
  var SLAT1 = 30.0; // 투영 위도1(degree)
  var SLAT2 = 60.0; // 투영 위도2(degree)
  var OLON = 126.0; // 기준점 경도(degree)
  var OLAT = 38.0; // 기준점 위도(degree)
  var XO = 43; // 기준점 X좌표(GRID)
  var YO = 136; // 기1준점 Y좌표(GRID)


  var DEGRAD = Math.PI / 180.0;
  var RADDEG = 180.0 / Math.PI;
  
  var re = RE / GRID;
  var slat1 = SLAT1 * DEGRAD;
  var slat2 = SLAT2 * DEGRAD;
  var olon = OLON * DEGRAD;
  var olat = OLAT * DEGRAD;
  
  var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
  var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = re * sf / Math.pow(ro, sn);
  var rs = {};
  if (code == "toXY") {
      rs['lat'] = v1;
      rs['lng'] = v2;
      var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
      ra = re * sf / Math.pow(ra, sn);
      var theta = v2 * DEGRAD - olon;
      if (theta > Math.PI) theta -= 2.0 * Math.PI;
      if (theta < -Math.PI) theta += 2.0 * Math.PI;
      theta *= sn;
      rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
      rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  }
  else {
      rs['x'] = v1;
      rs['y'] = v2;
      var xn = v1 - XO;
      var yn = ro - v2 + YO;
      ra = Math.sqrt(xn * xn + yn * yn);
      if (sn < 0.0) {ra = -ra;}
      var alat = Math.pow((re * sf / ra), (1.0 / sn));
      alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;
      
      if (Math.abs(xn) <= 0.0) {
          theta = 0.0;
      }
      else {
          if (Math.abs(yn) <= 0.0) {
              theta = Math.PI * 0.5;
              if (xn < 0.0) {theta = -theta;}
          }
          else theta = Math.atan2(xn, yn);
      }
      var alon = theta / sn + olon;
      rs['lat'] = alat * RADDEG;
      rs['lng'] = alon * RADDEG;
  }
  return rs;
}
