(function () {
  var div = document.getElementsByClassName("apps")[0];

  function loadApp(json) {
    console.log(json);
  }

  function xhrStateHandler(i) {
    function checkXHR() {
      if (xhrs[i].status === 200 && xhrs[i].readyState === 4) {
        div.children[i].style.visibility = false;
        loadApp(JSON.parse(xhrs[i].responseText));
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
    xhrs[xhrs.length - 1].onreadystatechange = xhrStateHandler(i);
    div.children[i].addEventListener('click', clickHandler(i));
  }
})();
