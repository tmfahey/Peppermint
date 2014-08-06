'use strict';

angular.module('mean.payments').controller('PaymentsController', ['$scope', '$http', '$location', '$stateParams', 'Global', 'Payments',
    function($scope, $http, $location, $stateParams, Global, Payments) {
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

            /*$http({
            method: 'GET',
            url: '/payments/',
            params: {access_token: $scope.data.access_token}
            }).success(function(data, status, headers, config) {
                $scope.payments = data;
                $scope.status = status;
                console.log($scope.status);
                console.log($scope.payments);
            });*/
        });

        /*$scope.updateMember = function(member){
                        
            member.$update(function() {
              //repopulate
              $scope.find();
                member.edit = false;
                console.log(member);
            });

        };*/


        $scope.requestPayment = function(members){
            var tickedMembers = [];
            for(var i = 0; i < members.length; i++){
                if(members[i].ticked === true){
                    var newMember = {};
                    newMember.name = members[i].name;
                    newMember.id = members[i].id;
                    newMember.phone = members[i].phone;
                    newMember.email = members[i].email;
                    tickedMembers.push(newMember);
                }
            }
            var isValid;
            if(tickedMembers.length>0){
                isValid =true;
                $scope.error = '';
            }
            else{
                isValid = false;
                $scope.error = "You must select at least 1 member.";
            }

            if(isValid){
                $scope.success = [];
                for(var j = 0; j < tickedMembers.length; j++){
                    var postData = {
                        access_token: $scope.data.access_token,
                        amount : -this.payment.amount,
                        note : this.payment.note,
                        audience: 'private'
                    };
                    if(tickedMembers[j].phone !== null)
                        postData.phone = tickedMembers[j].phone;
                    else if(tickedMembers[j].email !== null)
                        postData.email = tickedMembers[j].email;

                    if(tickedMembers[j].email === null && tickedMembers[j].phone){
                        //invalid member
                    }else{
                        $http({
                            url: '/payments',
                            method: 'POST',
                            params: postData,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).
                        success(function(data, status, headers, config) {
                            var member;
                            for(var k = 0; k < tickedMembers.length; k++){
                                if((tickedMembers[k].email === data.data.payment.target.email)){
                                    member = tickedMembers[k];
                                    console.log('found: ' + member.name);
                                }else
                                if(tickedMembers[k].phone === data.data.payment.target.phone && data.data.payment.target.phone !== null){
                                    member = tickedMembers[k];
                                    console.log('found: ' + member.name);
                                }
                            }
                            $scope.success.push('Payment Request to ' + member.name + ' Successful.\n\r');
                            $scope.error = '';
                            $scope.$$childHead.payment = '';
                            var pay = new Payments({
                              member: member.id,
                              name: member.name,
                              id: data.data.payment.id,
                              status: data.data.payment.status,
                              amount: data.data.payment.amount,
                              action: data.data.payment.action,
                              note: data.data.payment.note,
                              date_created: data.data.payment.date_created,
                              date_completed: data.data.payment.date_completed,
                              audience: data.data.payment.audience                       
                            });
                            pay.$save(function(response) {
                              //repopulate members with a find
                              $scope.findPayments();
                            });
                        }).
                        error(function(data, status, headers, config) {
                            $scope.error = data.error.message;
                        });

                    }
                }
            }else{
                //server side invalid
                console.log('invalid');
            }

        };

        $scope.deletePayment = function(payment){
            payment.$remove(function(){
                $scope.findPayments();
            });
        };

        $scope.findPayments = function() {
          Payments.query(function(payments) {
            $scope.payments = payments;
          });
        };




    }
]);