'use strict';

angular.module('mean.payments').controller('PaymentsController', ['$scope', '$http', 'Global', 'Payments',
    function($scope, $http, $rootScope, Global, Payments) {
        $scope.global = Global;
        $scope.package = {
            name: 'payments'
        };
        //get user login data
        $http({
            method: 'GET',
            url: '/users/me',
        }).success(function(data, status, headers, config) {
            $scope.data = data;
            $scope.status = status;
            console.log($scope.status);
            console.log($scope.data);

            $http({
            method: 'GET',
            url: '/payments',
            params: {access_token: $scope.data.access_token}
            }).success(function(data, status, headers, config) {
                $scope.payments = data;
                $scope.status = status;
                console.log($scope.status);
                console.log($scope.payments);
            });
        });


        $scope.requestPayment = function(isValid){
            if(isValid){
                console.log($scope.$$childHead);
                var postData = {
                    access_token: $scope.data.access_token,
                    amount : this.payment.amount,
                    note : this.payment.note,
                    audience: 'private'
                };
                if(this.payment.member.phone !== '')
                    postData.phone = this.payment.member.phone;
                else if(this.payment.member.email !== '')
                    postData.email = this.payment.member.email;

                if(this.payment.member.email === null && this.payment.member.phone === null){
                    //invalid member
                    console.log('member has neither a valid phone nor email\n\r');
                }else{
                    $http({
                        url: '/payments',
                        method: 'POST',
                        params: postData,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).
                    success(function(data, status, headers, config) {
                        $scope.success = 'Payment Request Successful';
                        $scope.error = '';
                        $scope.$$childHead.payment = '';
                        console.log(data.data.payment);
                    }).
                    error(function(data, status, headers, config) {
                        $scope.error = data.error.message;
                    });

                }
            }else{
                //server side invalid
                console.log('invalid');
            }

        };




    }
]);
