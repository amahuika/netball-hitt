// set dom element variables
const btn25min = document.querySelector("#generate25");
const exerciseDiv = document.querySelector(".exerciseMain");
const timerDiv = document.querySelector(".timer");
const timerBtnDiv = document.querySelector(".timerBtnDiv");
const playBtn = document.querySelector(".playBtn");
const stopBtn = document.querySelector(".stopBtn");
const mainBtn = document.querySelector(".mainBtn");
const lengthInput = document.querySelector("#length");
const timeRemainderDiv = document.querySelector(".timeRemainderDiv");
const timeRemaining = document.querySelector(".timeRemaining");
const congratDiv = document.querySelector(".congratulations");
const restDiv = document.querySelector("rest");

// set variables
let audioBeep = new Audio("audio/beeps.wav");
let totalSeconds = 0;
let toMinutes, seconds, lengthMin, totalTime;

// set empty arrays
let exerciseList = [];
let exerciseOrder = [];
let workoutDisplay = [];

// exercise object
const exercises = {
  arms: ["Ski Jumps", "Long Jump Run Back", "Squat Jumps"],
  legs: ["Jumping Lunges", "High Knees", "Shuttle Sprints"],
  abs: ["Little Feet Fig 8", "Burpees", "Tuck Jumps"],
};

// Generate button click ////////////////////////////////////////////

btn25min.addEventListener("click", () => {
  // amount of exercises for each category
  const amount = 2;

  let armsCloneArr = [...exercises.arms];
  let legsCloneArr = [...exercises.legs];

  let absCloneArr = [...exercises.abs];

  // get exercises

  for (let i = 0; i < amount; i++) {
    randomExercise(armsCloneArr);
    randomExercise(legsCloneArr);

    randomExercise(absCloneArr);
  }

  // set default length of 25min if input is empty
  let lengthMin = lengthInput.value ? lengthInput.value : 25;

  // create exercise order
  while (totalSeconds / 60 < lengthMin) {
    for (let i = 0; i < exerciseList.length; i++) {
      if (totalSeconds / 60 < lengthMin) {
        exerciseOrder.push(exerciseList[i]);
        exerciseOrder.push("Rest");
        exerciseOrder.push(exerciseList[i]);
        exerciseOrder.push("Rest");
        exerciseOrder.push(exerciseList[i]);
        exerciseOrder.push("Break");

        // add each exercise length and breaks in seconds
        totalSeconds += 25 + 10 + 25 + 10 + 25 + 20;
      } else {
        break;
      }
    }
  }

  // remove last break of array and minus the 20 sec for that break
  exerciseOrder.unshift("Get Ready");
  totalSeconds += 5;
  exerciseOrder.pop();
  totalSeconds -= 20;

  // add the array to the screen in multiple div
  for (const el of exerciseOrder) {
    createDiv(el);
  }

  // add a timer to the screen show play button
  let showTotalTime = displayTimeRemaining(totalSeconds);
  showTimer(exerciseOrder[0]);
  timeRemaining.textContent = showTotalTime;

  totalTime = showTotalTime;
  congratDiv.classList.add("d-none");
  timerBtnDiv.classList.remove("d-none");
  timeRemainderDiv.classList.remove("d-none");
  mainBtn.classList.add("d-none");

  //   Get array of all div for each workout
  workoutDisplay = [...document.querySelectorAll(".workoutDisplay")];
  workoutDisplay[0].setAttribute("id", "top");
});

// PLay button /////////////////////////////////

let isPlaying = false;
let countdown;
let timer = 0;

playBtn.addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("#top").scrollIntoView({
    behavior: "smooth",
  });
  if (isPlaying) {
    clearInterval(countdown);
    playBtn.innerHTML = "Play";
    isPlaying = false;
  } else if (!isPlaying) {
    timerCount();
    playBtn.innerHTML = "Pause";
    isPlaying = true;
  }

  workoutDisplay[0].style.borderColor = "#66ff00";
});

// Timer function
function timerCount() {
  countdown = setInterval(() => {
    timer--;
    timerDiv.textContent = `${timer.toString().padStart(2, 0)} Sec`;

    totalSeconds--;
    timeRemaining.textContent = displayTimeRemaining(totalSeconds);

    if (timer === 4) {
      audioBeep.play();
    }
    if (timer <= 0) {
      workoutDisplay[0].remove();
      workoutDisplay.shift();
      exerciseOrder.shift();
      clearInterval(countdown);

      if (workoutDisplay.length === 0) {
        resetPage();
        congratDiv.classList.remove("d-none");
        document.querySelector(".totalTime").textContent = totalTime;
      } else {
        workoutDisplay[0].setAttribute("id", "top");
        workoutDisplay[0].style.borderColor = "#66ff00";
        showTimer(exerciseOrder[0]);
        timerCount();
      }

      workoutDisplay[0].setAttribute("id", "top");
      workoutDisplay[0].style.borderColor = "#66ff00";
      showTimer(exerciseOrder[0]);
      clearInterval(countdown);
      timerCount();
    }
  }, 1000);
}

// Stop button //////////////////////////

stopBtn.addEventListener("click", () => {
  const stop = confirm(
    `Are you sure you want to stop the timer? \nThis will remove current workout`
  );

  // Reset elements and variables
  if (stop) {
    workoutDisplay.forEach((val) => val.remove());
    resetPage();
    clearInterval(countdown);
  }
});

// functions /////////////////////////
// show timer function
function showTimer(exercise) {
  if (exercise === "Rest") {
    timer = 10;
  } else if (exercise === "Break") {
    timer = 20;
  } else if (exercise === "Get Ready") {
    timer = 5;
  } else {
    timer = 25;
  }

  timerDiv.textContent = `${timer.toString().padStart(2, 0)} Sec`;
}

// Random exercise function
function randomExercise(bodyPartArr) {
  let index = Math.floor(Math.random() * bodyPartArr.length);
  exerciseList.push(bodyPartArr[index]);
  bodyPartArr.splice(index, 1);
}

// Create div function
function createDiv(name) {
  const text = document.createTextNode(`${name}`);
  const newDiv = document.createElement("div");

  newDiv.classList.add("workoutDisplay");
  newDiv.appendChild(text);
  exerciseDiv.appendChild(newDiv);
}

//display total time remaining
function displayTimeRemaining(totalSeconds) {
  toMinutes = Math.floor(totalSeconds / 60);
  seconds = totalSeconds % 60;

  return `${toMinutes.toString().padStart(2, 0)}:${seconds
    .toString()
    .padStart(2, 0)}`;
}

function resetPage() {
  timerBtnDiv.classList.add("d-none");
  timeRemainderDiv.classList.add("d-none");
  mainBtn.classList.remove("d-none");
  lengthInput.value = "";
  playBtn.innerHTML = "Play";
  workoutDisplay = [];
  exerciseList = [];
  exerciseOrder = [];
  timer = 0;
  totalSeconds = 0;
  isPlaying = false;
}
