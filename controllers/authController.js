const { validationResult, matchedData } = require('express-validator');
const bcrypt = require('bcryptjs');

const { User } = require('../models');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Signup',
        oldUser: {
            email: req.body.email
        },
        hasError: true,
        errorMessage: '',
        errorsMessage: []
    });
}

exports.postLogin = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.render('auth/login', {
            pageTitle: 'Signup',
            oldUser: {
                email: req.body.email
            },
            hasError: true,
            errorMessage: '',
            errorsMessage: errors.array()
        })
    }

    let formData = matchedData(req);

    User.findOne({ where: { email: formData.email } })
        .then(user => {
            if(!user) {
                return res.status(422).render('auth/login', {
                    pageTitle: 'Signup',
                    oldUser: {
                        email: req.body.email
                    },
                    hasError: true,
                    errorMessage: 'Adresse mail ou mot de passe incorect',
                    errorsMessage: []
                })
            }

            console.log(formData)

            bcrypt.compare(formData.password, user.password)
                .then(passwordMatch => {
                    if(passwordMatch) {
                        // return res.redirect('/admin/')
                        req.session.user = user;
                        req.session.isLogedIn = true;
                        
                        return req.session.save(err => {
                            if(err) {
                                console.log(err);
                                next(err)
                            }
                            res.redirect('/admin/')
                        })
                    }
                    return res.status(422).render('auth/login', {
                        pageTitle: 'Signup',
                        oldUser: {
                            email: req.body.email
                        },
                        hasError: true,
                        errorMessage: 'Adresse mail ou mot de passe incorect',
                        errorsMessage: []
                    }) 
                })
                .catch(err => {
                    console.log(err)
                    return res.redirect('/login')
                })
        })
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        oldUser: {
            name: '',
            email: '',
            password: ''
        },
        errorsMessage: []
    });
}

exports.postSignup = (req, res, next) => {
    const error = validationResult(req);

    if(!error.isEmpty()) {
        return res.render('auth/signup', {
            pageTitle: 'Signup',
            oldUser: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            },
            hasError: true,
            errorsMessage: error.array()
        })
    }
    let formData = matchedData(req);

    bcrypt
        .hash(formData.password, 12)
        .then(hashedPassword => {
            const user = new User({
                name: formData.name,
                email: formData.email,
                password: hashedPassword
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })

}

exports.logout = (req, res, next) => {
    req.session.user = null;
    req.session.isLogedIn = null;

    req.session.save(err => {
        if(err) next(err)
        
        req.session.regenerate(err => {
            if (err) next(err);
            res.redirect('/auth/login');
        })
    })
}
