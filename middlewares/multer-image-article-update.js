const multer = require('multer');
const { Category, Article } = require('../models');

function multerImageArticleUpdate(err, req, res, next) {

    if(err instanceof multer.MulterError || err instanceof Error) {
        
        const errorMessage = err.message || 'Erreur lors de l\'upload du fichier';

        return Category.findAll()
            .then(categories => {
                return Article.findByPk(req.params.articleId, { include: ['categories'] })
                    .then(article => {
                        res.render('article/edit', {
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
                            errorMessage: errorMessage,
                            errorsMessage: []
                        });
                    });
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })

        return;
    }

    next();
}

module.exports = multerImageArticleUpdate;