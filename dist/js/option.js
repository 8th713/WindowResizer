angular.module('App', ['App.common', 'App.services'])
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/index.html',
      controller: 'PresetCtrl'
    })
    .when('/advance', {
      templateUrl: 'templates/advance.html',
      controller: 'AdvanceCtrl'
    })
    .when('/about', {
      templateUrl: 'templates/about.html'
    })
    .otherwise({
      redirectTo: '/'
    });
}])
.controller('NavCtrl', ['$scope', '$location',
function (scope, $location) {
  scope.$watch(function () {
    return $location.path();
  }, function (path) {
    scope.path = path;
  });
}])
.controller('SortCtrl', ['$scope', function (scope) {
  scope.sort = function (predicate) {
    scope.$emit('changeSort', predicate);
  };
}])
.controller('PresetCtrl', ['$scope', 'getSize', 'storage', 'objToArr',
function (scope, getSize, storage, objToArr) {
  scope.predicate = null; // filtering predicate
  scope.$on('changeSort', function (evt, predicate) {
    scope.predicate = predicate;
  });

  storage.get().then(function (presets) {
    scope.presets = presets;
    scope.presetsOfArray = objToArr(presets);
  });

  scope.reset = function () {
    getSize().then(function (size) {
      scope.inputs = size;
    });
  };

  scope.reset(); // Initialize inputs model

  scope.editing = null; // Id of the current editing preset

  scope.edit = function (id) {
    scope.editing = id;
    scope.inputs = angular.copy(scope.presets[id]);
  };

  scope.remove = function (id) {
    delete scope.presets[id];
    scope.presetsOfArray = objToArr(scope.presets);
    storage.remove(id);
  };

  scope.cancel = function () {
    scope.editing = null;
    scope.reset();
  };

  scope.update = function () {
    var data = {};
    var id = scope.editing || Date.now();

    data[id] = angular.copy(scope.inputs);
    storage.set(data);
    scope.presets[id] = data[id];
    scope.presetsOfArray = objToArr(scope.presets);
    scope.reset();
  };
}])
.controller('AdvanceCtrl', ['$scope', 'exports', 'storage', 'readFiles', 'Preset',
function (scope, exports, storage, readFiles, Preset) {
  scope.predicate = null; // filtering predicate
  scope.$on('changeSort', function (evt, predicate) {
    scope.predicate = predicate;
  });

  scope.exports = exports;

  var savedPresets;
  storage.get().then(function (presets) {
    savedPresets = presets;
  });

  scope.imports = [];
  scope.addSelected = function () {
    var savingData = {};
    var added = false;

    scope.imports = scope.imports.filter(function (data) {
      if (data.selected) {
        savingData[data.id] = data.preset;
        added = true;
        return false;
      }
      return true;
    });

    if (added) {
      storage.set(savingData);
      angular.extend(savedPresets, savingData);
    }
  };

  function find(arr, id) {
    var preset;
    var index = arr.length;

    while (index--) {
      preset = arr[index];
      if (preset.id === id) {
        return true;
      }
    }
    return false;
  }

  function add(id, preset, name) {
    scope.imports.push({
      id: id,
      file: name,
      selected: true,
      preset: preset
    });
  }

  scope.upload = function (files) {
    readFiles(files).then(function (files) {
      files.forEach(function (file) {
        var data = file.data;

        if (angular.isObject(data)) {
          if (Preset.isPreset(data)) {
            add(Date.now(), Preset.convert(data), file.name);
            return;
          }

          for (var id in data) {
            var preset = data[id];
            if (Preset.isPreset(preset) && !savedPresets[id] && !find(scope.imports, id)) {
              add(id, Preset.convert(preset), file.name);
            }
          }
        }
      });
    });
  };
}])
.directive('wrChange', ['$parse', function (parse) {
  return function (scope, $el, attrs) {
    var fn = parse(attrs.wrChange);

    $el.bind('change', function () {
      var files = this.files;
      scope.$apply(function () {
        fn(scope, {$files: files});
      });
    });
  };
}]);
