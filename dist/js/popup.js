angular.module('App', ['App.common'])
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/',
      controller: 'PresetCtrl'
    })
    .when('/custom', {
      templateUrl: '/custom',
      controller: 'CustomCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}])
.run(['$rootScope', '$location', function (scope, $location) {
  scope.$watch(function () {
    return $location.path();
  }, function (path) {
    scope.path = path;
  });
}])
.factory('resize', [function () {
  return function (inputs) {
    var data = angular.copy(inputs);

    delete data.id;
    delete data.name;
    chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, data);
  };
}])
.controller('PresetCtrl', ['$scope', 'storage', 'objToArr', 'resize',
function (scope, storage, objToArr, resize) {
  storage.get().then(function (presets) {
    scope.presetsOfArray = objToArr(presets);
  });

  scope.resize = resize;
}])
.controller('CustomCtrl', ['$scope', 'getSize', 'storage', 'resize',
function (scope, getSize, storage, resize) {
  function reset() {
    getSize().then(function (size) {
      scope.inputs = size;
    });
  }

  reset();

  scope.update = function () {
    var data = {};
    var id = Date.now();

    data[id] = angular.copy(scope.inputs);
    storage.set(data);
    reset();
  };

  scope.resize = resize;
}])
.directive('tooltip', ['$filter', function ($filter) {
  var num = $filter('number');

  return function (scope, $el, attrs) {
    var preset = scope.$eval(attrs.tooltip);
    var tooltip = 'Top: '    + num(preset.top)   + '\n' +
                  'Left: '   + num(preset.left)  + '\n' +
                  'Width: '  + num(preset.width) + '\n' +
                  'Height: ' + num(preset.height);

    $el.attr('title', tooltip);
  };
}]);
