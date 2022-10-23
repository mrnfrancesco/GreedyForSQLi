vsbbAngularApp.controller('vsbbBuilderController', function (vsbbUtils, $http, $routeParams, $location, ngDialog) {
    var vm = this;
    vm.getThemePartialContainer = function (partial) {
        return vsbbUtils.getPartialsUrl() + '/themes/' + partial + '/index.html';
    };
    vm.getThemePartialItem = function (partial, partialItem) {
        return vsbbUtils.getPartialsUrl() + '/themes/' + partial + '/' + partialItem + '.html';
    };
    vm.getThemePartialEditor = function (partial) {
        return vsbbUtils.getPartialsUrl() + '/themes/' + partial + '/editor.html';
    };
    vm.getThemePreviewPartial = function (partial) {
        return vsbbUtils.getPartialsUrl() + '/themes/' + partial + '/preview.php';
    };
    vm.getPaidVersion = function () {
        return vsbbUtils.getPaidVersion();
    };
    vm.isThemeAllowed = function (themeId) {
        return vsbbUtils.isThemeAllowed(themeId);
    };
    vm.isFeatureAllowed = function (key) {
        return vsbbUtils.isFeatureAllowed(key);
    };
    vm.getThemeSelector = function () {
        return vsbbUtils.getPartialsUrl() + '/themes/selector.html';
    };
    vm.themes = vsbbUtils.getAvailableThemes();
    angular.forEach(vm.themes, function (item, index) {
        if (item.value === $routeParams.themeId) {
            vm.selectedTheme = angular.copy(vm.themes[index]);
        }
        if (item.value === -1) {
            vm.themes.splice(index, 1);
        }
    });
    vm.sliderOptions = {
        floor: 0,
        ceil: 100,
        //hidePointerLabels: true,
        hideLimitLabels: true,
        translate: function (value) {
            return value + '%';
        }
    };

    vm.colorPickerOptions = {
        pos: 'bottom right',
        format: 'hsl'
    };
    vm.setBackgroundImage = function ($event, model, property) {
        $event.preventDefault();
        // Create the media frame.
        vm.fileFrame = wp.media.frames.file_frame = wp.media({
            title: 'Select a image to upload',
            button: {
                text: 'Use this image'
            },
            multiple: false	// Set to true to allow multiple files to be selected
        });
        // When an image is selected, run a callback.
        vm.fileFrame.on('select', function () {
            // We set multiple to false so only get one image from the uploader
            var attachment = vm.fileFrame.state().get('selection').first().toJSON();
            model[property] = attachment.url;
        });
        // Finally, open the modal
        vm.fileFrame.open();
    };
    vm.removeBackgroundImage = function ($event, model, property) {
        $event.preventDefault();
        model[property] = null;
    };
    vm.themeChanged = function (selected) {
        console.log('selected ', selected)
        //go to appropriate theme URL
        $location.path('/builder/' + selected.value);
    };

    vm.cloneItemModal = function (saveObject) {
        var saveObjectCopy = angular.copy(saveObject);
        ngDialog.open({
            template: vsbbGlobalVars.partials + '/dialogs/clone.html',
            className: 'ngdialog-theme-default',
            controllerAs: 'cloneCtrl',
            controller: [function () {
                var vm1 = this;
                saveObjectCopy.friendlyName = saveObjectCopy.friendlyName + ' - Clone';
                vm1.saveObject = saveObjectCopy;
            }],
            data: {
                heading: 'Clone Item',
                body: {
                    subText: 'Your clone will be saved with the identical settings at the item you are cloning it from'
                },
                footer: {
                    mainCtaText: 'Clone',
                    subCtaText: 'Cancel',
                    mainCta: function (saveObject) {
                        vm.cloneItem(saveObject);
                    },
                    subCta: function () {
                        ngDialog.close();
                    }
                }
            }
        });

    };

    vm.cloneItem = function (saveObject) {
        vsbbUtils.saveInstance(saveObject,
            [
                {
                    value: 'friendlyName',
                    label: 'Friendly Name'
                }
            ]
        );
    }
});