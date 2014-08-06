'use strict';

angular.module('mean.payments').config(['$stateProvider', '$httpProvider',
    function($stateProvider, $httpProvider) {
        $stateProvider.state('payments', {
            url: '/payments/',
            templateUrl: 'payments/views/index.html'
        });
        $httpProvider.defaults.useXDomain = true;
    	delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }

]);
