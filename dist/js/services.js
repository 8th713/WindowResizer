angular.module('App.services', [])
.factory('exports', ['$rootScope', '$filter', 'storage', function (scope, $filter, storage) {
  var URL = window.URL;
  var Event = window.Event;
  var dateFormat = $filter('date');

  return function () {
    storage.get().then(function (data) {
      var src = angular.toJson(data, true);
      var blob = new Blob([src], {type: 'application\/json'});
      var date = dateFormat(new Date(), 'yyyyMMddHHmmss');
      var evt = new Event('click');
      var a = document.createElement('a');

      a.href = URL.createObjectURL(blob);
      a.download = 'window_resizer_' + date + '.json';
      a.dispatchEvent(evt);
    });
  };
}])
.factory('readFiles', ['$rootScope', '$q', function (scope, $q) {
  var map = Array.prototype.map;

  function readFile(file) {
    var dfd = $q.defer();
    var fr = new FileReader();

    fr.onload = function () {
      try {
        var result = {
          name: file.name,
          data: angular.fromJson(this.result)
        };

        scope.$apply(function () {
          dfd.resolve(result);
        });
      } catch (err) {
        scope.$apply(function () {
          dfd.reject(err);
        });
      }
    };
    fr.readAsText(file);

    return dfd.promise;
  }

  return function (files) {
    var results = map.call(files, readFile);

    return $q.all(results);
  };
}])
.factory('Preset', [function () {
  var preset = {
    name: angular.isString,
    top: angular.isNumber,
    left: angular.isNumber,
    width: angular.isNumber,
    height: angular.isNumber
  };

  return {
    isPreset: function (data) {
      var check;
      var value;

      for (var key in preset) {
        check = preset[key];
        value = data[key];

        if (angular.isUndefined(data[key]) || !check(data[key])) {
          return false;
        }
      }
      return true;
    },
    convert: function (data) {
      return {
        name:   data.name,
        top:    data.top,
        left:   data.left,
        width:  data.width,
        height: data.height
      };
    }
  };
}]);
