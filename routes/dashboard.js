const { noCache } = require('../middlewares/authentication');


var express = require('express');
var router = express.Router();


router.get('/', noCache, function(req, res, next) {
    res.render('index', {
    path: '/dashboard'
  });
});

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
