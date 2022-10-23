vsbbAngularApp.controller('vsbbHistoryController', function ($scope, $http, NgTableParams, vsbbUtils, ngDialog) {
    var vm = this;

    vm.themes = vsbbUtils.getAvailableThemes();
    if (vsbbUtils.legacySupport()) {
        var found = false;
        angular.forEach(vm.themes, function (item, index) {
            if (item.value === -1) {
                found = true;
            }
        });
        if (!found) {
            vm.themes.push({
                value: -1,
                name: 'Legacy'
            });
        }
    }
    vm.selectedTheme = angular.copy(vm.themes[0]);
    vm.listTable = function () {
        vm.tableParams = new NgTableParams({
            page: 1, // show first page
            count: 10 // count per page
        }, {
            filterDelay: 0,
            getData: function (params) {
                return $http({
                    method: 'GET',
                    url: window.ajaxurl,
                    params: {
                        action: 'vsbb_get_all',
                        theme: vm.selectedTheme.value
                    }
                }).success(function (data, status, headers, config) {
                    params.total(data);
                    return data;


                }).error(function (data, status, headers, config) {

                });
            }
        });
    };
    vm.listTable();

    vm.deleteItem = function (idx) {
        vsbbUtils.deleteItem(idx).success(function () {
            vm.listTable();
        });
    };

    vm.delete = function ($event, idx) {
        $event.preventDefault();
        ngDialog.open({
            template: vsbbGlobalVars.partials + '/dialogs/result.html',
            className: 'ngdialog-theme-default vsbb-warning-dialog',
            data: {
                heading: 'Delete',
                body: {
                    mainText: 'Are you sure you want to delete this item?'
                },
                footer: {
                    mainCtaText: 'Delete',
                    subCtaText: 'Cancel',
                    mainCta: function () {
                        ngDialog.close();
                        vm.deleteItem(idx);
                    },
                    subCta: function () {
                        ngDialog.close()
                    }
                }
            }
        });
    };

    vm.themeChanged = function (selected) {
        vm.listTable(selected.value);
    };
});