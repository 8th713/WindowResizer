angular.module('App.common', [])
.factory('getSize', ['$rootScope', '$q', function (scope, $q) {
  return function () {
    var dfd = $q.defer();

    chrome.windows.getCurrent({}, function (win) {
      scope.$apply(function () {
        dfd.resolve({
          top: win.top,
          left: win.left,
          width: win.width,
          height: win.height
        });
      });
    });

    return dfd.promise;
  };
}])
.service('storage', ['$rootScope', '$q', function (scope, $q) {
  var storage = chrome.storage.local;

  this.get = function () {
    var dfd = $q.defer();

    storage.get(null, function (obj) {
      scope.$apply(function () {
        dfd.resolve(obj);
      });
    });

    return dfd.promise;
  };

  this.set = function (data) {
    storage.set(data);
  };

  this.remove = function (id) {
    storage.remove(id);
  };
}])
.factory('objToArr', [function () {
  return function (obj) {
    var result = [];
    angular.forEach(obj, function (val, key) {
      val = angular.copy(val);
      val.id = key;
      result.push(val);
    });
    return result;
  };
}]);
