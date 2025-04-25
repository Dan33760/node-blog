var express = require('express');
var router = express.Router();
const { body } = require('express-validator');
 
const categoryController = require('../../controllers/categoryController');

const { noCache } = require('../../middlewares/authentication');

const verifyCsrfToken = require('../../middlewares/verify-csrftoken');

/* GET users listing. */


router.get('/', categoryController.getCategories);

router.get('/add', categoryController.getAddCategory);

router.post('/add', verifyCsrfToken, [
	body('title')
		.trim()
		.notEmpty()
		.isLength({min: 3, max: 20}).withMessage('Le nombre de caracteres doit etre entre 3 et 20'),
	body('slug').isString().trim().notEmpty(),
],categoryController.postAddCategory);

router.get('/edit/:categoryId', categoryController.getEditCategory);

router.post('/edit', verifyCsrfToken, [
	body('title')
		.trim()
		.notEmpty()
		.isLength({min: 3, max: 20}).withMessage('Le nombre de caracteres doit etre entre 3 et 20'),
	body('slug').isString().trim().notEmpty(),
	body('categoryId').trim().notEmpty(),
],categoryController.postEditCategory);

router.get('/delete/:categoryId', categoryController.deleteCatgory);


module.exports = router;
