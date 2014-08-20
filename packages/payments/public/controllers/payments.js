'use strict';

angular.module('mean.payments').controller('PaymentsController', ['$scope', '$http', '$q', '$location', '$stateParams', 'Global', 'Payments',
    function($scope, $http, $q, $location, $stateParams, Global, Payments) {
        $scope.global = Global;
        $scope.package = {
            name: 'payments'
        };
        $scope.error = [];
        var tickedMembers = [];

        function sucPush(data){
            var target = data.data.data.payment.target;
            //console.log(data);
            //console.log(target);
            var member;
            for(var k = 0; k < tickedMembers.length; k++){
                if(target.type === 'email'){
                    if(angular.lowercase(tickedMembers[k].email) === angular.lowercase(target.email)){
                        member = tickedMembers[k];
                    }
                }else
                if(target.type === 'phone'){
                    if(('1'+tickedMembers[k].phone) === target.phone && target.phone !== null){
                        member = tickedMembers[k];
                    }
                }
                else if (target.type === 'user'){
                    if(angular.lowercase(tickedMembers[k].first_name) === angular.lowercase(target.user.first_name) &&
                     angular.lowercase(tickedMembers[k].last_name) === angular.lowercase(target.user.last_name)){
                        member = tickedMembers[k];
                    }
                }
                
            }
            if(target.type==='user' && !angular.isDefined(member)){
                alert('If any members have a Venmo, their first and last name must be the same as Venmo.');
            }else{
                $scope.success.push('Payment Request to ' + member.first_name + ' ' + member.last_name + ' Successful.\n\r');
                var pay = new Payments({
                  member: member.id,
                  payment: data.data.data.payment                  
                });
                pay.$save(function(response) {
                  //repopulate members with a find
                });
            }

        }
        
        function errPush(r){
            //console.log(r);
            if(angular.isDefined(r.config.params.phone)){
                $scope.error.push('Error billing member with number ' + r.config.params.phone);
            }else
            if(angular.isDefined(r.config.params.email)){
                $scope.error.push('Error billing member with email ' + r.config.params.email);
            }
            
        }
        
        /*This function currently should be rewritten to take advantage of promises
         current implementation is very sloppy.
          Will work for now, but known bugs when billing multiple members
          where some members have incorrect phone number / email*/          
        $scope.requestPayment = function(members){
            //populating tickedMembers
            $scope.success = [];
            $scope.error = [];
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
            }
            else{
                isValid = false;
                $scope.error = [];
                $scope.error.push('You must select at least 1 member.');
            }

            //we have valid ticked members, lets start charging them
            if(isValid){
                $scope.requesting = true;
                var paymentAmount = -this.payment.amount;
                var paymentNote = this.payment.note;
                $scope.success = [];
                //get user data and populate their access_token for payments
                $http({
                    method: 'GET',
                    url: '/users/me',
                }).success(function(data, status, headers, config) {
                    //grabbed user data successfully, storing
                    var userData = data;
                    var charges = [];
                    //iterating through ticked members and charging
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
                            $scope.error.push(tickedMembers[j].first_name + tickedMembers[j].first_name + ' has an invalid phone/email');
                            //invalid member
                        }else{
                            charges.push(
                                $http({
                                    url: '/payments',
                                    method: 'POST',
                                    params: postData,
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                }).then(sucPush).catch(errPush)
                            );
                            console.log(postData);
                            /*$http({
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
                                        if(angular.lowercase(tickedMembers[k].first_name) === angular.lowercase(data.data.payment.target.user.first_name) &&
                                         angular.lowercase(tickedMembers[k].last_name) === angular.lowercase(data.data.payment.target.user.last_name)){
                                            member = tickedMembers[k];
                                        }
                                    }
                                    
                                }
                                if(data.data.payment.target.type==='user' && !angular.isDefined(member)){
                                    alert('If any members have a Venmo, their first and last names must be correct.');
                                }else{
                                    $scope.success.push('Payment Request to ' + member.first_name + ' ' + member.last_name + ' Successful.\n\r');
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
                                $scope.error.push(data.error.message);
                            });*/

                        }
                    }
                    $q.all(charges).then(function(arrayOfResults) {
                        console.log('in q');
                        $scope.findPayments();
                        $scope.requesting = false;
                        for(var i = 0; i < members.length; i++){
                            if(members[i].ticked === true){
                                members[i].ticked = false;
                            }
                        }
                        $scope.$$childHead.paymentForm.$setPristine();
                        $scope.$$childHead.payment.amount = '';
                        $scope.$$childHead.payment.note = '';
                    });
                });
                
            }else{
                //server side invalid
                console.log('invalid selection');
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
                    $scope.settled.push($scope.payments[i]);
                    $scope.fundsCollected = parseInt($scope.fundsCollected) + parseInt($scope.payments[i].payment.amount);
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
