vsbbAngularApp.config(function ($routeProvider) {
    $routeProvider

        .when('/builder/:themeId', {
            templateUrl: vsbbGlobalVars.partials + '/builder.html',
            controller: 'vsbbBuilderController',
            controllerAs: 'ctrl'
        }).when('/builder/:themeId/:id', {
        templateUrl: vsbbGlobalVars.partials + '/builder.html',
        controller: 'vsbbBuilderController',
        controllerAs: 'ctrl'
    }).when('/history', {
        templateUrl: vsbbGlobalVars.partials + '/history.html',
        controller: 'vsbbHistoryController',
        controllerAs: 'ctrl'
    }).when('/my', {
        templateUrl: vsbbGlobalVars.partials + '/myvsbb.html',
        controller: 'vsbbMyVsbbController',
        controllerAs: 'ctrl'
    }).otherwise({
        redirectTo: '/builder/image_caption'
    });

});
