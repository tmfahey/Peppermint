'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Member = mongoose.model('Member'),
  _ = require('lodash');


/**
 * Find article by id
 */
exports.member = function(req, res, next, id) {
  Member.load(id, function(err, member) {
    if (err) return next(err);
    if (!member) return next(new Error('Failed to load member ' + id));
    req.member = member;
    next();
  });
};

/**
 * Create an article
 */
exports.create = function(req, res) {
  var member = new Member(req.body);
  member.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot save the member'
      });
    }
    res.json(member);

  });
};

/**
 * Update an article
 */
exports.update = function(req, res) {
  var member = req.member;

  member = _.extend(member, req.body);

  member.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the member'
      });
    }
    res.json(member);

  });
};

/**
 * Delete an article
 */
exports.destroy = function(req, res) {
  var member = req.member;

  member.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot delete the member'
      });
    }
    res.json(member);

  });
};

/**
 * Show an article
 */
exports.show = function(req, res) {
  res.json(req.member);
};

/**
 * List of Members
 */
exports.all = function(req, res) {
  Member.find().sort('-created').exec(function(err, members) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the members'
      });
    }
    res.json(members);
  });
};
