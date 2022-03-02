(function () {
    'use strict';
    angular
        .module('app', [])
        .controller('UserController', controller);

    controller.$inject = ['$scope', 'orderByFilter', '$http'];

    function controller($scope, orderBy, $http) {

        $scope.openEditor = function(id) {
            console.log(id);
            var url = 'https://esdcadapt.canadacentral.cloudapp.azure.com/#editor/' + id + '/menu';
            window.open(url, '_blank');
        }
        
        var vm = this;        

        this.sortBy = function (propertyName) {
            vm.reverse = (propertyName !== null && vm.propertyName === propertyName)
                ? !vm.reverse : false;
            vm.propertyName = propertyName;
            vm.userList = orderBy(vm.userList, vm.propertyName, vm.reverse);
        };                  
       
        this.init = function () {
        
        $('#loading').removeClass('hidden');
    
        $http({
            method: 'GET',
            url: '/users/list'
        }).then(function successCallback(response) {
                console.log(response);
                vm.userList = response.data;
                $('#loading').addClass('hidden');
            }, function errorCallback(response) {
                console.log(response);
            });
            vm.propertyName = '_id';
            vm.reverse = true;
            vm.userList = orderBy(vm.userList, vm.propertyName, vm.reverse);
        };

        this.init();
    }

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
    });

})();