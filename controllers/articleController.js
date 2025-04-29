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
                article: {
                    title: '',
                    slug: '',
                    content: ''
                },
                editing: false,
                errorMessage: null,
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
    const articleId = req.params.articleId;
    Category.findAll()
        .then(categories => {
            return Article.findByPk(articleId, { include: ['categories'] })
                .then(article => {
                    console.log(article.categories)
                    res.render('article/edit', {
                        path: '/articles',
                        editing: true,
                        categories: categories,
                        article: article,
                        errorMessage: null,
                        errorsMessage: []
                    });
                });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.postAddArticle = (req, res, next) => {
    const errors = validationResult(req);
    const formData = matchedData(req);

    if(!errors.isEmpty()) {
        return Category.findAll()
            .then(categories => {
                return res.status(422).render('article/add', {
                    path: '/articles',
                    pageTitle: "Ajouter un Article",
                    categories: categories,
                    article: {
                        title: req.body.title ?? '',
                        slug: req.body.slug ?? '',
                        content: req.body.content ?? ''
                    },
                    editing: false,
                    hasError: true,
                    errorMessage: req.multerError || null,
                    errorsMessage: errors.array()
                })
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
    }

    const image = req.file;

    if(!image) {
        return Category.findAll()
            .then(categories => {
                return res.status(422).render('article/add', {
                    path: '/articles',
                    pageTitle: "Ajouter un Article",
                    categories: categories,
                    article: {
                        title: req.body.title ?? '',
                        slug: req.body.slug ?? '',
                        content: req.body.content ?? ''
                    },
                    editing: false,
                    hasError: true,
                    errorMessage: 'Image incorect',
                    errorsMessage: errors.array()
                })
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
    }

    Article.create({
            title: formData.title,
            slug: formData.slug,
            thumbnail: image.path,
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
}

exports.postEditArticle = (req, res, next) => {
    const errors = validationResult(req);
    const articleId = req.params.articleId;

    if(!errors.isEmpty()) {
        Category.findAll()
            .then(categories => {
                return Article.findByPk(articleId, { include: ['categories'] })
                    .then(article => {
                        console.log(article.categories)
                        res.render('article/edit', {
                            path: '/articles',
                            editing: true,
                            categories: categories,
                            article: article,
                            errorMessage: null,
                            errorsMessage: []
                        });
                    });
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
    }

    const image = req.file;

    if(!image) {
        Category.findAll()
            .then(categories => {
                return Article.findByPk(articleId, { include: ['categories'] })
                    .then(article => {
                        console.log(article.categories)
                        res.render('article/edit', {
                            path: '/articles',
                            editing: true,
                            categories: categories,
                            article: article,
                            errorMessage: null,
                            errorsMessage: []
                        });
                    });
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
            thumbnail: image.path,
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
