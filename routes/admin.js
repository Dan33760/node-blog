var express = require('express');
var router = express.Router();
const { body } = require('express-validator');
 
const categoryController = require('../controllers/categoryController');

/* GET users listing. */
router.get('/dashboard', function(req, res, next) {
  res.render('index');
});

router.get('/categories', categoryController.getCategory);

router.get('/categories/add', categoryController.getAddCategory);

router.post('/categories/add', [
	body('title')
		.trim()
		.notEmpty()
		.isLength({min: 3, max: 20}).withMessage('Le nombre de caracteres doit etre entre 3 et 20'),
	body('slug').isString().trim().notEmpty(),
],categoryController.postAddCategory);

router.get('/categories/edit/:categoryId', categoryController.getEditCategory);

router.post('/categories/edit', [
	body('title')
		.trim()
		.notEmpty()
		.isLength({min: 3, max: 20}).withMessage('Le nombre de caracteres doit etre entre 3 et 20'),
	body('slug').isString().trim().notEmpty(),
],categoryController.postAddCategory);


module.exports = router;
