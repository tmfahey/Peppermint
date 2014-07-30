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
  access_token: {
    type: String,
    required: true
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  note: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  audience: {
    type: String,
    default: 'private'
  }
});


mongoose.model('Payment', PaymentSchema);
