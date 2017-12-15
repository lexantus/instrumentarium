let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
  let json = {};
  json.status = 'ok';
  json.name = 'cv';
  json.html = `
<div id="books" class="screen">
    <p>
        Here is BOOKS!!!
    </p>
</div>`.trim();
  res.json(json);
});

module.exports = router;