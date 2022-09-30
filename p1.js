//The Rules of Game
document.querySelector("#close").addEventListener("click", function(){
  document.querySelector(".popup").style.display = "none";
  document.querySelector("#overlay").style.display = "none";
   startTimer();
});


//To assign the various elements to a variable 
let button = document.getElementById("Button");
let firstLetter = document.querySelector("#displayLetter");
let numDis = document.querySelector("#displayNum")
let points = document.querySelector("#displayPoint")

let counter = 0;
let counterStorage = []
let wordStorage = []


//To randomize number from 3 to 15
function randomNumber(){
    const min = 3
    const max =10;
    let num = Math.floor(Math.random()*(max-min+1))+min
    return num
}

//To randomize the alphabets 
let alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
let startLetter=Math.floor(Math.random()*alphabets.length)


//To create the boxes for player to input the letters
function createLetterInput(num){
    for (let i=1; i<num; i++){
        let input = document.createElement("INPUT")
        input.setAttribute("type","text");
        input.setAttribute("placeholder","___");
        input.setAttribute("id",`letterInput${i}`);
        input.setAttribute("class","letterContainer");
        input.setAttribute("onkeydown","return /[a-z]/i.test(event.key)");
         input.setAttribute("onkeyup","manage(this)");
        input.setAttribute("maxlength","1");
    
        firstLetter.after(input)
         }
    
    }  

//To auto move on the the next input box
function enterNext(){
let setOfInputs  = document.getElementsByTagName("input")
Array.from(setOfInputs).forEach(function(enterInput){
  enterInput.addEventListener("keyup", function() {
    if (enterInput.value.length == 1) {
      // Focus on the next sibling
      enterInput.nextElementSibling.focus()
    }
    else{
        enterInput.previousElementSibling.focus()
    }
  });
})
}


function toLoop(num){
    for (let i=1; i<num; i++){
        let element = document.getElementById(`letterInput${i}`)
        return element
    }
}
   
//To enable button
function enablingButton(arg){
    arg.addEventListener("input",function(){
        button.disabled = !(arg.value)
    })
}


//To string the letters together to get a word
function createWord(){
    let word=""
    let letter = document.querySelectorAll(".letterContainer")
    word+=letter[0].innerHTML
    for (let i=1; i<letter.length; i++){
     word += letter[i].value
    } 
    return word   
    
}

//check if the word exist in the storage 
function isWordEnteredBefore(word){
  let validation1 = false;
    if (wordStorage.indexOf(word) !== -1){  //match found 
            validation1 = true;
        } 
        return validation1;
  

}

//check validity of word
async function isWordValid(word){
    const url = `https://api.datamuse.com/words?ml=${word}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return data

}

//Return the highestscore
function storePoints(score){
        localStorage.setItem(Date(), score)

        let points = [],
                keys = Object.keys(localStorage),
                i = keys.length;

            while (i--) {
                points.push(JSON.parse(localStorage.getItem(keys[i])));
            }
            
            let highestScore = Math.max.apply(0, points)
            console.log(Object.values(localStorage))

            return highestScore ;
}

//Countdown

let FULL_DASH_ARRAY = 283;
let WARNING_THRESHOLD = 10;
let ALERT_THRESHOLD = 5;

let COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const TIME_LIMIT = 20;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("timer").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

function onTimesUp() {
  clearInterval(timerInterval);
  
  wordStorage.length=0   
  console.log(counter)
  if (storePoints(counter) === counter){
    document.querySelector("#overlay").style.display = "block";
    document.querySelector("#GameOver1").style.display = "block"
    document.getElementById("reason").innerHTML = "Time is up !"
    document.getElementById("your_score").innerHTML = `Your score is ${counter}`;
    document.getElementById("highest_score").innerHTML = "New High Score";
  }
  else{
    document.querySelector("#overlay").style.display = "block";
    document.querySelector("#GameOver1").style.display = "block"
    document.getElementById("reason").innerHTML = "Time is up !"
    document.getElementById("your_score").innerHTML = `Your score is ${counter}`;
    document.getElementById("highest_score").innerHTML = `The  Higest score is ${storePoints(counter)}`;
   
  }
  
  console.log(storePoints(counter))


}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();

    }
  }, 1000);
}

function formatTime(time) {
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${seconds}s`;
}

function setRemainingPathColor(timeLeft) {
  let { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
  else{
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
     document
      .getElementById("base-timer-path-remaining")
      .classList.add(info.color);
          document
      .getElementById("base-timer-path-remaining")
      .classList.remove(alert.color);
     document
      .getElementById("base-timer-path-remaining")
      .classList.add(info.color);
    }
  }

function calculateTimeFraction() {
  let rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  let circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

function reset(){
  setTimeout(() => {timePassed=-1},0)
  
}

//Call the various function

//display num
let number = numDis.innerText = randomNumber();

//display alphabets
firstLetter.innerText = alphabets[startLetter];

createLetterInput(number)
enterNext();
enablingButton(toLoop(number))



button.addEventListener("click", function() {
    reset()
    setTimeout(()=>{
        let wordCreate=createWord()
        console.log(wordCreate)

         isWordValid(wordCreate).then( data => {
          if (data.length === 0){
            wordStorage.length=0   
            console.log(counter)
            if (storePoints(counter) === counter){
              document.querySelector("#overlay").style.display = "block";
              document.querySelector("#GameOver1").style.display = "block"
              document.getElementById("reason").innerHTML = "Word does not exist!"
              document.getElementById("your_score").innerHTML = `Your score is ${counter}`;
              document.getElementById("highest_score").innerHTML = "New High Score";
            }
            else{
              document.querySelector("#overlay").style.display = "block";
              document.querySelector("#GameOver1").style.display = "block"
              document.getElementById("reason").innerHTML = "Word does not exist !"
              document.getElementById("your_score").innerHTML = `Your score is ${counter}`;
              document.getElementById("highest_score").innerHTML = `The  Higest score is ${storePoints(counter)}`;
            
            }
          
            console.log(storePoints(counter))
          }
          else{
            if(isWordEnteredBefore(wordCreate) === false){
              wordStorage.push(wordCreate)
              console.log(wordStorage)
              console.log("No exist & word valid")
              
              counter++;
              points.innerText = counter;
              let lastLetter = wordCreate.slice(-1).toUpperCase(); 
              firstLetter.innerText = lastLetter;
              let clearLetter=document.getElementsByTagName("input");
                  for (let i=clearLetter.length; i>0; i--){
                      clearInput = document.getElementById(`letterInput${i}`).remove();
                      console.log(clearLetter)
                  }
                  
              let updateNum = numDis.innerText = randomNumber();
              createLetterInput(updateNum);
              enterNext();
              button.disabled = true;
              enablingButton(toLoop(updateNum))
          }
          else{
            wordStorage.length=0   
            console.log(counter)
            if (storePoints(counter) === counter){
              document.querySelector("#overlay").style.display = "block";
              document.querySelector("#GameOver1").style.display = "block"
              document.getElementById("reason").innerHTML = "Word has already been entered!"
              document.getElementById("your_score").innerHTML = `Your score is ${counter}`;
              document.getElementById("highest_score").innerHTML = "New High Score";
            }
            else{
              document.querySelector("#overlay").style.display = "block";
              document.querySelector("#GameOver1").style.display = "block"
              document.getElementById("reason").innerHTML = "Word has already been entered !"
              document.getElementById("your_score").innerHTML = `Your score is ${counter}`;
              document.getElementById("highest_score").innerHTML = `The  Higest score is ${storePoints(counter)}`;
            
            }
          
            console.log(storePoints(counter))
            }
          }
         console.log(data)
            
        })
        
        },500)
    });
