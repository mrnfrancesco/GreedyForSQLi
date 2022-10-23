var vsbbAngularApp = angular.module("vsbbAngularApp", ['ngRoute', 'ui.select', 'rzModule', 'color.picker', 'textAngular', 'uiSwitch', 'ngDropdowns', 'angularSpectrumColorpicker', 'ngTable', 'ngDialog','ui.bootstrap.dropdownToggle']);
vsbbAngularApp.constant('RESOURCES', (function () {
    // Use the variable in your constants
    return {}
})());


vsbbAngularApp.config(function ($provide) {
    $provide.decorator('ColorPickerOptions', function ($delegate) {
        var options = angular.copy($delegate);
        options.format = 'hex';
        return options;
    });
});

vsbbAngularApp.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) {
        // $delegate is the taOptions we are decorating
        // register the tool with textAngular

        taRegisterTool('backgroundColor', {
            display: "<div spectrum-colorpicker ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></div>",
            action: function (color) {
                var me = this;
                if (!this.$editor().wrapSelection) {
                    setTimeout(function () {
                        me.action(color);
                    }, 100)
                } else {
                    return this.$editor().wrapSelection('forecolor', color);
                }
            },
            options: {
                replacerClassName: 'fa fa-paint-brush', showButtons: false
            },
            color: "#fff"
        });
        taRegisterTool('fontColor', {
            display: "<spectrum-colorpicker trigger-id='{{trigger}}' ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></spectrum-colorpicker>",
            action: function (color) {
                var me = this;
                if (!this.$editor().wrapSelection) {
                    setTimeout(function () {
                        me.action(color);
                    }, 100)
                } else {
                    return this.$editor().wrapSelection('foreColor', color);
                }
            },
            options: {
                replacerClassName: 'fa fa-font', showButtons: false
            },
            color: "#000"
        });


        taRegisterTool('fontName', {
            display: "<span class='bar-btn-dropdown dropdown'>" +
            "<button class='btn btn-blue dropdown-toggle' type='button' ng-disabled='showHtml()'><i class='fa fa-font'></i><i class='fa fa-caret-down'></i></button>" +
            "<ul class='dropdown-menu'><li ng-repeat='o in options'><button class='btn btn-blue checked-dropdown' style='font-family: {{o.css}}; width: 100%' type='button' ng-click='action($event, o.css)'><i ng-if='o.active' class='fa fa-check'></i>{{o.name}}</button></li></ul></span>",
            action: function (event, font) {
                //Ask if event is really an event.
                if (!!event.stopPropagation) {
                    //With this, you stop the event of textAngular.
                    event.stopPropagation();
                    //Then click in the body to close the dropdown.
                    $("body").trigger("click");
                }
                return this.$editor().wrapSelection('fontName', font);
            },
            options: [
                {name: 'Sans-Serif', css: 'Arial, Helvetica, sans-serif'},
                {name: 'Serif', css: "'times new roman', serif"},
                {name: 'Wide', css: "'arial black', sans-serif"},
                {name: 'Narrow', css: "'arial narrow', sans-serif"},
                {name: 'Comic Sans MS', css: "'comic sans ms', sans-serif"},
                {name: 'Courier New', css: "'courier new', monospace"},
                {name: 'Garamond', css: 'garamond, serif'},
                {name: 'Georgia', css: 'georgia, serif'},
                {name: 'Tahoma', css: 'tahoma, sans-serif'},
                {name: 'Trebuchet MS', css: "'trebuchet ms', sans-serif"},
                {name: "Helvetica", css: "'Helvetica Neue', Helvetica, Arial, sans-serif"},
                {name: 'Verdana', css: 'verdana, sans-serif'},
                {name: 'Proxima Nova', css: 'proxima_nova_rgregular'}
            ]
        });


        taRegisterTool('fontSize', {
            display: "<span class='bar-btn-dropdown dropdown'>" +
            "<button class='btn btn-blue dropdown-toggle' type='button' ng-disabled='showHtml()'><i class='fa fa-text-height'></i><i class='fa fa-caret-down'></i></button>" +
            "<ul class='dropdown-menu'><li ng-repeat='o in options'><button class='btn btn-blue checked-dropdown' style='font-size: {{o.css}}; width: 100%' type='button' ng-click='action($event, o.value)'><i ng-if='o.active' class='fa fa-check'></i> {{o.name}}</button></li></ul>" +
            "</span>",
            action: function (event, size) {
                //Ask if event is really an event.
                if (!!event.stopPropagation) {
                    //With this, you stop the event of textAngular.
                    event.stopPropagation();
                    //Then click in the body to close the dropdown.
                    $("body").trigger("click");
                }
                return this.$editor().wrapSelection('fontSize', parseInt(size));
            },
            options: [
                {name: 'xx-small', css: 'xx-small', value: 1},
                {name: 'x-small', css: 'x-small', value: 2},
                {name: 'small', css: 'small', value: 3},
                {name: 'medium', css: 'medium', value: 4},
                {name: 'large', css: 'large', value: 5},
                {name: 'x-large', css: 'x-large', value: 6},
                {name: 'xx-large', css: 'xx-large', value: 7}

            ]
        });
        // add the button to the default toolbar definition
        taOptions.toolbar[1].push('backgroundColor', 'fontColor', 'fontName', 'fontSize');
        return taOptions;
    }]);

});