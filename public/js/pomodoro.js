class Pomodoro {
  constructor(changeCallback) {
    const BASE_URL = '/ajax/pomodoro';

    this.changeCallback = changeCallback;

    this.seconds = 1500;

    let svgContainer = document.getElementById('result');

    let addSVG = (svg)=>{
      let el = document.createElement('img');
      el.src=`/svg/${svg}`;
      el.style.width = '100px';
      el.style.height = '100px';
      svgContainer.appendChild(el);
    };

    this.xhrPomodoroComplete = new XMLHttpRequest();
    this.xhrPomodoroComplete.open('GET', `${BASE_URL}/complete`, true);
    this.xhrPomodoroComplete.onreadystatechange = () => {
      if (this.xhrPomodoroComplete.status === 200 && this.xhrPomodoroComplete.readyState === 4) {
        console.log("work: " + this.xhrPomodoroComplete.responseText);
        addSVG('tomato.svg');
      }
    };

    this.xhrBreakComplete = new XMLHttpRequest();
    this.xhrBreakComplete.open('GET', `${BASE_URL}/break_complete`, true);
    this.xhrBreakComplete.onreadystatechange = () => {
      if (this.xhrBreakComplete.status === 200 && this.xhrBreakComplete.readyState === 4) {
        console.log("short break: " + this.xhrBreakComplete.responseText);
        addSVG('short_break.svg');
      }
    };

    this.xhrLongBreakComplete = new XMLHttpRequest();
    this.xhrLongBreakComplete.open('GET', `${BASE_URL}/long_break_complete`, true);
    this.xhrLongBreakComplete.onreadystatechange = () => {
      if (this.xhrBreakComplete.status === 200 && this.xhrBreakComplete.readyState === 4) {
        console.log("long break: " + this.xhrBreakComplete.responseText);
        addSVG('long_break.svg');
      }
    };

    var self = this;

    this.startAction = (seconds, xhr) => {
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

let pomodoro = new Pomodoro((seconds) => {
  let mins = Math.floor(seconds / 60);
  let sec = seconds - mins * 60;
  if (mins < 10) mins = '0' + mins;
  if (sec < 10) sec = '0' + sec;
  clockDiv.innerHTML = mins + ':' + sec;
});

btnWork.addEventListener('click', () => {
  pomodoro.startPomodoro();
});

btnBreak.addEventListener('click', () => {
  pomodoro.startBreak();
});

btnLongBreak.addEventListener('click', () => {
  pomodoro.startLongBreak();
});
