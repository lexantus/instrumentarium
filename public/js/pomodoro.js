class Pomodoro {
  constructor(changeCallback) {
    const BASE_URL = '/ajax/pomodoro';

    this.changeCallback = changeCallback;

    this.seconds = 1500;

    let self = this;

    this.xhrPomodoroComplete = new XMLHttpRequest();
    this.xhrPomodoroComplete.open('GET', `${BASE_URL}/complete`, true);
    this.xhrPomodoroComplete.onreadystatechange = () => {
      if (this.status === 200 && this.readyState === 4) {
        console.log("work: " + this.responseText);
      }
    };

    this.xhrBreakComplete = new XMLHttpRequest();
    this.xhrBreakComplete.open('GET', `${BASE_URL}/break_complete`, true);
    this.xhrBreakComplete.onreadystatechange = () => {
      if (this.status === 200 && this.readyState === 4) {
        console.log("short break: " + this.responseText);
      }
    };

    this.xhrLongBreakComplete = new XMLHttpRequest();
    this.xhrLongBreakComplete.open('GET', `${BASE_URL}/long_break_complete`, true);
    this.xhrLongBreakComplete.onreadystatechange = () => {
      if (this.status === 200 && this.readyState === 4) {
        console.log("long break: " + this.responseText);
      }
    };

    this.startAction = function (seconds, xhr) {
      this.seconds = seconds;
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        self.seconds -= 1;
        if (self.seconds === 0) {
          clearInterval(self.timer);
          xhr.send();
        }
      }, 1000);
    }
  }

  set seconds(value) {
    this._seconds = value;
    this.changeCallback(this._seconds);
  }

  get seconds() {
    return this._seconds;
  }

  startPomodoro() {
    this.startAction(1500, this.xhrPomodoroComplete);
  }

  startBreak() {
    this.startAction(300, this.xhrBreakComplete);
  }

  startLongBreak() {
    this.startAction(600, this.xhrLongBreakComplete);
  }
}

let clockDiv = document.getElementById('clock');
let btnWork = document.getElementById('work');
let btnBreak = document.getElementById('short_break');
let btnLongBreak = document.getElementById('long_break');

let pomodoro = new Pomodoro(function(seconds){
  "use strict";
  let mins = Math.floor(seconds / 60);
  let sec = seconds - mins * 60;
  if (mins < 10) mins = '0' + mins;
  if (sec < 10) sec = '0' + sec;
  clockDiv.innerHTML = mins + ':' + sec;
});

btnWork.addEventListener('click', function(){
  pomodoro.startPomodoro();
});

btnBreak.addEventListener('click', function() {
  pomodoro.startBreak();
});

btnLongBreak.addEventListener('click', function() {
  pomodoro.startLongBreak();
});
