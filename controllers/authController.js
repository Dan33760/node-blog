exports.login = (req, res, next) => {
    res.render('auth/login');
}

exports.signup = (req, res, next) => {
    res.render('auth/signup');
}