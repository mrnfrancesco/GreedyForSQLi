vsbbAngularApp.controller('vsbbStandardThemeController', function ($scope, vsbbUtils, $http, $routeParams, ngDialog) {

    var vm = this;
    vm.saveObject = {
        "themeId": "standard",
        "themeFriendlyName": "Advanced",
        "tp": true,
        "friendlyName": "",
        "positioning": {
            "responsive": false,
            "gutters": true,
            "preserveRatio": false,
            "responsiveClass": "vsbb-grid__col--12-of-12"
        },
        "initial": {
            "backgroundImg": vsbbUtils.getPublicRootUrl() + "/images/vsbb_image1.jpg",
            "mainText": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at dolor faucibus, iaculis libero sed, commodo orci. Aenean porta tristique augue, nec maximus dui commodo sed.",
            "backgroundColor": "hsl(0, 0%, 100%)",
            "borderColorRaw": "hsl(0, 0%, 0%)",
            "styles": {
                "border-color": "hsl(0, 0%, 0%)",
                "border-width": "0px",
                "border-style": "none",
                "width": "300px",
                "height": "200px",
                "background-color": "hsl(0, 0%, 100%)",
                "border-top-left-radius": "0%",
                "border-top-right-radius": "0%",
                "border-bottom-left-radius": "0%",
                "border-bottom-right-radius": "0%"
            },
            "borderStyleRaw": {"value": "none", "name": "None"},
            "border-top-left-radius": null,
            "border-bottom-left-radius": null,
            "border-top-right-radius": null,
            "border-bottom-right-radius": null
        },
        "final": {
            "backgroundImg": "",
            "mainText": "",
            "backgroundColor": "hsla(0, 0%, 0%, 0.46)",
            "opacity": 1,
            "borderColorRaw": "hsl(0, 0%, 0%)",
            "styles": {
                "border-color": "hsl(0, 0%, 0%)",
                "border-width": "0px",
                "border-style": "none",
                "background-color": "hsla(0, 0%, 0%, 0.46)",
                "border-top-left-radius": "0%",
                "border-top-right-radius": "0%",
                "border-bottom-left-radius": "0%",
                "border-bottom-right-radius": "0%"
            },
            "link": {
                "paddingRaw": 5,
                "backgroundColorRaw": "hsl(0, 0%, 0%)",
                "url": "",
                "newTab": false,
                "styles": {"background-color": "hsl(0, 0%, 0%)", "padding": "6%"},
                "title": "LEARN MORE",
                "enabled": true,
                "position": "vsbb-bottom-header-link"
            },
            "borderStyleRaw": {"value": "none", "name": "None"},
            "border-top-left-radius": null,
            "border-bottom-left-radius": null,
            "border-top-right-radius": null,
            "border-bottom-right-radius": null
        },
        "entranceEffect": {"name": "Slide Up Peeking", "inEffect": "vsbb-slide-up-classic-50", "outEffect": "vsbb-slide-down-classic-50"},
        "animateClass": "vsbb-slide-up-classic-50",
        "animateClassOut": "vsbb-slide-down-classic-50"
    };
    vm.entranceEffects = vsbbUtils.getEntranceEffects();
    vm.saveObject.entranceEffect = angular.copy(vm.entranceEffects[16]);
    vm.borderOpts = [
        {
            value: 'none',
            name: 'None'
        },
        {
            value: 'solid',
            name: 'Solid'
        }, {
            value: 'dashed',
            name: 'Dashed'
        }, {
            value: 'dotted',
            name: 'Dotted'
        }
    ];
    vm.saveObject.initial.borderStyleRaw = angular.copy(vm.borderOpts[0]);
    vm.saveObject.final.borderStyleRaw = angular.copy(vm.borderOpts[0]);

    vm.ITLsliderOptions = {
        floor: 0,
        ceil: 100,
        //hidePointerLabels: true,
        hideLimitLabels: true,
        translate: function (value) {
            return value + '%';
        },
        onChange: function (sliderId, modelValue, highValue, pointerType) {
            vm.saveObject.initial.styles['border-top-left-radius'] = modelValue + '%';
            vm.saveObject.initial.styles['-webkit-border-top-left-radius'] = modelValue + '%';
            vm.saveObject.initial.styles['-moz-border-top-left-radius'] = modelValue + '%';
        }
    };

    vm.ITRsliderOptions = {
        floor: 0,
        ceil: 100,
        //hidePointerLabels: true,
        hideLimitLabels: true,
        translate: function (value) {
            return value + '%';
        },
        onChange: function (sliderId, modelValue, highValue, pointerType) {
            vm.saveObject.initial.styles['border-top-right-radius'] = modelValue + '%';
            vm.saveObject.initial.styles['-webkit-border-top-right-radius'] = modelValue + '%';
            vm.saveObject.initial.styles['-moz-border-top-right-radius'] = modelValue + '%';
        }
    };

    vm.IBLsliderOptions = {
        floor: 0,
        ceil: 100,
        //hidePointerLabels: true,
        hideLimitLabels: true,
        translate: function (value) {
            return value + '%';
        },
        onChange: function (sliderId, modelValue, highValue, pointerType) {
            vm.saveObject.initial.styles['border-bottom-left-radius'] = modelValue + '%';
            vm.saveObject.initial.styles['-webkit-border-bottom-left-radius'] = modelValue + '%';
            vm.saveObject.initial.styles['-moz-border-bottom-left-radius'] = modelValue + '%';
        }
    };
    vm.IBRsliderOptions = {
        floor: 0,
        ceil: 100,
        //hidePointerLabels: true,
        hideLimitLabels: true,
        translate: function (value) {
            return value + '%';
        },
        onChange: function (sliderId, modelValue, highValue, pointerType) {
            vm.saveObject.initial.styles['border-bottom-right-radius'] = modelValue + '%';
            vm.saveObject.initial.styles['-webkit-border-bottom-right-radius'] = modelValue + '%';
            vm.saveObject.initial.styles['-moz-border-bottom-right-radius'] = modelValue + '%';
        }
    };
    vm.FTLsliderOptions = {
        floor: 0,
        ceil: 100,
        //hidePointerLabels: true,
        hideLimitLabels: true,
        translate: function (value) {
            return value + '%';
        },
        onChange: function (sliderId, modelValue, highValue, pointerType) {
            vm.saveObject.final.styles['border-top-left-radius'] = modelValue + '%';
            vm.saveObject.final.styles['-webkit-border-top-left-radius'] = modelValue + '%';
            vm.saveObject.final.styles['-moz-border-top-left-radius'] = modelValue + '%';
        }
    };

    vm.FTRsliderOptions = {
        floor: 0,
        ceil: 100,
        //hidePointerLabels: true,
        hideLimitLabels: true,
        translate: function (value) {
            return value + '%';
        },
        onChange: function (sliderId, modelValue, highValue, pointerType) {
            vm.saveObject.final.styles['border-top-right-radius'] = modelValue + '%';
            vm.saveObject.final.styles['-webkit-border-top-right-radius'] = modelValue + '%';
            vm.saveObject.final.styles['-moz-border-top-right-radius'] = modelValue + '%';
        }
    };

    vm.FBLsliderOptions = {
        floor: 0,
        ceil: 100,
        //hidePointerLabels: true,
        hideLimitLabels: true,
        translate: function (value) {
            return value + '%';
        },
        onChange: function (sliderId, modelValue, highValue, pointerType) {
            vm.saveObject.final.styles['border-bottom-left-radius'] = modelValue + '%';
            vm.saveObject.final.styles['-webkit-border-bottom-left-radius'] = modelValue + '%';
            vm.saveObject.final.styles['-moz-border-bottom-left-radius'] = modelValue + '%';
        }
    };
    vm.FBRsliderOptions = {
        floor: 0,
        ceil: 100,
        //hidePointerLabels: true,
        hideLimitLabels: true,
        translate: function (value) {
            return value + '%';
        },
        onChange: function (sliderId, modelValue, highValue, pointerType) {
            vm.saveObject.final.styles['border-bottom-right-radius'] = modelValue + '%';
            vm.saveObject.final.styles['-webkit-border-bottom-right-radius'] = modelValue + '%';
            vm.saveObject.final.styles['-moz-border-bottom-right-radius'] = modelValue + '%';
        }
    };
    vm.FPsliderOptions = {
        floor: 0,
        ceil: 100,
        //hidePointerLabels: true,
        hideLimitLabels: true,
        translate: function (value) {
            return value + '%';
        },
        onChange: function (sliderId, modelValue, highValue, pointerType) {
            vm.saveObject.final.link.styles.padding = modelValue + '%';
        }
    };

    vm.styleChanged = function (state, type, value) {
        if (typeof value !== 'undefined') {
            vm.saveObject[state].styles[type] = value;
        }
    };

    vm.colorApi = {
        onChange: function (api, color, $event) {
            var schema = vm.saveObject;  // a moving reference to internal objects within obj
            var string = api.getScope().control[0].$name;
            var pList = string.split('.');
            var len = pList.length;
            for (var i = 0; i < len - 1; i++) {
                var elem = pList[i];
                if (!schema[elem]) schema[elem] = {}
                schema = schema[elem];
            }
            schema[pList[len - 1]] = color;
        }
    };
    vm.borderStyleChanged = function (selected) {
        vm.saveObject.initial.styles['border-style'] = selected.value;
    };
    vm.borderStyleFinalChanged = function (selected) {
        vm.saveObject.final.styles['border-style'] = selected.value;
    };

    vm.entranceEffectChanged = function (selected) {
        vm.saveObject.animateClass = selected.inEffect;
        vm.saveObject.animateClassOut = selected.outEffect;
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

    vm.colorPickerOptions = {
        pos: 'bottom right',
        format: 'hsl'
    };

    vm.init = function () {
        jQuery(".vsbb-standard-initial").on('mouseenter', function () {
            jQuery(this).find('.vsbb-standard-final').removeClass().addClass('vsbb-hovering vsbb-standard-final animated ' + vm.saveObject.entranceEffect.inEffect);
        });
        jQuery(".vsbb-standard-initial").on('mouseleave', function () {
            jQuery(this).find('.vsbb-standard-final').removeClass().addClass('vsbb-standard-final animated ' + vm.saveObject.entranceEffect.outEffect);
        });
    };
    setTimeout(function () {
        vm.init();
    }, 1000);

    vm.showHoverState = function ($event) {
        $event.preventDefault();
        if (jQuery('.vsbb-standard-final').hasClass('vsbb-hovering')) {
            jQuery(this).find('.vsbb-standard-final').removeClass().addClass('vsbb-standard-final animated ' + vm.saveObject.entranceEffect.outEffect);
        } else {
            jQuery('.vsbb-standard-final').removeClass().addClass('vsbb-hovering vsbb-standard-final animated ' + vm.saveObject.entranceEffect.inEffect);
        }
    };

    //load saved instance
    if ($routeParams.id) {
        vm.loaded = false;
        vm.id = $routeParams.id;
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
            if (!angular.isDefined(vm.saveObject.animateClass)) {
                vm.saveObject.animateClass = 'bounceIn';
                vm.saveObject.animateClassOut = 'bounceOut';
            }
        }).error(function (data, status, headers, config) {

        });
    } else {
        vm.loaded = true;
        vm.editingExisting = false;
    }
});