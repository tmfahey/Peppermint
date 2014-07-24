'use strict';

angular.module('mean.user').controller('UserController', ['$scope', 'Global', 'User',
    function($scope, Global, User) {
        $scope.global = Global;
        $scope.package = {
            name: 'user'
        };
    }
]);
