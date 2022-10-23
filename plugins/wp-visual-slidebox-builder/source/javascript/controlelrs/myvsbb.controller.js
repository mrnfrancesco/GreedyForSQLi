vsbbAngularApp.controller('vsbbMyVsbbController', function ($scope, $http, $timeout, ngDialog, vsbbUtils) {
    var vm = this;
    vm.license = null;
    vm.isValidLicense = vsbbUtils.getPaidVersion();
    vm.newFeaturesExpand = false;
    vm.improvedFeaturesExpand = false;
    vm.legacySupportExpand = false;

    vm.validateLicense = function () {
        if (vm.license !== null && vm.license !== '') {
            vsbbUtils.validateUserLicense(vm.license).success(function (result) {
                if (result.status === 'success') {
                    ngDialog.open({
                        template: vsbbGlobalVars.partials + '/dialogs/result.html',
                        className: 'ngdialog-theme-default vsbb-success-dialog',
                        data: {
                            heading: 'Successful',
                            body: {
                                subText: 'License: ' + vm.license + ' was successfully validated!'
                            }
                        }
                    });
                    vm.isValidLicense = true;
                    $timeout(function () {
                        ngDialog.close()
                    }, 2000);
                } else {
                    ngDialog.open({
                        template: vsbbGlobalVars.partials + '/dialogs/paid-only.html',
                        className: 'ngdialog-theme-default vsbb-warning-dialog',
                        data: {
                            heading: 'Hmmmm....',
                            body: {
                                mainText: 'Please input a VALID license',
                                subText: 'Failed to validate license: ' + vm.license
                            }
                        }
                    });
                }
            });
        }
    };
    vm.getPublicRootUrl = function () {
        return vsbbUtils.getPublicRootUrl();
    };
    $http({
        method: 'GET',
        url: window.ajaxurl,
        params: {
            action: 'vsbb_get_license'
        }
    }).success(function (data, status, headers, config) {
        vm.license = data;
    }).error(function (data, status, headers, config) {

    });
});