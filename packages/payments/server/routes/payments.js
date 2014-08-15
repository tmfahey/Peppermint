'use strict';

var payments = require('../controllers/payments');

// Article authorization helpers

var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.member.user.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

module.exports = function(Payments, app, auth) {

  app.route('/payments')
    .get(auth.requiresLogin, payments.all, hasAuthorization)
    .post(auth.requiresLogin, payments.create);
  
  app.route('/payments/:payId')
    .get(auth.requiresLogin, payments.getPayment, hasAuthorization);

  app.route('/paymentdb')
    .get(auth.requiresLogin, payments.grabAll, hasAuthorization)
    .post(auth.requiresLogin, payments.save, hasAuthorization);
  
  app.route('/paymentdb/:payId')
    .delete(auth.requiresLogin, payments.destroy, hasAuthorization)
    .put(auth.requiresLogin, hasAuthorization, payments.update);


  app.route('/paymentHook')
    .get(payments.hookValidate)
    .post(payments.hook);



// Finish with setting up the paymentId param
  app.param('payId', payments.payment);
};
