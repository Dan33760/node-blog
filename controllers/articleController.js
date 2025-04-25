const { validationResult, matchedData } = require('express-validator');
const { Category, Article, ArticleCategory } = require('../models');

exports.getArticles = (req, res, next) => {
    Article.findAll()
        .then(articles => {
            res.render('article/index', {
                path: '/articles',
                pageTitle: 'Liste de articles',
                articles: articles
            });
        })
        .catch(err => {
            console.log(err);
        });
}  

exports.getAddArticle = (req, res, next) => {
    Category.findAll()
        .then(categories => {
            res.render('article/add', {
                path: '/articles',
                categories: categories,
                editing: false,
                errorsMessage: []
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.getEditArticle = (req, res, next) => {
    const categorieId = req.params.categoryId;
    Category.findOne({ where: { id: categorieId } })
        .then(category => {
            res.render('article/add-update', {
                path: '/articles',
                editing: true,
                category: category,
                errorsMessage: []
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.postAddarticle = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        Category.findAll()
            .then(categories => {
                return res.status(422).render('article/add', {
                    path: '/articles',
                    pageTitle: "Ajouter un Article",
                    categories: categories,
                    editing: false,
                    hasError: true,
                    errorsMessage: errors.array()
                })
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
    }

    const formData = matchedData(req);
    console.log(formData);

    Article.create({
            title: formData.title,
            slug: formData.slug,
            content: formData.content
        })
        .then(article => {
            let articleCategories = [];
            for(let categorieId of formData.categories) {
                let articleCategorie  = {
                    article_id: article.id,
                    category_id: categorieId
                }
                articleCategories.push(articleCategorie);
            }
            console.log(articleCategories);

            ArticleCategory.bulkCreate(articleCategories)
                .then(result => {
                    req.flash('message', 'Article bien enregistrer');
                    res.redirect('/articles')
                })
                .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                })
        })

    // Category.create({
    //         title: data.title,
    //         slug: data.slug,
    //     })
    //     .then((result) => {
    //         req.flash('message', 'Category bien enregistrer');
    //         res.redirect('/admin/articles')
    //     })
    //     .catch(err => console.log(err));
}

exports.postEditArticle = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).render('article/add-update', {
            path: '/articles',
            pageTitle: "Ajouter une Category",
            editing: false,
            hasError: true,
            errorsMessage: errors.array()
        })
    }

    const data = matchedData(req);

    Category.findOne({ where: { id: data.categoryId } })
        .then(category => {
            console.log(category);
            category.title = data.title;
            category.slug = data.slug;
            return category.save();
        })
        .then((result) => {
            req.flash('message', 'Category Modifier');
            res.redirect('/admin/articles')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.deleteCatgory = (req, res, next) => {
    const categorieId = req.params.categoryId;
    Category.findByPk(categorieId)
        .then(category => {
            if(!category) {
                let err = new Error('Category non trouver');
                return next(err);
            }
            return category.destroy();
        })
        .then(result => {
            console.log(result);
            req.flash('message', 'Category Supprime');
            res.redirect('/admin/articles')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}
