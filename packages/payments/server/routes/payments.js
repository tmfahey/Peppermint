'use strict';

var payments = require('../controllers/payments');

// Article authorization helpers

var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.member.user.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

module.exports = function(Members, app, auth) {

  app.route('/payments')
    .get(auth.requiresLogin, payments.all, hasAuthorization)
    .post(auth.requiresLogin, payments.create);/*
  app.route('/payments/:paymentId')
    .get(payments.show)
    .put(auth.requiresLogin, hasAuthorization, payments.update)
    .delete(auth.requiresLogin, hasAuthorization, payments.destroy);

  // Finish with setting up the articleId param
  app.param('paymentId', payments.member);*/
};
