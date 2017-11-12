class ScreenManager {
  static setScreen(name) {
    let screen = document.getElementById(name);
    ScreenManager.hideAllScreens(name);
    screen.classList.add('show');
    screen.style.display = 'block';
  }

  static hideAllScreens(exceptId) {
    let screens = document.getElementsByClassName('screen');
    Array.prototype.forEach.call(screens, (screen) => {
      if (screen.id !== exceptId) {
        screen.classList.remove('show');
        setTimeout(() => {
          screen.style.display = 'none';
        }, 500);
      }
    });
  }
}

(function () {
  let div = document.getElementById('apps');
  let body = document.body;
  let head = document.head;

  let backBtn = document.getElementById('backBtn');
  backBtn.addEventListener('click', () => {
    ScreenManager.setScreen('apps');
    backBtn.style.display = 'none';
    document.getElementById('appName').textContent = 'Applications';
  });
  backBtn.style.display = 'none';

  function loadApp(json) {

    function addJSElements() {
      let js = json.js;
      let el;
      for (let i = 0; i < js.length; i++) {
        el = document.createElement('script');
        el.src = js[i];
        body.appendChild(el);
      }
    }

    function addCSSElements() {
      let css = json.css;
      let el;
      for (let i = 0; i < css.length; i++) {
        el = document.createElement('link');
        el.rel = 'stylesheet';
        el.href = css[i];
        head.appendChild(el);
      }
    }

    let htmlEl = document.createElement('div');
    body.appendChild(htmlEl);
    htmlEl.outerHTML = json.html;
    backBtn.style.display = 'block';

    ScreenManager.setScreen(json.name);

    addCSSElements();
    addJSElements();
  }

  function xhrStateHandler(i, appname) {
    function checkXHR() {
      if (xhrs[i].status === 200 && xhrs[i].readyState === 4) {
        div.children[i].style.visibility = false;
        appStatus[i] = 'loaded';
        loadApp(JSON.parse(xhrs[i].responseText));
        xhrs[i].open('GET', 'ajax/' + appname);
      }
    }

    return checkXHR;
  }

  function clickHandler(i) {
    function openApp() {
      if (appStatus[i] !== 'loaded') {
        xhrs[i].send();
      }
      else {
        let appname = div.children[i].dataset.appname;
        backBtn.style.display = 'block';
        ScreenManager.setScreen(appname);
        document.getElementById('appName').textContent = appname;
      }
    }

    return openApp;
  }

  let appStatus = [];
  let xhrs = [];
  let n = div.children.length;
  for (let i = 0; i < n; i++) {
    appStatus.push('not_loaded');
    xhrs.push(new XMLHttpRequest());
    xhrs[xhrs.length - 1].open('GET', `ajax/${div.children[i].dataset.appname}`, true);
    xhrs[xhrs.length - 1].onreadystatechange = xhrStateHandler(i, div.children[i].dataset.appname);
    div.children[i].addEventListener('click', clickHandler(i));
  }
})();
