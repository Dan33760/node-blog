const multer = require('multer');
const { Category } = require('../models');

function multerErrorHandler(err, req, res, next) {
    if(err instanceof multer.MulterError || err instanceof Error) {
        
        const errorMessage = err.message || 'Erreur lors de l\'upload du fichier';

        Category.findAll()
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
                    errorMessage: errorMessage,
                    errorsMessage: []
                })
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });

        return;
    }

    next();
}

module.exports = multerErrorHandler;