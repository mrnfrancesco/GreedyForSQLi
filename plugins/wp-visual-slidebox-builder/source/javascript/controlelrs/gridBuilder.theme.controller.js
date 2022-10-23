vsbbAngularApp.controller('vsbbGridBuilderThemeController', function ($scope, vsbbUtils, $http, $routeParams) {
    var vm = this;
    vm.saveObject = {
        themeId: 'grid',
        themeFriendlyName: 'Grid Builder',
        tp: false,
        friendlyName: '',
        size: {
            v: {},
            h: {}
        },
        gutters: true,
        gridIndex: []
    };
    vm.gridSizes = [
        {name: 2, value: 2},
        {name: 3, value: 3},
        {name: 4, value: 4}
    ];
    vm.saveObject.size.h = angular.copy(vm.gridSizes[1]);
    vm.saveObject.size.v = angular.copy(vm.gridSizes[1]);

    vm.getSavedBoxes = function () {
        $http({
            method: 'GET',
            url: window.ajaxurl,
            params: {
                action: 'vsbb_get_grid_ready',
                idx: $routeParams.id
            }
        }).success(function (data, status, headers, config) {
            vm.savedBoxes = data;
        }).error(function (data, status, headers, config) {

        });
    };
    vm.getSavedBoxes();

    vm.save = function ($event) {
        console.log("vm.saveObject ", vm.saveObject.gridIndex);
        $event.preventDefault();
        vsbbUtils.saveInstance(vm.saveObject,
            [
                {
                    value: 'friendlyName',
                    label: 'Friendly Name'
                }
            ]
        );
    };

    //load saved instance
    if ($routeParams.id) {
        vm.loaded = false;
        vm.id = $routeParams.id;
        vm.editingExisting = true;
        $http({
            method: 'GET',
            url: window.ajaxurl,
            params: {
                action: 'vsbb_get_one',
                idx: vm.id
            }
        }).success(function (data, status, headers, config) {
            vm.loaded = true;
            vm.saveObject = JSON.parse(data.save_object);
            console.log("vm.saveObject ", vm.saveObject.gridIndex);
        }).error(function (data, status, headers, config) {

        });
    } else {
        vm.loaded = true;
        vm.editingExisting = false;
    }

    vm.getNumber = function (num) {
        return new Array(num);
    }
});