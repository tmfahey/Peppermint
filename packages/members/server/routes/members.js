'use strict';

var members = require('../controllers/members');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.member.user.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

module.exports = function(Members, app, auth) {

  app.route('/members')
    .get(members.all)
    .post(auth.requiresLogin, members.create);
  app.route('/members/:memberId')
    .get(members.show)
    .put(auth.requiresLogin, hasAuthorization, members.update)
    .delete(auth.requiresLogin, hasAuthorization, members.destroy);

  // Finish with setting up the articleId param
  app.param('memberId', members.member);
};
