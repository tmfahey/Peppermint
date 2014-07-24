'use strict';

angular.module('mean.members').controller('MembersController', ['$scope', 'Global', 'Members',
    function($scope, Global, Members) {
        $scope.global = Global;
        $scope.package = {
            name: 'members'
        };
        $scope.members = [
        {
        	'first_name' : 'Bobby',
        	'last_name' : 'Brown',
            'phone' : '6122219400',
        	'email' : 'bob.brown@gmail.com',
        	'date_joined' : '2014-07-22T17:45:34.243000',
        	'payment_ids' : ['1470381502175904366']
        }];
    }
]);
