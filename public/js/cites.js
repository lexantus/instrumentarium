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

  function ajax(e, path, form) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open('POST', path, true);
    xhr.onreadystatechange = xhrStateHandler(xhr);
    let data = new FormData(form);
    xhr.send(data);
  }

  function parseAuthor(jsonStr) {
    let json = JSON.parse(jsonStr);
    let s = formCite.getElementsByTagName('select');
    let option = document.createElement('option');
    option.value = json.rows.insertId;
    option.innerHTML = json.req.author_name;
    s.appendChild(option);
  }

  formCite.addEventListener('submit', (e) => {
    ajax(e, 'ajax/cites/addCite', formCite);
  });

  formAuthor.addEventListener('submit', (e) => {
    ajax(e, 'ajax/cites/addAuthor', formAuthor, parseAuthor);
  });
})();