var express = require('express');
var router = express.Router();
const { body } = require('express-validator');

const upload = require('../../config/multer-config');

const articleController = require('../../controllers/articleController');

const { noCache } = require('../../middlewares/authentication');

const verifyCsrfToken = require('../../middlewares/verify-csrftoken');
const multerErrorHandler = require('../../middlewares/multer-error-handler');

router.get('/', articleController.getArticles);

router.get('/add', articleController.getAddArticle);

router.post('/add',
    upload.single('image'),
    multerErrorHandler,
    verifyCsrfToken,
    (req, res, next) => {
        if(req.body.categories && typeof req.body.categories == 'string') {
            req.body.categories = [req.body.categories];
        }
        next()
    },
    [
        body('title').trim().notEmpty()
            .isLength({ min: 3, max: 20 })
            .withMessage('Le nombre de caracteres doit etre entre 3 et 20'),
        body('slug').trim().notEmpty(),
        body('categories').notEmpty(),
        body('content').trim().notEmpty(),
    ],
    articleController.postAddArticle
);

router.post('/edit/:articleId', verifyCsrfToken,
    (req, res, next) => {
        if(req.body.categories && typeof req.body.categories == 'string') {
            req.body.categories = [req.body.categories];
        }
        next()
    },
    [
        body('title')
            .trim()
            .notEmpty()
            .isLength({ min: 3, max: 20 }).withMessage('Le nombre de caracteres doit etre entre 3 et 20'),
        body('slug').trim().notEmpty(),
        body('categories').notEmpty(),
        body('content').trim().notEmpty(),
        body('articleId').notEmpty(),
    ],
    articleController.postEditArticle
);

router.get('/edit/:articleId', articleController.getEditArticle);



module.exports = router;
