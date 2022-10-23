vsbbAngularApp.controller('vsbbModalThemeController', function ($scope, $sce, $window, vsbbUtils, $http, ngDialog, $routeParams) {
    var vm = this;

    vsbbUtils.getModals().success(function (results) {
        vm.modals = results;
    });
    vm.saveObject = {
        themeId: 'modal',
        themeFriendlyName: 'Modal Popup',
        tp: true,
        friendlyName: '',
        modalSettings: {
            triggerText: 'Preview modal',
            className: 'ngdialog-theme-default',
            template: vsbbGlobalVars.partials + '/dialogs/modal-theme.html',
            data: {
                heading: 'Details',
                body: {
                    mainText: 'Lorem iusmod tempor incididunt.',
                    subText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
                },
                footer: {
                    mainCtaText: 'OK',
                    mainCtaLink: '',
                    subCtaText: 'Cancel'
                },
                loaderImage: vsbbUtils.getPublicRootUrl() + 'images/loading.gif',
                iframe: false,
                iframeURL: 'https://webtricksandtreats.com/'
            }
        }

    };
    vm.iframeSettingsChanged = function () {
        if (vm.saveObject.modalSettings.data.iframe) {
            vm.saveObject.modalSettings.className = 'ngdialog-theme-default vsbb-iframe-dialog';
        } else {
            vm.saveObject.modalSettings.className = 'ngdialog-theme-default';
        }
    };
    vm.modalStyle = {
        name: 'Plain',
        value: 'ngdialog-theme-default'
    };
    vm.modalStyleChanged = function (selected) {
        vm.saveObject.modalSettings.className = selected.value;
    };
    vm.modalStyles = [
        {
            name: 'Plain',
            value: 'ngdialog-theme-default'
        },
        {
            name: 'Success',
            value: 'ngdialog-theme-default vsbb-success-dialog'
        },
        {
            name: 'Fail',
            value: 'ngdialog-theme-default vsbb-fail-dialog'
        },
        {
            name: 'Warming',
            value: 'ngdialog-theme-default vsbb-warning-dialog'
        }
    ];
    vm.previewModal = function () {
        if (vm.saveObject.modalSettings.data.iframe) {
            vm.saveObject.modalSettings.data.iframeURLTrusted = $sce.trustAsResourceUrl(vm.saveObject.modalSettings.data.iframeURL);
        }
        $scope.dialog = ngDialog.open(vm.saveObject.modalSettings);
    };
    vm.save = function ($event) {
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
        vm.id = $routeParams.id;
        vm.loaded = false;
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

        }).error(function (data, status, headers, config) {

        });
    } else {
        vm.loaded = true;
        vm.editingExisting = false;
    }
});