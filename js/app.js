'use strict';


// Declare app level module which depends on filters, and services
angular.module('srun3000', ['srun3000.filters', 'srun3000.services', 'srun3000.directives', 'srun3000.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/main', {templateUrl: 'partials/form.html', controller: 'MainCtrl'});
    $routeProvider.when('/detail', {templateUrl: 'partials/detail.html', controller: 'DetailCtrl'});
    $routeProvider.when('/add',{templateUrl:'partials/add.html',controller:'AddCtrl'});
    $routeProvider.otherwise({redirectTo: '/main'});
  }]);
