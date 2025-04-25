var express = require('express');
var router = express.Router();
const { body } = require('express-validator');

const articleController = require('../../controllers/articleController');

const { noCache } = require('../../middlewares/authentication');

const verifyCsrfToken = require('../../middlewares/verify-csrftoken');


router.get('/', articleController.getArticles);

router.get('/add', articleController.getAddArticle);

router.post('/add', verifyCsrfToken,
    (req, res, next) => {
        if(req.body.categories && typeof req.body.categories == 'string') {
            req.body.categories = [req.body.categories];
        }
        console.log(req.body.categories);
        next()
    } ,[
    body('title')
        .trim()
        .notEmpty()
        .isLength({ min: 3, max: 20 }).withMessage('Le nombre de caracteres doit etre entre 3 et 20'),
    body('slug').isString().trim().notEmpty(),
    body('categories'),
    body('content').isString().trim().notEmpty(),
], articleController.postAddarticle);


module.exports = router;
