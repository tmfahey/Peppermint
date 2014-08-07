'use strict';

angular.module('mean.members').controller('MembersController', ['$scope', '$location', '$stateParams', 'Global', 'Members',
    function($scope, $location, $stateParams, Global, Members) {
        $scope.global = Global;
        $scope.package = {
            name: 'members'
        };

        $scope.updateMember = function(member){
          if(member.phone === '')
            member.phone = null;
                        
            member.$update(function() {
              //repopulate
              $scope.find();
              member.edit = false;
              $scope.existError = '';
            }, function(error){
              $scope.existError = error.data.error;
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

        $scope.create = function() {
            var member = new Members({
              first_name: this.first_name,
              last_name: this.last_name,
              email: this.email,
              phone: this.phone
            });
            member.$save(function(response) {
              //repopulate members with a find
              $scope.find();
              $scope.first_name = '';
              $scope.last_name = '';
              $scope.email = '';
              $scope.phone = '';  
              $scope.error = '';
            }, function(error){
              $scope.error = error.data.error;
            });
        };

        $scope.find = function() {
          Members.query(function(members) {
            $scope.members = members;
            $scope.msMembers = [];
            for(var i = 0; i < $scope.members.length; i++){
              var newMember = {};
              newMember.name = $scope.members[i].first_name + ' ' + $scope.members[i].last_name;
              newMember.id = $scope.members[i]._id;
              newMember.phone = $scope.members[i].phone;
              newMember.email = $scope.members[i].email;
              newMember.ticked = false;
              $scope.msMembers.push(newMember);
            }
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
