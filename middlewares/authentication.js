exports.isAuthenticated = (req, res, next) => {
    if(!req.session.isLogedIn) {
        return res.redirect('/auth/login');
    }

    next();
}

exports.chechAuthAlready = (req, res, next) => {
    if(req.session.isLogedIn) {
        console.log(res)
        return next()
    }
    next()
}

exports.noCache = (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
}