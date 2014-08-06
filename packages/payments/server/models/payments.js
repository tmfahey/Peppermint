'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

/**
 * Member Schema
 */
var PaymentSchema = new Schema({

  member: {
    type: ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  id: {
    type: String,
    required: true
  },
  date_created: {
    type: Date,
    default: Date.now
  },
  date_completed:{
    type: Date,
    default: null
  },
  status: {
    type: String,
    required: true
  },
  show: {
    type: Boolean,
    default:true
  },
  amount:{
    type: String,
    required: true
  },
  action:{
    type: String,
    required: true
  },
  audience:{
    type: String,
    required: true
  },
  note:{
    type: String,
    required: true
  }
});

PaymentSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};


mongoose.model('Payment', PaymentSchema);
