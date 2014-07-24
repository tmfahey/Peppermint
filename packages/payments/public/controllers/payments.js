'use strict';

angular.module('mean.payments').controller('PaymentsController', ['$scope', 'Global', 'Payments',
    function($scope, Global, Payments) {
        $scope.global = Global;
        $scope.package = {
            name: 'payments'
        };
        $scope.users=[
        {	'_id' : '53cd9acbf76ffa5f1c646c74', 
        	'name' : 'Taylor Fahey', 
        	'username' : 'taylor-fahey',
        	'email' : 'tmfahey@wisc.edu', 
        	'venmo' : { 
        	 	'date_joined' : '2014-06-04T05:23:20', 'id' : '1435218686771200177', 'trust_request' : { 'status' : null },
        	 	'friend_request' : { 'status' : null }, 'profile_picture_url' : 'https://graph.facebook.com/100000019202462/picture?type=square',
        	 	'phone' : '19522219775', 'email' : 'tmfahey@wisc.edu', 'about' : 'No Short Bio', 'friends_count' : 15, 'is_friend' : false,
        	    'display_name' : 'Taylor Fahey', 'last_name' : 'Fahey', 'first_name' : 'Taylor', 'username' : 'taylor-fahey'
        	},
        	'balance' : '61.04',
        	'access_token' : 'aV2DestL7PwN6WZHgdg6mExfuaSjmeeh',
        	'refresh_token' : 'nsnB2HHEWDLgjxbpjA3aYryY3cNJUycA',
        	'provider' : 'venmo',
        	'roles' : [ 'authenticated' ],
        	'__v' : 0,
        	'resetPasswordExpires' : '2014-07-22T17:41:42.251Z',
        	'resetPasswordToken' : '4473c7f4884ee47a92a4b456a7fc94211ea8a021'
        } 
        ];


    }
]);
