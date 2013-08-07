'use strict';

/* Controllers */

angular.module('srun3000.controllers', []).
  controller('MainCtrl', ['$scope','$routeParams','$http',function($scope,$routeParams,$http) {
        chrome.storage.sync.get(function(value) {
            // The $apply is only necessary to execute the function inside Angular scope
            $scope.$apply(function() {
                $scope.load(value);
            });
        });
        // If there is saved data in storage, use it. Otherwise, bootstrap with sample todos
        $scope.load = function(value) {
            if (value && value.account) {
                $scope.account = value.account;
                $scope.uid = value.uid;
            } else {
                $scope.account = {
                    username:"",
                    password:"",
                    drop:true
                };
            }
        };
        $scope.saveAccount = function() {
            chrome.storage.sync.set({'account': $scope.account});
        };

        $scope.message = "上网不涉密,涉密不上网!";
        $scope.save = true;


        $scope.login = function(){

            var pass1=hex_md5($scope.account.password);
            var pass2=pass1.substr(8,16);
            var data = "username="+$scope.account.username+"&password="+pass2+"&drop="+($scope.account.drop?1:0)+"&type=1&n=100";

            $http.post("http://10.0.0.55/cgi-bin/do_login",data
            ,{
                "headers":{
                    "Content-Type":"application/x-www-form-urlencoded",
                    "X-Requested-With":""
                }
            }).success(function(data){
                    $scope.message = data;
                    if(/^[\d]+$/.test(data)){
                        chrome.storage.sync.set({'uid':data});
                    }
                    if($scope.save){
                        $scope.saveAccount();
                    }
                }).error(function(){
                    $scope.message = "timeout";
                });
        }

        $scope.logout = function(){
            var data="username="+$scope.account.username+"&password="+$scope.account.password+"&drop="+($scope.account.drop?1:0)+"&type=1&n=1";

            $http.post("http://10.0.0.55/cgi-bin/force_logout",data
                ,{
                    "headers":{
                        "Content-Type":"application/x-www-form-urlencoded",
                        "X-Requested-With":""
                    }
                }).success(function(data){
                    $scope.message = data;
                }).error(function(){
                    $scope.message = "timeout";
                });
        }

  }])
  .controller('DetailCtrl', ['$scope','$routeParams','$http',function($scope,$routeParams,$http) {
        chrome.storage.sync.get('uid',function(value) {
            // The $apply is only necessary to execute the function inside Angular scope
            $scope.$apply(function() {
                $scope.load(value);
            });
        });
        // If there is saved data in storage, use it. Otherwise, bootstrap with sample todos
        $scope.load = function(value) {
            if (value && value.uid) {
                $scope.uid = value.uid;
            }
            var url = "http://10.0.0.55/user_info.php?uid="+ $scope.uid;
            $scope.url = url;
        };


  }]);

