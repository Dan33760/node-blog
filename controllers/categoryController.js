const { validationResult, matchedData } = require('express-validator');
const { Category } = require('../models');

exports.getCategory = (req, res, next) => {
    Category.findAll()
        .then(categories => {
            res.render('category/index', {
                pageTitle: 'Liste de categories',
                categories: categories
            });
        })
        .catch(err => {
            console.log(err);
        });
}  

exports.getAddCategory = (req, res, next) => {
    res.render('category/add-update', {
        editing: false,
        errorsMessage: []
    });
}

exports.getEditCategory = (req, res, next) => {
    const categorieId = req.params.categoryId;
    Category.findOne({ where: { id: categorieId } })
        .then(category => {
            res.render('category/add-update', {
                editing: true,
                category: category,
                errorsMessage: []
            });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postAddCategory = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).render('category/add-update', {
            pageTitle: "Ajouter une Category",
            editing: false,
            hasError: true,
            errorsMessage: errors.array()
        })
    }

    const data = matchedData(req);

    Category.create({
            title: data.title,
            slug: data.slug,
        })
        .then((result) => {
            req.flash('message', 'Category bien enregistrer');
            res.redirect('/admin/categories')
        })
        .catch(err => console.log(err));
}

exports.postEditCategory = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).render('category/add-update', {
            pageTitle: "Ajouter une Category",
            editing: false,
            hasError: true,
            errorsMessage: errors.array()
        })
    }

    const data = matchedData(req);

    Category.findOne({ where: { id: data.categoryId } })
        .then(category => {
            category.title = data.title;
            category.slug = data.slug;
            return category.save();
        })
        .then((result) => {
            req.flash('message', 'Category Modifier');
            res.redirect('/admin/categories')
        })
        .catch(err => console.log(err));
}
