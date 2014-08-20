'use strict';

// The Package is past automatically as first parameter
module.exports = function(Gettingstarted, app, auth, database) {

    app.get('/gettingstarted/example/anyone', function(req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/gettingstarted/example/auth', auth.requiresLogin, function(req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/gettingstarted/example/admin', auth.requiresAdmin, function(req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/gettingstarted/example/render', function(req, res, next) {
        Gettingstarted.render('index', {
            package: 'gettingstarted'
        }, function(err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });
};
