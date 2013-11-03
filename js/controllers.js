'use strict';

/* Controllers */

angular.module('srun3000.controllers', [])
  .controller('MainCtrl', ['$scope','$routeParams','$http',function($scope,$routeParams,$http) {
        chrome.storage.sync.get(function(value) {
            // The $apply is only necessary to execute the function inside Angular scope
            $scope.$apply(function() {
                $scope.load(value);
            });
        });
        // If there is saved data in storage, use it. Otherwise, bootstrap with sample todos
        $scope.load = function(value) {
            if (value && value.accounts) {
                $scope.accounts = value.accounts;
                $scope.current = angular.copy($scope.accounts.ids[$scope.accounts.current]);
                $scope.uid = value.uid;
            } else {
                $scope.accounts = {
                    current:0,
                    ids:[]
                };
            }
        };
        $scope.saveAccount = function() {
            var has = false;//是否已经在列表中
            $scope.accounts.ids.forEach(function(e,i){
                if($scope.current.username == e.username){
                    has = true;
                    $scope.accounts.current = i;
                }
            });
            if(!has){
                $scope.accounts.ids.push(angular.copy($scope.current));
                $scope.accounts.current = $scope.accounts.ids.length -1;
            }
            chrome.storage.sync.set({'accounts': $scope.accounts});
        };

        $scope.message = "上网不涉密,涉密不上网!";
        $scope.openDiv = false;
        $scope.save = true;


        $scope.login = function(){
            var curUser = $scope.accounts.ids[$scope.accounts.current];
            var pass1=hex_md5(curUser.password);
            var pass2=pass1.substr(8,16);
            var data = "username="+curUser.username+"&password="+pass2+"&type=1&n=100";

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

        $scope.open = function(){
            $scope.openDiv = !$scope.openDiv;
        }
        
        $scope.logout = function(){
            var curUser = $scope.accounts.ids[$scope.accounts.current];
            var data="username="+curUser.username+"&password="+curUser.password+"&type=1&n=1";

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
        $scope.delete = function(){
            var ids = $scope.accounts.ids.splice($scope.accounts.current,1);
            if($scope.accounts.current == $scope.accounts.ids.length){
                $scope.accounts.current = 0;
            }
            chrome.storage.sync.set({'accounts': $scope.accounts});
            $scope.openDiv = false;
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


  }])
  .controller('AddCtrl', ['$scope','$routeParams','$location',function($scope,$routeParams,$location) {
        $scope.newAccount={username:"",password:""};
        chrome.storage.sync.get('accounts',function(value) {
            // The $apply is only necessary to execute the function inside Angular scope
            $scope.$apply(function() {
                $scope.load(value);
            });
        });
        // If there is saved data in storage, use it. Otherwise, bootstrap with sample todos
        $scope.load = function(value) {
            if (value && value.accounts) {
                $scope.accounts = value.accounts;
            }else{
                $scope.accounts = {
                    current:1,
                    ids:[{username:"111118",password:"880824"},{username:"hiyuki",password:"3113979"}]
                };
            } 
        };
        $scope.add = function() {
            if($scope.newAccount.username == "" || $scope.newAccount.password == ""){
                return;
            }
            var has = false;//是否已经在列表中
            $scope.accounts.ids.forEach(function(e,i){
                if($scope.newAccount.username == e.username){
                    has = true;
                    $scope.accounts.current = i;
                }
            });
            if(!has){
                console.log($scope.newAccount.username);
                $scope.accounts.ids.push(angular.copy($scope.newAccount));
                $scope.accounts.current = $scope.accounts.ids.length -1;
            }
            chrome.storage.sync.set({'accounts': $scope.accounts});
            $location.path("#/main");
        };


  }]);

