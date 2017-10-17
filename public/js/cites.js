(() => {
  let form = document.getElementById('addCiteForm');

  let xhrStateHandler = () => {
    function checkXHR() {
      if (xhr.status === 200 && xhr.readyState === 4) {
        alert(xhr.responseText);
      }
    }

    return checkXHR;
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'ajax/cites/addCite', true);
    xhr.onreadystatechange = xhrStateHandler();
    let data = new FormData(form);
    xhr.send(data);
  });
})();