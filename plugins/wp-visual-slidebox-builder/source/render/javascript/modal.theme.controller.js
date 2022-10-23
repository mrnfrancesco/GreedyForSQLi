vsbbAngularRenderApp.controller('vsbbModalRenderController', function ($scope, $sce, $http, ngDialog) {
    var vm = this;
    vm.triggerModal = function (id) {
        $http({
            method: 'GET',
            url: vsbb_ajax_obj.ajax_url,
            params: {
                action: 'vsbb_get_one',
                idx: id
            }
        }).success(function (data, status, headers, config) {
            vm.savedObject = JSON.parse(data.save_object);
            if(vm.savedObject.modalSettings.data.iframe){
                vm.savedObject.modalSettings.data.iframeURLTrusted = $sce.trustAsResourceUrl(vm.savedObject.modalSettings.data.iframeURL)
            }
            ngDialog.open(vm.savedObject.modalSettings);
        }).error(function (data, status, headers, config) {

        });
    };
});
