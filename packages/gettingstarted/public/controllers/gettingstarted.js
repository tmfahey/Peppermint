'use strict';

angular.module('mean.gettingstarted').controller('GettingstartedController', ['$scope', 'Global', 'Gettingstarted',
    function($scope, Global, Gettingstarted) {
        $scope.global = Global;
        $scope.package = {
            name: 'gettingstarted'
        };
    }
]);
