'use strict';

angular.module('mean.members').controller('MembersController', ['$scope', '$location', '$stateParams', 'Global', 'Members',
    function($scope, $location, $stateParams, Global, Members) {
        $scope.global = Global;
        $scope.package = {
            name: 'members'
        };

        $scope.updateMember = function(member){
          if(member.prefersEmail){
            member.phone = null;
          }else{
            member.email = null;
          }
                        
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
            $scope.members.push(newMember);
            $scope.newMember = '';
        };

        $scope.create = function() {
            var billUsersEmail;

            if(this.billPhone === 'true')
              billUsersEmail= false;
            else
              billUsersEmail= true;



            var member = new Members({
              first_name: this.first_name,
              last_name: this.last_name,
              email: this.email,
              phone: this.phone,
              prefersEmail: billUsersEmail
            });
            member.$save(function(response) {
              //repopulate members with a find
              $scope.find();
              $scope.first_name = '';
              $scope.last_name = '';
              $scope.email = '';
              $scope.phone = '';  
              $scope.error = '';
              $scope.memberForm.$setPristine();
              $scope.billEmail = undefined;
              $scope.billPhone = undefined;
              $scope.showEmail = false;
              $scope.showPhone = false;
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
              newMember.first_name = $scope.members[i].first_name;
              newMember.last_name = $scope.members[i].last_name;
              newMember.id = $scope.members[i]._id;
              newMember.phone = $scope.members[i].phone;
              newMember.email = $scope.members[i].email;
              newMember.prefersEmail = $scope.members[i].prefersEmail;
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
