const Tokens = require('csrf');
const tokens = new Tokens();

const verifyCsrfToken = (req, res, next) => {
    const secret = req.session.csrfToken;
    const token = req.body._csrf;

    console.log(secret, token);

    if(!secret || !token || !tokens.verify(secret, token)) {
        return next('CSRF token invalide ou manquant.');
    }

    next();
}

module.exports = verifyCsrfToken;