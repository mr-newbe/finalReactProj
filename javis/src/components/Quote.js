


var quoteArr=["인생은 실전", "거울이 당신의 겉모습만을 비추는걸 감사히 생각하라", "우린 더 나아질 수 있다는 믿음 아래 비로소 살아갈 수 있다"]

function Quote(){
  
  function reSetting(){
    
    const rand = Math.floor(Math.random() * (quoteArr.length));
    const quotediv = document.getElementById('quote');
    quotediv.innerText = quoteArr[rand];
  }

  return(
    <div className="qutteMom">
      <div id='quote'></div>
      <button onClick={()=>reSetting()}>명언 추천</button>

    </div>
  )
}

export default Quote;