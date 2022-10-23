vsbbAngularApp.directive('vsbbFontPicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '='
        },
        link: function (scope, elem, attrs) {
            jQuery(elem).iconpicker();
            // Watch for changes to the model and update the slider
            jQuery(elem).on('iconpickerSelected', function(e) {
                scope.ngModel='picker-target ' +
                    e.iconpickerInstance.options.iconBaseClass + ' ' +
                    e.iconpickerInstance.options.fullClassFormatter(e.iconpickerValue);
                scope.$apply();
            });
        }
    };
});