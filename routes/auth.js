const express = require('express');
const { body, check } = require('express-validator');

const authController = require('../controllers/authController');
const { User } = require('../models');

const { chechAuthAlready } = require('../middlewares/authentication');

const verifyCsrfToken = require('../middlewares/verify-csrftoken');

const router = express.Router();

router.get('/login', chechAuthAlready, authController.getLogin);

router.post('/login', verifyCsrfToken,[
    body('email').isEmail(),
    body('password').notEmpty()
],authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup', [
    body('name').notEmpty(),
    check('email').isEmail()
        .custom((value, { req }) => {
            return User.findOne({ where: { email: value } })
                .then(user => {
                    if(user) {
                        return Promise.reject('Votre adresse email existe deja');
                    }
                })
        })
        .normalizeEmail(),
    body('password').notEmpty()
],authController.postSignup);

router.get('/logout', authController.logout);

module.exports = router;