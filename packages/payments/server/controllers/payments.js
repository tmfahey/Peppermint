'use strict';

/**
 * Module dependencies.
 */
var request = require('request'),
  mongoose = require('mongoose'),
  Payment = mongoose.model('Payment'),
    _ = require('lodash');



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
      console.log(response.body.error);
      res.json(response.statusCode, {
        error: response.body.error
      });
    }
  });
};



//payment hook
 
exports.hook = function(req, res) {
  var paymentUpdate = req.body.data;
  var paymentHold;
  
  Payment.findOne({'payment.id': paymentUpdate.id}).exec(function(err, payments) {
    if (err) {
      return res.json(500, {
        error: 'Could not find payment'
      });
    }
    if(payments===null){
      return res.json(500, {
        error: 'Could not find payment'
      });
    }
    paymentHold = payments;

    //if payment is settled, don't let a hook change status.
    if(paymentHold.payment.status==='settled'){
      paymentUpdate.status = settled;
    }
    
    paymentHold.payment = paymentUpdate;

    paymentHold.save(function(err) {
      if (err) {
        return res.json(500, {
          error: 'Cannot update the payment'
        });
      }
      res.json(paymentHold.payment);

    });
  });
};

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
  Payment.find({user: req.user._id}).sort('-created').populate('member').exec(function(err, payments) {
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

exports.update = function(req, res) {
  var payment = req.payment;
  payment = _.extend(payment, req.body);
  payment.save(function(err) {
    if (err) {
      console.log(err);
      return res.json(500, {
        error: 'Cannot update the payment'
      });
    }
    res.json(payment);

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
 * List of all payments from venmo
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
