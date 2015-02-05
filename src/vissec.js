angular.module('vissec', ['ui.router', 'ui.bootstrap']);

angular.module('vissec')
  .config(($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/');
  });
