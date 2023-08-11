import axios from "axios"
import { useState,useEffect } from "react";
import { 
  RecoilRoot,
  atom, 
  useRecoilValue,
  useRecoilState, 
  useSetRecoilState 
} from "recoil";
import { dateSet, timeSet } from "./Time";
import { globLoc } from "./Glocation";


//chat에 들어갈 정보 첫번째 : 날씨현황
export const chatReqData = atom({
  key:"meaningless",
  default:""
})

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
  if(timeShh[1]<10){  
    timeShh[1] = '0'+timeShh[1];
  }

  if(timeShh[2]<10){  
    timeShh[2] = '0'+timeShh[2];
  }
  
  const todate = timeShh[0]+timeShh[1]+timeShh[2];
  console.log(todate);



  //시간 --> baseTime
  console.log("tiem"+time);
  var tmp = 2;
  while(tmp<24){
    if(time<=tmp){
      if(tmp>=13){
        var baseTime = `${tmp}00`
        console.log(baseTime);
      }else{
        var baseTime = `0${tmp}00`;
        console.log(baseTime);
      }
      break;

      
      
    }
    tmp+=3;
  }
  
  //위경도 ==> xy좌표
  console.log(exLoc);
  const lat = exLoc.Lat;
  console.log(lat);
  const lon = exLoc.Lon;
  var xy = dfs_xy_conv("toXY",lat, lon);
  
  
  //일출, 일몰정보 요청하는 api
  function sunriseAPI(){
    if(lat===undefined){
      console.log("치명적 에러")
      return console.error;
    }
    console.log(lat);
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
    if(lat===undefined || xy.lat===''){
      console.log("치명적 에러")
      return console.error;
    }
    console.log(lat);
    console.log(xy);
    console.log("베이스타임"+baseTime);

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
    console.log("중간확인");
    try{
      if(ans.sunrise===undefined){
        return;
      } 
    }catch(error){
      console.log(error);
      return;
    }
       
    //const sunRiseCtn = document.getElementById('sunRiseCtn');
    const chrise = document.getElementsByClassName('sunChText');

    const sunRiseTime = ans.sunrise;
    const sunSetTime = ans.sunset;

    chrise[0].innerText = `${sunRiseTime.substr(0,2)} : ${sunRiseTime.substr(2,4)}`
    chrise[1].innerText = `${sunSetTime.substr(0,2)} : ${sunSetTime.substr(2,4)}`
    
  }


  
  useEffect(()=>{
    console.log(lat);
    
    if(lat!==undefined){
      sunriseAPI();
    }
      
  },[lat]);
  


  function parsing(ans){
    const saveCtn = document.getElementById('timeCtn');
    saveCtn.innerHTML = '';
    console.log(ans);
    if(ans.status!==200){
      return alert('weather request Error!')
    }
    var timeContent='';
    try{
      var obj = ans.data.response.body.items.item;
    }catch (error){
      console.log(error);
      return;
    }
    
    var isClould = 0;
    var isRain = 0;
    var isWet = 0;

    const categotyJS = ['SKY','PTY','REH','TMP'];
    const obj2 = obj.filter((data)=>categotyJS.includes(data.category))
    //console.log(obj2);
    for(var i=0;i<22;i++){

      //날씨 경보
      var skyState = obj2[i*4+1].fcstValue;
      console.log(skyState);
      var skyText;
      switch(skyState){
        case "4":
          //흐림
          skyText = '<img src="https://yogiweather.netlify.app/static/media/icon_night.f8d048e29abde58b26f1.gif" className="imgSky" style="height:110px;width:110px"/></Image>';
          isClould++;
          break;
        case "3":
          //구름낌
          skyText = '<img src="data:image/png;base64,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" className="imgSky"/>';
          isClould++;
          break;
          
        case "1":
          //맑음
          skyText = '<img src="https://yogiweather.netlify.app/static/media/icon_sun.d5b70715f6b5e6bd11b4.gif" className="imgSky" style="height:110px;width:110px"/></Image>';
          break;
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
          isRain++;
          break;
        case "2":
          flyState = ' 비 또는 눈';
          break;
        case "3":
          flyState = ' 눈';
          break;
        case "4":
          flyState = '소나기'
          isRain++;
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
      //console.log(i*12);

      
      const arr = [];

      arr.push({})

      timeContent += 
        '<div>'
        +`${skyText}`
        +`<strong>${showCase}시</strong>`+'&nbsp'
        +`<strong>${flyState}</strong>`
        +'&nbsp'
        //습도
        +`<br/>${rehShow}%&nbsp`
        //온도
        +`  ${tmpShow}℃`
        +'</div>'
        ; 
      

    }
    
    saveCtn.innerHTML += timeContent;
    setPgRender((pgRender)=>!pgRender);
    //console.log(saveCtn.innerHTML);
    
  }

  useEffect(()=>{
    console.log(lat);
    
    if(lat!==undefined){
      requestWeather();
    }
      
  },[lat]);


  
  
  return(
    <>
      <div id="bigtimeCtn">
        <div id="timeCtn"></div>
      </div>
      <br/>
      <br/>
      <br/>

      <div id="sunText">
        <div>
          <img className="rise" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAElUlEQVR4nO2dz48URRSAv1nYBROUDSjClQgSDxIikKgcuAKJJO6y/BB0TYigePMiciDGxMTwR5AQEy8cuOFNjngBDybuhriSAMvGC8lClsAMi4eqkZ7uaqa7p6vrdc/7ksrO7E73e1PfVlX/rIZmcMQWRQDTQMeW6cC5DD3TwDPguS3LwKmgGQ0xcRkqJSBHMF1UXEa3PAM+C5bdkHGYl8uISvk0UI5Dw2GgTX8Z3dJBpXjjOMmW4RpD4r/r2GWVEpki2TKWgdMkhXyOW8qJyrNuKC4Z0UE7LgTcg762lBI4RFJGh94tKJcQMFJcy6qUgkzirtD4IJ0mBNwbAR3gE29ZN5SsMuDlQkClDEyajLRBuZ8QcI9DHeBYaVk3lAngKfn6/SxCIH08UikpHCRZYW36H1bPKgTcA30b+Khw1g1mlmRFTWVYLo8QcHdfMwXybTx/0CvjUMbl8gqBZPd1M1emQ8JuTMXMkK8LKSIEG2MWuAHsyrGcV1qhEyiBuIRaf6eR0AkovagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYagQYTRByO3I63+CZaH8zz7gri37AueiKIqiKIqiKIqiKIqiKIqiDMIoNb+3sElMAQ+ARbLfSq14ZIEXt0TPB85lYJrQzPW2aMUfKkQYKkQYKkQYKkQYKkQYKkQYKkQYPoSMAR8Ab3hYtxQ2ATupwT/0SuA6Zu/5EWaWUd8UnVGuKBPAko31K8KlvE9yIstJzzGrFOKaU/hdzzEHYhPwmGqlzEVizXmM45KxBLzuMWYpTOCeG9eXlCqufnfJaFNNl1wKaTNU13EW6bTvcjRkUkVogpTGyOhSZymNk9GljlIaK6NL2qDoe5O4CHXKdSBcX/QJsCVkUjG2kmwZlcpYWVUg4LL9+Usk7hiwHbiVYz3jwF5gB7AN2Gh/tjBzuS9g5o+/AVzDXJGSle2YS4q6dLupy+6PN4NJTMt4DtwB1mVYZjXmQWC/ke0pn9F+/xrmubmvZIiz3ubUbb2N66bS2IIZOPvJGAO+ofdSn6Jlwa5rrE/MdTY3SV2pCD4k+ZCXMsqMXbeSkRZwjvSu6RFwBfgCU7GbMd3Ravt6j/3bFftZ1zrawHfU/BquKlgBXMRdiXPASWBVjvWtsstED0BGy0UbU3EwAvxMstKWgDP0bv3kZRT4mhfnMaLlEsLPaYTiR5KVNYvZFC2Ld4A/HXF+KDFGIziAefpztJJuYvY5ymYcs48SjbUM7PcQq5aMY65aj28JbfAYcwPJLbh7wFqPMWvDBZJjxtYK4r5N8uzmTxXEFc2bJCvl2wrjn43Ffozflime7+mtkL+o9vjaqI0ZzeF8hfFF0cJMyRetjK8C5HEmlsPfDOkO43v0VsQi8GqAPF6zsaO57AiQBxB2h2hv7P1V4GGAPBYxF7xFiedWGSGF7I69/z1IFu7YwZ6NG1LIW7H314Nk4Y5dxWZ3KseBfyn/MLeWfGUe+LiF2RHLcjZN8c/8CMaOIoPRFZipuvcAawInM+zcB778D/wkjRlXpbOPAAAAAElFTkSuQmCC"/>
          <div className="sunChText"> 시 분</div>
        </div>
        <div>
          <img className="rise" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAEnUlEQVR4nO2dz2sdRRzAP0mbtII/QtVqr2Jr8WApVcEfhx48WEUEk7apRo0gWq03L/44iAiC+EcURNRDD73pQbTHerEeBFPFKKixeBFiSdGX5HmYeWR3dva9fe/tzHx38/3AkLy83f1+dz5vZ2d3502g+ZwA/gZWgeOJc1GAK0DXlpXEuYzNROoEaqDrvG70Pk2mTkDJo0KEoUKEoUKEoUKEoUKEoUKEoUKEoUKEoUKEoUKEoUKEoUKEoUKEoUKEoUKEoUKEoUKEoUKEoUKEIUnI7cBnwJfAIxHiPQn8CHwH3B8hXuP4hK3hPB2qj7HqOqUKx22M3jqXhsp0m/AV+YrtYAbBDWJYISfIy+gCSyPk23oepVhRHWB+wHrDCJkvifHEyFm3nFngP/IVtg4s9FmnqhDfkbEOPD121i1nDn/FPVuyfBUhKmNMyqQ851l2kJCTJdt6pvasW06ZlOed5foJ8Z0zVMYYuN3TLrBBXkqZkDIZ/c5HSgV87f8GsGjf9wk5hal8lREIn5RN4DRFIS9ghFXtFCgjskDxU+9WvO9vemQExNdj6lfKemZKjZykeKT4ygYqIxrz9Jfi9sSUCCziP4dsAi8nzGtb40pRGQJYxDRf62xdmyiJmWfwbXpFURRFURRFURRFURRFURRFOlM0fPLLNqHz9gpD5+0Vhjuet9H7JOk7hgoqRBwqRBgqRBgqRBgqRBgqRBgqRBghhEwDDwK3Bti2FPYB99KAD/RO4CLm6vkqZiKA0Awzk0MdzAJrNtYXCJfyAMVpK+YCx4wpxPdV7XsCxxyLfcA14kpZzsRaDhjHJ2MNuCVgzFqYxT/BSygpx4DfbTkWKIZPRoc4TXItlE0i08S5Rcr25VTKpEahDVJaI6NHk6W0TkaPJkpprYweZSfF0F3iUWhSrmPh29F/gf0pk3I4QPHIiCpjZ6xAwDn789NM3GngEPDTENuZAY4Ch4GDmOllD2KepV/GDHpYAr4FLmBGpFTlEGZIUY9eM3XOv3g7mMMcGV3gN2BPhXV2Y2Zm+Jpq02pk2/0LmK9LX1chzs02p97R27pmqoz9mBPnIBnTwOvkh/qMWq7YbU0PiLnH5iapKRXBQ5gmaFwRblmy21YqMgG8TXnTdBU4D7yEqdg7MM3Rbvv7w/a983ZZ3zY6wFs0fAxXDHYAZ/FX4jLwIrBriO3tsutkb0Bmy1kbU/EwCXxMsdLWgDPkez/DMgW8xtZzjGz5COHPNFLxPsXKuozpitbF3cD3njjv1RijFTyOmVopW0mXMNccdTODuUbJxtoEHgsQq5HMYEatuz2hvQFj7qXYg/sDuClgzMbwIcVzxoEIce+i+HTzgwhxRXMbxUp5I2L8N53Y1wh7ZIrnXfIV8gNx769N2ZjZHN6JGF8UE8Av5Cvj1QR5nHFy+JltesF4hHxFrAI3JMjjRhs7m8vhBHkAaS+IjjqvPwf+SZDHKmbAWxY3t2ikFOL+q7pvkmThj31fkixIK+RO5/XFJFn4Y8fodpeyAPxF/be5tQxXVoCnJjAXYlWepinhWZnE2FFkMLUD+BXzUOf6xMlsd/4EXvkf38KKr/w/R1oAAAAASUVORK5CYII="/>
          <div className="sunChText"> 시 분</div>
        </div>
        
      </div>
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
