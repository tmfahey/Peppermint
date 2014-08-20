'use strict';

angular.module('mean.gettingstarted').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('gettingstarted', {
            url: '/gettingstarted/',
            templateUrl: 'gettingstarted/views/index.html'
        });
    }
]);
