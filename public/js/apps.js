(function () {
  var div = document.getElementsByClassName('apps')[0];
  var body = document.getElementsByTagName('body')[0];
  var head = document.getElementsByTagName('head')[0];

  function loadApp(json) {

    function addJSElements() {
      var js = json.js;
      var el;
      for (var i = 0; i < js.length; i++) {
        el = document.createElement('script');
        el.src = js[i];
        body.appendChild(el);
      }
    }

    function addCSSElements() {
      var css = json.css;
      var el;
      for (var i = 0; i < css.length; i++) {
        el = document.createElement('link');
        el.rel = 'stylesheet';
        el.href = css[i];
        head.appendChild(el);
      }
    }

    var htmlEl = document.createElement('div');
    htmlEl.innerHTML = json.html;
    body.appendChild(htmlEl);

    addCSSElements();
    addJSElements();
  }

  function xhrStateHandler(i, appname) {
    function checkXHR() {
      if (xhrs[i].status === 200 && xhrs[i].readyState === 4) {
        div.children[i].style.visibility = false;
        loadApp(JSON.parse(xhrs[i].responseText));
        xhrs[i].open('GET', 'ajax/' + appname);
      }
    }

    return checkXHR;
  }

  function clickHandler(i) {
    function sendXHR() {
      div.children[i].removeEventListener('click', sendXHR);
      div.children[i].style.display = 'none';
      xhrs[i].send();
    }

    return sendXHR;
  }

  var xhrs = [];
  for (var i = 0; i < div.children.length; i++) {
    xhrs.push(new XMLHttpRequest());
    xhrs[xhrs.length - 1].open('GET', 'ajax/' + div.children[i].dataset.appname, true);
    xhrs[xhrs.length - 1].onreadystatechange = xhrStateHandler(i, div.children[i].dataset.appname);
    div.children[i].addEventListener('click', clickHandler(i));
  }
})();
