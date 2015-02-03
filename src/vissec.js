angular.module('vissec', ['ui.router']);

angular.module('vissec')
  .config(($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/');
  });
