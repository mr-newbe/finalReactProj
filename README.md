# finalReactProj
<img width="1280" alt="image" src="https://github.com/mr-newbe/finalReactProj/assets/49405838/cd013ab0-2202-4b24-8398-08c912ae02a5">

<div>여러 api를 활용하면서 하루를 정리하기 위한 todo를 만들었습니다</div>
<div>구조는 스파게이티고, 왜인지 github page에도 게시되지 않는것이 여러 오류가 있는듯 하지만</div>
<div>로컬에서 사용하기에는 충분한듯 하고, 후에 충분히 시간을 들여 리펙토링 등을 하도록 하겠습니다</div>
<br/>
<br/>
<br/>
<img width="1280" alt="image" src="https://github.com/mr-newbe/finalReactProj/assets/49405838/96b1caf0-2e77-4687-832d-63f20d870c5c">
<div>두번째 페이지이자 메인 페이지입니다. 이곳에서 추가 버튼으로 할일을 추가하고 알림 버튼으로 가운데 영역으로 옮깁니다.</div>
<div>두번째 페이지에서 드래그를 통해 몇시에 그 일을 할지를 정합니다. </div>
<div>그리고 세번째 달력에서 해당 달에 대해서만 정할 수 있는데, 더블클릭으로 그달의 일정을 추가하면 로컬 스토리지에 데이터가 저장, 후에 불러와집니다.</div>
<div>가운데 창 가장 밑의 버튼을 누르고 다음 페이지로 넘거갑니다.</div>
<img width="1280" alt="image" src="https://github.com/mr-newbe/finalReactProj/assets/49405838/f3ba58bd-d85f-471f-8897-7f07a3b5d7cd">
<div>모든 요소를 버튼으로 설정했습니다</div>
<div>버튼을 누르면 그 부분이 초록으로 바뀌고, 그 뜻은 해당 일이 완료되었다는 뜻입니다. 마찬가지로 제일 아래 버튼을 통해 다음 페이지로 이동합니다</div>
<img width="1280" alt="image" src="https://github.com/mr-newbe/finalReactProj/assets/49405838/d68a0468-353a-4f0c-bbb9-c8adaf113512">
<div>마지막 페이지입니다. 마지막 버튼을 누르면 처음 페이지로 돌아가나 그게 중요한게 아니죠</div>
<div>이곳에 있는 일기 자동 생성 버튼, 이것이 이 프로젝트의 핵심입니다.</div>
<div>오늘의 날씨, 기온, 하루 일정의 마무리 정도, 앞으로 있을 이번달의 일정을 바탕으로 "사실에 기반한 일기를 작성해줍니다"</div>
<div>바로 밑의 quill Editor로 그 만들어진 일기가 입력됩니다</div>
<div>일기에 오늘의 감정적 사건들, 비하인드 스토리들을 작성하고 나면 밑의 인증 버튼과 만든일기 게시 버튼을 눌러 blogger api를 통해 블로그에 게시합니다</div>
<div>그 일기의 제목은 그날의 날짜(오전 4시 기준)를 바탕으로 바뀌며 일기는 설정한 페이지로 이동합니다</div>
<br/>
<br/>
<br/>
<div>기능들을 설명했으니 이번엔 기술에 대해 이야기해보겠습니다</div>
<div>우선 페이지 이동에 쓰인 기술은 간단합니다. display block과 none으로 페이지가 이동하는듯하게 꾸몄습니다.</div>
<div>그 이유는 github page에서는 react의 react router가 적용되지 않기 때문입니다. </div>
<div>첫번째 페이지에서는 </div>
