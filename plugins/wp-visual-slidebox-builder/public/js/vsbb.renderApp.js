var vsbbAngularRenderApp = angular.module("vsbbAngularRenderApp", ['ngDialog']);
vsbbAngularRenderApp.constant('RESOURCES', (function () {
    // Use the variable in your constants
    return {}
})());
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIHZzYmJBbmd1bGFyUmVuZGVyQXBwID0gYW5ndWxhci5tb2R1bGUoXCJ2c2JiQW5ndWxhclJlbmRlckFwcFwiLCBbJ25nRGlhbG9nJ10pO1xudnNiYkFuZ3VsYXJSZW5kZXJBcHAuY29uc3RhbnQoJ1JFU09VUkNFUycsIChmdW5jdGlvbiAoKSB7XG4gICAgLy8gVXNlIHRoZSB2YXJpYWJsZSBpbiB5b3VyIGNvbnN0YW50c1xuICAgIHJldHVybiB7fVxufSkoKSk7Il0sImZpbGUiOiJhcHAuanMifQ==

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2RhbC50aGVtZS5jb250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZzYmJBbmd1bGFyUmVuZGVyQXBwLmNvbnRyb2xsZXIoJ3ZzYmJNb2RhbFJlbmRlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkc2NlLCAkaHR0cCwgbmdEaWFsb2cpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLnRyaWdnZXJNb2RhbCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAkaHR0cCh7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiB2c2JiX2FqYXhfb2JqLmFqYXhfdXJsLFxuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgYWN0aW9uOiAndnNiYl9nZXRfb25lJyxcbiAgICAgICAgICAgICAgICBpZHg6IGlkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICB2bS5zYXZlZE9iamVjdCA9IEpTT04ucGFyc2UoZGF0YS5zYXZlX29iamVjdCk7XG4gICAgICAgICAgICBpZih2bS5zYXZlZE9iamVjdC5tb2RhbFNldHRpbmdzLmRhdGEuaWZyYW1lKXtcbiAgICAgICAgICAgICAgICB2bS5zYXZlZE9iamVjdC5tb2RhbFNldHRpbmdzLmRhdGEuaWZyYW1lVVJMVHJ1c3RlZCA9ICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKHZtLnNhdmVkT2JqZWN0Lm1vZGFsU2V0dGluZ3MuZGF0YS5pZnJhbWVVUkwpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHZtLnNhdmVkT2JqZWN0Lm1vZGFsU2V0dGluZ3MpO1xuICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcblxuICAgICAgICB9KTtcbiAgICB9O1xufSk7XG4iXSwiZmlsZSI6Im1vZGFsLnRoZW1lLmNvbnRyb2xsZXIuanMifQ==
