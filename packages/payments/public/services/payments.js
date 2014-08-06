'use strict';

//Members service used for members REST endpoint
angular.module('mean.payments').factory('Payments', ['$resource',
  function($resource) {
    return $resource('paymentdb/:payId', {
      payId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
