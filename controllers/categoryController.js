const { validationResult, matchedData } = require('express-validator');
const { Category, User } = require('../models');

exports.getCategory = (req, res, next) => {
    res.render('category/index');
} 

exports.getAddCategory = (req, res, next) => {
    res.render('category/add-update', {
        editing: false,
        errorsMessage: []
    });
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

    User.

    console.log(User);


    // res.render('category/add-update', {
    //     editing: false
    // });
}

exports.getUpdateCategory = (req, res, next) => {
    res.render('category/add-update', {
        category: {},
        editing: false
    });
} 