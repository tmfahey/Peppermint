'use strict';

/**
 * Module dependencies.
 */
var request = require('request'),
  mongoose = require('mongoose'),
  Payment = mongoose.model('Payment');



/**
 * Find payment by id
 */
exports.payment = function(req, res, next, id) {
  Payment.load(id, function(err, payment) {
    if (err) return next(err);
    if (!payment) return next(new Error('Failed to load payment ' + id));
    req.payment = payment;
    next();
  });
};

/**
 * Create a payment
 */
exports.create = function(req, res) {
  var input = req.query;
  
  request.post({
    uri: 'https://api.venmo.com/v1/payments',
    form: input,
    json: true
  }, function(error, response, body){
    if (!error && response.statusCode === 200) {
      res.json(response.body);
    }else{
      res.json(response.statusCode, {
        error: response.body.error
      });
    }
  });
};



/**
 * payment hook
 
exports.hook = function(req, res) {
  var id = req.data.id;
  var reqPayment = req.data;
  var paymentHold;
  Payment.load(id, function(err, payment) {

    paymentHold = payment;
  });

  paymentHold.status = reqPayment.status;
  paymentHold.date_completed = reqPayment.date_completed;

  paymentHold.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the payment'
      });
    }
    res.json(paymentHold);

  });
};*/

exports.hookValidate = function(req,res){
  res.send(req.query.venmo_challenge);
};


exports.save = function(req,res){

  var payment = new Payment(req.body);
  payment.user = req.user;
  payment.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot save the payment'
      });
    }
    res.json(payment);

  });
};

exports.grabAll = function(req, res){
  Payment.find({user: req.user._id}).sort('-created').exec(function(err, payments) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the members'
      });
    }
    res.json(payments);
  });
};

exports.getPayment = function(req, res) {
  var baseUrl = 'https://api.venmo.com/v1/payments/';
  var token = req.query.access_token;
  var id = req.params.paymentId;
  var fullUrl = baseUrl + id + '?access_token=' + token;
  request.get({
    uri: fullUrl,
    json: true
  }, function(error, response, body){
    if (!error && response.statusCode === 200) {
      res.json(body.data);
    }
  });
};

exports.destroy = function(req, res) {
  var payment = req.payment;
  payment.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot delete the payment'
      });
    }
    res.json(payment);

  });
};

/**
 * List of Members
 */
exports.all = function(req, res) {
  var baseUrl = 'https://api.venmo.com/v1/payments';
  var token = req.query.access_token;
  var fullUrl = baseUrl + '?access_token=' + token;
  request.get({
    uri: fullUrl,
    json: true
  }, function(error, response, body){
    if (!error && response.statusCode === 200) {
      res.json(body.data);
    }
  });
  
};
