'use strict';

angular.module('mean.members').controller('MembersController', ['$scope', '$location', '$stateParams', 'Global', 'Members',
    function($scope, $location, $stateParams, Global, Members) {
        $scope.global = Global;
        $scope.package = {
            name: 'members'
        };

        $scope.updateMember = function(member){
                        
            member.$update(function() {
              //repopulate
              $scope.find();
                member.edit = false;
                console.log(member);
            });

        };

        $scope.deleteMember = function(member){
            member.$remove(function(){
                $scope.find();
            });
        };

        $scope.addMember = function(newMember){
            console.log(newMember);
            $scope.members.push(newMember);
            $scope.newMember = '';
        };

        $scope.create = function(isValid) {
          if (isValid) {
            var member = new Members({
              first_name: this.first_name,
              last_name: this.last_name,
              email: this.email,
              phone: this.phone
            });
            member.$save(function(response) {
              //repopulate members with a find
              $scope.find();
            });
            this.first_name = '';
            this.last_name = '';
            this.email = '';
            this.phone = '';
          } else {
            $scope.submitted = true;
          }
        };

        $scope.find = function() {
          Members.query(function(members) {
            $scope.members = members;
          });
        };

        $scope.findOne = function() {
          Members.get({
            memberId: $stateParams.memberId
          }, function(member) {
            $scope.member = member;
          });
        };


    }
]);
