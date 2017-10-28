(() => {
  let formCite = document.getElementById('addCiteForm');
  let formAuthor = document.getElementById('addAuthorForm');

  let xhrStateHandler = (xhr) => {
    function checkXHR() {
      if (xhr.status === 200 && xhr.readyState === 4) {
        alert(xhr.responseText);
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

  formCite.addEventListener('submit', (e) => {
    ajax(e, 'ajax/cites/addCite', formCite);
  });

  formAuthor.addEventListener('submit', (e) => {
    ajax(e, 'ajax/cites/addAuthor', formAuthor);
  });
})();