let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
  let json = {};
  json.status = 'ok';
  json.name = 'cv';
  json.html = `
<div id="cv" class="screen">
    <p>
        Here is your CV for employer.
    </p>
</div>`.trim();
  json.js = ['/js/cv.js'];
  json.css = ['/css/cv.css'];
  res.json(json);
});

module.exports = router;