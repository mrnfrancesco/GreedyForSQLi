vsbbAngularApp.controller('vsbbNavController', function ($location) {
    var vm = this;
    vm.navClass = function (path) {
        return ($location.path().substr(0, path.length) === path) ? 'vsbb-nav-active' : '';
    }
});