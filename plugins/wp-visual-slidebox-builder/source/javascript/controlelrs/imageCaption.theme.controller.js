vsbbAngularApp.controller('vsbbImageCaptionThemeController', function ($scope, $window, vsbbUtils, $sce, $http, ngDialog, $routeParams) {
    var vm = this;

    $http({
        method: 'GET',
        url: window.ajaxurl,
        params: {
            action: 'vsbb_get_all',
            theme: 'modal'
        }
    }).success(function (data, status, headers, config) {
        vm.modals = data;
    }).error(function (data, status, headers, config) {

    });
    vm.saveObject = {
        themeId: 'image_caption',
        themeFriendlyName: 'Image Caption',
        tp: false,
        friendlyName: '',
        pfs: [
            {
                f: ['positioning', 'responsive'],
                render: {
                    action: 'replace',
                    val: false
                }
            }
        ],
        heading: 'HOVER ME',
        mainContent: '<div style="text-align: center;">A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.</div>',
        positioning: {
            responsive: false,
            gutters: true,
            preserveRatio: false,
            responsiveClass: 'vsbb-grid__col--12-of-12'
        },
        final: {
            link: {
                url: 'https://webtricksandtreats.com/',
                newTab: false,
                styles: {
                    'background-color': '#000000'
                },
                title: 'Learn More'
            },
            heading: {
                styles: {
                    'background-color': '#000000',
                    'border-color': '#000000'
                }
            },
            headingColorSchemeRaw: '#000000',
            headingColorSchemeRaw2: '#',
            linkColorSchemeRaw: '#000000'
        },
        mask: {
            backgroundColorRaw: '#777777',
            styles: {
                'background-color': '#777777'
            }
        },
        initial: {
            backgroundImg: vsbbUtils.getPublicRootUrl() + '/images/vsbb_image1.jpg',
            backgroundColorRaw: '#000000',
            borderColorRaw: '#ffffff',
            borderRadiusRaw: 0,
            borderStyleRaw: {},
            styles: {
                'border-radius': 0,
                '-webkit-border-radius': 0,
                '-moz-border-radius': 0,
                'border-width': '10px',
                'background-color': '#000000',
                'border-style': 'solid',
                width: '400px',
                height: '220px'
            }
        },
        c2a: {
            final: {
                type: 'link',
                category: 'button',
                modal: {}
            }
        }
    };
    vm.sliderOptions = {
        floor: 0,
        ceil: 100,
        //hidePointerLabels: true,
        hideLimitLabels: true,
        translate: function (value) {
            return value + '%';
        },
        onChange: function (sliderId, modelValue, highValue, pointerType) {
            vm.saveObject.initial.styles['border-radius'] = modelValue + '%';
            vm.saveObject.initial.styles['-webkit-border-radius'] = modelValue + '%';
            vm.saveObject.initial.styles['-moz-border-radius'] = modelValue + '%';
        }
    };
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
    vm.saveObject.initial.borderStyleRaw = angular.copy(vm.borderOpts[1]);
    vm.hoverEffects = [
        {
            value: '1',
            name: 'Elegant',
            type: 1
        },
        // {
        //     value: '2',
        //     name: 'Side Way',
        //     type: 2
        // },
        {
            value: '3',
            name: 'Rotation',
            type: 1
        }, {
            value: '4',
            name: 'Faded',
            type: 2
        }, {
            value: '6',
            name: 'Opaque',
            type: 2
        }, {
            value: '7',
            name: 'Slide Up',
            type: 2
        }, {
            value: '9',
            name: 'Fancy',
            type: 1
        }
    ];
    vm.saveObject.hoverEffect = angular.copy(vm.hoverEffects[4]);
    vm.showHoverState = function ($event) {
        $event.preventDefault();
        jQuery('.vsbb-image-caption-view').toggleClass("vsbb-hovering")
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
            if (!vm.saveObject.c2a) {
                vm.saveObject.c2a = {
                    final: {
                        type: 'link',
                        category: 'button',
                        modal: {}
                    }
                }
            }
        }).error(function (data, status, headers, config) {

        });
    } else {
        vm.loaded = true;
        vm.editingExisting = false;
    }
    vm.triggerModal = function (id) {
        $http({
            method: 'GET',
            url: window.ajaxurl,
            params: {
                action: 'vsbb_get_one',
                idx: id
            }
        }).success(function (data, status, headers, config) {
            vm.modalItem = JSON.parse(data.save_object);
            if (vm.modalItem.modalSettings.data.iframe) {
                vm.modalItem.modalSettings.data.iframeURLTrusted = $sce.trustAsResourceUrl(vm.modalItem.modalSettings.data.iframeURL)
            }
            ngDialog.open(vm.modalItem.modalSettings);
        }).error(function (data, status, headers, config) {

        });
    };

    vm.ctaMask = function () {
        if (vm.saveObject.c2a.final.category === 'mask') {
            if (vm.saveObject.c2a.final.type === 'link') {
                if (vm.saveObject.final.link.newTab) {
                    $window.open(vm.saveObject.final.link.url, '_blank');
                } else {
                    $window.location.href = vm.saveObject.final.link.url;
                }
            } else if (vm.saveObject.c2a.final.type === 'modal') {
                vm.triggerModal(vm.saveObject.c2a.final.modal.idx);
            }
        }
    }
});