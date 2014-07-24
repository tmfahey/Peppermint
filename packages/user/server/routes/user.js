'use strict';

// The Package is past automatically as first parameter
module.exports = function(User, app, auth, database) {

    app.get('/user/example/anyone', function(req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/user/example/auth', auth.requiresLogin, function(req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/user/example/admin', auth.requiresAdmin, function(req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/user/example/render', function(req, res, next) {
        User.render('index', {
            package: 'user'
        }, function(err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });
};
