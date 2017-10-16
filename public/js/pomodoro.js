class Pomodoro {
  constructor(changeCallback) {
    const BASE_URL = '/ajax/pomodoro';

    this.changeCallback = changeCallback;

    this.seconds = 1500;

    let self = this;

    this.xhrPomodoroComplete = new XMLHttpRequest();
    this.xhrPomodoroComplete.open('GET', `${BASE_URL}/complete`, true);
    this.xhrPomodoroComplete.onreadystatechange = () => {
      if (self.xhrPomodoroComplete.status === 200 && self.xhrPomodoroComplete.readyState === 4) {
        console.log("work: " + self.xhrPomodoroComplete.responseText);
      }
    };

    this.xhrBreakComplete = new XMLHttpRequest();
    this.xhrBreakComplete.open('GET', `${BASE_URL}/break_complete`, true);
    this.xhrBreakComplete.onreadystatechange = () => {
      if (self.xhrBreakComplete.status === 200 && self.xhrBreakComplete.readyState === 4) {
        console.log("short break: " + self.xhrBreakComplete.responseText);
      }
    };

    this.xhrLongBreakComplete = new XMLHttpRequest();
    this.xhrLongBreakComplete.open('GET', `${BASE_URL}/long_break_complete`, true);
    this.xhrLongBreakComplete.onreadystatechange = () => {
      if (self.xhrLongBreakComplete.status === 200 && self.xhrLongBreakComplete.readyState === 4) {
        console.log("long break: " + self.xhrLongBreakComplete.responseText);
      }
    };

    this.startAction = function (seconds, xhr) {
      this.seconds = seconds;
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

let pomodoro = new Pomodoro(function(seconds){
  "use strict";
  let mins = Math.floor(seconds / 60);
  let sec = seconds - mins * 60;
  if (mins < 10) mins = '0' + mins;
  if (sec < 10) sec = '0' + sec;
  clockDiv.innerHTML = mins + ':' + sec;
});

pomodoro.startPomodoro();