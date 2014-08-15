'use strict';

//Global service for global variables
angular.module('mean.system').factory('Global', [

  function() {
    var _this = this;
    _this._data = {
      user: window.user,
      authenticated: false,
      isAdmin: false
    };
    if (window.user && window.user.roles) {
      _this._data.authenticated = window.user.roles.length;
      _this._data.isAdmin = window.user.roles.indexOf('admin') !== -1;
    }
    return _this._data;
  }
]);

angular.module('mean.system').directive('ngConfirmClick', [
        function(){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || 'Are you sure?';
                    var clickAction = attr.confirmedClick;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            scope.$eval(clickAction);
                        }
                    });
                }
            };
    }]);