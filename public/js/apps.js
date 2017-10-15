(function () {
  var div = document.getElementsByClassName("apps")[0];

  function loadApp(json) {
    console.log(json);
    var html = json.html;
    var css = '<link rel="stylesheet" href="' + json.css + '">';
    var js = '<script src="' + json.js + '"></script>';
    document.getElementsByTagName('head')[ 0 ].innerHTML += css;
    document.getElementsByTagName('body')[ 0 ].innerHTML += html;
    document.getElementsByTagName('body')[ 0 ].innerHTML += js;
  }

  function xhrStateHandler(i, appname) {
    function checkXHR() {
      if (xhrs[i].status === 200 && xhrs[i].readyState === 4) {
        div.children[i].style.visibility = false;
        loadApp(JSON.parse(xhrs[i].responseText));
        xhrs[ i ].open('GET', 'ajax/' + appname);
      }
    }

    return checkXHR;
  }

  function clickHandler(i) {
    function sendXHR() {
      div.children[i].classList.add('icon-loader');
      xhrs[i].send();
    }

    return sendXHR;
  }

  var xhrs = [];
  for (var i = 0; i < div.children.length; i++) {
    xhrs.push(new XMLHttpRequest());
    xhrs[xhrs.length - 1].open('GET', 'ajax/' + div.children[i].dataset.appname, true);
    xhrs[xhrs.length - 1].onreadystatechange = xhrStateHandler(i, div.children[ i ].dataset.appname);
    div.children[i].addEventListener('click', clickHandler(i));
  }
})();
