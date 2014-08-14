'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Member Schema
 */
var PaymentSchema = new Schema({
  member: {
    type: Schema.ObjectId,
    ref: 'Member',
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  show: {type: Boolean, default: true},
  payment:{
    id: String,
    status: String,
    note: String,
    amount: String,
    action: String,
    date_created: String,
    date_completed: String,
    audience: String,
    target:{
      type: {type: String},
      phone: String,
      email: String,
      user: String
    },
    actor:{
      username: String,
      first_name: String,
      last_name: String,
      display_name: String,
      about: String,
      profile_picture_urlid: String,
      id: String,
      date_joined: String
    },   
    fee: String,
    refund: String,
    medium: String
  }
});

PaymentSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};


mongoose.model('Payment', PaymentSchema);
