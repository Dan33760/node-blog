const { validationResult, matchedData } = require('express-validator');
const { Category, Article, ArticleCategory } = require('../models');
const { where } = require('sequelize');

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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
    const image = req.file;
    const formData = matchedData(req);



    if(!errors.isEmpty()) {
        return Promise.all([
                Category.findAll(),
                Article.findByPk(articleId, { include: ['categories'] })
            ])
            .then(([categories, article]) => {
                return res.render('article/edit', {
                    path: '/articles',
                    editing: true,
                    categories: categories,
                    article: {
                        id: article.id,
                        categories: article.categories,
                        title: req.body.title ?? '',
                        slug: req.body.slug ?? '',
                        content: req.body.content ?? ''
                    },
                    errorMessage: 'Corriger les erreurs',
                    errorsMessage: errors.array()
                });
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
    }

    Article.findByPk(articleId, { include: ['categories'] })
        .then(article => {
            article.title = formData.title;
            article.slug = formData.slug;
            article.content = formData.content;
            article.thumbnail = image?.path ?? article.thumbnail;
            return article.save();
        })
        .then(article => {
            return ArticleCategory.destroy({ where: { article_id: articleId } })
        })
        .then(result => {
            let articleCategories = [];
            for(let categoryId of formData.categories) {
                let newArtCategory = {
                    article_id: articleId,
                    category_id: categoryId
                }
                articleCategories.push(newArtCategory);
            }
            return ArticleCategory.bulkCreate(articleCategories);
        })
        .then(result => {
            req.flash('message', 'Article modifier');
            res.redirect('/articles')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}



exports.deleteArticle = (req, res, next) => {
    const articleId = req.params.articleId;

    Article.findByPk(articleId)
        .then(article => {
            if(!article) {
                return next(new Error('article non trouve'));
            }

            return ArticleCategory.destroy({ where: { article_id: articleId } })
                .then(() => article.destroy());
        })
        .then(() => {
            req.flash('message', 'Article supprimé avec succès');
            res.redirect('/articles')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}
