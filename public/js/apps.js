(function () {
  let div = document.getElementsByClassName("apps")[0];

  function loadApp(json) {
    console.log(json);
  }

  var xhrs = [];
  var xhr;
  for (var i = 0; i < div.children.length; i++) {
    xhrs.push(new XMLHttpRequest());
    xhr = xhrs[xhrs.length - 1];
    xhr.open('GET', 'ajax/' + div.children[i].dataset.appname, true);
    xhr.onreadystatechange = function () {
      if (this.status === 200 && this.readyState === 4) {
        div.children[i].style.visibility = false;
        loadApp(JSON.parse(xhr.responseText));
      }
    };
    div.children[i].addEventListener('click', function () {
      this.classList.add('icon-loader');
      xhrs[i].send();
    });
  }
})();