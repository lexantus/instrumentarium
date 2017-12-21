let express = require('express');
let cites = express.Router();
let upload = require('multer')();
let db = require('../UserDB');

cites.get('/', function (req, res) {
  db.query('SELECT * FROM author', function (err, results) {
    let selectAuthor = '<select name="author" id="author"><option value="-1" selected>-</option>';
    let n = results.length;
    for (let i = 0; i < n; i++) {
      selectAuthor += `<option value="${results[i].id}">${results[i].name}</option>`;
    }
    selectAuthor += '</select>';

    let json = {};
    json.status = 'ok';
    json.name = 'cites';
    json.html = `
<div id="cites" class="screen">
    <form id="addCiteForm" action="/ajax/addCite" method="post">
        <h2>Add cite</h2>
        <label for="cite">Cite:</label>
        <textarea name="cite" id="cite" rows="6" cols="30" required></textarea>
        Author:
        ${selectAuthor}
        <button type="submit">Add</button>
    </form>
    <form id="addAuthorForm" method="post" action="/ajax/cites/addAuthor">
        <h2>Add author</h2>
        <label for="author_name">Author:</label>
        <input id="author_name" name="author_name" type="text" placeholder="author name" required>
        <button type="submit">Add</button>
    </form>
    <button id="btnGetCites" type="button">Get cites</button>
</div>`.trim();
    json.js = ['/js/cites.js'];
    json.css = ['/css/cites.css'];
    res.json(json);
  });
});

cites.post('/get', function (req, res) {
  db.query(`SELECT text, name FROM cites JOIN author ON cites.author_id = author.id`, function (err, rows) {
    if (err) throw err;
    res.json({status: 'ok', rows: rows});
  });
});

cites.post('/addCite', upload.array([]), function (req, res) {
  db.query(`INSERT INTO cites (author_id, text) VALUES (${req.body.author}, "${req.body.cite}")`, function (err, rows) {
    if (err) throw err;
    res.json({status: 'ok', message: 'Cite is successfully added', req: req.body});
  });
});

cites.post('/addAuthor', upload.array([]), function (req, res) {
  db.query(`INSERT INTO author (name) VALUES ("${req.body.author_name}")`, function (err, rows) {
    if (err) throw err;
    res.json({status: 'ok', message: 'Author is successfully added', req: req.body, rows: rows});
  });
});

module.exports = cites;