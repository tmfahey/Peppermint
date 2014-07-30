'use strict';

/**
 * Module dependencies.
 */
var request = require('request');


/**
 * Create a payment
 */
exports.create = function(req, res) {
  var input = req.query;
  console.log(input);
  
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
 * List of Members
 */
exports.all = function(req, res) {
  var baseUrl = 'https://api.venmo.com/v1/me';
  var token = req.query.access_token;
  var fullUrl = baseUrl + '?access_token=' + token;
  request.get({
    uri: fullUrl,
    json: true
  }, function(error, response, body){
    if (!error && response.statusCode === 200) {
      res.json(body.data);
    }
  });/*
  request('https://api.venmo.com/v1/me?access_token=s2g3kQSgMxHnFQP49NAXBmZxaBXEy7wP', function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body); // Print the google web page.
      res.json(body);
    }
  });*/
};
