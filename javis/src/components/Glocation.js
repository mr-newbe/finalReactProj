/*global kakao*/
import {useEffect, useState} from 'react';
import { 
  RecoilRoot,
  atom, 
  useRecoilValue, 
  useSetRecoilState 
} from "recoil";import "../styles/Map.css"


export const globLoc = atom({
  key:'loc',
  default:{Lat:'',Lon:''}
})

export function Location(){
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const locSetter = useSetRecoilState(globLoc);


  function loc(){
    if("geolocation" in navigator){
      console.log("위치 확인 가능");
      navigator.geolocation.getCurrentPosition((position)=>{
        console.log("경도 :"+position.coords.latitude);
        setLatitude(position.coords.latitude);
        console.log("위도 :"+position.coords.longitude);
        setLongitude(position.coords.longitude);

        locSetter({Lat:latitude,Lon:longitude});
      })
    } else {
      console.log("위치 확인 불가");
    }
  }


  return(
    <>
      <span>{loc()}</span>
      <div className='MapOuterBox'>
        {latitude&&longitude?
        <CacaoAPI Lat={latitude} Lng={longitude}/>:''}
      </div>
      
      
      
    </>
  )
}

//좌표를 통해 카카오 맵을 불러오기


const btynstyle = {
  width:"400px",
  height: "400px",
}
const {kakao} = window;

export function CacaoAPI(props){
  console.log(props.Lat);
  console.log(props.Lng);
  useEffect(() => {
    let container = document.getElementById("map");
    
    let options = {
      center: new kakao.maps.LatLng(props.Lat, props.Lng),
      level: 3,
    };

    let map = new window.kakao.maps.Map(container, options);

    console.log("loading kakaomap");

    var geocoder = new window.kakao.maps.services.Geocoder();

    var marker = new window.kakao.maps.Marker();

    var infowindow = new window.kakao.maps.InfoWindow({zindex:1});


    searchAddrFromCoords(map.getCenter(), displayCenterInfo);
      
        // 지도를 클릭했을 때 클릭 위치 좌표에 대한 주소정보를 표시하도록 이벤트를 등록합니다
    kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
      searchDetailAddrFromCoords(mouseEvent.latLng, function(result, status) {
          if (status === kakao.maps.services.Status.OK) {
              var detailAddr = !!result[0].road_address ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>' : '';
              detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';
              
              var content = '<div class="bAddr">' +
                              '<span class="title">법정동 주소정보</span>' + 
                              detailAddr + 
                          '</div>';

              // 마커를 클릭한 위치에 표시합니다 
              marker.setPosition(mouseEvent.latLng);
              marker.setMap(map);

              // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
              infowindow.setContent(content);
              infowindow.open(map, marker);
          }   
      });
    });

    // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
    kakao.maps.event.addListener(map, 'idle', function() {
      searchAddrFromCoords(map.getCenter(), displayCenterInfo);
    });

    function searchAddrFromCoords(coords, callback) {
      // 좌표로 행정동 주소 정보를 요청합니다
      geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
    }

    function searchDetailAddrFromCoords(coords, callback) {
      // 좌표로 법정동 상세 주소 정보를 요청합니다
      geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
    }

    // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
    function displayCenterInfo(result, status) {
      if (status === kakao.maps.services.Status.OK) {
          var infoDiv = document.getElementById('centerAddr');

          for(var i = 0; i < result.length; i++) {
              // 행정동의 region_type 값은 'H' 이므로
              if (result[i].region_type === 'H') {
                  infoDiv.innerHTML = result[i].address_name;
                  break;
              }
          }
      }    
    }
  }, []);

  return (
    <div className="mapWrap">
      <div id="map"></div>
      <div className="hAddr">
        <span className="title">지도중심기준 행정동 주소정보</span>
        <span id='centerAddr'></span>
      </div>
    </div>
  );
}