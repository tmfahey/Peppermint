'use strict';

angular.module('mean.user').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('user example page', {
            url: '/user/example',
            templateUrl: 'user/views/index.html'
        });
    }
]);
