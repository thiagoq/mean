/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Eventos = mongoose.model('Eventos'),
    _ = require('lodash');


/**
 * Find article by id
 */
exports.article = function(req, res, next, id) {
    Eventos.load(id, function(err, article) {
        if (err) return next(err);
        if (!article) return next(new Error('Failed to load article ' + id));
        req.article = article;
        next();
    });
};


/**
 * Show cadastroEvento form
 */
exports.cadastro = function(req, res) { 
    res.render('eventos/cadastro', {
        title: 'Sign up',
        eventos: new Eventos()
    });
};

/**
 * Create a article
 */
exports.create = function(req, res) {
    var article = new Eventos(req.body);
    article.user = req.user;

    article.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                article: article
            });
        } else {
            res.jsonp(article);
        }
    });
};

/**
 * Update a article
 */
exports.update = function(req, res) {
    var article = req.article;

    article = _.extend(article, req.body);

    article.save(function(err) {
        res.jsonp(article);
    });
};

/**
 * Delete an article
 */
exports.destroy = function(req, res) {
    var article = req.article;

    article.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(article);
        }
    });
};

/**
 * Show an article
 */
exports.show = function(req, res) {
    res.jsonp(req.article);
};

/**
 * List of Eventoss
 */
exports.all = function(req, res) {
    Eventos.find().sort('-created').populate('user', 'name username').exec(function(err, articles) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(articles);
        }
    });
};