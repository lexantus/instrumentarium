(() => {
  let formCite = document.getElementById('addCiteForm');
  let formAuthor = document.getElementById('addAuthorForm');
  let btnGetCites = document.getElementById('btnGetCites');

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
    if (form) {
      let data = new FormData(form);
      xhr.send(data);
    }
    else {
      xhr.send();
    }
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

      document.getElementById('author_name').value = "";
    }
  }

  function parseAddCite(jsonStr) {
    let json = JSON.parse(jsonStr);
    if (json.status === 'ok') {
      let ta = formCite.getElementsByTagName('textarea')[0];
      ta.value = '';
      ta.focus();
    }
  }

  function parseCites(jsonStr) {
    let json = JSON.parse(jsonStr);
    if (json.status === 'ok') {
      console.log(json.rows);
    }
  }

  formCite.addEventListener('submit', (e) => {
    ajax(e, 'ajax/cites/addCite', formCite, parseAddCite);
  });

  formAuthor.addEventListener('submit', (e) => {
    ajax(e, 'ajax/cites/addAuthor', formAuthor, parseAuthor);
  });

  btnGetCites.addEventListener('click', (e) => {
    ajax(e, 'ajax/cites/get', null, parseCites)
  });
})();