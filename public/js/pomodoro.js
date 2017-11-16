class Pomodoro {
  constructor(changeCallback) {
    this.changeCallback = changeCallback;

    this.seconds = 1500;

    let svgContainer = document.getElementById('result');
    let audioLeasure = new Audio('/sounds/leasure.mp3');
    let audioJob = new Audio('/sounds/job.mp3');

    let addSVG = (svg) => {
      let el = document.createElement('img');
      el.src = `/svg/${svg}`;
      el.style.width = '100px';
      el.style.height = '100px';
      svgContainer.appendChild(el);
    };

    let showNotification = (title, body, icon, audio) => {
      if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
      }
      else if (Notification.permission === 'granted'){
        new Notification(title, {body, icon, requireInteraction: true});
        audio.play();
      }
      else {
        Notification.requestPermission(((permission)=>{
          if (permission === 'granted'){
            new Notification(title, {body, icon, requireInteraction: true});
            audio.play();
          }
        }));
      }
    };

    this.xhrPomodoroComplete = new XMLHttpRequest();
    this.xhrPomodoroComplete.onreadystatechange = () => {
      if (this.xhrPomodoroComplete.status === 200 && this.xhrPomodoroComplete.readyState === 4) {
        console.log("work: " + this.xhrPomodoroComplete.responseText);
        addSVG('tomato.svg');
        showNotification('Pomodoro completed', 'Time to have a rest', '/imgs/tomato.png', audioLeasure);
      }
    };

    this.xhrBreakComplete = new XMLHttpRequest();
    this.xhrBreakComplete.onreadystatechange = () => {
      if (this.xhrBreakComplete.status === 200 && this.xhrBreakComplete.readyState === 4) {
        console.log("short break: " + this.xhrBreakComplete.responseText);
        addSVG('short_break.svg');
        showNotification('Short break completed', 'Work time', '/imgs/short_break.png', audioJob);
      }
    };

    this.xhrLongBreakComplete = new XMLHttpRequest();
    this.xhrLongBreakComplete.onreadystatechange = () => {
      if (this.xhrLongBreakComplete.status === 200 && this.xhrLongBreakComplete.readyState === 4) {
        console.log("long break: " + this.xhrLongBreakComplete.responseText);
        addSVG('dinner.svg');
        showNotification('Dinner completed', 'Work time', '/imgs/dinner.png', audioJob);
      }
    };

    this.getNowState = new XMLHttpRequest();
    this.getNowState.onreadystatechange = () => {
      if (this.getNowState.status === 200 && this.getNowState.readyState === 4) {
        let rows = JSON.parse(this.getNowState.responseText).rows;
        for (let value of rows) {
          if (value.type === '0') {
            addSVG('tomato.svg');
          }
          else if (value.type === '1') {
            addSVG('short_break.svg');
          }
          else if (value.type === '2') {
            addSVG('dinner.svg');
          }
        }
      }
    };

    let self = this;

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
    this.xhrPomodoroComplete.open('GET', `/ajax/pomodoro/complete`, true);
    this.startAction(1500, this.xhrPomodoroComplete);
  }

  startBreak() {
    this.xhrBreakComplete.open('GET', `/ajax/pomodoro/break_complete`, true);
    this.startAction(300, this.xhrBreakComplete);
  }

  startLongBreak() {
    this.xhrLongBreakComplete.open('GET', `/ajax/pomodoro/long_break_complete`, true);
    this.startAction(3600, this.xhrLongBreakComplete);
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
  document.getElementsByTagName('title')[0].innerHTML = clockDiv.innerHTML;
});

let date = new Date();
pomodoro.getNowState.open('GET', `/ajax/pomodoro/${date.getUTCFullYear()}/${date.getUTCMonth()}/${date.getUTCDate()}`);
pomodoro.getNowState.send();


btnWork.addEventListener('click', () => {
  pomodoro.startPomodoro();
});

btnBreak.addEventListener('click', () => {
  pomodoro.startBreak();
});

btnLongBreak.addEventListener('click', () => {
  pomodoro.startLongBreak();
});

document.getElementsByTagName('title')[0].innerHTML = 'Pomodoro';
document.getElementsByTagName('h1')[0].innerHTML = 'Pomodoro';

