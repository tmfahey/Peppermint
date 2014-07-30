'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Member Schema
 */
var MemberSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  payment_ids: [String],
  created: {
    type: Date,
    default: Date.now
  }
});

MemberSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};

mongoose.model('Member', MemberSchema);
