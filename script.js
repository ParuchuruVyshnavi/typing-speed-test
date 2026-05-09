
const paragraphs = {

  easy:[
    "Coding is fun and easy.",
    "Practice typing every day.",
    "Frontend development creates websites.",
    "HTML and CSS are important.",
    "JavaScript adds interactivity.",
    "Practice makes a man perfect.",
    "Browser acts as interpreter for HTML,CSS and Javascript.",
    "Every website starts as a blank file in a code editor.",
    "Responsive website adjusts its layout automatically based on screen.",
  ],

  medium:[
    "Typing accuracy matters more than typing speed.",
    "Responsive design improves mobile user experience.",
    "Practice consistently to improve your coding skills.",
    "Web developers build interactive applications.",
    "HTML,CSS and Javascript are primary languages in web development.",
    "Three main types of development are front-end,back-end and full-stack.",
    "Version control systems like git are essential for tracking code changes.",
    "Web developers bare essentially problem solvers using code to build solutions."
  ],

  hard:[
    "Artificial intelligence is transforming modern software engineering rapidly.",
    "Advanced frontend frameworks improve scalability and maintainability.",
    "Consistency and determination are essential for mastering development skills.",
    "Web development is a process of designing,building and maintaining websites and web applications.",
    "Front-end development focuses on the user interface and client-side functionality.",
    "Back-end development handles server-side logic,database integrations and application performances."
  ]

};

const quote =
  document.getElementById("quote");

const input =
  document.getElementById("input");

const timeElement =
  document.getElementById("time");

const wpmElement =
  document.getElementById("wpm");

const accuracyElement =
  document.getElementById("accuracy");

const wordsElement =
  document.getElementById("words");

const mistakesElement =
  document.getElementById("mistakes");

const sentencesElement =
  document.getElementById("sentences");

const highScoreElement =
  document.getElementById("highScore");

const progressBar =
  document.getElementById("progressBar");

const warning =
  document.getElementById("warning");

const alertSound =
  document.getElementById("alertSound");

let timer;
let timeLeft;
let totalTime;
let currentText = "";
let mistakes = 0;
let completedSentences = 0;

highScoreElement.textContent =
  localStorage.getItem("highScore") || 0;

function startTest(){

  input.disabled = false;

  input.value = "";

  input.focus();

  mistakes = 0;

  completedSentences = 0;

  sentencesElement.textContent = 0;

  loadNextSentence();

  totalTime = parseInt(
    document.getElementById("timeSelect").value
  );

  timeLeft = totalTime;

  clearInterval(timer);

  timer = setInterval(()=>{

    timeLeft--;

    timeElement.textContent = timeLeft;

    progressBar.style.width =
      (timeLeft/totalTime)*100 + "%";

    calculateResults();

    if(timeLeft <= 5){

      warning.innerText =
        "⚠ Hurry Up! Only " +
        timeLeft +
        " seconds left";

      document.body.classList.add(
        "warning-active"
      );

      if(timeLeft === 5){
        alertSound.play();
      }

    }

    if(timeLeft <= 0){
      stopTest();
    }

  },1000);

}

function displayText(){

  quote.innerHTML = "";

  currentText.split("").forEach(char=>{

    const span =
      document.createElement("span");

    span.innerText = char;

    quote.appendChild(span);

  });

}

function loadNextSentence(){

  input.value = "";

  const level =
    document.getElementById("difficulty").value;

  const texts = paragraphs[level];

  currentText =
    texts[
      Math.floor(
        Math.random()*texts.length
      )
    ];

  displayText();

}

input.addEventListener("input", ()=>{

  const chars =
    quote.querySelectorAll("span");

  const typed =
    input.value.split("");

  mistakes = 0;

  chars.forEach((char,index)=>{

    if(typed[index] == null){

      char.classList.remove(
        "correct",
        "wrong"
      );

    }

    else if(
      typed[index] === char.innerText
    ){

      char.classList.add("correct");

      char.classList.remove("wrong");

    }

    else{

      char.classList.add("wrong");

      char.classList.remove("correct");

      mistakes++;

    }

  });

  mistakesElement.textContent = mistakes;

  calculateResults();

  if(
    typed.join("") === currentText
  ){

    completedSentences++;

    sentencesElement.textContent =
      completedSentences;

    loadNextSentence();

  }

});

function calculateResults(){

  const typedText =
    input.value.trim();

  const words =
    typedText.split(/\s+/)
    .filter(word=>word!=="");

  wordsElement.textContent =
    words.length;

  const timeSpent =
    (totalTime - timeLeft)/60;

  const wpm =
    Math.round(words.length/timeSpent);

  const finalWpm =
    isFinite(wpm) ? wpm : 0;

  wpmElement.textContent =
    finalWpm;

  const accuracy =
    Math.max(
      0,
      Math.round(
        ((typedText.length - mistakes)
        / typedText.length) * 100
      )
    );

  accuracyElement.textContent =
    isFinite(accuracy)
    ? accuracy + "%"
    : "0%";

  const highScore =
    localStorage.getItem("highScore") || 0;

  if(finalWpm > highScore){

    localStorage.setItem(
      "highScore",
      finalWpm
    );

    highScoreElement.textContent =
      finalWpm;

  }

}

function stopTest(){

  clearInterval(timer);

  input.disabled = true;

  warning.innerText = "";

  document.body.classList.remove(
    "warning-active"
  );

  alert(
    "Test Completed!\n\n" +
    "WPM: " + wpmElement.textContent +
    "\nAccuracy: " + accuracyElement.textContent +
    "\nCompleted Sentences: " + completedSentences
  );

}

const themeBtn =
  document.getElementById("themeBtn");

themeBtn.addEventListener("click", ()=>{

  document.body.classList.toggle("light");

});


document.addEventListener("keydown", (e) => {

  const pressedKey =
    e.key.toUpperCase();

  document.querySelectorAll(".key")
  .forEach(key => {

    key.classList.remove("active");

    if(
      key.innerText.toUpperCase()
      === pressedKey
    ){

      key.classList.add("active");

    }

  });

  // space key
  if(e.key === " "){

    document.querySelector(".space")
    .classList.add("active");

  }

  // enter key
  if(e.key === "Enter"){

    document.querySelector(".enter")
    .classList.add("active");

  }

});
