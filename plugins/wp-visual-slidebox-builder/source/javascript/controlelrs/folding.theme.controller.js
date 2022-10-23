vsbbAngularApp.controller('vsbbFoldingThemeController', function ($routeParams,$http, vsbbUtils) {
    var vm = this;
    vm.fileFrame = null;
    vm.borderOpts = [
        {
            value: 'none',
            name: 'No Border'
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
    vm.foldedBorder = angular.copy(vm.borderOpts[0]);
    vm.unfoldeBorder = angular.copy(vm.borderOpts[0]);
    vm.foldedBackgroundColor = '#ffffff';
    vm.unfoldedBackgroundColor = '#ffffff';
    vm.foldCounts = [
        {name: 2, value: 2},
        {name: 3, value: 3},
        {name: 4, value: 4}
    ];
    vm.foldDirections = [
        {name: "Right - Top", value: ['right', 'top']},
        {name: "Left - Top", value: ['left', 'top']},
        {name: "Right - Bottom", value: ['right', 'bottom']},
        {name: "Left - Bottom", value: ['left', 'bottom']}
    ];

    vm.saveObject = {
        themeId:'folding',
        themeFriendlyName:'Folding',
        tp:false,
        friendlyName: '',
        mainText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ac ante eros. Morbi congue cursus cursus. Sed fermentum dui vel turpis congue molestie a et magna. Nam sit amet commodo lorem, id maximus lectus. Aenean sollicitudin lorem ac mauris suscipit, eget lacinia quam consequat. Sed vulputate mauris tortor, aliquet viverra purus volutpat non.',
        preContent: "",
        footerText: 'footer text',
        openTrigger: 'Click Me',
        closeTrigger: 'X',
        folds: vm.foldCounts[1],
        foldDirections: vm.foldDirections[0],
        centered: false,
        overlays: true,
        speed: 500,
        depth: 1500,
        positioning: {
            gutters: true,
            responsiveClass: 'vsbb-grid__col--12-of-12'
        },
        folded: {
            backgroundImg: vsbbUtils.getPublicRootUrl() + '/images/vsbb_image2.png',
            styles: {
                width: '75px',
                height: '100px',
                'background-color': '#ffffff',
                'border-style': 'none',
                'border-width': 3
            }
        },
        unfolded: {
            backgroundImg: "",
            styles: {
                'border-style': 'none',
                'border-width': 3
            }
        },
        triggers: {
            open: {
                styles: {left: '10px', top: '10px', 'font-size': '22px', 'color': '#2a35e0'},
                styleValue: 0,
                styleClass: 'fa-align-justify',
                colorRaw: '#000000'
            },
            close: {
                styles: {left: '10px', bottom: '18px', 'font-size': '22px', 'color': '#2a35e0'},
                styleValue: 2,
                styleClass: 'fa fa-close',
                colorRaw: '#000000'
            }
        }
    };
    vm.triggerStyleChanged = function (triggerType, val) {
        vm.saveObject.triggers[triggerType].styles = {};
        var topVal = '0px';
        if (triggerType === 'open') {
            topVal = '10px';
        }
        switch (val) {
            case 0:
                vm.saveObject.triggers[triggerType].styles.left = '10px';
                vm.saveObject.triggers[triggerType].styles.top = topVal;
                break;
            case 1:
                vm.saveObject.triggers[triggerType].styles.right = '10px';
                vm.saveObject.triggers[triggerType].styles.top = topVal;
                break;
            case 2:
                vm.saveObject.triggers[triggerType].styles.left = '10px';
                vm.saveObject.triggers[triggerType].styles.bottom = '18px';
                break;
            case 3:
                vm.saveObject.triggers[triggerType].styles.right = '10px';
                vm.saveObject.triggers[triggerType].styles.bottom = '18px';
                break;
        }
        if (triggerType === 'open') {
            jQuery('.vsbb-pfold-clickme').css(vm.saveObject.triggers[triggerType].styles);
        } else {
            jQuery('.vsbb-pfold-close').css(vm.saveObject.triggers[triggerType].styles);
        }
    };

    vm.styleChanged = function (state, type, value) {
        if (typeof value !== 'undefined') {
            vm.saveObject[state].styles[type] = value;
        }
        jQuery('.uc-final').css(vm.saveObject.unfolded.styles);
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

    vm.unfoldedBackGroundColorApi = {
        onChange: function (api, color, $event) {
            vm.styleChanged('unfolded', 'background-color',  color);
        }
    };

    vm.foldedBackGroundColorApi = {
        onChange: function (api, color, $event) {
            vm.styleChanged('folded', 'background-color', color)
        }
    };

    vm.refreshPreview = function () {
        if (vm.pfold) {
            vm.pfold._destroyPfold();
        }
        vm.pfold = jQuery('#uc-container').pfold({
            easing: 'ease-in',
            folds: vm.saveObject.folds.value,
            folddirection: vm.saveObject.foldDirections.value,
            containerEasing: 'ease-in',
            centered: vm.saveObject.centered,
            overlays: vm.saveObject.overlays,
            containerSpeedFactor: 1,
            speed: vm.saveObject.speed,
            perspective: vm.saveObject.depth
        });
        jQuery('#uc-container .vsbb-pfold-clickme').off('click');
        jQuery('#uc-container .vsbb-pfold-clickme').on('click', function () {
            vm.pfold.unfold();
        });
        jQuery('#uc-container .vsbb-pfold-close').off('click');
        jQuery('#uc-container .vsbb-pfold-close').on('click', function () {
            vm.pfold.fold();
        });
    };
    vm.removeBackgroundImage = function ($event, state) {
        $event.preventDefault();
        if (state === 'open') {
            vm.saveObject.folded.backgroundImg = '';
        } else {
            vm.saveObject.unfolded.backgroundImg = '';
        }
    };
    vm.setBackgroundImage = function ($event, state) {
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
            if (state === 'open') {
                vm.saveObject.folded.backgroundImg = attachment.url;
            } else {
                vm.saveObject.unfolded.backgroundImg = attachment.url;
            }
        });
        // Finally, open the modal
        vm.fileFrame.open();

    };

    setTimeout(function () {
        jQuery('.vsbb-pfold-clickme').removeAttr("style").css(vm.saveObject.triggers.open.styles);
        vm.refreshPreview();
    }, 1000)

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
        }).error(function (data, status, headers, config) {

        });
    } else {
        vm.loaded = true;
        vm.editingExisting = false;
    }


});