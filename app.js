const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authsRouter = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const errorController = require('./controllers/errorController');

const { isAuthenticated, isAlreadyAuthenticated, noCache, chechAuthAlready } = require('./middlewares/authentication')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuration de la session
app.use(session({
    secret: 'danielsivyolokasereka',
    resave: false,
    saveUninitialized: false
}));

// configuration connect-flash
app.use(flash());

// Middleware pour mettre le message flash dans les variables de la vue
app.use((req, res, next) => {
    res.locals.message = req.flash('message');
    next();
});

// Configuration des routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authsRouter);
app.use('/admin', isAuthenticated, adminRoutes);

// app.use('/500', errorController.get500);

// error handler
app.use(function (err, req, res, next) {
    console.log(err)
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('500', {
        pageTitle: '500'
    });
});

// Page not found
app.use(errorController.getNotFound);

module.exports = app;
