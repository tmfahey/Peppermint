'use strict';

angular.module('mean.payments').controller('PaymentsController', ['$scope', '$http', '$location', '$stateParams', 'Global', 'Payments',
    function($scope, $http, $location, $stateParams, Global, Payments) {
        $scope.global = Global;
        $scope.package = {
            name: 'payments'
        };
        
        /*This function currently should be rewritten to take advantage of promises
         current implementation is very sloppy.
          Will work for now, but known bugs when billing multiple members
          where some members have incorrect phone number / email*/
          
        $scope.requestPayment = function(members){
            var tickedMembers = [];
            //populating tickedMembers
            for(var i = 0; i < members.length; i++){
                if(members[i].ticked === true){
                    var newMember = {};
                    newMember.first_name = members[i].first_name;
                    newMember.last_name = members[i].last_name;
                    newMember.id = members[i].id;
                    newMember.phone = members[i].phone;
                    newMember.email = members[i].email;
                    newMember.prefersEmail = members[i].prefersEmail;
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
                $scope.error = 'You must select at least 1 member.';
            }

            if(isValid){
                var paymentAmount = -this.payment.amount;
                var paymentNote = this.payment.note;
                $scope.success = [];
                //get user login data
                $http({
                    method: 'GET',
                    url: '/users/me',
                }).success(function(data, status, headers, config) {
                    var userData = data;
                    for(var j = 0; j < tickedMembers.length; j++){
                    var postData = {
                        access_token: userData.access_token,
                        amount : paymentAmount,
                        note : paymentNote,
                        audience: 'private'
                    };
                    if(tickedMembers[j].phone !== null && !tickedMembers[j].prefersEmail)
                        postData.phone = tickedMembers[j].phone;
                    else if(tickedMembers[j].email !== null && tickedMembers[j].prefersEmail)
                        postData.email = tickedMembers[j].email;

                    if(tickedMembers[j].email === null && tickedMembers[j].phone === null){
                        $scope.error = tickedMembers[j].first_name + tickedMembers[j].first_name + ' has an invalid phone/email';
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
                                if(data.data.payment.target.type === 'email'){
                                    if(angular.lowercase(tickedMembers[k].email) === angular.lowercase(data.data.payment.target.email)){
                                        member = tickedMembers[k];
                                    }
                                }else
                                if(data.data.payment.target.type === 'phone'){
                                    if(('1'+tickedMembers[k].phone) === data.data.payment.target.phone && data.data.payment.target.phone !== null){
                                        member = tickedMembers[k];
                                    }
                                }
                                else if (data.data.payment.target.type === 'user'){
                                    if(angular.lowercase(tickedMembers[k].first_name) === angular.lowercase(data.data.payment.target.user.first_name) ||
                                     angular.lowercase(tickedMembers[k].last_name) === angular.lowercase(data.data.payment.target.user.last_name)){
                                        member = tickedMembers[k];
                                    }
                                }
                                
                            }
                            if(data.data.payment.target.type==='user' && !angular.isDefined(member)){
                                alert('If any members have a Venmo, their first and last names must be correct.');
                            }else{
                                $scope.success.push('Payment Request to ' + member.first_name + ' ' + member.last_name + ' Successful.\n\r');
                                $scope.error = '';
                                $scope.$$childHead.paymentForm.$setPristine();
                                $scope.$$childHead.payment.amount = '';
                                $scope.$$childHead.payment.note = '';
                                var pay = new Payments({
                                  member: member.id,
                                  payment: data.data.payment                  
                                });
                                pay.$save(function(response) {
                                  //repopulate members with a find
                                  $scope.findPayments();
                                });
                            }

                        }).
                        error(function(data, status, headers, config) {
                            $scope.error = data.error.message;
                        });

                    }
                }
                });
                
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

        $scope.hidePayment = function(payment){
            payment.show = false;
            if(payment.member._id)
                payment.member = payment.member._id;
            payment.$update(function(){
                $scope.findPayments();
            });
        };

        $scope.findPayments = function() {
          Payments.query(function(payments) {
            $scope.payments = payments;
            $scope.populateDash();
          });
        };

        $scope.populateDash = function(){
            $scope.fundsCollected = 0;
            $scope.pending = [];
            $scope.settled = [];
            $scope.errors = [];
            $scope.displayedPayments = $scope.payments;
            for(var i = 0; i < $scope.payments.length; i++){
                if($scope.payments[i].payment.status === 'settled'){
                    $scope.fundsCollected += $scope.payments[i].payment.amount;
                    $scope.settled.push($scope.payments[i]);
                }else
                if($scope.payments[i].payment.status === 'pending'){
                    $scope.pending.push($scope.payments[i]);
                }else{
                    $scope.errors.push($scope.payments[i]);
                }
            }
        };

    }
]);
