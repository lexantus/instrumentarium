(() => {
  let formCite = document.getElementById('addCiteForm');
  let formAuthor = document.getElementById('addAuthorForm');

  let xhrStateHandler = (xhr, parseCallback) => {
    function checkXHR() {
      if (xhr.status === 200 && xhr.readyState === 4 && parseCallback) {
        parseCallback(xhr.responseText);
      }
    }

    return checkXHR;
  };

  function ajax(e, path, form, callback) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open('POST', path, true);
    xhr.onreadystatechange = xhrStateHandler(xhr, callback);
    let data = new FormData(form);
    xhr.send(data);
  }

  function parseAuthor(jsonStr) {
    let json = JSON.parse(jsonStr);
    if (json.status === 'ok') {
      let s = formCite.getElementsByTagName('select')[0];
      let option = document.createElement('option');
      option.value = json.rows.insertId;
      option.innerHTML = json.req.author_name;
      option.selected = 'selected';
      s.appendChild(option);
    }
  }

  function parseCite(jsonStr) {
    let json = JSON.parse(jsonStr);
    if (json.status === 'ok') {
      let ta = formCite.getElementsByTagName('textarea')[0];
      ta.value = '';
    }
  }

  formCite.addEventListener('submit', (e) => {
    ajax(e, 'ajax/cites/addCite', formCite, parseCite);
  });

  formAuthor.addEventListener('submit', (e) => {
    ajax(e, 'ajax/cites/addAuthor', formAuthor, parseAuthor);
  });
})();