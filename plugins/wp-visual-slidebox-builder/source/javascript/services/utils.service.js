vsbbAngularApp.factory("vsbbUtils", function ($q, $http, $timeout, $location, ngDialog) {
    var utils = {
        availableThemes: [
            {
                value: 'image_caption',
                name: 'Image Caption'
            },
            {
                value: 'standard',
                name: 'Advanced'
            },
            {
                value: 'grid',
                name: 'Grid Builder'
            },
            {
                value: 'modal',
                name: 'Modal Popup'
            },
            {
                value: 'folding',
                name: 'Folding'
            }
            // ,{
            //     value: 5,
            //     name: 'Multi Content'
            // },
            // {
            //     value: 6,
            //     name: '3D Reveal'
            // },
            // {
            //     value: 7,
            //     name: '3D Hover'
            // },
            // {
            //     value: 8,
            //     name: 'Slide Over'
            // },
            // {
            //     value: 9,
            //     name: 'Circle Split'
            // }
        ],
        getPartialsUrl: function () {
            return vsbbGlobalVars.partials
        },
        getRootUrl: function () {
            return vsbbGlobalVars.root
        },
        getPublicRootUrl: function () {
            return vsbbGlobalVars.publicRoot
        },
        getGlobalVars: function () {
            return vsbbGlobalVars;
        },
        legacySupport: function () {
            return vsbbGlobalVars.legacySupport === "1";
        },
        getPaidVersion: function () {
            return vsbbGlobalVars.paidVersion;
        },
        isThemeAllowed: function (themeId) {
            return vsbbGlobalVars.allowed_f.builders.indexOf(themeId) !== -1;
        },
        isFeatureAllowed: function (key) {
            if (typeof vsbbGlobalVars.allowed_f[key] !== 'undefined') {
                return vsbbGlobalVars.allowed_f[key];
            }
            return false;
        },
        getAvailableThemes: function () {
            var self = this;
            angular.forEach(utils.availableThemes, function (item, index) {
                if (!self.isThemeAllowed(item.value)) {
                    item.name = item.name.replace(' - Paid Only', '') + " - Paid Only";
                }
            });
            return utils.availableThemes;
        },
        validateUserLicense: function (license) {
            return $http({
                method: 'POST',
                url: window.ajaxurl,
                params: {
                    action: 'vsbb_register_lic'
                },
                data: {
                    license: license
                }
            })
        },
        deleteItem: function (idx) {
            return $http({
                method: 'POST',
                url: window.ajaxurl,
                params: {
                    action: 'vsbb_delete_item'
                },
                data: {
                    idx: idx
                }
            })
        },
        getModals: function () {
            return $http({
                method: 'GET',
                url: window.ajaxurl,
                params: {
                    action: 'vsbb_get_all',
                    theme: 'modal'
                }
            }).success(function (data, status, headers, config) {
                return data;
            }).error(function (data, status, headers, config) {

            });
        },
        saveInstance: function (saveData, requiredFields, overwrite) {
            var self = this;
            var missingReqFields = [];
            if (!angular.isDefined(overwrite)) {
                overwrite = false;
            }
            angular.forEach(requiredFields, function (item, index) {
                if (typeof saveData[item.value] === 'undefined' || saveData[item.value] === '') {
                    missingReqFields.push(item.label);
                }
            });
            if (missingReqFields.length === 0) {

                if (!self.isFeatureAllowed('advanced-c2a') && (saveData.c2a.final.category !== 'button' || saveData.c2a.final.type !== 'link')) {

                    ngDialog.open({
                        template: vsbbGlobalVars.partials + '/dialogs/paid-only.html',
                        className: 'ngdialog-theme-default vsbb-warning-dialog',
                        data: {
                            heading: 'Warning',
                            body: {
                                subText: 'Using paid featured "Advanced Call to Action" not allowed in your license. Failed to save'
                            }
                        }
                    });

                } else {


                    return $http({
                        method: 'POST',
                        url: window.ajaxurl,
                        params: {
                            action: 'vsbb_save'
                        },
                        data: {
                            save_object: saveData,
                            friendly_name: saveData.friendlyName,
                            theme: saveData.themeId,
                            overwrite: overwrite
                        }
                    }).success(function (result, status, headers, config) {
                        switch (result.status) {
                            case 'overwrite':
                                ngDialog.open({
                                    template: vsbbGlobalVars.partials + '/dialogs/result.html',
                                    className: 'ngdialog-theme-default vsbb-warning-dialog',
                                    data: {
                                        heading: 'Save',
                                        body: {
                                            mainText: 'Overwrite this item?',
                                            subText: 'There is already an item name: ' + saveData.friendlyName
                                        },
                                        footer: {
                                            mainCtaText: 'Overwrite',
                                            subCtaText: 'Cancel',
                                            mainCta: function () {
                                                ngDialog.close();
                                                self.saveInstance(saveData, [
                                                        {
                                                            value: 'friendlyName',
                                                            label: 'Friendly Name'
                                                        }
                                                    ], true
                                                );
                                            },
                                            subCta: function () {
                                                ngDialog.close()
                                            }
                                        }
                                    }
                                });
                                break;
                            case 'success':
                                if (self.isThemeAllowed(saveData.themeId)) {
                                    ngDialog.open({
                                        template: vsbbGlobalVars.partials + '/dialogs/result.html',
                                        className: 'ngdialog-theme-default vsbb-success-dialog',
                                        data: {
                                            heading: 'Successful',
                                            body: {
                                                subText: saveData.friendlyName + ' was successfully save!'
                                            }
                                        }
                                    });
                                    $timeout(function () {
                                        ngDialog.close()
                                    }, 2000);
                                } else {
                                    ngDialog.open({
                                        template: vsbbGlobalVars.partials + '/dialogs/paid-only.html',
                                        className: 'ngdialog-theme-default vsbb-warning-dialog',
                                        data: {
                                            heading: 'Warning',
                                            body: {
                                                subText: 'You are allowed to save ' + saveData.themeFriendlyName + ' Builder Type under the Free Version but would not be able to use it'
                                            }
                                        }
                                    });
                                }
                                break;
                            default:
                                ngDialog.open({
                                    template: vsbbGlobalVars.partials + '/dialogs/result.html',
                                    className: 'ngdialog-theme-default vsbb-fail-dialog',
                                    data: {
                                        heading: 'Error',
                                        body: {
                                            mainText: 'There was an error saving!'
                                        }
                                    }
                                });
                        }
                        if (result.id) {
                            //go to appropriate URL with ID
                            $location.path('/builder/' + saveData.themeId + '/' + result.id);
                        }
                    }).error(function (result, status, headers, config) {
                        ngDialog.open({
                            template: vsbbGlobalVars.partials + '/dialogs/result.html',
                            className: 'ngdialog-theme-default vsbb-fail-dialog',
                            data: {
                                heading: 'Error',
                                body: {
                                    mainText: 'There was an error saving!'
                                }
                            }
                        });
                    });

                }
            } else {
                ngDialog.open({
                    template: vsbbGlobalVars.partials + '/dialogs/validation-error.html',
                    className: 'ngdialog-theme-default vsbb-fail-dialog',
                    data: {
                        heading: 'Error',
                        body: {
                            mainText: 'Missing required fields:'
                        },
                        missingReqFields: missingReqFields
                    }
                });
            }
        }
        ,
        getEntranceEffects: function () {
            return [
                {
                    // DIVIDER
                    divider: true,
                    name: 'Specials'
                },
                {
                    name: 'Hello!',
                    inEffect: 'tada',
                    outEffect: 'fadeOut'
                },
                {
                    name: 'Roller',
                    inEffect: 'rollIn',
                    outEffect: 'rollOut'
                },
                {
                    name: 'Falling',
                    inEffect: 'hinge',
                    outEffect: 'vsbb-hidden'
                },
                {
                    name: 'Bang',
                    inEffect: 'rubberBand',
                    outEffect: 'fadeOut'
                },
                {
                    name: 'Shaker',
                    inEffect: 'shake',
                    outEffect: 'fadeOut'
                },
                {
                    name: 'Focus',
                    inEffect: 'pulse',
                    outEffect: 'fadeOut'
                },
                {
                    name: 'Flash',
                    inEffect: 'flash',
                    outEffect: 'fadeOut'
                },
                {
                    name: 'Jello',
                    inEffect: 'jello',
                    outEffect: 'fadeOut'
                },
                {
                    // DIVIDER
                    divider: true,
                    name: 'Faded'
                },
                {
                    name: 'Faded',
                    inEffect: 'fadeIn',
                    outEffect: 'fadeOut'
                },
                {
                    name: 'Faded Up',
                    inEffect: 'fadeInUp',
                    outEffect: 'fadeOutDown'
                },
                {
                    name: 'Faded Down',
                    inEffect: 'fadeInDown',
                    outEffect: 'fadeOutUp'
                },
                {
                    name: 'Faded Left',
                    inEffect: 'fadeInLeft',
                    outEffect: 'fadeOutLeft'
                },
                {
                    name: 'Faded Right',
                    inEffect: 'fadeInRight',
                    outEffect: 'fadeOutRight'
                },
                {
                    // DIVIDER
                    divider: true,
                    name: 'Peeking Slide'
                },
                {
                    name: 'Slide Up Peeking',
                    inEffect: 'vsbb-slide-up-classic-50',
                    outEffect: 'vsbb-slide-down-classic-50'
                },
                {
                    name: 'Slide Down Peeking',
                    inEffect: 'vsbb-slide-up-classic-down-50',
                    outEffect: 'vsbb-slide-down-classic-down-50'
                },
                {
                    // DIVIDER
                    divider: true,
                    name: 'Hidden Slide'
                },
                {
                    name: 'Slide Up',
                    inEffect: 'slideInUp',
                    outEffect: 'slideOutDown'
                },
                {
                    name: 'Slide Down',
                    inEffect: 'slideInDown',
                    outEffect: 'slideOutUp'
                },
                {
                    name: 'Slide Left',
                    inEffect: 'slideInLeft',
                    outEffect: 'slideOutLeft'
                },
                {
                    name: 'Slide Right',
                    inEffect: 'slideInRight',
                    outEffect: 'slideOutRight'
                },
                {
                    // DIVIDER
                    divider: true,
                    name: 'Zoom'
                },
                {
                    name: 'Zoom',
                    inEffect: 'zoomIn',
                    outEffect: 'zoomOut'
                },
                {
                    name: 'Zoom Up',
                    inEffect: 'zoomInUp',
                    outEffect: 'zoomOutUp'
                },
                {
                    name: 'Zoom Down',
                    inEffect: 'zoomInDown',
                    outEffect: 'zoomOutDown'
                },
                {
                    name: 'Zoom Left',
                    inEffect: 'zoomInLeft',
                    outEffect: 'zoomOutLeft'
                },
                {
                    name: 'Zoom Right',
                    inEffect: 'zoomInRight',
                    outEffect: 'zoomOutRight'
                },
                {
                    // DIVIDER
                    divider: true,
                    name: 'Bounce'
                },
                {
                    name: 'Bounce',
                    inEffect: 'bounceIn',
                    outEffect: 'bounceOut'
                },
                {
                    name: 'Bounce Up',
                    inEffect: 'bounceInUp',
                    outEffect: 'bounceOutDown'
                },
                {
                    name: 'Bounce Down',
                    inEffect: 'bounceInDown',
                    outEffect: 'bounceOutUp'
                },
                {
                    name: 'Bounce Left',
                    inEffect: 'bounceInLeft',
                    outEffect: 'bounceOutLeft'
                },
                {
                    name: 'Bounce Right',
                    inEffect: 'bounceInRight',
                    outEffect: 'bounceOutRight'
                },
                {
                    // DIVIDER
                    divider: true,
                    name: 'Rotate'
                },
                {
                    name: 'Rotate',
                    inEffect: 'rotateIn',
                    outEffect: 'rotateOut'
                },
                {
                    name: 'Rotate Up Left',
                    inEffect: 'rotateInUpLeft',
                    outEffect: 'rotateOutDownLeft'
                },
                {
                    name: 'Rotate Up Right',
                    inEffect: 'rotateInUpRight',
                    outEffect: 'rotateOutDownRight'
                },
                {
                    name: 'Rotate Down Left',
                    inEffect: 'rotateInDownLeft',
                    outEffect: 'rotateOutUpLeft'
                },
                {
                    // DIVIDER
                    divider: true,
                    name: 'Flip'
                },
                {
                    name: 'Horizontal Flip',
                    inEffect: 'flipInX',
                    outEffect: 'flipOutX'
                },
                {
                    name: 'Vertical Flip',
                    inEffect: 'flipInY',
                    outEffect: 'flipOutY'
                }
            ];
        }
    };

    return utils;
});