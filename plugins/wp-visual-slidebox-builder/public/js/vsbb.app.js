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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIHZzYmJBbmd1bGFyQXBwID0gYW5ndWxhci5tb2R1bGUoXCJ2c2JiQW5ndWxhckFwcFwiLCBbJ25nUm91dGUnLCAndWkuc2VsZWN0JywgJ3J6TW9kdWxlJywgJ2NvbG9yLnBpY2tlcicsICd0ZXh0QW5ndWxhcicsICd1aVN3aXRjaCcsICduZ0Ryb3Bkb3ducycsICdhbmd1bGFyU3BlY3RydW1Db2xvcnBpY2tlcicsICduZ1RhYmxlJywgJ25nRGlhbG9nJywndWkuYm9vdHN0cmFwLmRyb3Bkb3duVG9nZ2xlJ10pO1xudnNiYkFuZ3VsYXJBcHAuY29uc3RhbnQoJ1JFU09VUkNFUycsIChmdW5jdGlvbiAoKSB7XG4gICAgLy8gVXNlIHRoZSB2YXJpYWJsZSBpbiB5b3VyIGNvbnN0YW50c1xuICAgIHJldHVybiB7fVxufSkoKSk7XG5cblxudnNiYkFuZ3VsYXJBcHAuY29uZmlnKGZ1bmN0aW9uICgkcHJvdmlkZSkge1xuICAgICRwcm92aWRlLmRlY29yYXRvcignQ29sb3JQaWNrZXJPcHRpb25zJywgZnVuY3Rpb24gKCRkZWxlZ2F0ZSkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IGFuZ3VsYXIuY29weSgkZGVsZWdhdGUpO1xuICAgICAgICBvcHRpb25zLmZvcm1hdCA9ICdoZXgnO1xuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9KTtcbn0pO1xuXG52c2JiQW5ndWxhckFwcC5jb25maWcoZnVuY3Rpb24gKCRwcm92aWRlKSB7XG4gICAgJHByb3ZpZGUuZGVjb3JhdG9yKCd0YU9wdGlvbnMnLCBbJ3RhUmVnaXN0ZXJUb29sJywgJyRkZWxlZ2F0ZScsIGZ1bmN0aW9uICh0YVJlZ2lzdGVyVG9vbCwgdGFPcHRpb25zKSB7XG4gICAgICAgIC8vICRkZWxlZ2F0ZSBpcyB0aGUgdGFPcHRpb25zIHdlIGFyZSBkZWNvcmF0aW5nXG4gICAgICAgIC8vIHJlZ2lzdGVyIHRoZSB0b29sIHdpdGggdGV4dEFuZ3VsYXJcblxuICAgICAgICB0YVJlZ2lzdGVyVG9vbCgnYmFja2dyb3VuZENvbG9yJywge1xuICAgICAgICAgICAgZGlzcGxheTogXCI8ZGl2IHNwZWN0cnVtLWNvbG9ycGlja2VyIG5nLW1vZGVsPSdjb2xvcicgb24tY2hhbmdlPSchIWNvbG9yICYmIGFjdGlvbihjb2xvciknIGZvcm1hdD0nXFxcImhleFxcXCInIG9wdGlvbnM9J29wdGlvbnMnPjwvZGl2PlwiLFxuICAgICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbiAoY29sb3IpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy4kZWRpdG9yKCkud3JhcFNlbGVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lLmFjdGlvbihjb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kZWRpdG9yKCkud3JhcFNlbGVjdGlvbignZm9yZWNvbG9yJywgY29sb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgcmVwbGFjZXJDbGFzc05hbWU6ICdmYSBmYS1wYWludC1icnVzaCcsIHNob3dCdXR0b25zOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbG9yOiBcIiNmZmZcIlxuICAgICAgICB9KTtcbiAgICAgICAgdGFSZWdpc3RlclRvb2woJ2ZvbnRDb2xvcicsIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiPHNwZWN0cnVtLWNvbG9ycGlja2VyIHRyaWdnZXItaWQ9J3t7dHJpZ2dlcn19JyBuZy1tb2RlbD0nY29sb3InIG9uLWNoYW5nZT0nISFjb2xvciAmJiBhY3Rpb24oY29sb3IpJyBmb3JtYXQ9J1xcXCJoZXhcXFwiJyBvcHRpb25zPSdvcHRpb25zJz48L3NwZWN0cnVtLWNvbG9ycGlja2VyPlwiLFxuICAgICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbiAoY29sb3IpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy4kZWRpdG9yKCkud3JhcFNlbGVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lLmFjdGlvbihjb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kZWRpdG9yKCkud3JhcFNlbGVjdGlvbignZm9yZUNvbG9yJywgY29sb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgcmVwbGFjZXJDbGFzc05hbWU6ICdmYSBmYS1mb250Jywgc2hvd0J1dHRvbnM6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29sb3I6IFwiIzAwMFwiXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgdGFSZWdpc3RlclRvb2woJ2ZvbnROYW1lJywge1xuICAgICAgICAgICAgZGlzcGxheTogXCI8c3BhbiBjbGFzcz0nYmFyLWJ0bi1kcm9wZG93biBkcm9wZG93bic+XCIgK1xuICAgICAgICAgICAgXCI8YnV0dG9uIGNsYXNzPSdidG4gYnRuLWJsdWUgZHJvcGRvd24tdG9nZ2xlJyB0eXBlPSdidXR0b24nIG5nLWRpc2FibGVkPSdzaG93SHRtbCgpJz48aSBjbGFzcz0nZmEgZmEtZm9udCc+PC9pPjxpIGNsYXNzPSdmYSBmYS1jYXJldC1kb3duJz48L2k+PC9idXR0b24+XCIgK1xuICAgICAgICAgICAgXCI8dWwgY2xhc3M9J2Ryb3Bkb3duLW1lbnUnPjxsaSBuZy1yZXBlYXQ9J28gaW4gb3B0aW9ucyc+PGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1ibHVlIGNoZWNrZWQtZHJvcGRvd24nIHN0eWxlPSdmb250LWZhbWlseToge3tvLmNzc319OyB3aWR0aDogMTAwJScgdHlwZT0nYnV0dG9uJyBuZy1jbGljaz0nYWN0aW9uKCRldmVudCwgby5jc3MpJz48aSBuZy1pZj0nby5hY3RpdmUnIGNsYXNzPSdmYSBmYS1jaGVjayc+PC9pPnt7by5uYW1lfX08L2J1dHRvbj48L2xpPjwvdWw+PC9zcGFuPlwiLFxuICAgICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbiAoZXZlbnQsIGZvbnQpIHtcbiAgICAgICAgICAgICAgICAvL0FzayBpZiBldmVudCBpcyByZWFsbHkgYW4gZXZlbnQuXG4gICAgICAgICAgICAgICAgaWYgKCEhZXZlbnQuc3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vV2l0aCB0aGlzLCB5b3Ugc3RvcCB0aGUgZXZlbnQgb2YgdGV4dEFuZ3VsYXIuXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAvL1RoZW4gY2xpY2sgaW4gdGhlIGJvZHkgdG8gY2xvc2UgdGhlIGRyb3Bkb3duLlxuICAgICAgICAgICAgICAgICAgICAkKFwiYm9keVwiKS50cmlnZ2VyKFwiY2xpY2tcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLiRlZGl0b3IoKS53cmFwU2VsZWN0aW9uKCdmb250TmFtZScsIGZvbnQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9wdGlvbnM6IFtcbiAgICAgICAgICAgICAgICB7bmFtZTogJ1NhbnMtU2VyaWYnLCBjc3M6ICdBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmJ30sXG4gICAgICAgICAgICAgICAge25hbWU6ICdTZXJpZicsIGNzczogXCIndGltZXMgbmV3IHJvbWFuJywgc2VyaWZcIn0sXG4gICAgICAgICAgICAgICAge25hbWU6ICdXaWRlJywgY3NzOiBcIidhcmlhbCBibGFjaycsIHNhbnMtc2VyaWZcIn0sXG4gICAgICAgICAgICAgICAge25hbWU6ICdOYXJyb3cnLCBjc3M6IFwiJ2FyaWFsIG5hcnJvdycsIHNhbnMtc2VyaWZcIn0sXG4gICAgICAgICAgICAgICAge25hbWU6ICdDb21pYyBTYW5zIE1TJywgY3NzOiBcIidjb21pYyBzYW5zIG1zJywgc2Fucy1zZXJpZlwifSxcbiAgICAgICAgICAgICAgICB7bmFtZTogJ0NvdXJpZXIgTmV3JywgY3NzOiBcIidjb3VyaWVyIG5ldycsIG1vbm9zcGFjZVwifSxcbiAgICAgICAgICAgICAgICB7bmFtZTogJ0dhcmFtb25kJywgY3NzOiAnZ2FyYW1vbmQsIHNlcmlmJ30sXG4gICAgICAgICAgICAgICAge25hbWU6ICdHZW9yZ2lhJywgY3NzOiAnZ2VvcmdpYSwgc2VyaWYnfSxcbiAgICAgICAgICAgICAgICB7bmFtZTogJ1RhaG9tYScsIGNzczogJ3RhaG9tYSwgc2Fucy1zZXJpZid9LFxuICAgICAgICAgICAgICAgIHtuYW1lOiAnVHJlYnVjaGV0IE1TJywgY3NzOiBcIid0cmVidWNoZXQgbXMnLCBzYW5zLXNlcmlmXCJ9LFxuICAgICAgICAgICAgICAgIHtuYW1lOiBcIkhlbHZldGljYVwiLCBjc3M6IFwiJ0hlbHZldGljYSBOZXVlJywgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZlwifSxcbiAgICAgICAgICAgICAgICB7bmFtZTogJ1ZlcmRhbmEnLCBjc3M6ICd2ZXJkYW5hLCBzYW5zLXNlcmlmJ30sXG4gICAgICAgICAgICAgICAge25hbWU6ICdQcm94aW1hIE5vdmEnLCBjc3M6ICdwcm94aW1hX25vdmFfcmdyZWd1bGFyJ31cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG5cblxuICAgICAgICB0YVJlZ2lzdGVyVG9vbCgnZm9udFNpemUnLCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBcIjxzcGFuIGNsYXNzPSdiYXItYnRuLWRyb3Bkb3duIGRyb3Bkb3duJz5cIiArXG4gICAgICAgICAgICBcIjxidXR0b24gY2xhc3M9J2J0biBidG4tYmx1ZSBkcm9wZG93bi10b2dnbGUnIHR5cGU9J2J1dHRvbicgbmctZGlzYWJsZWQ9J3Nob3dIdG1sKCknPjxpIGNsYXNzPSdmYSBmYS10ZXh0LWhlaWdodCc+PC9pPjxpIGNsYXNzPSdmYSBmYS1jYXJldC1kb3duJz48L2k+PC9idXR0b24+XCIgK1xuICAgICAgICAgICAgXCI8dWwgY2xhc3M9J2Ryb3Bkb3duLW1lbnUnPjxsaSBuZy1yZXBlYXQ9J28gaW4gb3B0aW9ucyc+PGJ1dHRvbiBjbGFzcz0nYnRuIGJ0bi1ibHVlIGNoZWNrZWQtZHJvcGRvd24nIHN0eWxlPSdmb250LXNpemU6IHt7by5jc3N9fTsgd2lkdGg6IDEwMCUnIHR5cGU9J2J1dHRvbicgbmctY2xpY2s9J2FjdGlvbigkZXZlbnQsIG8udmFsdWUpJz48aSBuZy1pZj0nby5hY3RpdmUnIGNsYXNzPSdmYSBmYS1jaGVjayc+PC9pPiB7e28ubmFtZX19PC9idXR0b24+PC9saT48L3VsPlwiICtcbiAgICAgICAgICAgIFwiPC9zcGFuPlwiLFxuICAgICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbiAoZXZlbnQsIHNpemUpIHtcbiAgICAgICAgICAgICAgICAvL0FzayBpZiBldmVudCBpcyByZWFsbHkgYW4gZXZlbnQuXG4gICAgICAgICAgICAgICAgaWYgKCEhZXZlbnQuc3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vV2l0aCB0aGlzLCB5b3Ugc3RvcCB0aGUgZXZlbnQgb2YgdGV4dEFuZ3VsYXIuXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAvL1RoZW4gY2xpY2sgaW4gdGhlIGJvZHkgdG8gY2xvc2UgdGhlIGRyb3Bkb3duLlxuICAgICAgICAgICAgICAgICAgICAkKFwiYm9keVwiKS50cmlnZ2VyKFwiY2xpY2tcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLiRlZGl0b3IoKS53cmFwU2VsZWN0aW9uKCdmb250U2l6ZScsIHBhcnNlSW50KHNpemUpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvcHRpb25zOiBbXG4gICAgICAgICAgICAgICAge25hbWU6ICd4eC1zbWFsbCcsIGNzczogJ3h4LXNtYWxsJywgdmFsdWU6IDF9LFxuICAgICAgICAgICAgICAgIHtuYW1lOiAneC1zbWFsbCcsIGNzczogJ3gtc21hbGwnLCB2YWx1ZTogMn0sXG4gICAgICAgICAgICAgICAge25hbWU6ICdzbWFsbCcsIGNzczogJ3NtYWxsJywgdmFsdWU6IDN9LFxuICAgICAgICAgICAgICAgIHtuYW1lOiAnbWVkaXVtJywgY3NzOiAnbWVkaXVtJywgdmFsdWU6IDR9LFxuICAgICAgICAgICAgICAgIHtuYW1lOiAnbGFyZ2UnLCBjc3M6ICdsYXJnZScsIHZhbHVlOiA1fSxcbiAgICAgICAgICAgICAgICB7bmFtZTogJ3gtbGFyZ2UnLCBjc3M6ICd4LWxhcmdlJywgdmFsdWU6IDZ9LFxuICAgICAgICAgICAgICAgIHtuYW1lOiAneHgtbGFyZ2UnLCBjc3M6ICd4eC1sYXJnZScsIHZhbHVlOiA3fVxuXG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBhZGQgdGhlIGJ1dHRvbiB0byB0aGUgZGVmYXVsdCB0b29sYmFyIGRlZmluaXRpb25cbiAgICAgICAgdGFPcHRpb25zLnRvb2xiYXJbMV0ucHVzaCgnYmFja2dyb3VuZENvbG9yJywgJ2ZvbnRDb2xvcicsICdmb250TmFtZScsICdmb250U2l6ZScpO1xuICAgICAgICByZXR1cm4gdGFPcHRpb25zO1xuICAgIH1dKTtcblxufSk7Il0sImZpbGUiOiJhcHAuanMifQ==

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyb3V0ZXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsidnNiYkFuZ3VsYXJBcHAuY29uZmlnKGZ1bmN0aW9uICgkcm91dGVQcm92aWRlcikge1xuICAgICRyb3V0ZVByb3ZpZGVyXG5cbiAgICAgICAgLndoZW4oJy9idWlsZGVyLzp0aGVtZUlkJywge1xuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IHZzYmJHbG9iYWxWYXJzLnBhcnRpYWxzICsgJy9idWlsZGVyLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ3ZzYmJCdWlsZGVyQ29udHJvbGxlcicsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjdHJsJ1xuICAgICAgICB9KS53aGVuKCcvYnVpbGRlci86dGhlbWVJZC86aWQnLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiB2c2JiR2xvYmFsVmFycy5wYXJ0aWFscyArICcvYnVpbGRlci5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3ZzYmJCdWlsZGVyQ29udHJvbGxlcicsXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gICAgfSkud2hlbignL2hpc3RvcnknLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiB2c2JiR2xvYmFsVmFycy5wYXJ0aWFscyArICcvaGlzdG9yeS5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3ZzYmJIaXN0b3J5Q29udHJvbGxlcicsXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ2N0cmwnXG4gICAgfSkud2hlbignL215Jywge1xuICAgICAgICB0ZW1wbGF0ZVVybDogdnNiYkdsb2JhbFZhcnMucGFydGlhbHMgKyAnL215dnNiYi5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3ZzYmJNeVZzYmJDb250cm9sbGVyJyxcbiAgICAgICAgY29udHJvbGxlckFzOiAnY3RybCdcbiAgICB9KS5vdGhlcndpc2Uoe1xuICAgICAgICByZWRpcmVjdFRvOiAnL2J1aWxkZXIvaW1hZ2VfY2FwdGlvbidcbiAgICB9KTtcblxufSk7XG4iXSwiZmlsZSI6InJvdXRlcy5qcyJ9

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb250cm9sZWxycy9idWlsZGVyLmNvbnRyb2xsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsidnNiYkFuZ3VsYXJBcHAuY29udHJvbGxlcigndnNiYkJ1aWxkZXJDb250cm9sbGVyJywgZnVuY3Rpb24gKHZzYmJVdGlscywgJGh0dHAsICRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uLCBuZ0RpYWxvZykge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uZ2V0VGhlbWVQYXJ0aWFsQ29udGFpbmVyID0gZnVuY3Rpb24gKHBhcnRpYWwpIHtcbiAgICAgICAgcmV0dXJuIHZzYmJVdGlscy5nZXRQYXJ0aWFsc1VybCgpICsgJy90aGVtZXMvJyArIHBhcnRpYWwgKyAnL2luZGV4Lmh0bWwnO1xuICAgIH07XG4gICAgdm0uZ2V0VGhlbWVQYXJ0aWFsSXRlbSA9IGZ1bmN0aW9uIChwYXJ0aWFsLCBwYXJ0aWFsSXRlbSkge1xuICAgICAgICByZXR1cm4gdnNiYlV0aWxzLmdldFBhcnRpYWxzVXJsKCkgKyAnL3RoZW1lcy8nICsgcGFydGlhbCArICcvJyArIHBhcnRpYWxJdGVtICsgJy5odG1sJztcbiAgICB9O1xuICAgIHZtLmdldFRoZW1lUGFydGlhbEVkaXRvciA9IGZ1bmN0aW9uIChwYXJ0aWFsKSB7XG4gICAgICAgIHJldHVybiB2c2JiVXRpbHMuZ2V0UGFydGlhbHNVcmwoKSArICcvdGhlbWVzLycgKyBwYXJ0aWFsICsgJy9lZGl0b3IuaHRtbCc7XG4gICAgfTtcbiAgICB2bS5nZXRUaGVtZVByZXZpZXdQYXJ0aWFsID0gZnVuY3Rpb24gKHBhcnRpYWwpIHtcbiAgICAgICAgcmV0dXJuIHZzYmJVdGlscy5nZXRQYXJ0aWFsc1VybCgpICsgJy90aGVtZXMvJyArIHBhcnRpYWwgKyAnL3ByZXZpZXcucGhwJztcbiAgICB9O1xuICAgIHZtLmdldFBhaWRWZXJzaW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdnNiYlV0aWxzLmdldFBhaWRWZXJzaW9uKCk7XG4gICAgfTtcbiAgICB2bS5pc1RoZW1lQWxsb3dlZCA9IGZ1bmN0aW9uICh0aGVtZUlkKSB7XG4gICAgICAgIHJldHVybiB2c2JiVXRpbHMuaXNUaGVtZUFsbG93ZWQodGhlbWVJZCk7XG4gICAgfTtcbiAgICB2bS5pc0ZlYXR1cmVBbGxvd2VkID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gdnNiYlV0aWxzLmlzRmVhdHVyZUFsbG93ZWQoa2V5KTtcbiAgICB9O1xuICAgIHZtLmdldFRoZW1lU2VsZWN0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB2c2JiVXRpbHMuZ2V0UGFydGlhbHNVcmwoKSArICcvdGhlbWVzL3NlbGVjdG9yLmh0bWwnO1xuICAgIH07XG4gICAgdm0udGhlbWVzID0gdnNiYlV0aWxzLmdldEF2YWlsYWJsZVRoZW1lcygpO1xuICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS50aGVtZXMsIGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgICBpZiAoaXRlbS52YWx1ZSA9PT0gJHJvdXRlUGFyYW1zLnRoZW1lSWQpIHtcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkVGhlbWUgPSBhbmd1bGFyLmNvcHkodm0udGhlbWVzW2luZGV4XSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0udmFsdWUgPT09IC0xKSB7XG4gICAgICAgICAgICB2bS50aGVtZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZtLnNsaWRlck9wdGlvbnMgPSB7XG4gICAgICAgIGZsb29yOiAwLFxuICAgICAgICBjZWlsOiAxMDAsXG4gICAgICAgIC8vaGlkZVBvaW50ZXJMYWJlbHM6IHRydWUsXG4gICAgICAgIGhpZGVMaW1pdExhYmVsczogdHJ1ZSxcbiAgICAgICAgdHJhbnNsYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSArICclJztcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2bS5jb2xvclBpY2tlck9wdGlvbnMgPSB7XG4gICAgICAgIHBvczogJ2JvdHRvbSByaWdodCcsXG4gICAgICAgIGZvcm1hdDogJ2hzbCdcbiAgICB9O1xuICAgIHZtLnNldEJhY2tncm91bmRJbWFnZSA9IGZ1bmN0aW9uICgkZXZlbnQsIG1vZGVsLCBwcm9wZXJ0eSkge1xuICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBtZWRpYSBmcmFtZS5cbiAgICAgICAgdm0uZmlsZUZyYW1lID0gd3AubWVkaWEuZnJhbWVzLmZpbGVfZnJhbWUgPSB3cC5tZWRpYSh7XG4gICAgICAgICAgICB0aXRsZTogJ1NlbGVjdCBhIGltYWdlIHRvIHVwbG9hZCcsXG4gICAgICAgICAgICBidXR0b246IHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnVXNlIHRoaXMgaW1hZ2UnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbXVsdGlwbGU6IGZhbHNlXHQvLyBTZXQgdG8gdHJ1ZSB0byBhbGxvdyBtdWx0aXBsZSBmaWxlcyB0byBiZSBzZWxlY3RlZFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gV2hlbiBhbiBpbWFnZSBpcyBzZWxlY3RlZCwgcnVuIGEgY2FsbGJhY2suXG4gICAgICAgIHZtLmZpbGVGcmFtZS5vbignc2VsZWN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gV2Ugc2V0IG11bHRpcGxlIHRvIGZhbHNlIHNvIG9ubHkgZ2V0IG9uZSBpbWFnZSBmcm9tIHRoZSB1cGxvYWRlclxuICAgICAgICAgICAgdmFyIGF0dGFjaG1lbnQgPSB2bS5maWxlRnJhbWUuc3RhdGUoKS5nZXQoJ3NlbGVjdGlvbicpLmZpcnN0KCkudG9KU09OKCk7XG4gICAgICAgICAgICBtb2RlbFtwcm9wZXJ0eV0gPSBhdHRhY2htZW50LnVybDtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIEZpbmFsbHksIG9wZW4gdGhlIG1vZGFsXG4gICAgICAgIHZtLmZpbGVGcmFtZS5vcGVuKCk7XG4gICAgfTtcbiAgICB2bS5yZW1vdmVCYWNrZ3JvdW5kSW1hZ2UgPSBmdW5jdGlvbiAoJGV2ZW50LCBtb2RlbCwgcHJvcGVydHkpIHtcbiAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG1vZGVsW3Byb3BlcnR5XSA9IG51bGw7XG4gICAgfTtcbiAgICB2bS50aGVtZUNoYW5nZWQgPSBmdW5jdGlvbiAoc2VsZWN0ZWQpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbGVjdGVkICcsIHNlbGVjdGVkKVxuICAgICAgICAvL2dvIHRvIGFwcHJvcHJpYXRlIHRoZW1lIFVSTFxuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2J1aWxkZXIvJyArIHNlbGVjdGVkLnZhbHVlKTtcbiAgICB9O1xuXG4gICAgdm0uY2xvbmVJdGVtTW9kYWwgPSBmdW5jdGlvbiAoc2F2ZU9iamVjdCkge1xuICAgICAgICB2YXIgc2F2ZU9iamVjdENvcHkgPSBhbmd1bGFyLmNvcHkoc2F2ZU9iamVjdCk7XG4gICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgdGVtcGxhdGU6IHZzYmJHbG9iYWxWYXJzLnBhcnRpYWxzICsgJy9kaWFsb2dzL2Nsb25lLmh0bWwnLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCcsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjbG9uZUN0cmwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogW2Z1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdm0xID0gdGhpcztcbiAgICAgICAgICAgICAgICBzYXZlT2JqZWN0Q29weS5mcmllbmRseU5hbWUgPSBzYXZlT2JqZWN0Q29weS5mcmllbmRseU5hbWUgKyAnIC0gQ2xvbmUnO1xuICAgICAgICAgICAgICAgIHZtMS5zYXZlT2JqZWN0ID0gc2F2ZU9iamVjdENvcHk7XG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBoZWFkaW5nOiAnQ2xvbmUgSXRlbScsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgICBzdWJUZXh0OiAnWW91ciBjbG9uZSB3aWxsIGJlIHNhdmVkIHdpdGggdGhlIGlkZW50aWNhbCBzZXR0aW5ncyBhdCB0aGUgaXRlbSB5b3UgYXJlIGNsb25pbmcgaXQgZnJvbSdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZvb3Rlcjoge1xuICAgICAgICAgICAgICAgICAgICBtYWluQ3RhVGV4dDogJ0Nsb25lJyxcbiAgICAgICAgICAgICAgICAgICAgc3ViQ3RhVGV4dDogJ0NhbmNlbCcsXG4gICAgICAgICAgICAgICAgICAgIG1haW5DdGE6IGZ1bmN0aW9uIChzYXZlT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5jbG9uZUl0ZW0oc2F2ZU9iamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1YkN0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmdEaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgdm0uY2xvbmVJdGVtID0gZnVuY3Rpb24gKHNhdmVPYmplY3QpIHtcbiAgICAgICAgdnNiYlV0aWxzLnNhdmVJbnN0YW5jZShzYXZlT2JqZWN0LFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICdmcmllbmRseU5hbWUnLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0ZyaWVuZGx5IE5hbWUnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgIH1cbn0pOyJdLCJmaWxlIjoiY29udHJvbGVscnMvYnVpbGRlci5jb250cm9sbGVyLmpzIn0=

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb250cm9sZWxycy9mb2xkaW5nLnRoZW1lLmNvbnRyb2xsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsidnNiYkFuZ3VsYXJBcHAuY29udHJvbGxlcigndnNiYkZvbGRpbmdUaGVtZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHJvdXRlUGFyYW1zLCRodHRwLCB2c2JiVXRpbHMpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmZpbGVGcmFtZSA9IG51bGw7XG4gICAgdm0uYm9yZGVyT3B0cyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdub25lJyxcbiAgICAgICAgICAgIG5hbWU6ICdObyBCb3JkZXInXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlOiAnc29saWQnLFxuICAgICAgICAgICAgbmFtZTogJ1NvbGlkJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJ2Rhc2hlZCcsXG4gICAgICAgICAgICBuYW1lOiAnRGFzaGVkJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJ2RvdHRlZCcsXG4gICAgICAgICAgICBuYW1lOiAnRG90dGVkJ1xuICAgICAgICB9XG4gICAgXTtcbiAgICB2bS5mb2xkZWRCb3JkZXIgPSBhbmd1bGFyLmNvcHkodm0uYm9yZGVyT3B0c1swXSk7XG4gICAgdm0udW5mb2xkZUJvcmRlciA9IGFuZ3VsYXIuY29weSh2bS5ib3JkZXJPcHRzWzBdKTtcbiAgICB2bS5mb2xkZWRCYWNrZ3JvdW5kQ29sb3IgPSAnI2ZmZmZmZic7XG4gICAgdm0udW5mb2xkZWRCYWNrZ3JvdW5kQ29sb3IgPSAnI2ZmZmZmZic7XG4gICAgdm0uZm9sZENvdW50cyA9IFtcbiAgICAgICAge25hbWU6IDIsIHZhbHVlOiAyfSxcbiAgICAgICAge25hbWU6IDMsIHZhbHVlOiAzfSxcbiAgICAgICAge25hbWU6IDQsIHZhbHVlOiA0fVxuICAgIF07XG4gICAgdm0uZm9sZERpcmVjdGlvbnMgPSBbXG4gICAgICAgIHtuYW1lOiBcIlJpZ2h0IC0gVG9wXCIsIHZhbHVlOiBbJ3JpZ2h0JywgJ3RvcCddfSxcbiAgICAgICAge25hbWU6IFwiTGVmdCAtIFRvcFwiLCB2YWx1ZTogWydsZWZ0JywgJ3RvcCddfSxcbiAgICAgICAge25hbWU6IFwiUmlnaHQgLSBCb3R0b21cIiwgdmFsdWU6IFsncmlnaHQnLCAnYm90dG9tJ119LFxuICAgICAgICB7bmFtZTogXCJMZWZ0IC0gQm90dG9tXCIsIHZhbHVlOiBbJ2xlZnQnLCAnYm90dG9tJ119XG4gICAgXTtcblxuICAgIHZtLnNhdmVPYmplY3QgPSB7XG4gICAgICAgIHRoZW1lSWQ6J2ZvbGRpbmcnLFxuICAgICAgICB0aGVtZUZyaWVuZGx5TmFtZTonRm9sZGluZycsXG4gICAgICAgIHRwOmZhbHNlLFxuICAgICAgICBmcmllbmRseU5hbWU6ICcnLFxuICAgICAgICBtYWluVGV4dDogJ0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQuIER1aXMgYWMgYW50ZSBlcm9zLiBNb3JiaSBjb25ndWUgY3Vyc3VzIGN1cnN1cy4gU2VkIGZlcm1lbnR1bSBkdWkgdmVsIHR1cnBpcyBjb25ndWUgbW9sZXN0aWUgYSBldCBtYWduYS4gTmFtIHNpdCBhbWV0IGNvbW1vZG8gbG9yZW0sIGlkIG1heGltdXMgbGVjdHVzLiBBZW5lYW4gc29sbGljaXR1ZGluIGxvcmVtIGFjIG1hdXJpcyBzdXNjaXBpdCwgZWdldCBsYWNpbmlhIHF1YW0gY29uc2VxdWF0LiBTZWQgdnVscHV0YXRlIG1hdXJpcyB0b3J0b3IsIGFsaXF1ZXQgdml2ZXJyYSBwdXJ1cyB2b2x1dHBhdCBub24uJyxcbiAgICAgICAgcHJlQ29udGVudDogXCJcIixcbiAgICAgICAgZm9vdGVyVGV4dDogJ2Zvb3RlciB0ZXh0JyxcbiAgICAgICAgb3BlblRyaWdnZXI6ICdDbGljayBNZScsXG4gICAgICAgIGNsb3NlVHJpZ2dlcjogJ1gnLFxuICAgICAgICBmb2xkczogdm0uZm9sZENvdW50c1sxXSxcbiAgICAgICAgZm9sZERpcmVjdGlvbnM6IHZtLmZvbGREaXJlY3Rpb25zWzBdLFxuICAgICAgICBjZW50ZXJlZDogZmFsc2UsXG4gICAgICAgIG92ZXJsYXlzOiB0cnVlLFxuICAgICAgICBzcGVlZDogNTAwLFxuICAgICAgICBkZXB0aDogMTUwMCxcbiAgICAgICAgcG9zaXRpb25pbmc6IHtcbiAgICAgICAgICAgIGd1dHRlcnM6IHRydWUsXG4gICAgICAgICAgICByZXNwb25zaXZlQ2xhc3M6ICd2c2JiLWdyaWRfX2NvbC0tMTItb2YtMTInXG4gICAgICAgIH0sXG4gICAgICAgIGZvbGRlZDoge1xuICAgICAgICAgICAgYmFja2dyb3VuZEltZzogdnNiYlV0aWxzLmdldFB1YmxpY1Jvb3RVcmwoKSArICcvaW1hZ2VzL3ZzYmJfaW1hZ2UyLnBuZycsXG4gICAgICAgICAgICBzdHlsZXM6IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogJzc1cHgnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMHB4JyxcbiAgICAgICAgICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICAgICAnYm9yZGVyLXN0eWxlJzogJ25vbmUnLFxuICAgICAgICAgICAgICAgICdib3JkZXItd2lkdGgnOiAzXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHVuZm9sZGVkOiB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kSW1nOiBcIlwiLFxuICAgICAgICAgICAgc3R5bGVzOiB7XG4gICAgICAgICAgICAgICAgJ2JvcmRlci1zdHlsZSc6ICdub25lJyxcbiAgICAgICAgICAgICAgICAnYm9yZGVyLXdpZHRoJzogM1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0cmlnZ2Vyczoge1xuICAgICAgICAgICAgb3Blbjoge1xuICAgICAgICAgICAgICAgIHN0eWxlczoge2xlZnQ6ICcxMHB4JywgdG9wOiAnMTBweCcsICdmb250LXNpemUnOiAnMjJweCcsICdjb2xvcic6ICcjMmEzNWUwJ30sXG4gICAgICAgICAgICAgICAgc3R5bGVWYWx1ZTogMCxcbiAgICAgICAgICAgICAgICBzdHlsZUNsYXNzOiAnZmEtYWxpZ24tanVzdGlmeScsXG4gICAgICAgICAgICAgICAgY29sb3JSYXc6ICcjMDAwMDAwJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsb3NlOiB7XG4gICAgICAgICAgICAgICAgc3R5bGVzOiB7bGVmdDogJzEwcHgnLCBib3R0b206ICcxOHB4JywgJ2ZvbnQtc2l6ZSc6ICcyMnB4JywgJ2NvbG9yJzogJyMyYTM1ZTAnfSxcbiAgICAgICAgICAgICAgICBzdHlsZVZhbHVlOiAyLFxuICAgICAgICAgICAgICAgIHN0eWxlQ2xhc3M6ICdmYSBmYS1jbG9zZScsXG4gICAgICAgICAgICAgICAgY29sb3JSYXc6ICcjMDAwMDAwJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICB2bS50cmlnZ2VyU3R5bGVDaGFuZ2VkID0gZnVuY3Rpb24gKHRyaWdnZXJUeXBlLCB2YWwpIHtcbiAgICAgICAgdm0uc2F2ZU9iamVjdC50cmlnZ2Vyc1t0cmlnZ2VyVHlwZV0uc3R5bGVzID0ge307XG4gICAgICAgIHZhciB0b3BWYWwgPSAnMHB4JztcbiAgICAgICAgaWYgKHRyaWdnZXJUeXBlID09PSAnb3BlbicpIHtcbiAgICAgICAgICAgIHRvcFZhbCA9ICcxMHB4JztcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHZhbCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIHZtLnNhdmVPYmplY3QudHJpZ2dlcnNbdHJpZ2dlclR5cGVdLnN0eWxlcy5sZWZ0ID0gJzEwcHgnO1xuICAgICAgICAgICAgICAgIHZtLnNhdmVPYmplY3QudHJpZ2dlcnNbdHJpZ2dlclR5cGVdLnN0eWxlcy50b3AgPSB0b3BWYWw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgdm0uc2F2ZU9iamVjdC50cmlnZ2Vyc1t0cmlnZ2VyVHlwZV0uc3R5bGVzLnJpZ2h0ID0gJzEwcHgnO1xuICAgICAgICAgICAgICAgIHZtLnNhdmVPYmplY3QudHJpZ2dlcnNbdHJpZ2dlclR5cGVdLnN0eWxlcy50b3AgPSB0b3BWYWw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgdm0uc2F2ZU9iamVjdC50cmlnZ2Vyc1t0cmlnZ2VyVHlwZV0uc3R5bGVzLmxlZnQgPSAnMTBweCc7XG4gICAgICAgICAgICAgICAgdm0uc2F2ZU9iamVjdC50cmlnZ2Vyc1t0cmlnZ2VyVHlwZV0uc3R5bGVzLmJvdHRvbSA9ICcxOHB4JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICB2bS5zYXZlT2JqZWN0LnRyaWdnZXJzW3RyaWdnZXJUeXBlXS5zdHlsZXMucmlnaHQgPSAnMTBweCc7XG4gICAgICAgICAgICAgICAgdm0uc2F2ZU9iamVjdC50cmlnZ2Vyc1t0cmlnZ2VyVHlwZV0uc3R5bGVzLmJvdHRvbSA9ICcxOHB4JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHJpZ2dlclR5cGUgPT09ICdvcGVuJykge1xuICAgICAgICAgICAgalF1ZXJ5KCcudnNiYi1wZm9sZC1jbGlja21lJykuY3NzKHZtLnNhdmVPYmplY3QudHJpZ2dlcnNbdHJpZ2dlclR5cGVdLnN0eWxlcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBqUXVlcnkoJy52c2JiLXBmb2xkLWNsb3NlJykuY3NzKHZtLnNhdmVPYmplY3QudHJpZ2dlcnNbdHJpZ2dlclR5cGVdLnN0eWxlcyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdm0uc3R5bGVDaGFuZ2VkID0gZnVuY3Rpb24gKHN0YXRlLCB0eXBlLCB2YWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdm0uc2F2ZU9iamVjdFtzdGF0ZV0uc3R5bGVzW3R5cGVdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgalF1ZXJ5KCcudWMtZmluYWwnKS5jc3Modm0uc2F2ZU9iamVjdC51bmZvbGRlZC5zdHlsZXMpO1xuICAgIH07XG5cbiAgICB2bS5jb2xvckFwaSA9IHtcbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uIChhcGksIGNvbG9yLCAkZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBzY2hlbWEgPSB2bS5zYXZlT2JqZWN0OyAgLy8gYSBtb3ZpbmcgcmVmZXJlbmNlIHRvIGludGVybmFsIG9iamVjdHMgd2l0aGluIG9ialxuICAgICAgICAgICAgdmFyIHN0cmluZyA9IGFwaS5nZXRTY29wZSgpLmNvbnRyb2xbMF0uJG5hbWU7XG4gICAgICAgICAgICB2YXIgcExpc3QgPSBzdHJpbmcuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIHZhciBsZW4gPSBwTGlzdC5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbiAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBlbGVtID0gcExpc3RbaV07XG4gICAgICAgICAgICAgICAgaWYgKCFzY2hlbWFbZWxlbV0pIHNjaGVtYVtlbGVtXSA9IHt9XG4gICAgICAgICAgICAgICAgc2NoZW1hID0gc2NoZW1hW2VsZW1dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2NoZW1hW3BMaXN0W2xlbiAtIDFdXSA9IGNvbG9yO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZtLnVuZm9sZGVkQmFja0dyb3VuZENvbG9yQXBpID0ge1xuICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24gKGFwaSwgY29sb3IsICRldmVudCkge1xuICAgICAgICAgICAgdm0uc3R5bGVDaGFuZ2VkKCd1bmZvbGRlZCcsICdiYWNrZ3JvdW5kLWNvbG9yJywgIGNvbG9yKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2bS5mb2xkZWRCYWNrR3JvdW5kQ29sb3JBcGkgPSB7XG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoYXBpLCBjb2xvciwgJGV2ZW50KSB7XG4gICAgICAgICAgICB2bS5zdHlsZUNoYW5nZWQoJ2ZvbGRlZCcsICdiYWNrZ3JvdW5kLWNvbG9yJywgY29sb3IpXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdm0ucmVmcmVzaFByZXZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh2bS5wZm9sZCkge1xuICAgICAgICAgICAgdm0ucGZvbGQuX2Rlc3Ryb3lQZm9sZCgpO1xuICAgICAgICB9XG4gICAgICAgIHZtLnBmb2xkID0galF1ZXJ5KCcjdWMtY29udGFpbmVyJykucGZvbGQoe1xuICAgICAgICAgICAgZWFzaW5nOiAnZWFzZS1pbicsXG4gICAgICAgICAgICBmb2xkczogdm0uc2F2ZU9iamVjdC5mb2xkcy52YWx1ZSxcbiAgICAgICAgICAgIGZvbGRkaXJlY3Rpb246IHZtLnNhdmVPYmplY3QuZm9sZERpcmVjdGlvbnMudmFsdWUsXG4gICAgICAgICAgICBjb250YWluZXJFYXNpbmc6ICdlYXNlLWluJyxcbiAgICAgICAgICAgIGNlbnRlcmVkOiB2bS5zYXZlT2JqZWN0LmNlbnRlcmVkLFxuICAgICAgICAgICAgb3ZlcmxheXM6IHZtLnNhdmVPYmplY3Qub3ZlcmxheXMsXG4gICAgICAgICAgICBjb250YWluZXJTcGVlZEZhY3RvcjogMSxcbiAgICAgICAgICAgIHNwZWVkOiB2bS5zYXZlT2JqZWN0LnNwZWVkLFxuICAgICAgICAgICAgcGVyc3BlY3RpdmU6IHZtLnNhdmVPYmplY3QuZGVwdGhcbiAgICAgICAgfSk7XG4gICAgICAgIGpRdWVyeSgnI3VjLWNvbnRhaW5lciAudnNiYi1wZm9sZC1jbGlja21lJykub2ZmKCdjbGljaycpO1xuICAgICAgICBqUXVlcnkoJyN1Yy1jb250YWluZXIgLnZzYmItcGZvbGQtY2xpY2ttZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZtLnBmb2xkLnVuZm9sZCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgalF1ZXJ5KCcjdWMtY29udGFpbmVyIC52c2JiLXBmb2xkLWNsb3NlJykub2ZmKCdjbGljaycpO1xuICAgICAgICBqUXVlcnkoJyN1Yy1jb250YWluZXIgLnZzYmItcGZvbGQtY2xvc2UnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2bS5wZm9sZC5mb2xkKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgdm0ucmVtb3ZlQmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKCRldmVudCwgc3RhdGUpIHtcbiAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmIChzdGF0ZSA9PT0gJ29wZW4nKSB7XG4gICAgICAgICAgICB2bS5zYXZlT2JqZWN0LmZvbGRlZC5iYWNrZ3JvdW5kSW1nID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2bS5zYXZlT2JqZWN0LnVuZm9sZGVkLmJhY2tncm91bmRJbWcgPSAnJztcbiAgICAgICAgfVxuICAgIH07XG4gICAgdm0uc2V0QmFja2dyb3VuZEltYWdlID0gZnVuY3Rpb24gKCRldmVudCwgc3RhdGUpIHtcbiAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgbWVkaWEgZnJhbWUuXG4gICAgICAgIHZtLmZpbGVGcmFtZSA9IHdwLm1lZGlhLmZyYW1lcy5maWxlX2ZyYW1lID0gd3AubWVkaWEoe1xuICAgICAgICAgICAgdGl0bGU6ICdTZWxlY3QgYSBpbWFnZSB0byB1cGxvYWQnLFxuICAgICAgICAgICAgYnV0dG9uOiB7XG4gICAgICAgICAgICAgICAgdGV4dDogJ1VzZSB0aGlzIGltYWdlJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG11bHRpcGxlOiBmYWxzZVx0Ly8gU2V0IHRvIHRydWUgdG8gYWxsb3cgbXVsdGlwbGUgZmlsZXMgdG8gYmUgc2VsZWN0ZWRcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFdoZW4gYW4gaW1hZ2UgaXMgc2VsZWN0ZWQsIHJ1biBhIGNhbGxiYWNrLlxuICAgICAgICB2bS5maWxlRnJhbWUub24oJ3NlbGVjdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIFdlIHNldCBtdWx0aXBsZSB0byBmYWxzZSBzbyBvbmx5IGdldCBvbmUgaW1hZ2UgZnJvbSB0aGUgdXBsb2FkZXJcbiAgICAgICAgICAgIHZhciBhdHRhY2htZW50ID0gdm0uZmlsZUZyYW1lLnN0YXRlKCkuZ2V0KCdzZWxlY3Rpb24nKS5maXJzdCgpLnRvSlNPTigpO1xuICAgICAgICAgICAgaWYgKHN0YXRlID09PSAnb3BlbicpIHtcbiAgICAgICAgICAgICAgICB2bS5zYXZlT2JqZWN0LmZvbGRlZC5iYWNrZ3JvdW5kSW1nID0gYXR0YWNobWVudC51cmw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZtLnNhdmVPYmplY3QudW5mb2xkZWQuYmFja2dyb3VuZEltZyA9IGF0dGFjaG1lbnQudXJsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gRmluYWxseSwgb3BlbiB0aGUgbW9kYWxcbiAgICAgICAgdm0uZmlsZUZyYW1lLm9wZW4oKTtcblxuICAgIH07XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgalF1ZXJ5KCcudnNiYi1wZm9sZC1jbGlja21lJykucmVtb3ZlQXR0cihcInN0eWxlXCIpLmNzcyh2bS5zYXZlT2JqZWN0LnRyaWdnZXJzLm9wZW4uc3R5bGVzKTtcbiAgICAgICAgdm0ucmVmcmVzaFByZXZpZXcoKTtcbiAgICB9LCAxMDAwKVxuXG4gICAgdm0uc2F2ZSA9IGZ1bmN0aW9uICgkZXZlbnQpIHtcbiAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZzYmJVdGlscy5zYXZlSW5zdGFuY2Uodm0uc2F2ZU9iamVjdCxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAnZnJpZW5kbHlOYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdGcmllbmRseSBOYW1lJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgKTtcbiAgICB9O1xuICAgIC8vbG9hZCBzYXZlZCBpbnN0YW5jZVxuICAgIGlmICgkcm91dGVQYXJhbXMuaWQpIHtcbiAgICAgICAgdm0ubG9hZGVkID0gZmFsc2U7XG4gICAgICAgIHZtLmlkID0gJHJvdXRlUGFyYW1zLmlkO1xuICAgICAgICB2bS5lZGl0aW5nRXhpc3RpbmcgPSB0cnVlO1xuICAgICAgICAkaHR0cCh7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiB3aW5kb3cuYWpheHVybCxcbiAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIGFjdGlvbjogJ3ZzYmJfZ2V0X29uZScsXG4gICAgICAgICAgICAgICAgaWR4OiB2bS5pZFxuICAgICAgICAgICAgfVxuICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgdm0ubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHZtLnNhdmVPYmplY3QgPSBKU09OLnBhcnNlKGRhdGEuc2F2ZV9vYmplY3QpO1xuICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcblxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2bS5sb2FkZWQgPSB0cnVlO1xuICAgICAgICB2bS5lZGl0aW5nRXhpc3RpbmcgPSBmYWxzZTtcbiAgICB9XG5cblxufSk7Il0sImZpbGUiOiJjb250cm9sZWxycy9mb2xkaW5nLnRoZW1lLmNvbnRyb2xsZXIuanMifQ==

vsbbAngularApp.controller('vsbbGridBuilderThemeController', function ($scope, vsbbUtils, $http, $routeParams) {
    var vm = this;
    vm.saveObject = {
        themeId: 'grid',
        themeFriendlyName: 'Grid Builder',
        tp: false,
        friendlyName: '',
        size: {
            v: {},
            h: {}
        },
        gutters: true,
        gridIndex: []
    };
    vm.gridSizes = [
        {name: 2, value: 2},
        {name: 3, value: 3},
        {name: 4, value: 4}
    ];
    vm.saveObject.size.h = angular.copy(vm.gridSizes[1]);
    vm.saveObject.size.v = angular.copy(vm.gridSizes[1]);

    vm.getSavedBoxes = function () {
        $http({
            method: 'GET',
            url: window.ajaxurl,
            params: {
                action: 'vsbb_get_grid_ready',
                idx: $routeParams.id
            }
        }).success(function (data, status, headers, config) {
            vm.savedBoxes = data;
        }).error(function (data, status, headers, config) {

        });
    };
    vm.getSavedBoxes();

    vm.save = function ($event) {
        console.log("vm.saveObject ", vm.saveObject.gridIndex);
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
            console.log("vm.saveObject ", vm.saveObject.gridIndex);
        }).error(function (data, status, headers, config) {

        });
    } else {
        vm.loaded = true;
        vm.editingExisting = false;
    }

    vm.getNumber = function (num) {
        return new Array(num);
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb250cm9sZWxycy9ncmlkQnVpbGRlci50aGVtZS5jb250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZzYmJBbmd1bGFyQXBwLmNvbnRyb2xsZXIoJ3ZzYmJHcmlkQnVpbGRlclRoZW1lQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIHZzYmJVdGlscywgJGh0dHAsICRyb3V0ZVBhcmFtcykge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uc2F2ZU9iamVjdCA9IHtcbiAgICAgICAgdGhlbWVJZDogJ2dyaWQnLFxuICAgICAgICB0aGVtZUZyaWVuZGx5TmFtZTogJ0dyaWQgQnVpbGRlcicsXG4gICAgICAgIHRwOiBmYWxzZSxcbiAgICAgICAgZnJpZW5kbHlOYW1lOiAnJyxcbiAgICAgICAgc2l6ZToge1xuICAgICAgICAgICAgdjoge30sXG4gICAgICAgICAgICBoOiB7fVxuICAgICAgICB9LFxuICAgICAgICBndXR0ZXJzOiB0cnVlLFxuICAgICAgICBncmlkSW5kZXg6IFtdXG4gICAgfTtcbiAgICB2bS5ncmlkU2l6ZXMgPSBbXG4gICAgICAgIHtuYW1lOiAyLCB2YWx1ZTogMn0sXG4gICAgICAgIHtuYW1lOiAzLCB2YWx1ZTogM30sXG4gICAgICAgIHtuYW1lOiA0LCB2YWx1ZTogNH1cbiAgICBdO1xuICAgIHZtLnNhdmVPYmplY3Quc2l6ZS5oID0gYW5ndWxhci5jb3B5KHZtLmdyaWRTaXplc1sxXSk7XG4gICAgdm0uc2F2ZU9iamVjdC5zaXplLnYgPSBhbmd1bGFyLmNvcHkodm0uZ3JpZFNpemVzWzFdKTtcblxuICAgIHZtLmdldFNhdmVkQm94ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRodHRwKHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5hamF4dXJsLFxuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgYWN0aW9uOiAndnNiYl9nZXRfZ3JpZF9yZWFkeScsXG4gICAgICAgICAgICAgICAgaWR4OiAkcm91dGVQYXJhbXMuaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgIHZtLnNhdmVkQm94ZXMgPSBkYXRhO1xuICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcblxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHZtLmdldFNhdmVkQm94ZXMoKTtcblxuICAgIHZtLnNhdmUgPSBmdW5jdGlvbiAoJGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidm0uc2F2ZU9iamVjdCBcIiwgdm0uc2F2ZU9iamVjdC5ncmlkSW5kZXgpO1xuICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdnNiYlV0aWxzLnNhdmVJbnN0YW5jZSh2bS5zYXZlT2JqZWN0LFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICdmcmllbmRseU5hbWUnLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0ZyaWVuZGx5IE5hbWUnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICAvL2xvYWQgc2F2ZWQgaW5zdGFuY2VcbiAgICBpZiAoJHJvdXRlUGFyYW1zLmlkKSB7XG4gICAgICAgIHZtLmxvYWRlZCA9IGZhbHNlO1xuICAgICAgICB2bS5pZCA9ICRyb3V0ZVBhcmFtcy5pZDtcbiAgICAgICAgdm0uZWRpdGluZ0V4aXN0aW5nID0gdHJ1ZTtcbiAgICAgICAgJGh0dHAoe1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogd2luZG93LmFqYXh1cmwsXG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBhY3Rpb246ICd2c2JiX2dldF9vbmUnLFxuICAgICAgICAgICAgICAgIGlkeDogdm0uaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgIHZtLmxvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICB2bS5zYXZlT2JqZWN0ID0gSlNPTi5wYXJzZShkYXRhLnNhdmVfb2JqZWN0KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidm0uc2F2ZU9iamVjdCBcIiwgdm0uc2F2ZU9iamVjdC5ncmlkSW5kZXgpO1xuICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcblxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2bS5sb2FkZWQgPSB0cnVlO1xuICAgICAgICB2bS5lZGl0aW5nRXhpc3RpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB2bS5nZXROdW1iZXIgPSBmdW5jdGlvbiAobnVtKSB7XG4gICAgICAgIHJldHVybiBuZXcgQXJyYXkobnVtKTtcbiAgICB9XG59KTsiXSwiZmlsZSI6ImNvbnRyb2xlbHJzL2dyaWRCdWlsZGVyLnRoZW1lLmNvbnRyb2xsZXIuanMifQ==

vsbbAngularApp.controller('vsbbHistoryController', function ($scope, $http, NgTableParams, vsbbUtils, ngDialog) {
    var vm = this;

    vm.themes = vsbbUtils.getAvailableThemes();
    if (vsbbUtils.legacySupport()) {
        var found = false;
        angular.forEach(vm.themes, function (item, index) {
            if (item.value === -1) {
                found = true;
            }
        });
        if (!found) {
            vm.themes.push({
                value: -1,
                name: 'Legacy'
            });
        }
    }
    vm.selectedTheme = angular.copy(vm.themes[0]);
    vm.listTable = function () {
        vm.tableParams = new NgTableParams({
            page: 1, // show first page
            count: 10 // count per page
        }, {
            filterDelay: 0,
            getData: function (params) {
                return $http({
                    method: 'GET',
                    url: window.ajaxurl,
                    params: {
                        action: 'vsbb_get_all',
                        theme: vm.selectedTheme.value
                    }
                }).success(function (data, status, headers, config) {
                    params.total(data);
                    return data;


                }).error(function (data, status, headers, config) {

                });
            }
        });
    };
    vm.listTable();

    vm.deleteItem = function (idx) {
        vsbbUtils.deleteItem(idx).success(function () {
            vm.listTable();
        });
    };

    vm.delete = function ($event, idx) {
        $event.preventDefault();
        ngDialog.open({
            template: vsbbGlobalVars.partials + '/dialogs/result.html',
            className: 'ngdialog-theme-default vsbb-warning-dialog',
            data: {
                heading: 'Delete',
                body: {
                    mainText: 'Are you sure you want to delete this item?'
                },
                footer: {
                    mainCtaText: 'Delete',
                    subCtaText: 'Cancel',
                    mainCta: function () {
                        ngDialog.close();
                        vm.deleteItem(idx);
                    },
                    subCta: function () {
                        ngDialog.close()
                    }
                }
            }
        });
    };

    vm.themeChanged = function (selected) {
        vm.listTable(selected.value);
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb250cm9sZWxycy9oaXN0b3J5LmNvbnRyb2xsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsidnNiYkFuZ3VsYXJBcHAuY29udHJvbGxlcigndnNiYkhpc3RvcnlDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsIE5nVGFibGVQYXJhbXMsIHZzYmJVdGlscywgbmdEaWFsb2cpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0udGhlbWVzID0gdnNiYlV0aWxzLmdldEF2YWlsYWJsZVRoZW1lcygpO1xuICAgIGlmICh2c2JiVXRpbHMubGVnYWN5U3VwcG9ydCgpKSB7XG4gICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2godm0udGhlbWVzLCBmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChpdGVtLnZhbHVlID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgIHZtLnRoZW1lcy5wdXNoKHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogLTEsXG4gICAgICAgICAgICAgICAgbmFtZTogJ0xlZ2FjeSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHZtLnNlbGVjdGVkVGhlbWUgPSBhbmd1bGFyLmNvcHkodm0udGhlbWVzWzBdKTtcbiAgICB2bS5saXN0VGFibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZtLnRhYmxlUGFyYW1zID0gbmV3IE5nVGFibGVQYXJhbXMoe1xuICAgICAgICAgICAgcGFnZTogMSwgLy8gc2hvdyBmaXJzdCBwYWdlXG4gICAgICAgICAgICBjb3VudDogMTAgLy8gY291bnQgcGVyIHBhZ2VcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgZmlsdGVyRGVsYXk6IDAsXG4gICAgICAgICAgICBnZXREYXRhOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB3aW5kb3cuYWpheHVybCxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICd2c2JiX2dldF9hbGwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhlbWU6IHZtLnNlbGVjdGVkVGhlbWUudmFsdWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy50b3RhbChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG5cblxuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgdm0ubGlzdFRhYmxlKCk7XG5cbiAgICB2bS5kZWxldGVJdGVtID0gZnVuY3Rpb24gKGlkeCkge1xuICAgICAgICB2c2JiVXRpbHMuZGVsZXRlSXRlbShpZHgpLnN1Y2Nlc3MoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdm0ubGlzdFRhYmxlKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2bS5kZWxldGUgPSBmdW5jdGlvbiAoJGV2ZW50LCBpZHgpIHtcbiAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgdGVtcGxhdGU6IHZzYmJHbG9iYWxWYXJzLnBhcnRpYWxzICsgJy9kaWFsb2dzL3Jlc3VsdC5odG1sJyxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQgdnNiYi13YXJuaW5nLWRpYWxvZycsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgaGVhZGluZzogJ0RlbGV0ZScsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgICBtYWluVGV4dDogJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBpdGVtPydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZvb3Rlcjoge1xuICAgICAgICAgICAgICAgICAgICBtYWluQ3RhVGV4dDogJ0RlbGV0ZScsXG4gICAgICAgICAgICAgICAgICAgIHN1YkN0YVRleHQ6ICdDYW5jZWwnLFxuICAgICAgICAgICAgICAgICAgICBtYWluQ3RhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZ0RpYWxvZy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uZGVsZXRlSXRlbShpZHgpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzdWJDdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nRGlhbG9nLmNsb3NlKClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZtLnRoZW1lQ2hhbmdlZCA9IGZ1bmN0aW9uIChzZWxlY3RlZCkge1xuICAgICAgICB2bS5saXN0VGFibGUoc2VsZWN0ZWQudmFsdWUpO1xuICAgIH07XG59KTsiXSwiZmlsZSI6ImNvbnRyb2xlbHJzL2hpc3RvcnkuY29udHJvbGxlci5qcyJ9

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb250cm9sZWxycy9pbWFnZUNhcHRpb24udGhlbWUuY29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2c2JiQW5ndWxhckFwcC5jb250cm9sbGVyKCd2c2JiSW1hZ2VDYXB0aW9uVGhlbWVDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJHdpbmRvdywgdnNiYlV0aWxzLCAkc2NlLCAkaHR0cCwgbmdEaWFsb2csICRyb3V0ZVBhcmFtcykge1xuICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAkaHR0cCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHVybDogd2luZG93LmFqYXh1cmwsXG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgYWN0aW9uOiAndnNiYl9nZXRfYWxsJyxcbiAgICAgICAgICAgIHRoZW1lOiAnbW9kYWwnXG4gICAgICAgIH1cbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICB2bS5tb2RhbHMgPSBkYXRhO1xuICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuXG4gICAgfSk7XG4gICAgdm0uc2F2ZU9iamVjdCA9IHtcbiAgICAgICAgdGhlbWVJZDogJ2ltYWdlX2NhcHRpb24nLFxuICAgICAgICB0aGVtZUZyaWVuZGx5TmFtZTogJ0ltYWdlIENhcHRpb24nLFxuICAgICAgICB0cDogZmFsc2UsXG4gICAgICAgIGZyaWVuZGx5TmFtZTogJycsXG4gICAgICAgIHBmczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGY6IFsncG9zaXRpb25pbmcnLCAncmVzcG9uc2l2ZSddLFxuICAgICAgICAgICAgICAgIHJlbmRlcjoge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICdyZXBsYWNlJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsOiBmYWxzZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgaGVhZGluZzogJ0hPVkVSIE1FJyxcbiAgICAgICAgbWFpbkNvbnRlbnQ6ICc8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyO1wiPkEgd29uZGVyZnVsIHNlcmVuaXR5IGhhcyB0YWtlbiBwb3NzZXNzaW9uIG9mIG15IGVudGlyZSBzb3VsLCBsaWtlIHRoZXNlIHN3ZWV0IG1vcm5pbmdzIG9mIHNwcmluZyB3aGljaCBJIGVuam95IHdpdGggbXkgd2hvbGUgaGVhcnQuPC9kaXY+JyxcbiAgICAgICAgcG9zaXRpb25pbmc6IHtcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IGZhbHNlLFxuICAgICAgICAgICAgZ3V0dGVyczogdHJ1ZSxcbiAgICAgICAgICAgIHByZXNlcnZlUmF0aW86IGZhbHNlLFxuICAgICAgICAgICAgcmVzcG9uc2l2ZUNsYXNzOiAndnNiYi1ncmlkX19jb2wtLTEyLW9mLTEyJ1xuICAgICAgICB9LFxuICAgICAgICBmaW5hbDoge1xuICAgICAgICAgICAgbGluazoge1xuICAgICAgICAgICAgICAgIHVybDogJ2h0dHBzOi8vd2VidHJpY2tzYW5kdHJlYXRzLmNvbS8nLFxuICAgICAgICAgICAgICAgIG5ld1RhYjogZmFsc2UsXG4gICAgICAgICAgICAgICAgc3R5bGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kLWNvbG9yJzogJyMwMDAwMDAnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0xlYXJuIE1vcmUnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGVhZGluZzoge1xuICAgICAgICAgICAgICAgIHN0eWxlczoge1xuICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjMDAwMDAwJyxcbiAgICAgICAgICAgICAgICAgICAgJ2JvcmRlci1jb2xvcic6ICcjMDAwMDAwJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoZWFkaW5nQ29sb3JTY2hlbWVSYXc6ICcjMDAwMDAwJyxcbiAgICAgICAgICAgIGhlYWRpbmdDb2xvclNjaGVtZVJhdzI6ICcjJyxcbiAgICAgICAgICAgIGxpbmtDb2xvclNjaGVtZVJhdzogJyMwMDAwMDAnXG4gICAgICAgIH0sXG4gICAgICAgIG1hc2s6IHtcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvclJhdzogJyM3Nzc3NzcnLFxuICAgICAgICAgICAgc3R5bGVzOiB7XG4gICAgICAgICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnIzc3Nzc3NydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaW5pdGlhbDoge1xuICAgICAgICAgICAgYmFja2dyb3VuZEltZzogdnNiYlV0aWxzLmdldFB1YmxpY1Jvb3RVcmwoKSArICcvaW1hZ2VzL3ZzYmJfaW1hZ2UxLmpwZycsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3JSYXc6ICcjMDAwMDAwJyxcbiAgICAgICAgICAgIGJvcmRlckNvbG9yUmF3OiAnI2ZmZmZmZicsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXNSYXc6IDAsXG4gICAgICAgICAgICBib3JkZXJTdHlsZVJhdzoge30sXG4gICAgICAgICAgICBzdHlsZXM6IHtcbiAgICAgICAgICAgICAgICAnYm9yZGVyLXJhZGl1cyc6IDAsXG4gICAgICAgICAgICAgICAgJy13ZWJraXQtYm9yZGVyLXJhZGl1cyc6IDAsXG4gICAgICAgICAgICAgICAgJy1tb3otYm9yZGVyLXJhZGl1cyc6IDAsXG4gICAgICAgICAgICAgICAgJ2JvcmRlci13aWR0aCc6ICcxMHB4JyxcbiAgICAgICAgICAgICAgICAnYmFja2dyb3VuZC1jb2xvcic6ICcjMDAwMDAwJyxcbiAgICAgICAgICAgICAgICAnYm9yZGVyLXN0eWxlJzogJ3NvbGlkJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzQwMHB4JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcyMjBweCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYzJhOiB7XG4gICAgICAgICAgICBmaW5hbDoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdsaW5rJyxcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogJ2J1dHRvbicsXG4gICAgICAgICAgICAgICAgbW9kYWw6IHt9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZtLnNsaWRlck9wdGlvbnMgPSB7XG4gICAgICAgIGZsb29yOiAwLFxuICAgICAgICBjZWlsOiAxMDAsXG4gICAgICAgIC8vaGlkZVBvaW50ZXJMYWJlbHM6IHRydWUsXG4gICAgICAgIGhpZGVMaW1pdExhYmVsczogdHJ1ZSxcbiAgICAgICAgdHJhbnNsYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSArICclJztcbiAgICAgICAgfSxcbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uIChzbGlkZXJJZCwgbW9kZWxWYWx1ZSwgaGlnaFZhbHVlLCBwb2ludGVyVHlwZSkge1xuICAgICAgICAgICAgdm0uc2F2ZU9iamVjdC5pbml0aWFsLnN0eWxlc1snYm9yZGVyLXJhZGl1cyddID0gbW9kZWxWYWx1ZSArICclJztcbiAgICAgICAgICAgIHZtLnNhdmVPYmplY3QuaW5pdGlhbC5zdHlsZXNbJy13ZWJraXQtYm9yZGVyLXJhZGl1cyddID0gbW9kZWxWYWx1ZSArICclJztcbiAgICAgICAgICAgIHZtLnNhdmVPYmplY3QuaW5pdGlhbC5zdHlsZXNbJy1tb3otYm9yZGVyLXJhZGl1cyddID0gbW9kZWxWYWx1ZSArICclJztcbiAgICAgICAgfVxuICAgIH07XG4gICAgdm0uYm9yZGVyT3B0cyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdub25lJyxcbiAgICAgICAgICAgIG5hbWU6ICdOb25lJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogJ3NvbGlkJyxcbiAgICAgICAgICAgIG5hbWU6ICdTb2xpZCdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICdkYXNoZWQnLFxuICAgICAgICAgICAgbmFtZTogJ0Rhc2hlZCdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICdkb3R0ZWQnLFxuICAgICAgICAgICAgbmFtZTogJ0RvdHRlZCdcbiAgICAgICAgfVxuICAgIF07XG4gICAgdm0uc2F2ZU9iamVjdC5pbml0aWFsLmJvcmRlclN0eWxlUmF3ID0gYW5ndWxhci5jb3B5KHZtLmJvcmRlck9wdHNbMV0pO1xuICAgIHZtLmhvdmVyRWZmZWN0cyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICcxJyxcbiAgICAgICAgICAgIG5hbWU6ICdFbGVnYW50JyxcbiAgICAgICAgICAgIHR5cGU6IDFcbiAgICAgICAgfSxcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgdmFsdWU6ICcyJyxcbiAgICAgICAgLy8gICAgIG5hbWU6ICdTaWRlIFdheScsXG4gICAgICAgIC8vICAgICB0eXBlOiAyXG4gICAgICAgIC8vIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlOiAnMycsXG4gICAgICAgICAgICBuYW1lOiAnUm90YXRpb24nLFxuICAgICAgICAgICAgdHlwZTogMVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJzQnLFxuICAgICAgICAgICAgbmFtZTogJ0ZhZGVkJyxcbiAgICAgICAgICAgIHR5cGU6IDJcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICc2JyxcbiAgICAgICAgICAgIG5hbWU6ICdPcGFxdWUnLFxuICAgICAgICAgICAgdHlwZTogMlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICB2YWx1ZTogJzcnLFxuICAgICAgICAgICAgbmFtZTogJ1NsaWRlIFVwJyxcbiAgICAgICAgICAgIHR5cGU6IDJcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgdmFsdWU6ICc5JyxcbiAgICAgICAgICAgIG5hbWU6ICdGYW5jeScsXG4gICAgICAgICAgICB0eXBlOiAxXG4gICAgICAgIH1cbiAgICBdO1xuICAgIHZtLnNhdmVPYmplY3QuaG92ZXJFZmZlY3QgPSBhbmd1bGFyLmNvcHkodm0uaG92ZXJFZmZlY3RzWzRdKTtcbiAgICB2bS5zaG93SG92ZXJTdGF0ZSA9IGZ1bmN0aW9uICgkZXZlbnQpIHtcbiAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGpRdWVyeSgnLnZzYmItaW1hZ2UtY2FwdGlvbi12aWV3JykudG9nZ2xlQ2xhc3MoXCJ2c2JiLWhvdmVyaW5nXCIpXG4gICAgfTtcbiAgICB2bS5jb2xvckFwaSA9IHtcbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uIChhcGksIGNvbG9yLCAkZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBzY2hlbWEgPSB2bS5zYXZlT2JqZWN0OyAgLy8gYSBtb3ZpbmcgcmVmZXJlbmNlIHRvIGludGVybmFsIG9iamVjdHMgd2l0aGluIG9ialxuICAgICAgICAgICAgdmFyIHN0cmluZyA9IGFwaS5nZXRTY29wZSgpLmNvbnRyb2xbMF0uJG5hbWU7XG4gICAgICAgICAgICB2YXIgcExpc3QgPSBzdHJpbmcuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIHZhciBsZW4gPSBwTGlzdC5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbiAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBlbGVtID0gcExpc3RbaV07XG4gICAgICAgICAgICAgICAgaWYgKCFzY2hlbWFbZWxlbV0pIHNjaGVtYVtlbGVtXSA9IHt9XG4gICAgICAgICAgICAgICAgc2NoZW1hID0gc2NoZW1hW2VsZW1dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2NoZW1hW3BMaXN0W2xlbiAtIDFdXSA9IGNvbG9yO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB2bS5ib3JkZXJTdHlsZUNoYW5nZWQgPSBmdW5jdGlvbiAoc2VsZWN0ZWQpIHtcbiAgICAgICAgdm0uc2F2ZU9iamVjdC5pbml0aWFsLnN0eWxlc1snYm9yZGVyLXN0eWxlJ10gPSBzZWxlY3RlZC52YWx1ZTtcbiAgICB9O1xuICAgIHZtLnNhdmUgPSBmdW5jdGlvbiAoJGV2ZW50KSB7XG4gICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2c2JiVXRpbHMuc2F2ZUluc3RhbmNlKHZtLnNhdmVPYmplY3QsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJ2ZyaWVuZGx5TmFtZScsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnRnJpZW5kbHkgTmFtZSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICk7XG4gICAgfTtcbiAgICAvL2xvYWQgc2F2ZWQgaW5zdGFuY2VcbiAgICBpZiAoJHJvdXRlUGFyYW1zLmlkKSB7XG4gICAgICAgIHZtLmlkID0gJHJvdXRlUGFyYW1zLmlkO1xuICAgICAgICB2bS5sb2FkZWQgPSBmYWxzZTtcbiAgICAgICAgdm0uZWRpdGluZ0V4aXN0aW5nID0gdHJ1ZTtcbiAgICAgICAgJGh0dHAoe1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHVybDogd2luZG93LmFqYXh1cmwsXG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBhY3Rpb246ICd2c2JiX2dldF9vbmUnLFxuICAgICAgICAgICAgICAgIGlkeDogdm0uaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgIHZtLmxvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICB2bS5zYXZlT2JqZWN0ID0gSlNPTi5wYXJzZShkYXRhLnNhdmVfb2JqZWN0KTtcbiAgICAgICAgICAgIGlmICghdm0uc2F2ZU9iamVjdC5jMmEpIHtcbiAgICAgICAgICAgICAgICB2bS5zYXZlT2JqZWN0LmMyYSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZmluYWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdsaW5rJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiAnYnV0dG9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGFsOiB7fVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcblxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2bS5sb2FkZWQgPSB0cnVlO1xuICAgICAgICB2bS5lZGl0aW5nRXhpc3RpbmcgPSBmYWxzZTtcbiAgICB9XG4gICAgdm0udHJpZ2dlck1vZGFsID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICRodHRwKHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5hamF4dXJsLFxuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgYWN0aW9uOiAndnNiYl9nZXRfb25lJyxcbiAgICAgICAgICAgICAgICBpZHg6IGlkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICB2bS5tb2RhbEl0ZW0gPSBKU09OLnBhcnNlKGRhdGEuc2F2ZV9vYmplY3QpO1xuICAgICAgICAgICAgaWYgKHZtLm1vZGFsSXRlbS5tb2RhbFNldHRpbmdzLmRhdGEuaWZyYW1lKSB7XG4gICAgICAgICAgICAgICAgdm0ubW9kYWxJdGVtLm1vZGFsU2V0dGluZ3MuZGF0YS5pZnJhbWVVUkxUcnVzdGVkID0gJHNjZS50cnVzdEFzUmVzb3VyY2VVcmwodm0ubW9kYWxJdGVtLm1vZGFsU2V0dGluZ3MuZGF0YS5pZnJhbWVVUkwpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHZtLm1vZGFsSXRlbS5tb2RhbFNldHRpbmdzKTtcbiAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG5cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZtLmN0YU1hc2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh2bS5zYXZlT2JqZWN0LmMyYS5maW5hbC5jYXRlZ29yeSA9PT0gJ21hc2snKSB7XG4gICAgICAgICAgICBpZiAodm0uc2F2ZU9iamVjdC5jMmEuZmluYWwudHlwZSA9PT0gJ2xpbmsnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZtLnNhdmVPYmplY3QuZmluYWwubGluay5uZXdUYWIpIHtcbiAgICAgICAgICAgICAgICAgICAgJHdpbmRvdy5vcGVuKHZtLnNhdmVPYmplY3QuZmluYWwubGluay51cmwsICdfYmxhbmsnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkd2luZG93LmxvY2F0aW9uLmhyZWYgPSB2bS5zYXZlT2JqZWN0LmZpbmFsLmxpbmsudXJsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodm0uc2F2ZU9iamVjdC5jMmEuZmluYWwudHlwZSA9PT0gJ21vZGFsJykge1xuICAgICAgICAgICAgICAgIHZtLnRyaWdnZXJNb2RhbCh2bS5zYXZlT2JqZWN0LmMyYS5maW5hbC5tb2RhbC5pZHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7Il0sImZpbGUiOiJjb250cm9sZWxycy9pbWFnZUNhcHRpb24udGhlbWUuY29udHJvbGxlci5qcyJ9

vsbbAngularApp.controller('vsbbLegacyThemeController', function () {
    var vm = this;
    vm.saveObject = {
        theme: 'Legacy',
        color: '#000000'
    };

});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb250cm9sZWxycy9sZWdhY3kudGhlbWUuY29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2c2JiQW5ndWxhckFwcC5jb250cm9sbGVyKCd2c2JiTGVnYWN5VGhlbWVDb250cm9sbGVyJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uc2F2ZU9iamVjdCA9IHtcbiAgICAgICAgdGhlbWU6ICdMZWdhY3knLFxuICAgICAgICBjb2xvcjogJyMwMDAwMDAnXG4gICAgfTtcblxufSk7Il0sImZpbGUiOiJjb250cm9sZWxycy9sZWdhY3kudGhlbWUuY29udHJvbGxlci5qcyJ9

vsbbAngularApp.controller('vsbbModalThemeController', function ($scope, $sce, $window, vsbbUtils, $http, ngDialog, $routeParams) {
    var vm = this;

    vsbbUtils.getModals().success(function (results) {
        vm.modals = results;
    });
    vm.saveObject = {
        themeId: 'modal',
        themeFriendlyName: 'Modal Popup',
        tp: true,
        friendlyName: '',
        modalSettings: {
            triggerText: 'Preview modal',
            className: 'ngdialog-theme-default',
            template: vsbbGlobalVars.partials + '/dialogs/modal-theme.html',
            data: {
                heading: 'Details',
                body: {
                    mainText: 'Lorem iusmod tempor incididunt.',
                    subText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
                },
                footer: {
                    mainCtaText: 'OK',
                    mainCtaLink: '',
                    subCtaText: 'Cancel'
                },
                loaderImage: vsbbUtils.getPublicRootUrl() + 'images/loading.gif',
                iframe: false,
                iframeURL: 'https://webtricksandtreats.com/'
            }
        }

    };
    vm.iframeSettingsChanged = function () {
        if (vm.saveObject.modalSettings.data.iframe) {
            vm.saveObject.modalSettings.className = 'ngdialog-theme-default vsbb-iframe-dialog';
        } else {
            vm.saveObject.modalSettings.className = 'ngdialog-theme-default';
        }
    };
    vm.modalStyle = {
        name: 'Plain',
        value: 'ngdialog-theme-default'
    };
    vm.modalStyleChanged = function (selected) {
        vm.saveObject.modalSettings.className = selected.value;
    };
    vm.modalStyles = [
        {
            name: 'Plain',
            value: 'ngdialog-theme-default'
        },
        {
            name: 'Success',
            value: 'ngdialog-theme-default vsbb-success-dialog'
        },
        {
            name: 'Fail',
            value: 'ngdialog-theme-default vsbb-fail-dialog'
        },
        {
            name: 'Warming',
            value: 'ngdialog-theme-default vsbb-warning-dialog'
        }
    ];
    vm.previewModal = function () {
        if (vm.saveObject.modalSettings.data.iframe) {
            vm.saveObject.modalSettings.data.iframeURLTrusted = $sce.trustAsResourceUrl(vm.saveObject.modalSettings.data.iframeURL);
        }
        $scope.dialog = ngDialog.open(vm.saveObject.modalSettings);
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

        }).error(function (data, status, headers, config) {

        });
    } else {
        vm.loaded = true;
        vm.editingExisting = false;
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb250cm9sZWxycy9tb2RhbC50aGVtZS5jb250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZzYmJBbmd1bGFyQXBwLmNvbnRyb2xsZXIoJ3ZzYmJNb2RhbFRoZW1lQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRzY2UsICR3aW5kb3csIHZzYmJVdGlscywgJGh0dHAsIG5nRGlhbG9nLCAkcm91dGVQYXJhbXMpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdnNiYlV0aWxzLmdldE1vZGFscygpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdHMpIHtcbiAgICAgICAgdm0ubW9kYWxzID0gcmVzdWx0cztcbiAgICB9KTtcbiAgICB2bS5zYXZlT2JqZWN0ID0ge1xuICAgICAgICB0aGVtZUlkOiAnbW9kYWwnLFxuICAgICAgICB0aGVtZUZyaWVuZGx5TmFtZTogJ01vZGFsIFBvcHVwJyxcbiAgICAgICAgdHA6IHRydWUsXG4gICAgICAgIGZyaWVuZGx5TmFtZTogJycsXG4gICAgICAgIG1vZGFsU2V0dGluZ3M6IHtcbiAgICAgICAgICAgIHRyaWdnZXJUZXh0OiAnUHJldmlldyBtb2RhbCcsXG4gICAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0JyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiB2c2JiR2xvYmFsVmFycy5wYXJ0aWFscyArICcvZGlhbG9ncy9tb2RhbC10aGVtZS5odG1sJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBoZWFkaW5nOiAnRGV0YWlscycsXG4gICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgICBtYWluVGV4dDogJ0xvcmVtIGl1c21vZCB0ZW1wb3IgaW5jaWRpZHVudC4nLFxuICAgICAgICAgICAgICAgICAgICBzdWJUZXh0OiAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdCwgc2VkIGRvIGVpdXNtb2QgdGVtcG9yIGluY2lkaWR1bnQgdXQgbGFib3JlIGV0IGRvbG9yZSBtYWduYSBhbGlxdWEuICdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZvb3Rlcjoge1xuICAgICAgICAgICAgICAgICAgICBtYWluQ3RhVGV4dDogJ09LJyxcbiAgICAgICAgICAgICAgICAgICAgbWFpbkN0YUxpbms6ICcnLFxuICAgICAgICAgICAgICAgICAgICBzdWJDdGFUZXh0OiAnQ2FuY2VsJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbG9hZGVySW1hZ2U6IHZzYmJVdGlscy5nZXRQdWJsaWNSb290VXJsKCkgKyAnaW1hZ2VzL2xvYWRpbmcuZ2lmJyxcbiAgICAgICAgICAgICAgICBpZnJhbWU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGlmcmFtZVVSTDogJ2h0dHBzOi8vd2VidHJpY2tzYW5kdHJlYXRzLmNvbS8nXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH07XG4gICAgdm0uaWZyYW1lU2V0dGluZ3NDaGFuZ2VkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodm0uc2F2ZU9iamVjdC5tb2RhbFNldHRpbmdzLmRhdGEuaWZyYW1lKSB7XG4gICAgICAgICAgICB2bS5zYXZlT2JqZWN0Lm1vZGFsU2V0dGluZ3MuY2xhc3NOYW1lID0gJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQgdnNiYi1pZnJhbWUtZGlhbG9nJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLnNhdmVPYmplY3QubW9kYWxTZXR0aW5ncy5jbGFzc05hbWUgPSAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCc7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZtLm1vZGFsU3R5bGUgPSB7XG4gICAgICAgIG5hbWU6ICdQbGFpbicsXG4gICAgICAgIHZhbHVlOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCdcbiAgICB9O1xuICAgIHZtLm1vZGFsU3R5bGVDaGFuZ2VkID0gZnVuY3Rpb24gKHNlbGVjdGVkKSB7XG4gICAgICAgIHZtLnNhdmVPYmplY3QubW9kYWxTZXR0aW5ncy5jbGFzc05hbWUgPSBzZWxlY3RlZC52YWx1ZTtcbiAgICB9O1xuICAgIHZtLm1vZGFsU3R5bGVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnUGxhaW4nLFxuICAgICAgICAgICAgdmFsdWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnU3VjY2VzcycsXG4gICAgICAgICAgICB2YWx1ZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQgdnNiYi1zdWNjZXNzLWRpYWxvZydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ0ZhaWwnLFxuICAgICAgICAgICAgdmFsdWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0IHZzYmItZmFpbC1kaWFsb2cnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdXYXJtaW5nJyxcbiAgICAgICAgICAgIHZhbHVlOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCB2c2JiLXdhcm5pbmctZGlhbG9nJ1xuICAgICAgICB9XG4gICAgXTtcbiAgICB2bS5wcmV2aWV3TW9kYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh2bS5zYXZlT2JqZWN0Lm1vZGFsU2V0dGluZ3MuZGF0YS5pZnJhbWUpIHtcbiAgICAgICAgICAgIHZtLnNhdmVPYmplY3QubW9kYWxTZXR0aW5ncy5kYXRhLmlmcmFtZVVSTFRydXN0ZWQgPSAkc2NlLnRydXN0QXNSZXNvdXJjZVVybCh2bS5zYXZlT2JqZWN0Lm1vZGFsU2V0dGluZ3MuZGF0YS5pZnJhbWVVUkwpO1xuICAgICAgICB9XG4gICAgICAgICRzY29wZS5kaWFsb2cgPSBuZ0RpYWxvZy5vcGVuKHZtLnNhdmVPYmplY3QubW9kYWxTZXR0aW5ncyk7XG4gICAgfTtcbiAgICB2bS5zYXZlID0gZnVuY3Rpb24gKCRldmVudCkge1xuICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdnNiYlV0aWxzLnNhdmVJbnN0YW5jZSh2bS5zYXZlT2JqZWN0LFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICdmcmllbmRseU5hbWUnLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0ZyaWVuZGx5IE5hbWUnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgIH07XG4gICAgLy9sb2FkIHNhdmVkIGluc3RhbmNlXG4gICAgaWYgKCRyb3V0ZVBhcmFtcy5pZCkge1xuICAgICAgICB2bS5pZCA9ICRyb3V0ZVBhcmFtcy5pZDtcbiAgICAgICAgdm0ubG9hZGVkID0gZmFsc2U7XG4gICAgICAgIHZtLmVkaXRpbmdFeGlzdGluZyA9IHRydWU7XG4gICAgICAgICRodHRwKHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5hamF4dXJsLFxuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgYWN0aW9uOiAndnNiYl9nZXRfb25lJyxcbiAgICAgICAgICAgICAgICBpZHg6IHZtLmlkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICB2bS5sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgdm0uc2F2ZU9iamVjdCA9IEpTT04ucGFyc2UoZGF0YS5zYXZlX29iamVjdCk7XG5cbiAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG5cbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdm0ubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgdm0uZWRpdGluZ0V4aXN0aW5nID0gZmFsc2U7XG4gICAgfVxufSk7Il0sImZpbGUiOiJjb250cm9sZWxycy9tb2RhbC50aGVtZS5jb250cm9sbGVyLmpzIn0=

vsbbAngularApp.controller('vsbbModalTriggerController', function ($scope, $sce, $http, ngDialog) {
    var vm = this;
    vm.triggerModal = function (id) {
        $http({
            method: 'GET',
            url: window.ajaxurl,
            params: {
                action: 'vsbb_get_one',
                idx: id
            }
        }).success(function (data, status, headers, config) {
            vm.savedObject = JSON.parse(data.save_object);
            if(vm.savedObject.modalSettings.data.iframe){
                vm.savedObject.modalSettings.data.iframeURLTrusted= $sce.trustAsResourceUrl(vm.savedObject.modalSettings.data.iframeURL)
            }
            ngDialog.open(vm.savedObject.modalSettings);
        }).error(function (data, status, headers, config) {

        });
    };
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb250cm9sZWxycy9tb2RhbC50cmlnZ2VyLmNvbnRyb2xsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsidnNiYkFuZ3VsYXJBcHAuY29udHJvbGxlcigndnNiYk1vZGFsVHJpZ2dlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkc2NlLCAkaHR0cCwgbmdEaWFsb2cpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLnRyaWdnZXJNb2RhbCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAkaHR0cCh7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiB3aW5kb3cuYWpheHVybCxcbiAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIGFjdGlvbjogJ3ZzYmJfZ2V0X29uZScsXG4gICAgICAgICAgICAgICAgaWR4OiBpZFxuICAgICAgICAgICAgfVxuICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgdm0uc2F2ZWRPYmplY3QgPSBKU09OLnBhcnNlKGRhdGEuc2F2ZV9vYmplY3QpO1xuICAgICAgICAgICAgaWYodm0uc2F2ZWRPYmplY3QubW9kYWxTZXR0aW5ncy5kYXRhLmlmcmFtZSl7XG4gICAgICAgICAgICAgICAgdm0uc2F2ZWRPYmplY3QubW9kYWxTZXR0aW5ncy5kYXRhLmlmcmFtZVVSTFRydXN0ZWQ9ICRzY2UudHJ1c3RBc1Jlc291cmNlVXJsKHZtLnNhdmVkT2JqZWN0Lm1vZGFsU2V0dGluZ3MuZGF0YS5pZnJhbWVVUkwpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHZtLnNhdmVkT2JqZWN0Lm1vZGFsU2V0dGluZ3MpO1xuICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcblxuICAgICAgICB9KTtcbiAgICB9O1xufSk7XG4iXSwiZmlsZSI6ImNvbnRyb2xlbHJzL21vZGFsLnRyaWdnZXIuY29udHJvbGxlci5qcyJ9

vsbbAngularApp.controller('vsbbMyVsbbController', function ($scope, $http, $timeout, ngDialog, vsbbUtils) {
    var vm = this;
    vm.license = null;
    vm.isValidLicense = vsbbUtils.getPaidVersion();
    vm.newFeaturesExpand = false;
    vm.improvedFeaturesExpand = false;
    vm.legacySupportExpand = false;

    vm.validateLicense = function () {
        if (vm.license !== null && vm.license !== '') {
            vsbbUtils.validateUserLicense(vm.license).success(function (result) {
                if (result.status === 'success') {
                    ngDialog.open({
                        template: vsbbGlobalVars.partials + '/dialogs/result.html',
                        className: 'ngdialog-theme-default vsbb-success-dialog',
                        data: {
                            heading: 'Successful',
                            body: {
                                subText: 'License: ' + vm.license + ' was successfully validated!'
                            }
                        }
                    });
                    vm.isValidLicense = true;
                    $timeout(function () {
                        ngDialog.close()
                    }, 2000);
                } else {
                    ngDialog.open({
                        template: vsbbGlobalVars.partials + '/dialogs/paid-only.html',
                        className: 'ngdialog-theme-default vsbb-warning-dialog',
                        data: {
                            heading: 'Hmmmm....',
                            body: {
                                mainText: 'Please input a VALID license',
                                subText: 'Failed to validate license: ' + vm.license
                            }
                        }
                    });
                }
            });
        }
    };
    vm.getPublicRootUrl = function () {
        return vsbbUtils.getPublicRootUrl();
    };
    $http({
        method: 'GET',
        url: window.ajaxurl,
        params: {
            action: 'vsbb_get_license'
        }
    }).success(function (data, status, headers, config) {
        vm.license = data;
    }).error(function (data, status, headers, config) {

    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb250cm9sZWxycy9teXZzYmIuY29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2c2JiQW5ndWxhckFwcC5jb250cm9sbGVyKCd2c2JiTXlWc2JiQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkdGltZW91dCwgbmdEaWFsb2csIHZzYmJVdGlscykge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0ubGljZW5zZSA9IG51bGw7XG4gICAgdm0uaXNWYWxpZExpY2Vuc2UgPSB2c2JiVXRpbHMuZ2V0UGFpZFZlcnNpb24oKTtcbiAgICB2bS5uZXdGZWF0dXJlc0V4cGFuZCA9IGZhbHNlO1xuICAgIHZtLmltcHJvdmVkRmVhdHVyZXNFeHBhbmQgPSBmYWxzZTtcbiAgICB2bS5sZWdhY3lTdXBwb3J0RXhwYW5kID0gZmFsc2U7XG5cbiAgICB2bS52YWxpZGF0ZUxpY2Vuc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh2bS5saWNlbnNlICE9PSBudWxsICYmIHZtLmxpY2Vuc2UgIT09ICcnKSB7XG4gICAgICAgICAgICB2c2JiVXRpbHMudmFsaWRhdGVVc2VyTGljZW5zZSh2bS5saWNlbnNlKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IHZzYmJHbG9iYWxWYXJzLnBhcnRpYWxzICsgJy9kaWFsb2dzL3Jlc3VsdC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQgdnNiYi1zdWNjZXNzLWRpYWxvZycsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGluZzogJ1N1Y2Nlc3NmdWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViVGV4dDogJ0xpY2Vuc2U6ICcgKyB2bS5saWNlbnNlICsgJyB3YXMgc3VjY2Vzc2Z1bGx5IHZhbGlkYXRlZCEnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdm0uaXNWYWxpZExpY2Vuc2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZ0RpYWxvZy5jbG9zZSgpXG4gICAgICAgICAgICAgICAgICAgIH0sIDIwMDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IHZzYmJHbG9iYWxWYXJzLnBhcnRpYWxzICsgJy9kaWFsb2dzL3BhaWQtb25seS5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQgdnNiYi13YXJuaW5nLWRpYWxvZycsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGluZzogJ0htbW1tLi4uLicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluVGV4dDogJ1BsZWFzZSBpbnB1dCBhIFZBTElEIGxpY2Vuc2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJUZXh0OiAnRmFpbGVkIHRvIHZhbGlkYXRlIGxpY2Vuc2U6ICcgKyB2bS5saWNlbnNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdm0uZ2V0UHVibGljUm9vdFVybCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHZzYmJVdGlscy5nZXRQdWJsaWNSb290VXJsKCk7XG4gICAgfTtcbiAgICAkaHR0cCh7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIHVybDogd2luZG93LmFqYXh1cmwsXG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgYWN0aW9uOiAndnNiYl9nZXRfbGljZW5zZSdcbiAgICAgICAgfVxuICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgIHZtLmxpY2Vuc2UgPSBkYXRhO1xuICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuXG4gICAgfSk7XG59KTsiXSwiZmlsZSI6ImNvbnRyb2xlbHJzL215dnNiYi5jb250cm9sbGVyLmpzIn0=

vsbbAngularApp.controller('vsbbNavController', function ($location) {
    var vm = this;
    vm.navClass = function (path) {
        return ($location.path().substr(0, path.length) === path) ? 'vsbb-nav-active' : '';
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb250cm9sZWxycy9uYXYuY29udHJvbGxlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2c2JiQW5ndWxhckFwcC5jb250cm9sbGVyKCd2c2JiTmF2Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkbG9jYXRpb24pIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLm5hdkNsYXNzID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgICAgcmV0dXJuICgkbG9jYXRpb24ucGF0aCgpLnN1YnN0cigwLCBwYXRoLmxlbmd0aCkgPT09IHBhdGgpID8gJ3ZzYmItbmF2LWFjdGl2ZScgOiAnJztcbiAgICB9XG59KTsiXSwiZmlsZSI6ImNvbnRyb2xlbHJzL25hdi5jb250cm9sbGVyLmpzIn0=

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb250cm9sZWxycy9zdGFuZGFyZC50aGVtZS5jb250cm9sbGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZzYmJBbmd1bGFyQXBwLmNvbnRyb2xsZXIoJ3ZzYmJTdGFuZGFyZFRoZW1lQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIHZzYmJVdGlscywgJGh0dHAsICRyb3V0ZVBhcmFtcywgbmdEaWFsb2cpIHtcblxuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uc2F2ZU9iamVjdCA9IHtcbiAgICAgICAgXCJ0aGVtZUlkXCI6IFwic3RhbmRhcmRcIixcbiAgICAgICAgXCJ0aGVtZUZyaWVuZGx5TmFtZVwiOiBcIkFkdmFuY2VkXCIsXG4gICAgICAgIFwidHBcIjogdHJ1ZSxcbiAgICAgICAgXCJmcmllbmRseU5hbWVcIjogXCJcIixcbiAgICAgICAgXCJwb3NpdGlvbmluZ1wiOiB7XG4gICAgICAgICAgICBcInJlc3BvbnNpdmVcIjogZmFsc2UsXG4gICAgICAgICAgICBcImd1dHRlcnNcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwicHJlc2VydmVSYXRpb1wiOiBmYWxzZSxcbiAgICAgICAgICAgIFwicmVzcG9uc2l2ZUNsYXNzXCI6IFwidnNiYi1ncmlkX19jb2wtLTEyLW9mLTEyXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJpbml0aWFsXCI6IHtcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZEltZ1wiOiB2c2JiVXRpbHMuZ2V0UHVibGljUm9vdFVybCgpICsgXCIvaW1hZ2VzL3ZzYmJfaW1hZ2UxLmpwZ1wiLFxuICAgICAgICAgICAgXCJtYWluVGV4dFwiOiBcIkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQuIE51bGxhbSBhdCBkb2xvciBmYXVjaWJ1cywgaWFjdWxpcyBsaWJlcm8gc2VkLCBjb21tb2RvIG9yY2kuIEFlbmVhbiBwb3J0YSB0cmlzdGlxdWUgYXVndWUsIG5lYyBtYXhpbXVzIGR1aSBjb21tb2RvIHNlZC5cIixcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZENvbG9yXCI6IFwiaHNsKDAsIDAlLCAxMDAlKVwiLFxuICAgICAgICAgICAgXCJib3JkZXJDb2xvclJhd1wiOiBcImhzbCgwLCAwJSwgMCUpXCIsXG4gICAgICAgICAgICBcInN0eWxlc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJib3JkZXItY29sb3JcIjogXCJoc2woMCwgMCUsIDAlKVwiLFxuICAgICAgICAgICAgICAgIFwiYm9yZGVyLXdpZHRoXCI6IFwiMHB4XCIsXG4gICAgICAgICAgICAgICAgXCJib3JkZXItc3R5bGVcIjogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgXCJ3aWR0aFwiOiBcIjMwMHB4XCIsXG4gICAgICAgICAgICAgICAgXCJoZWlnaHRcIjogXCIyMDBweFwiLFxuICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcImhzbCgwLCAwJSwgMTAwJSlcIixcbiAgICAgICAgICAgICAgICBcImJvcmRlci10b3AtbGVmdC1yYWRpdXNcIjogXCIwJVwiLFxuICAgICAgICAgICAgICAgIFwiYm9yZGVyLXRvcC1yaWdodC1yYWRpdXNcIjogXCIwJVwiLFxuICAgICAgICAgICAgICAgIFwiYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1c1wiOiBcIjAlXCIsXG4gICAgICAgICAgICAgICAgXCJib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1c1wiOiBcIjAlXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImJvcmRlclN0eWxlUmF3XCI6IHtcInZhbHVlXCI6IFwibm9uZVwiLCBcIm5hbWVcIjogXCJOb25lXCJ9LFxuICAgICAgICAgICAgXCJib3JkZXItdG9wLWxlZnQtcmFkaXVzXCI6IG51bGwsXG4gICAgICAgICAgICBcImJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwiYm9yZGVyLXRvcC1yaWdodC1yYWRpdXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwiYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXNcIjogbnVsbFxuICAgICAgICB9LFxuICAgICAgICBcImZpbmFsXCI6IHtcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZEltZ1wiOiBcIlwiLFxuICAgICAgICAgICAgXCJtYWluVGV4dFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjogXCJoc2xhKDAsIDAlLCAwJSwgMC40NilcIixcbiAgICAgICAgICAgIFwib3BhY2l0eVwiOiAxLFxuICAgICAgICAgICAgXCJib3JkZXJDb2xvclJhd1wiOiBcImhzbCgwLCAwJSwgMCUpXCIsXG4gICAgICAgICAgICBcInN0eWxlc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJib3JkZXItY29sb3JcIjogXCJoc2woMCwgMCUsIDAlKVwiLFxuICAgICAgICAgICAgICAgIFwiYm9yZGVyLXdpZHRoXCI6IFwiMHB4XCIsXG4gICAgICAgICAgICAgICAgXCJib3JkZXItc3R5bGVcIjogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiaHNsYSgwLCAwJSwgMCUsIDAuNDYpXCIsXG4gICAgICAgICAgICAgICAgXCJib3JkZXItdG9wLWxlZnQtcmFkaXVzXCI6IFwiMCVcIixcbiAgICAgICAgICAgICAgICBcImJvcmRlci10b3AtcmlnaHQtcmFkaXVzXCI6IFwiMCVcIixcbiAgICAgICAgICAgICAgICBcImJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXNcIjogXCIwJVwiLFxuICAgICAgICAgICAgICAgIFwiYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXNcIjogXCIwJVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJsaW5rXCI6IHtcbiAgICAgICAgICAgICAgICBcInBhZGRpbmdSYXdcIjogNSxcbiAgICAgICAgICAgICAgICBcImJhY2tncm91bmRDb2xvclJhd1wiOiBcImhzbCgwLCAwJSwgMCUpXCIsXG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogXCJcIixcbiAgICAgICAgICAgICAgICBcIm5ld1RhYlwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInN0eWxlc1wiOiB7XCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiaHNsKDAsIDAlLCAwJSlcIiwgXCJwYWRkaW5nXCI6IFwiNiVcIn0sXG4gICAgICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkxFQVJOIE1PUkVcIixcbiAgICAgICAgICAgICAgICBcImVuYWJsZWRcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcInBvc2l0aW9uXCI6IFwidnNiYi1ib3R0b20taGVhZGVyLWxpbmtcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiYm9yZGVyU3R5bGVSYXdcIjoge1widmFsdWVcIjogXCJub25lXCIsIFwibmFtZVwiOiBcIk5vbmVcIn0sXG4gICAgICAgICAgICBcImJvcmRlci10b3AtbGVmdC1yYWRpdXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwiYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1c1wiOiBudWxsLFxuICAgICAgICAgICAgXCJib3JkZXItdG9wLXJpZ2h0LXJhZGl1c1wiOiBudWxsLFxuICAgICAgICAgICAgXCJib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1c1wiOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIFwiZW50cmFuY2VFZmZlY3RcIjoge1wibmFtZVwiOiBcIlNsaWRlIFVwIFBlZWtpbmdcIiwgXCJpbkVmZmVjdFwiOiBcInZzYmItc2xpZGUtdXAtY2xhc3NpYy01MFwiLCBcIm91dEVmZmVjdFwiOiBcInZzYmItc2xpZGUtZG93bi1jbGFzc2ljLTUwXCJ9LFxuICAgICAgICBcImFuaW1hdGVDbGFzc1wiOiBcInZzYmItc2xpZGUtdXAtY2xhc3NpYy01MFwiLFxuICAgICAgICBcImFuaW1hdGVDbGFzc091dFwiOiBcInZzYmItc2xpZGUtZG93bi1jbGFzc2ljLTUwXCJcbiAgICB9O1xuICAgIHZtLmVudHJhbmNlRWZmZWN0cyA9IHZzYmJVdGlscy5nZXRFbnRyYW5jZUVmZmVjdHMoKTtcbiAgICB2bS5zYXZlT2JqZWN0LmVudHJhbmNlRWZmZWN0ID0gYW5ndWxhci5jb3B5KHZtLmVudHJhbmNlRWZmZWN0c1sxNl0pO1xuICAgIHZtLmJvcmRlck9wdHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhbHVlOiAnbm9uZScsXG4gICAgICAgICAgICBuYW1lOiAnTm9uZSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdzb2xpZCcsXG4gICAgICAgICAgICBuYW1lOiAnU29saWQnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAnZGFzaGVkJyxcbiAgICAgICAgICAgIG5hbWU6ICdEYXNoZWQnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHZhbHVlOiAnZG90dGVkJyxcbiAgICAgICAgICAgIG5hbWU6ICdEb3R0ZWQnXG4gICAgICAgIH1cbiAgICBdO1xuICAgIHZtLnNhdmVPYmplY3QuaW5pdGlhbC5ib3JkZXJTdHlsZVJhdyA9IGFuZ3VsYXIuY29weSh2bS5ib3JkZXJPcHRzWzBdKTtcbiAgICB2bS5zYXZlT2JqZWN0LmZpbmFsLmJvcmRlclN0eWxlUmF3ID0gYW5ndWxhci5jb3B5KHZtLmJvcmRlck9wdHNbMF0pO1xuXG4gICAgdm0uSVRMc2xpZGVyT3B0aW9ucyA9IHtcbiAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgIGNlaWw6IDEwMCxcbiAgICAgICAgLy9oaWRlUG9pbnRlckxhYmVsczogdHJ1ZSxcbiAgICAgICAgaGlkZUxpbWl0TGFiZWxzOiB0cnVlLFxuICAgICAgICB0cmFuc2xhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlICsgJyUnO1xuICAgICAgICB9LFxuICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24gKHNsaWRlcklkLCBtb2RlbFZhbHVlLCBoaWdoVmFsdWUsIHBvaW50ZXJUeXBlKSB7XG4gICAgICAgICAgICB2bS5zYXZlT2JqZWN0LmluaXRpYWwuc3R5bGVzWydib3JkZXItdG9wLWxlZnQtcmFkaXVzJ10gPSBtb2RlbFZhbHVlICsgJyUnO1xuICAgICAgICAgICAgdm0uc2F2ZU9iamVjdC5pbml0aWFsLnN0eWxlc1snLXdlYmtpdC1ib3JkZXItdG9wLWxlZnQtcmFkaXVzJ10gPSBtb2RlbFZhbHVlICsgJyUnO1xuICAgICAgICAgICAgdm0uc2F2ZU9iamVjdC5pbml0aWFsLnN0eWxlc1snLW1vei1ib3JkZXItdG9wLWxlZnQtcmFkaXVzJ10gPSBtb2RlbFZhbHVlICsgJyUnO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZtLklUUnNsaWRlck9wdGlvbnMgPSB7XG4gICAgICAgIGZsb29yOiAwLFxuICAgICAgICBjZWlsOiAxMDAsXG4gICAgICAgIC8vaGlkZVBvaW50ZXJMYWJlbHM6IHRydWUsXG4gICAgICAgIGhpZGVMaW1pdExhYmVsczogdHJ1ZSxcbiAgICAgICAgdHJhbnNsYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSArICclJztcbiAgICAgICAgfSxcbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uIChzbGlkZXJJZCwgbW9kZWxWYWx1ZSwgaGlnaFZhbHVlLCBwb2ludGVyVHlwZSkge1xuICAgICAgICAgICAgdm0uc2F2ZU9iamVjdC5pbml0aWFsLnN0eWxlc1snYm9yZGVyLXRvcC1yaWdodC1yYWRpdXMnXSA9IG1vZGVsVmFsdWUgKyAnJSc7XG4gICAgICAgICAgICB2bS5zYXZlT2JqZWN0LmluaXRpYWwuc3R5bGVzWyctd2Via2l0LWJvcmRlci10b3AtcmlnaHQtcmFkaXVzJ10gPSBtb2RlbFZhbHVlICsgJyUnO1xuICAgICAgICAgICAgdm0uc2F2ZU9iamVjdC5pbml0aWFsLnN0eWxlc1snLW1vei1ib3JkZXItdG9wLXJpZ2h0LXJhZGl1cyddID0gbW9kZWxWYWx1ZSArICclJztcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2bS5JQkxzbGlkZXJPcHRpb25zID0ge1xuICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgY2VpbDogMTAwLFxuICAgICAgICAvL2hpZGVQb2ludGVyTGFiZWxzOiB0cnVlLFxuICAgICAgICBoaWRlTGltaXRMYWJlbHM6IHRydWUsXG4gICAgICAgIHRyYW5zbGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgKyAnJSc7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoc2xpZGVySWQsIG1vZGVsVmFsdWUsIGhpZ2hWYWx1ZSwgcG9pbnRlclR5cGUpIHtcbiAgICAgICAgICAgIHZtLnNhdmVPYmplY3QuaW5pdGlhbC5zdHlsZXNbJ2JvcmRlci1ib3R0b20tbGVmdC1yYWRpdXMnXSA9IG1vZGVsVmFsdWUgKyAnJSc7XG4gICAgICAgICAgICB2bS5zYXZlT2JqZWN0LmluaXRpYWwuc3R5bGVzWyctd2Via2l0LWJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXMnXSA9IG1vZGVsVmFsdWUgKyAnJSc7XG4gICAgICAgICAgICB2bS5zYXZlT2JqZWN0LmluaXRpYWwuc3R5bGVzWyctbW96LWJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXMnXSA9IG1vZGVsVmFsdWUgKyAnJSc7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZtLklCUnNsaWRlck9wdGlvbnMgPSB7XG4gICAgICAgIGZsb29yOiAwLFxuICAgICAgICBjZWlsOiAxMDAsXG4gICAgICAgIC8vaGlkZVBvaW50ZXJMYWJlbHM6IHRydWUsXG4gICAgICAgIGhpZGVMaW1pdExhYmVsczogdHJ1ZSxcbiAgICAgICAgdHJhbnNsYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSArICclJztcbiAgICAgICAgfSxcbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uIChzbGlkZXJJZCwgbW9kZWxWYWx1ZSwgaGlnaFZhbHVlLCBwb2ludGVyVHlwZSkge1xuICAgICAgICAgICAgdm0uc2F2ZU9iamVjdC5pbml0aWFsLnN0eWxlc1snYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXMnXSA9IG1vZGVsVmFsdWUgKyAnJSc7XG4gICAgICAgICAgICB2bS5zYXZlT2JqZWN0LmluaXRpYWwuc3R5bGVzWyctd2Via2l0LWJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzJ10gPSBtb2RlbFZhbHVlICsgJyUnO1xuICAgICAgICAgICAgdm0uc2F2ZU9iamVjdC5pbml0aWFsLnN0eWxlc1snLW1vei1ib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1cyddID0gbW9kZWxWYWx1ZSArICclJztcbiAgICAgICAgfVxuICAgIH07XG4gICAgdm0uRlRMc2xpZGVyT3B0aW9ucyA9IHtcbiAgICAgICAgZmxvb3I6IDAsXG4gICAgICAgIGNlaWw6IDEwMCxcbiAgICAgICAgLy9oaWRlUG9pbnRlckxhYmVsczogdHJ1ZSxcbiAgICAgICAgaGlkZUxpbWl0TGFiZWxzOiB0cnVlLFxuICAgICAgICB0cmFuc2xhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlICsgJyUnO1xuICAgICAgICB9LFxuICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24gKHNsaWRlcklkLCBtb2RlbFZhbHVlLCBoaWdoVmFsdWUsIHBvaW50ZXJUeXBlKSB7XG4gICAgICAgICAgICB2bS5zYXZlT2JqZWN0LmZpbmFsLnN0eWxlc1snYm9yZGVyLXRvcC1sZWZ0LXJhZGl1cyddID0gbW9kZWxWYWx1ZSArICclJztcbiAgICAgICAgICAgIHZtLnNhdmVPYmplY3QuZmluYWwuc3R5bGVzWyctd2Via2l0LWJvcmRlci10b3AtbGVmdC1yYWRpdXMnXSA9IG1vZGVsVmFsdWUgKyAnJSc7XG4gICAgICAgICAgICB2bS5zYXZlT2JqZWN0LmZpbmFsLnN0eWxlc1snLW1vei1ib3JkZXItdG9wLWxlZnQtcmFkaXVzJ10gPSBtb2RlbFZhbHVlICsgJyUnO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZtLkZUUnNsaWRlck9wdGlvbnMgPSB7XG4gICAgICAgIGZsb29yOiAwLFxuICAgICAgICBjZWlsOiAxMDAsXG4gICAgICAgIC8vaGlkZVBvaW50ZXJMYWJlbHM6IHRydWUsXG4gICAgICAgIGhpZGVMaW1pdExhYmVsczogdHJ1ZSxcbiAgICAgICAgdHJhbnNsYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSArICclJztcbiAgICAgICAgfSxcbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uIChzbGlkZXJJZCwgbW9kZWxWYWx1ZSwgaGlnaFZhbHVlLCBwb2ludGVyVHlwZSkge1xuICAgICAgICAgICAgdm0uc2F2ZU9iamVjdC5maW5hbC5zdHlsZXNbJ2JvcmRlci10b3AtcmlnaHQtcmFkaXVzJ10gPSBtb2RlbFZhbHVlICsgJyUnO1xuICAgICAgICAgICAgdm0uc2F2ZU9iamVjdC5maW5hbC5zdHlsZXNbJy13ZWJraXQtYm9yZGVyLXRvcC1yaWdodC1yYWRpdXMnXSA9IG1vZGVsVmFsdWUgKyAnJSc7XG4gICAgICAgICAgICB2bS5zYXZlT2JqZWN0LmZpbmFsLnN0eWxlc1snLW1vei1ib3JkZXItdG9wLXJpZ2h0LXJhZGl1cyddID0gbW9kZWxWYWx1ZSArICclJztcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2bS5GQkxzbGlkZXJPcHRpb25zID0ge1xuICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgY2VpbDogMTAwLFxuICAgICAgICAvL2hpZGVQb2ludGVyTGFiZWxzOiB0cnVlLFxuICAgICAgICBoaWRlTGltaXRMYWJlbHM6IHRydWUsXG4gICAgICAgIHRyYW5zbGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgKyAnJSc7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoc2xpZGVySWQsIG1vZGVsVmFsdWUsIGhpZ2hWYWx1ZSwgcG9pbnRlclR5cGUpIHtcbiAgICAgICAgICAgIHZtLnNhdmVPYmplY3QuZmluYWwuc3R5bGVzWydib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzJ10gPSBtb2RlbFZhbHVlICsgJyUnO1xuICAgICAgICAgICAgdm0uc2F2ZU9iamVjdC5maW5hbC5zdHlsZXNbJy13ZWJraXQtYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1cyddID0gbW9kZWxWYWx1ZSArICclJztcbiAgICAgICAgICAgIHZtLnNhdmVPYmplY3QuZmluYWwuc3R5bGVzWyctbW96LWJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXMnXSA9IG1vZGVsVmFsdWUgKyAnJSc7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZtLkZCUnNsaWRlck9wdGlvbnMgPSB7XG4gICAgICAgIGZsb29yOiAwLFxuICAgICAgICBjZWlsOiAxMDAsXG4gICAgICAgIC8vaGlkZVBvaW50ZXJMYWJlbHM6IHRydWUsXG4gICAgICAgIGhpZGVMaW1pdExhYmVsczogdHJ1ZSxcbiAgICAgICAgdHJhbnNsYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSArICclJztcbiAgICAgICAgfSxcbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uIChzbGlkZXJJZCwgbW9kZWxWYWx1ZSwgaGlnaFZhbHVlLCBwb2ludGVyVHlwZSkge1xuICAgICAgICAgICAgdm0uc2F2ZU9iamVjdC5maW5hbC5zdHlsZXNbJ2JvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzJ10gPSBtb2RlbFZhbHVlICsgJyUnO1xuICAgICAgICAgICAgdm0uc2F2ZU9iamVjdC5maW5hbC5zdHlsZXNbJy13ZWJraXQtYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXMnXSA9IG1vZGVsVmFsdWUgKyAnJSc7XG4gICAgICAgICAgICB2bS5zYXZlT2JqZWN0LmZpbmFsLnN0eWxlc1snLW1vei1ib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1cyddID0gbW9kZWxWYWx1ZSArICclJztcbiAgICAgICAgfVxuICAgIH07XG4gICAgdm0uRlBzbGlkZXJPcHRpb25zID0ge1xuICAgICAgICBmbG9vcjogMCxcbiAgICAgICAgY2VpbDogMTAwLFxuICAgICAgICAvL2hpZGVQb2ludGVyTGFiZWxzOiB0cnVlLFxuICAgICAgICBoaWRlTGltaXRMYWJlbHM6IHRydWUsXG4gICAgICAgIHRyYW5zbGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgKyAnJSc7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoc2xpZGVySWQsIG1vZGVsVmFsdWUsIGhpZ2hWYWx1ZSwgcG9pbnRlclR5cGUpIHtcbiAgICAgICAgICAgIHZtLnNhdmVPYmplY3QuZmluYWwubGluay5zdHlsZXMucGFkZGluZyA9IG1vZGVsVmFsdWUgKyAnJSc7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdm0uc3R5bGVDaGFuZ2VkID0gZnVuY3Rpb24gKHN0YXRlLCB0eXBlLCB2YWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdm0uc2F2ZU9iamVjdFtzdGF0ZV0uc3R5bGVzW3R5cGVdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdm0uY29sb3JBcGkgPSB7XG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoYXBpLCBjb2xvciwgJGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgc2NoZW1hID0gdm0uc2F2ZU9iamVjdDsgIC8vIGEgbW92aW5nIHJlZmVyZW5jZSB0byBpbnRlcm5hbCBvYmplY3RzIHdpdGhpbiBvYmpcbiAgICAgICAgICAgIHZhciBzdHJpbmcgPSBhcGkuZ2V0U2NvcGUoKS5jb250cm9sWzBdLiRuYW1lO1xuICAgICAgICAgICAgdmFyIHBMaXN0ID0gc3RyaW5nLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICB2YXIgbGVuID0gcExpc3QubGVuZ3RoO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW4gLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxlbSA9IHBMaXN0W2ldO1xuICAgICAgICAgICAgICAgIGlmICghc2NoZW1hW2VsZW1dKSBzY2hlbWFbZWxlbV0gPSB7fVxuICAgICAgICAgICAgICAgIHNjaGVtYSA9IHNjaGVtYVtlbGVtXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNjaGVtYVtwTGlzdFtsZW4gLSAxXV0gPSBjb2xvcjtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdm0uYm9yZGVyU3R5bGVDaGFuZ2VkID0gZnVuY3Rpb24gKHNlbGVjdGVkKSB7XG4gICAgICAgIHZtLnNhdmVPYmplY3QuaW5pdGlhbC5zdHlsZXNbJ2JvcmRlci1zdHlsZSddID0gc2VsZWN0ZWQudmFsdWU7XG4gICAgfTtcbiAgICB2bS5ib3JkZXJTdHlsZUZpbmFsQ2hhbmdlZCA9IGZ1bmN0aW9uIChzZWxlY3RlZCkge1xuICAgICAgICB2bS5zYXZlT2JqZWN0LmZpbmFsLnN0eWxlc1snYm9yZGVyLXN0eWxlJ10gPSBzZWxlY3RlZC52YWx1ZTtcbiAgICB9O1xuXG4gICAgdm0uZW50cmFuY2VFZmZlY3RDaGFuZ2VkID0gZnVuY3Rpb24gKHNlbGVjdGVkKSB7XG4gICAgICAgIHZtLnNhdmVPYmplY3QuYW5pbWF0ZUNsYXNzID0gc2VsZWN0ZWQuaW5FZmZlY3Q7XG4gICAgICAgIHZtLnNhdmVPYmplY3QuYW5pbWF0ZUNsYXNzT3V0ID0gc2VsZWN0ZWQub3V0RWZmZWN0O1xuICAgIH07XG5cbiAgICB2bS5zYXZlID0gZnVuY3Rpb24gKCRldmVudCkge1xuICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdnNiYlV0aWxzLnNhdmVJbnN0YW5jZSh2bS5zYXZlT2JqZWN0LFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICdmcmllbmRseU5hbWUnLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0ZyaWVuZGx5IE5hbWUnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICB2bS5jb2xvclBpY2tlck9wdGlvbnMgPSB7XG4gICAgICAgIHBvczogJ2JvdHRvbSByaWdodCcsXG4gICAgICAgIGZvcm1hdDogJ2hzbCdcbiAgICB9O1xuXG4gICAgdm0uaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgalF1ZXJ5KFwiLnZzYmItc3RhbmRhcmQtaW5pdGlhbFwiKS5vbignbW91c2VlbnRlcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGpRdWVyeSh0aGlzKS5maW5kKCcudnNiYi1zdGFuZGFyZC1maW5hbCcpLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoJ3ZzYmItaG92ZXJpbmcgdnNiYi1zdGFuZGFyZC1maW5hbCBhbmltYXRlZCAnICsgdm0uc2F2ZU9iamVjdC5lbnRyYW5jZUVmZmVjdC5pbkVmZmVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgICBqUXVlcnkoXCIudnNiYi1zdGFuZGFyZC1pbml0aWFsXCIpLm9uKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgalF1ZXJ5KHRoaXMpLmZpbmQoJy52c2JiLXN0YW5kYXJkLWZpbmFsJykucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcygndnNiYi1zdGFuZGFyZC1maW5hbCBhbmltYXRlZCAnICsgdm0uc2F2ZU9iamVjdC5lbnRyYW5jZUVmZmVjdC5vdXRFZmZlY3QpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICB2bS5pbml0KCk7XG4gICAgfSwgMTAwMCk7XG5cbiAgICB2bS5zaG93SG92ZXJTdGF0ZSA9IGZ1bmN0aW9uICgkZXZlbnQpIHtcbiAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmIChqUXVlcnkoJy52c2JiLXN0YW5kYXJkLWZpbmFsJykuaGFzQ2xhc3MoJ3ZzYmItaG92ZXJpbmcnKSkge1xuICAgICAgICAgICAgalF1ZXJ5KHRoaXMpLmZpbmQoJy52c2JiLXN0YW5kYXJkLWZpbmFsJykucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcygndnNiYi1zdGFuZGFyZC1maW5hbCBhbmltYXRlZCAnICsgdm0uc2F2ZU9iamVjdC5lbnRyYW5jZUVmZmVjdC5vdXRFZmZlY3QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgalF1ZXJ5KCcudnNiYi1zdGFuZGFyZC1maW5hbCcpLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3MoJ3ZzYmItaG92ZXJpbmcgdnNiYi1zdGFuZGFyZC1maW5hbCBhbmltYXRlZCAnICsgdm0uc2F2ZU9iamVjdC5lbnRyYW5jZUVmZmVjdC5pbkVmZmVjdCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy9sb2FkIHNhdmVkIGluc3RhbmNlXG4gICAgaWYgKCRyb3V0ZVBhcmFtcy5pZCkge1xuICAgICAgICB2bS5sb2FkZWQgPSBmYWxzZTtcbiAgICAgICAgdm0uaWQgPSAkcm91dGVQYXJhbXMuaWQ7XG4gICAgICAgIHZtLmVkaXRpbmdFeGlzdGluZyA9IHRydWU7XG4gICAgICAgICRodHRwKHtcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6IHdpbmRvdy5hamF4dXJsLFxuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgYWN0aW9uOiAndnNiYl9nZXRfb25lJyxcbiAgICAgICAgICAgICAgICBpZHg6IHZtLmlkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XG4gICAgICAgICAgICB2bS5sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgdm0uc2F2ZU9iamVjdCA9IEpTT04ucGFyc2UoZGF0YS5zYXZlX29iamVjdCk7XG4gICAgICAgICAgICBpZiAoIWFuZ3VsYXIuaXNEZWZpbmVkKHZtLnNhdmVPYmplY3QuYW5pbWF0ZUNsYXNzKSkge1xuICAgICAgICAgICAgICAgIHZtLnNhdmVPYmplY3QuYW5pbWF0ZUNsYXNzID0gJ2JvdW5jZUluJztcbiAgICAgICAgICAgICAgICB2bS5zYXZlT2JqZWN0LmFuaW1hdGVDbGFzc091dCA9ICdib3VuY2VPdXQnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcblxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2bS5sb2FkZWQgPSB0cnVlO1xuICAgICAgICB2bS5lZGl0aW5nRXhpc3RpbmcgPSBmYWxzZTtcbiAgICB9XG59KTsiXSwiZmlsZSI6ImNvbnRyb2xlbHJzL3N0YW5kYXJkLnRoZW1lLmNvbnRyb2xsZXIuanMifQ==

angular.module('ui.bootstrap.dropdownToggle', []).directive('dropdownToggle', ['$document', '$location', function ($document, $location) {
    var openElement = null,
        closeMenu = angular.noop;
    return {
        restrict: 'CA',
        link: function (scope, element, attrs) {
            scope.$watch('$location.path', function () { closeMenu(); });
            element.parent().bind('click', function () { closeMenu(); });
            element.bind('click', function (event) {

                var elementWasOpen = (element === openElement);

                event.preventDefault();
                event.stopPropagation();

                if (!!openElement) {
                    closeMenu();
                }

                if (!elementWasOpen && !element.hasClass('disabled') && !element.prop('disabled')) {
                    element.parent().addClass('open');
                    openElement = element;
                    closeMenu = function (event) {
                        if (event) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        $document.unbind('click', closeMenu);
                        element.parent().removeClass('open');
                        closeMenu = angular.noop;
                        openElement = null;
                    };
                    $document.bind('click', closeMenu);
                }
            });
        }
    };
}]);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkaXJlY3RpdmVzL2Ryb3Bkb3duLm1vZHVsZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgndWkuYm9vdHN0cmFwLmRyb3Bkb3duVG9nZ2xlJywgW10pLmRpcmVjdGl2ZSgnZHJvcGRvd25Ub2dnbGUnLCBbJyRkb2N1bWVudCcsICckbG9jYXRpb24nLCBmdW5jdGlvbiAoJGRvY3VtZW50LCAkbG9jYXRpb24pIHtcbiAgICB2YXIgb3BlbkVsZW1lbnQgPSBudWxsLFxuICAgICAgICBjbG9zZU1lbnUgPSBhbmd1bGFyLm5vb3A7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdDQScsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgnJGxvY2F0aW9uLnBhdGgnLCBmdW5jdGlvbiAoKSB7IGNsb3NlTWVudSgpOyB9KTtcbiAgICAgICAgICAgIGVsZW1lbnQucGFyZW50KCkuYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoKSB7IGNsb3NlTWVudSgpOyB9KTtcbiAgICAgICAgICAgIGVsZW1lbnQuYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcblxuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50V2FzT3BlbiA9IChlbGVtZW50ID09PSBvcGVuRWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEhb3BlbkVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VNZW51KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFlbGVtZW50V2FzT3BlbiAmJiAhZWxlbWVudC5oYXNDbGFzcygnZGlzYWJsZWQnKSAmJiAhZWxlbWVudC5wcm9wKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucGFyZW50KCkuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgb3BlbkVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICBjbG9zZU1lbnUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkZG9jdW1lbnQudW5iaW5kKCdjbGljaycsIGNsb3NlTWVudSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnBhcmVudCgpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZU1lbnUgPSBhbmd1bGFyLm5vb3A7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuRWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICRkb2N1bWVudC5iaW5kKCdjbGljaycsIGNsb3NlTWVudSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufV0pOyJdLCJmaWxlIjoiZGlyZWN0aXZlcy9kcm9wZG93bi5tb2R1bGUuanMifQ==

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkaXJlY3RpdmVzL2ljb24tcGlja2VyLWRpcmVjdGl2ZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2c2JiQW5ndWxhckFwcC5kaXJlY3RpdmUoJ3ZzYmJGb250UGlja2VyJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgICAgc2NvcGU6IHtcbiAgICAgICAgICAgIG5nTW9kZWw6ICc9J1xuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW0sIGF0dHJzKSB7XG4gICAgICAgICAgICBqUXVlcnkoZWxlbSkuaWNvbnBpY2tlcigpO1xuICAgICAgICAgICAgLy8gV2F0Y2ggZm9yIGNoYW5nZXMgdG8gdGhlIG1vZGVsIGFuZCB1cGRhdGUgdGhlIHNsaWRlclxuICAgICAgICAgICAgalF1ZXJ5KGVsZW0pLm9uKCdpY29ucGlja2VyU2VsZWN0ZWQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUubmdNb2RlbD0ncGlja2VyLXRhcmdldCAnICtcbiAgICAgICAgICAgICAgICAgICAgZS5pY29ucGlja2VySW5zdGFuY2Uub3B0aW9ucy5pY29uQmFzZUNsYXNzICsgJyAnICtcbiAgICAgICAgICAgICAgICAgICAgZS5pY29ucGlja2VySW5zdGFuY2Uub3B0aW9ucy5mdWxsQ2xhc3NGb3JtYXR0ZXIoZS5pY29ucGlja2VyVmFsdWUpO1xuICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7Il0sImZpbGUiOiJkaXJlY3RpdmVzL2ljb24tcGlja2VyLWRpcmVjdGl2ZS5qcyJ9

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzZXJ2aWNlcy91dGlscy5zZXJ2aWNlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZzYmJBbmd1bGFyQXBwLmZhY3RvcnkoXCJ2c2JiVXRpbHNcIiwgZnVuY3Rpb24gKCRxLCAkaHR0cCwgJHRpbWVvdXQsICRsb2NhdGlvbiwgbmdEaWFsb2cpIHtcbiAgICB2YXIgdXRpbHMgPSB7XG4gICAgICAgIGF2YWlsYWJsZVRoZW1lczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhbHVlOiAnaW1hZ2VfY2FwdGlvbicsXG4gICAgICAgICAgICAgICAgbmFtZTogJ0ltYWdlIENhcHRpb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhbHVlOiAnc3RhbmRhcmQnLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdBZHZhbmNlZCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFsdWU6ICdncmlkJyxcbiAgICAgICAgICAgICAgICBuYW1lOiAnR3JpZCBCdWlsZGVyJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogJ21vZGFsJyxcbiAgICAgICAgICAgICAgICBuYW1lOiAnTW9kYWwgUG9wdXAnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhbHVlOiAnZm9sZGluZycsXG4gICAgICAgICAgICAgICAgbmFtZTogJ0ZvbGRpbmcnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAse1xuICAgICAgICAgICAgLy8gICAgIHZhbHVlOiA1LFxuICAgICAgICAgICAgLy8gICAgIG5hbWU6ICdNdWx0aSBDb250ZW50J1xuICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgIC8vICAgICB2YWx1ZTogNixcbiAgICAgICAgICAgIC8vICAgICBuYW1lOiAnM0QgUmV2ZWFsJ1xuICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgIC8vICAgICB2YWx1ZTogNyxcbiAgICAgICAgICAgIC8vICAgICBuYW1lOiAnM0QgSG92ZXInXG4gICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgLy8gICAgIHZhbHVlOiA4LFxuICAgICAgICAgICAgLy8gICAgIG5hbWU6ICdTbGlkZSBPdmVyJ1xuICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgIC8vICAgICB2YWx1ZTogOSxcbiAgICAgICAgICAgIC8vICAgICBuYW1lOiAnQ2lyY2xlIFNwbGl0J1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICBdLFxuICAgICAgICBnZXRQYXJ0aWFsc1VybDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZzYmJHbG9iYWxWYXJzLnBhcnRpYWxzXG4gICAgICAgIH0sXG4gICAgICAgIGdldFJvb3RVcmw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB2c2JiR2xvYmFsVmFycy5yb290XG4gICAgICAgIH0sXG4gICAgICAgIGdldFB1YmxpY1Jvb3RVcmw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB2c2JiR2xvYmFsVmFycy5wdWJsaWNSb290XG4gICAgICAgIH0sXG4gICAgICAgIGdldEdsb2JhbFZhcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB2c2JiR2xvYmFsVmFycztcbiAgICAgICAgfSxcbiAgICAgICAgbGVnYWN5U3VwcG9ydDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZzYmJHbG9iYWxWYXJzLmxlZ2FjeVN1cHBvcnQgPT09IFwiMVwiO1xuICAgICAgICB9LFxuICAgICAgICBnZXRQYWlkVmVyc2lvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZzYmJHbG9iYWxWYXJzLnBhaWRWZXJzaW9uO1xuICAgICAgICB9LFxuICAgICAgICBpc1RoZW1lQWxsb3dlZDogZnVuY3Rpb24gKHRoZW1lSWQpIHtcbiAgICAgICAgICAgIHJldHVybiB2c2JiR2xvYmFsVmFycy5hbGxvd2VkX2YuYnVpbGRlcnMuaW5kZXhPZih0aGVtZUlkKSAhPT0gLTE7XG4gICAgICAgIH0sXG4gICAgICAgIGlzRmVhdHVyZUFsbG93ZWQ6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdnNiYkdsb2JhbFZhcnMuYWxsb3dlZF9mW2tleV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZzYmJHbG9iYWxWYXJzLmFsbG93ZWRfZltrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBnZXRBdmFpbGFibGVUaGVtZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh1dGlscy5hdmFpbGFibGVUaGVtZXMsIGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIGlmICghc2VsZi5pc1RoZW1lQWxsb3dlZChpdGVtLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLm5hbWUgPSBpdGVtLm5hbWUucmVwbGFjZSgnIC0gUGFpZCBPbmx5JywgJycpICsgXCIgLSBQYWlkIE9ubHlcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB1dGlscy5hdmFpbGFibGVUaGVtZXM7XG4gICAgICAgIH0sXG4gICAgICAgIHZhbGlkYXRlVXNlckxpY2Vuc2U6IGZ1bmN0aW9uIChsaWNlbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHVybDogd2luZG93LmFqYXh1cmwsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ3ZzYmJfcmVnaXN0ZXJfbGljJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBsaWNlbnNlOiBsaWNlbnNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgZGVsZXRlSXRlbTogZnVuY3Rpb24gKGlkeCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICB1cmw6IHdpbmRvdy5hamF4dXJsLFxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICd2c2JiX2RlbGV0ZV9pdGVtJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBpZHg6IGlkeFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldE1vZGFsczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIHVybDogd2luZG93LmFqYXh1cmwsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ3ZzYmJfZ2V0X2FsbCcsXG4gICAgICAgICAgICAgICAgICAgIHRoZW1lOiAnbW9kYWwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2F2ZUluc3RhbmNlOiBmdW5jdGlvbiAoc2F2ZURhdGEsIHJlcXVpcmVkRmllbGRzLCBvdmVyd3JpdGUpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciBtaXNzaW5nUmVxRmllbGRzID0gW107XG4gICAgICAgICAgICBpZiAoIWFuZ3VsYXIuaXNEZWZpbmVkKG92ZXJ3cml0ZSkpIHtcbiAgICAgICAgICAgICAgICBvdmVyd3JpdGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChyZXF1aXJlZEZpZWxkcywgZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzYXZlRGF0YVtpdGVtLnZhbHVlXSA9PT0gJ3VuZGVmaW5lZCcgfHwgc2F2ZURhdGFbaXRlbS52YWx1ZV0gPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pc3NpbmdSZXFGaWVsZHMucHVzaChpdGVtLmxhYmVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChtaXNzaW5nUmVxRmllbGRzLmxlbmd0aCA9PT0gMCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKCFzZWxmLmlzRmVhdHVyZUFsbG93ZWQoJ2FkdmFuY2VkLWMyYScpICYmIChzYXZlRGF0YS5jMmEuZmluYWwuY2F0ZWdvcnkgIT09ICdidXR0b24nIHx8IHNhdmVEYXRhLmMyYS5maW5hbC50eXBlICE9PSAnbGluaycpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogdnNiYkdsb2JhbFZhcnMucGFydGlhbHMgKyAnL2RpYWxvZ3MvcGFpZC1vbmx5Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCB2c2JiLXdhcm5pbmctZGlhbG9nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkaW5nOiAnV2FybmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJUZXh0OiAnVXNpbmcgcGFpZCBmZWF0dXJlZCBcIkFkdmFuY2VkIENhbGwgdG8gQWN0aW9uXCIgbm90IGFsbG93ZWQgaW4geW91ciBsaWNlbnNlLiBGYWlsZWQgdG8gc2F2ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogd2luZG93LmFqYXh1cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICd2c2JiX3NhdmUnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVfb2JqZWN0OiBzYXZlRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcmllbmRseV9uYW1lOiBzYXZlRGF0YS5mcmllbmRseU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlbWU6IHNhdmVEYXRhLnRoZW1lSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcndyaXRlOiBvdmVyd3JpdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0LCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyZXN1bHQuc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnb3ZlcndyaXRlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogdnNiYkdsb2JhbFZhcnMucGFydGlhbHMgKyAnL2RpYWxvZ3MvcmVzdWx0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCB2c2JiLXdhcm5pbmctZGlhbG9nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkaW5nOiAnU2F2ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWluVGV4dDogJ092ZXJ3cml0ZSB0aGlzIGl0ZW0/JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViVGV4dDogJ1RoZXJlIGlzIGFscmVhZHkgYW4gaXRlbSBuYW1lOiAnICsgc2F2ZURhdGEuZnJpZW5kbHlOYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb290ZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkN0YVRleHQ6ICdPdmVyd3JpdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJDdGFUZXh0OiAnQ2FuY2VsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpbkN0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmdEaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2F2ZUluc3RhbmNlKHNhdmVEYXRhLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAnZnJpZW5kbHlOYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnRnJpZW5kbHkgTmFtZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YkN0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmdEaWFsb2cuY2xvc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnc3VjY2Vzcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmlzVGhlbWVBbGxvd2VkKHNhdmVEYXRhLnRoZW1lSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZ0RpYWxvZy5vcGVuKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogdnNiYkdsb2JhbFZhcnMucGFydGlhbHMgKyAnL2RpYWxvZ3MvcmVzdWx0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ25nZGlhbG9nLXRoZW1lLWRlZmF1bHQgdnNiYi1zdWNjZXNzLWRpYWxvZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkaW5nOiAnU3VjY2Vzc2Z1bCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YlRleHQ6IHNhdmVEYXRhLmZyaWVuZGx5TmFtZSArICcgd2FzIHN1Y2Nlc3NmdWxseSBzYXZlISdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nRGlhbG9nLmNsb3NlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDIwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IHZzYmJHbG9iYWxWYXJzLnBhcnRpYWxzICsgJy9kaWFsb2dzL3BhaWQtb25seS5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0IHZzYmItd2FybmluZy1kaWFsb2cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGluZzogJ1dhcm5pbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJUZXh0OiAnWW91IGFyZSBhbGxvd2VkIHRvIHNhdmUgJyArIHNhdmVEYXRhLnRoZW1lRnJpZW5kbHlOYW1lICsgJyBCdWlsZGVyIFR5cGUgdW5kZXIgdGhlIEZyZWUgVmVyc2lvbiBidXQgd291bGQgbm90IGJlIGFibGUgdG8gdXNlIGl0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogdnNiYkdsb2JhbFZhcnMucGFydGlhbHMgKyAnL2RpYWxvZ3MvcmVzdWx0Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnbmdkaWFsb2ctdGhlbWUtZGVmYXVsdCB2c2JiLWZhaWwtZGlhbG9nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkaW5nOiAnRXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpblRleHQ6ICdUaGVyZSB3YXMgYW4gZXJyb3Igc2F2aW5nISdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZ28gdG8gYXBwcm9wcmlhdGUgVVJMIHdpdGggSURcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2J1aWxkZXIvJyArIHNhdmVEYXRhLnRoZW1lSWQgKyAnLycgKyByZXN1bHQuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAocmVzdWx0LCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IHZzYmJHbG9iYWxWYXJzLnBhcnRpYWxzICsgJy9kaWFsb2dzL3Jlc3VsdC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0IHZzYmItZmFpbC1kaWFsb2cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGluZzogJ0Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFpblRleHQ6ICdUaGVyZSB3YXMgYW4gZXJyb3Igc2F2aW5nISdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmdEaWFsb2cub3Blbih7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiB2c2JiR2xvYmFsVmFycy5wYXJ0aWFscyArICcvZGlhbG9ncy92YWxpZGF0aW9uLWVycm9yLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICduZ2RpYWxvZy10aGVtZS1kZWZhdWx0IHZzYmItZmFpbC1kaWFsb2cnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkaW5nOiAnRXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1haW5UZXh0OiAnTWlzc2luZyByZXF1aXJlZCBmaWVsZHM6J1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pc3NpbmdSZXFGaWVsZHM6IG1pc3NpbmdSZXFGaWVsZHNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgICxcbiAgICAgICAgZ2V0RW50cmFuY2VFZmZlY3RzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRElWSURFUlxuICAgICAgICAgICAgICAgICAgICBkaXZpZGVyOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnU3BlY2lhbHMnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdIZWxsbyEnLFxuICAgICAgICAgICAgICAgICAgICBpbkVmZmVjdDogJ3RhZGEnLFxuICAgICAgICAgICAgICAgICAgICBvdXRFZmZlY3Q6ICdmYWRlT3V0J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnUm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgaW5FZmZlY3Q6ICdyb2xsSW4nLFxuICAgICAgICAgICAgICAgICAgICBvdXRFZmZlY3Q6ICdyb2xsT3V0J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnRmFsbGluZycsXG4gICAgICAgICAgICAgICAgICAgIGluRWZmZWN0OiAnaGluZ2UnLFxuICAgICAgICAgICAgICAgICAgICBvdXRFZmZlY3Q6ICd2c2JiLWhpZGRlbidcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0JhbmcnLFxuICAgICAgICAgICAgICAgICAgICBpbkVmZmVjdDogJ3J1YmJlckJhbmQnLFxuICAgICAgICAgICAgICAgICAgICBvdXRFZmZlY3Q6ICdmYWRlT3V0J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnU2hha2VyJyxcbiAgICAgICAgICAgICAgICAgICAgaW5FZmZlY3Q6ICdzaGFrZScsXG4gICAgICAgICAgICAgICAgICAgIG91dEVmZmVjdDogJ2ZhZGVPdXQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdGb2N1cycsXG4gICAgICAgICAgICAgICAgICAgIGluRWZmZWN0OiAncHVsc2UnLFxuICAgICAgICAgICAgICAgICAgICBvdXRFZmZlY3Q6ICdmYWRlT3V0J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnRmxhc2gnLFxuICAgICAgICAgICAgICAgICAgICBpbkVmZmVjdDogJ2ZsYXNoJyxcbiAgICAgICAgICAgICAgICAgICAgb3V0RWZmZWN0OiAnZmFkZU91dCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0plbGxvJyxcbiAgICAgICAgICAgICAgICAgICAgaW5FZmZlY3Q6ICdqZWxsbycsXG4gICAgICAgICAgICAgICAgICAgIG91dEVmZmVjdDogJ2ZhZGVPdXQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERJVklERVJcbiAgICAgICAgICAgICAgICAgICAgZGl2aWRlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0ZhZGVkJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnRmFkZWQnLFxuICAgICAgICAgICAgICAgICAgICBpbkVmZmVjdDogJ2ZhZGVJbicsXG4gICAgICAgICAgICAgICAgICAgIG91dEVmZmVjdDogJ2ZhZGVPdXQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdGYWRlZCBVcCcsXG4gICAgICAgICAgICAgICAgICAgIGluRWZmZWN0OiAnZmFkZUluVXAnLFxuICAgICAgICAgICAgICAgICAgICBvdXRFZmZlY3Q6ICdmYWRlT3V0RG93bidcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0ZhZGVkIERvd24nLFxuICAgICAgICAgICAgICAgICAgICBpbkVmZmVjdDogJ2ZhZGVJbkRvd24nLFxuICAgICAgICAgICAgICAgICAgICBvdXRFZmZlY3Q6ICdmYWRlT3V0VXAnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdGYWRlZCBMZWZ0JyxcbiAgICAgICAgICAgICAgICAgICAgaW5FZmZlY3Q6ICdmYWRlSW5MZWZ0JyxcbiAgICAgICAgICAgICAgICAgICAgb3V0RWZmZWN0OiAnZmFkZU91dExlZnQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdGYWRlZCBSaWdodCcsXG4gICAgICAgICAgICAgICAgICAgIGluRWZmZWN0OiAnZmFkZUluUmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICBvdXRFZmZlY3Q6ICdmYWRlT3V0UmlnaHQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERJVklERVJcbiAgICAgICAgICAgICAgICAgICAgZGl2aWRlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1BlZWtpbmcgU2xpZGUnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdTbGlkZSBVcCBQZWVraW5nJyxcbiAgICAgICAgICAgICAgICAgICAgaW5FZmZlY3Q6ICd2c2JiLXNsaWRlLXVwLWNsYXNzaWMtNTAnLFxuICAgICAgICAgICAgICAgICAgICBvdXRFZmZlY3Q6ICd2c2JiLXNsaWRlLWRvd24tY2xhc3NpYy01MCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1NsaWRlIERvd24gUGVla2luZycsXG4gICAgICAgICAgICAgICAgICAgIGluRWZmZWN0OiAndnNiYi1zbGlkZS11cC1jbGFzc2ljLWRvd24tNTAnLFxuICAgICAgICAgICAgICAgICAgICBvdXRFZmZlY3Q6ICd2c2JiLXNsaWRlLWRvd24tY2xhc3NpYy1kb3duLTUwJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvLyBESVZJREVSXG4gICAgICAgICAgICAgICAgICAgIGRpdmlkZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdIaWRkZW4gU2xpZGUnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdTbGlkZSBVcCcsXG4gICAgICAgICAgICAgICAgICAgIGluRWZmZWN0OiAnc2xpZGVJblVwJyxcbiAgICAgICAgICAgICAgICAgICAgb3V0RWZmZWN0OiAnc2xpZGVPdXREb3duJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnU2xpZGUgRG93bicsXG4gICAgICAgICAgICAgICAgICAgIGluRWZmZWN0OiAnc2xpZGVJbkRvd24nLFxuICAgICAgICAgICAgICAgICAgICBvdXRFZmZlY3Q6ICdzbGlkZU91dFVwJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnU2xpZGUgTGVmdCcsXG4gICAgICAgICAgICAgICAgICAgIGluRWZmZWN0OiAnc2xpZGVJbkxlZnQnLFxuICAgICAgICAgICAgICAgICAgICBvdXRFZmZlY3Q6ICdzbGlkZU91dExlZnQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdTbGlkZSBSaWdodCcsXG4gICAgICAgICAgICAgICAgICAgIGluRWZmZWN0OiAnc2xpZGVJblJpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgb3V0RWZmZWN0OiAnc2xpZGVPdXRSaWdodCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRElWSURFUlxuICAgICAgICAgICAgICAgICAgICBkaXZpZGVyOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnWm9vbSdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1pvb20nLFxuICAgICAgICAgICAgICAgICAgICBpbkVmZmVjdDogJ3pvb21JbicsXG4gICAgICAgICAgICAgICAgICAgIG91dEVmZmVjdDogJ3pvb21PdXQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdab29tIFVwJyxcbiAgICAgICAgICAgICAgICAgICAgaW5FZmZlY3Q6ICd6b29tSW5VcCcsXG4gICAgICAgICAgICAgICAgICAgIG91dEVmZmVjdDogJ3pvb21PdXRVcCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1pvb20gRG93bicsXG4gICAgICAgICAgICAgICAgICAgIGluRWZmZWN0OiAnem9vbUluRG93bicsXG4gICAgICAgICAgICAgICAgICAgIG91dEVmZmVjdDogJ3pvb21PdXREb3duJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnWm9vbSBMZWZ0JyxcbiAgICAgICAgICAgICAgICAgICAgaW5FZmZlY3Q6ICd6b29tSW5MZWZ0JyxcbiAgICAgICAgICAgICAgICAgICAgb3V0RWZmZWN0OiAnem9vbU91dExlZnQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdab29tIFJpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgaW5FZmZlY3Q6ICd6b29tSW5SaWdodCcsXG4gICAgICAgICAgICAgICAgICAgIG91dEVmZmVjdDogJ3pvb21PdXRSaWdodCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRElWSURFUlxuICAgICAgICAgICAgICAgICAgICBkaXZpZGVyOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQm91bmNlJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQm91bmNlJyxcbiAgICAgICAgICAgICAgICAgICAgaW5FZmZlY3Q6ICdib3VuY2VJbicsXG4gICAgICAgICAgICAgICAgICAgIG91dEVmZmVjdDogJ2JvdW5jZU91dCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0JvdW5jZSBVcCcsXG4gICAgICAgICAgICAgICAgICAgIGluRWZmZWN0OiAnYm91bmNlSW5VcCcsXG4gICAgICAgICAgICAgICAgICAgIG91dEVmZmVjdDogJ2JvdW5jZU91dERvd24nXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdCb3VuY2UgRG93bicsXG4gICAgICAgICAgICAgICAgICAgIGluRWZmZWN0OiAnYm91bmNlSW5Eb3duJyxcbiAgICAgICAgICAgICAgICAgICAgb3V0RWZmZWN0OiAnYm91bmNlT3V0VXAnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdCb3VuY2UgTGVmdCcsXG4gICAgICAgICAgICAgICAgICAgIGluRWZmZWN0OiAnYm91bmNlSW5MZWZ0JyxcbiAgICAgICAgICAgICAgICAgICAgb3V0RWZmZWN0OiAnYm91bmNlT3V0TGVmdCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0JvdW5jZSBSaWdodCcsXG4gICAgICAgICAgICAgICAgICAgIGluRWZmZWN0OiAnYm91bmNlSW5SaWdodCcsXG4gICAgICAgICAgICAgICAgICAgIG91dEVmZmVjdDogJ2JvdW5jZU91dFJpZ2h0J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAvLyBESVZJREVSXG4gICAgICAgICAgICAgICAgICAgIGRpdmlkZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdSb3RhdGUnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdSb3RhdGUnLFxuICAgICAgICAgICAgICAgICAgICBpbkVmZmVjdDogJ3JvdGF0ZUluJyxcbiAgICAgICAgICAgICAgICAgICAgb3V0RWZmZWN0OiAncm90YXRlT3V0J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnUm90YXRlIFVwIExlZnQnLFxuICAgICAgICAgICAgICAgICAgICBpbkVmZmVjdDogJ3JvdGF0ZUluVXBMZWZ0JyxcbiAgICAgICAgICAgICAgICAgICAgb3V0RWZmZWN0OiAncm90YXRlT3V0RG93bkxlZnQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdSb3RhdGUgVXAgUmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICBpbkVmZmVjdDogJ3JvdGF0ZUluVXBSaWdodCcsXG4gICAgICAgICAgICAgICAgICAgIG91dEVmZmVjdDogJ3JvdGF0ZU91dERvd25SaWdodCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1JvdGF0ZSBEb3duIExlZnQnLFxuICAgICAgICAgICAgICAgICAgICBpbkVmZmVjdDogJ3JvdGF0ZUluRG93bkxlZnQnLFxuICAgICAgICAgICAgICAgICAgICBvdXRFZmZlY3Q6ICdyb3RhdGVPdXRVcExlZnQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERJVklERVJcbiAgICAgICAgICAgICAgICAgICAgZGl2aWRlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0ZsaXAnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdIb3Jpem9udGFsIEZsaXAnLFxuICAgICAgICAgICAgICAgICAgICBpbkVmZmVjdDogJ2ZsaXBJblgnLFxuICAgICAgICAgICAgICAgICAgICBvdXRFZmZlY3Q6ICdmbGlwT3V0WCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1ZlcnRpY2FsIEZsaXAnLFxuICAgICAgICAgICAgICAgICAgICBpbkVmZmVjdDogJ2ZsaXBJblknLFxuICAgICAgICAgICAgICAgICAgICBvdXRFZmZlY3Q6ICdmbGlwT3V0WSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiB1dGlscztcbn0pOyJdLCJmaWxlIjoic2VydmljZXMvdXRpbHMuc2VydmljZS5qcyJ9

vsbbAngularApp.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function(item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmaWx0ZXJzL3Bvcy5maWx0ZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsidnNiYkFuZ3VsYXJBcHAuZmlsdGVyKCdwcm9wc0ZpbHRlcicsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmdW5jdGlvbihpdGVtcywgcHJvcHMpIHtcbiAgICAgICAgdmFyIG91dCA9IFtdO1xuXG4gICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkoaXRlbXMpKSB7XG4gICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHByb3BzKTtcblxuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1NYXRjaGVzID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3AgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IHByb3BzW3Byb3BdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtW3Byb3BdLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRleHQpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbU1hdGNoZXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaXRlbU1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBMZXQgdGhlIG91dHB1dCBiZSB0aGUgaW5wdXQgdW50b3VjaGVkXG4gICAgICAgICAgICBvdXQgPSBpdGVtcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfTtcbn0pOyJdLCJmaWxlIjoiZmlsdGVycy9wb3MuZmlsdGVyLmpzIn0=

/**
 * jquery.pfold.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2012, Codrops
 * http://www.codrops.com
 */

;(function ($, window, undefined) {

    'use strict';

    /*
     * debouncedresize: special jQuery event that happens once after a window resize
     *
     * latest version and complete README available on Github:
     * https://github.com/louisremi/jquery-smartresize/blob/master/jquery.debouncedresize.js
     *
     * Copyright 2011 @louis_remi
     * Licensed under the MIT license.
     */
    var $event = $.event,
        $special,
        resizeTimeout;

    $special = $event.special.debouncedresize = {
        setup: function () {
            $(this).on("resize", $special.handler);
        },
        teardown: function () {
            console.log('tear down ', $(this));
            $(this).off("resize", $special.handler);
        },
        handler: function (event, execAsap) {
            // Save the context
            var context = this,
                args = arguments,
                dispatch = function () {
                    // set correct event type
                    event.type = "debouncedresize";
                    $event.dispatch.apply(context, args);
                };

            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }

            execAsap ?
                dispatch() :
                resizeTimeout = setTimeout(dispatch, $special.threshold);
        },
        threshold: 50
    };

    // global
    var $window = $(window),
        Modernizr = window.Modernizr;

    $.PFold = function (options, element) {

        this.$el = $(element);
        this._init(options);

    };

    // the options
    $.PFold.defaults = {
        // perspective value
        perspective: 1200,
        // each folding step's speed
        speed: 450,
        // each folding step's easing
        easing: 'linear',
        // delay between each (un)folding step (ms)
        folddelay: 0,
        // number of times the element will fold
        folds: 2,
        // the direction of each unfolding step
        folddirection: ['right', 'top'],
        // use overlays to simulate a shadow for each folding step
        overlays: true,
        // the main container moves (translation) in order to keep its initial position
        centered: false,
        // allows us to specify a different speed for the container's translation
        // values range : [0 - 1]
        // if 0 the container jumps immediately to the final position (translation).
        // this is only valid if centered is true
        containerSpeedFactor: 1,
        // easing for the container transition
        // this is only valid if centered is true
        containerEasing: 'linear',
        // callbacks
        onEndFolding: function () {
            return false;
        },
        onEndUnfolding: function () {
            return false;
        }
    };

    $.PFold.prototype = {

        _destroyPfold: function () {
            this._unbindEvents();
            this.$el.removeData();
            //this.$el.removeAttr('style');
            var $initialContentEl = this.$el.find('div.uc-initial-content').first();
            var $finalContentEl = this.$el.find('div.uc-final-content');
            this.$el.html('');
            this.$el.append($initialContentEl).append($finalContentEl);
        },
        _unbindEvents: function () {
            $window.off('debouncedresize.pfold');
        },
        _init: function (options) {

            // options
            this.options = $.extend(true, {}, $.PFold.defaults, options);

            // https://github.com/twitter/bootstrap/issues/2870
            this.transEndEventNames = {
                'WebkitTransition': 'webkitTransitionEnd',
                'MozTransition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'msTransition': 'MSTransitionEnd',
                'transition': 'transitionend'
            };
            this.transEndEventName = this.transEndEventNames[Modernizr.prefixed('transition')];

            // suport for css 3d transforms and css transitions
            this.support = Modernizr.csstransitions && Modernizr.csstransforms3d;

            // apply perspective to the main container
            if (this.support) {

                this.$el.css('perspective', this.options.perspective + 'px');

                // set the transition to the main container
                // we will need to move it if:
                // this.options.centered is true;
                // the opened element goes outside of the viewport
                this.$el.css('transition', 'all ' + ( this.options.speed * this.options.folds * this.options.containerSpeedFactor ) + 'ms ' + this.options.containerEasing);

            }

            // initial sizes
            this.initialDim = {
                width: this.$el.width(),
                height: this.$el.height(),
                left: 0,
                top: 0
            };

            // change the layout
            this._layout();

            // cache some initial values:
            // initial content
            this.$iContent = this.$el.find('.uc-initial');
            this.iContent = this.$iContent.html();
            // final content
            this.$fContent = this.$el.find('.uc-final');
            this.fContent = this.$fContent.html();
            // this element is inserted in the main container and it will contain the initial and final content elements
            this.$finalEl = $('<div class="uc-final-wrapper"></div>').append(this.$iContent.clone().hide(), this.$fContent).hide();
            this.$el.append(this.$finalEl);

            // initial element's offset
            this._setDimOffset();

            // status
            this.opened = false;
            this.animating = false;

            // initialize events
            this._initEvents();

        },

        _updateDims: function () {
            this.initialDim = {
                width: this.$el.width(),
                height: this.$el.height(),
                left: 0,
                top: 0
            };
            // change the layout
            this._layout();

            // initial content
            this.fContent = this.$fContent.html();

            // initial element's offset
            this._setDimOffset();

            // status
            this.opened = false;
            this.animating = false;

            // initialize events
            this._initEvents();
        },

        // changes the initial html structure
        // adds wrappers to the uc-initial-content and uc-final-content divs
        _layout: function () {

            var $initialContentEl = this.$el.children('div.uc-initial-content'),
                finalDim = this._getFinalDim(),
                $finalContentEl = this.$el.children('div.uc-final-content').css({
                    width: finalDim.width,
                    height: finalDim.height
                });

            $initialContentEl.wrap('<div class="uc-initial"></div>');
            $finalContentEl.show().wrap($('<div class="uc-final"></div>'));

        },
        // initialize the necessary events
        _initEvents: function () {

            var self = this;

            $window.on('debouncedresize.pfold', function (event) {

                // update offsets
                self._setDimOffset();

            });

        },
        // set/update offsets
        _setDimOffset: function () {

            this.initialDim.offsetL = this.$el.offset().left - $window.scrollLeft();
            this.initialDim.offsetT = this.$el.offset().top - $window.scrollTop();
            this.initialDim.offsetR = $window.width() - this.initialDim.offsetL - this.initialDim.width;
            this.initialDim.offsetB = $window.height() - this.initialDim.offsetT - this.initialDim.height;

        },
        // gets the values needed to translate the main container (if options.centered is true)
        _getTranslationValue: function () {

            var x = 0,
                y = 0,
                horizTimes = 0,
                vertTimes = 0;

            for (var i = 0; i < this.options.folds; ++i) {

                // bottom as default
                var dir = this.options.folddirection[i] || 'bottom';

                switch (dir) {

                    case 'left' :

                        x += this.initialDim.width * Math.pow(2, horizTimes) / 2;
                        horizTimes += 1;
                        break;

                    case 'right' :

                        x -= this.initialDim.width * Math.pow(2, horizTimes) / 2;
                        horizTimes += 1;
                        break;

                    case 'top' :

                        y += this.initialDim.height * Math.pow(2, vertTimes) / 2;
                        vertTimes += 1;
                        break;

                    case 'bottom' :

                        y -= this.initialDim.height * Math.pow(2, vertTimes) / 2;
                        vertTimes += 1;
                        break;

                }

            }

            return {
                x: x,
                y: y
            };

        },
        // gets the accumulated values for left, right, top and bottom once the element is opened
        _getAccumulatedValue: function () {

            var l = 0,
                r = 0,
                t = 0,
                b = 0,
                horizTimes = 0,
                vertTimes = 0;

            for (var i = 0; i < this.options.folds; ++i) {

                // bottom as default
                var dir = this.options.folddirection[i] || 'bottom';

                switch (dir) {

                    case 'left' :

                        l += this.initialDim.width * Math.pow(2, horizTimes);
                        horizTimes += 1;
                        break;

                    case 'right' :

                        r += this.initialDim.width * Math.pow(2, horizTimes);
                        horizTimes += 1;
                        break;

                    case 'top' :

                        t += this.initialDim.height * Math.pow(2, vertTimes);
                        vertTimes += 1;
                        break;

                    case 'bottom' :

                        b += this.initialDim.height * Math.pow(2, vertTimes);
                        vertTimes += 1;
                        break;

                }

            }

            return {
                l: l,
                r: r,
                t: t,
                b: b
            };

        },
        // gets the width and height of the element when it is opened
        _getFinalDim: function () {

            var l = 0,
                r = 0,
                t = 0,
                b = 0,
                horizTimes = 0,
                vertTimes = 0;

            for (var i = 0; i < this.options.folds; ++i) {

                // bottom as default
                var dir = this.options.folddirection[i] || 'bottom';

                switch (dir) {

                    case 'left' :
                    case 'right' :

                        horizTimes += 1;
                        break;

                    case 'top' :
                    case 'bottom' :

                        vertTimes += 1;
                        break;

                }

            }

            return {
                width: this.initialDim.width * Math.pow(2, horizTimes),
                height: this.initialDim.height * Math.pow(2, vertTimes)
            };

        },
        // returns the sizes and positions for the element after each (un)folding step
        _updateStepStyle: function (action) {

            var w, h, l, t;

            if (action === 'fold') {

                w = this.lastDirection === 'left' || this.lastDirection === 'right' ? this.lastStyle.width / 2 : this.lastStyle.width,
                    h = this.lastDirection === 'left' || this.lastDirection === 'right' ? this.lastStyle.height : this.lastStyle.height / 2,
                    l = this.lastDirection === 'left' ? this.lastStyle.left + this.lastStyle.width / 2 : this.lastStyle.left,
                    t = this.lastDirection === 'top' ? this.lastStyle.top + this.lastStyle.height / 2 : this.lastStyle.top;

            }
            else {

                w = this.lastDirection === 'left' || this.lastDirection === 'right' ? this.lastStyle.width * 2 : this.lastStyle.width,
                    h = this.lastDirection === 'left' || this.lastDirection === 'right' ? this.lastStyle.height : this.lastStyle.height * 2,
                    l = this.lastDirection === 'left' ? this.lastStyle.left - this.lastStyle.width : this.lastStyle.left,
                    t = this.lastDirection === 'top' ? this.lastStyle.top - this.lastStyle.height : this.lastStyle.top;

            }

            return {
                width: w,
                height: h,
                left: l,
                top: t
            };

        },
        // get the opposite direction
        _getOppositeDirection: function (realdirection) {

            var rvd;

            switch (realdirection) {

                case 'left' :
                    rvd = 'right';
                    break;
                case 'right' :
                    rvd = 'left';
                    break;
                case 'top' :
                    rvd = 'bottom';
                    break;
                case 'bottom' :
                    rvd = 'top';
                    break;

            }

            return rvd;

        },
        // main function: unfolds and folds the element [options.folds] times by using recursive calls
        _start: function (action, step) {

            // Basically we are replacing the element's content with 2 divisions, the top and bottom elements.
            // The top element will have a front and back faces. The front has the initial content for the first step
            // and the back will have the final content for the last step. For all the other cases the top element will be blank.
            // The bottom element will have the final content for the last step and will be blank for all the other cases.
            // We need to keep the right sizes and positions for these 2 elements, so we need to cache the previous step's state.

            step |= 0;

            var self = this,
                styleCSS = ( action === 'fold' ) ? {
                    width: this.lastStyle.width,
                    height: this.lastStyle.height,
                    left: this.lastStyle.left,
                    top: this.lastStyle.top
                } : this.initialDim,
                contentTopFront = '', contentBottom = '', contentTopBack = '',
                // direction for step [step]
                // bottom is the default value if none is present
                direction = ( action === 'fold' ) ?
                    this.options.folddirection[this.options.folds - 1 - step] || 'bottom' :
                    this.options.folddirection[step] || 'bottom',
                // future direction value (only for the "fold" action)
                nextdirection = ( action === 'fold' ) ? this.options.folddirection[this.options.folds - 2 - step] || 'bottom' : '';

            // remove uc-part divs inside the container (the top and bottom elements)
            this.$el.find('div.uc-part').remove();

            switch (step) {

                // first step & last transition step
                case 0 :
                case this.options.folds - 1 :

                    if (action === 'fold') {

                        if (step === this.options.folds - 1) {

                            styleCSS = this.initialDim;
                            contentTopFront = this.iContent;

                        }

                        if (step === 0) {

                            this._setDimOffset();

                            // reset the translation of the main container
                            this.$el.css({left: 0, top: 0});

                            var content = this._setLastStep(direction, styleCSS),
                                contentBottom = content.bottom,
                                contentTopBack = content.top;

                            this.$finalEl.hide().children().hide();

                        }

                    }
                    else { // unfolding

                        if (step === 0) {

                            this._setDimOffset();

                            // if options.centered is true, we need to center the container.
                            // either ways we need to make sure the container does not move outside the viewport.
                            // let's get the correct translation values for the container's transition
                            var coords = this._getTranslationViewport();

                            this.$el.addClass('uc-current').css({left: coords.ftx, top: coords.fty});

                            contentTopFront = this.iContent;

                            this.$finalEl.hide().children().hide();

                        }
                        else {

                            styleCSS = this._updateStepStyle(action);

                        }

                        if (step === this.options.folds - 1) {

                            var content = this._setLastStep(direction, styleCSS),
                                contentBottom = content.bottom,
                                contentTopBack = content.top;

                        }

                    }

                    break;

                // last step is to replace the topElement and bottomElement with a division that has the final content
                case this.options.folds :

                    styleCSS = ( action === 'fold') ? this.initialDim : this._updateStepStyle(action);

                    // remove top and bottom elements
                    var contentIdx = ( action === 'fold' ) ? 0 : 1;
                    this.$el
                        .find('.uc-part')
                        .remove();

                    this.$finalEl.css(styleCSS).show().children().eq(contentIdx).show();

                    this.opened = ( action === 'fold' ) ? false : true;
                    this.animating = false;
                    // nothing else to do
                    if (action === 'fold') {

                        this.$el.removeClass('uc-current');
                        this.options.onEndFolding();

                    }
                    else {

                        this.options.onEndUnfolding();

                    }
                    return false;

                    break;

                // all the other steps
                default :

                    // style of new layout will depend on the last step direction
                    styleCSS = this._updateStepStyle(action);

                    break;

            }

            // transition properties for the step
            if (this.support) {

                styleCSS.transition = 'all ' + this.options.speed + 'ms ' + this.options.easing;

            }

            var unfoldClass = 'uc-unfold-' + direction,
                topElClasses = ( action === 'fold' ) ? 'uc-unfold uc-part ' + unfoldClass : 'uc-part ' + unfoldClass,
                $topEl = $('<div class="' + topElClasses + '"><div class="uc-front">' + contentTopFront + '</div><div class="uc-back">' + contentTopBack + '</div></div>').css(styleCSS),
                $bottomEl = $('<div class="uc-part uc-single">' + contentBottom + '</div>').css(styleCSS);

            // cache last direction and style
            this.lastDirection = ( action === 'fold' ) ? nextdirection : direction;
            this.lastStyle = styleCSS;

            // append new elements
            this.$el.append($bottomEl, $topEl);

            // add overlays
            if (this.options.overlays && this.support) {

                this._addOverlays(action, $bottomEl, $topEl);

            }

            setTimeout(function () {

                // apply style
                ( action === 'fold' ) ? $topEl.removeClass('uc-unfold') : $topEl.addClass('uc-unfold');

                if (self.support) {

                    $topEl.on(self.transEndEventName, function (event) {

                        if (event.target.className !== 'uc-flipoverlay' && step < self.options.folds) {

                            // goto next step in [options.folddelay] ms
                            setTimeout(function () {
                                self._start(action, step + 1);
                            }, self.options.folddelay);

                        }

                    });

                }
                else {

                    // goto next step
                    self._start(action, step + 1);

                }

                if (self.options.overlays && self.support) {

                    var bo = ( action === 'fold' ) ? 1 : 0,
                        tbo = ( action === 'fold' ) ? .5 : 0,
                        tfo = ( action === 'fold' ) ? 0 : .5;

                    self.$bottomOverlay.css('opacity', bo);
                    self.$topBackOverlay.css('opacity', tbo);
                    self.$topFrontOverlay.css('opacity', tfo);

                }

            }, 30);

        },
        // gets the translation values for the container's transition
        _getTranslationViewport: function () {

            // the accumulatedValues stores the left, right, top and bottom increments to the final/opened element relatively to the initial/closed element
            var accumulatedValues = this._getAccumulatedValue(),
                tx = 0,
                ty = 0;

            // the final offsets for the opened element
            this.fOffsetL = this.initialDim.offsetL - accumulatedValues.l;
            this.fOffsetT = this.initialDim.offsetT - accumulatedValues.t;
            this.fOffsetR = this.initialDim.offsetR - accumulatedValues.r;
            this.fOffsetB = this.initialDim.offsetB - accumulatedValues.b;

            if (this.fOffsetL < 0) {
                tx = Math.abs(this.fOffsetL);
            }
            if (this.fOffsetT < 0) {
                ty = Math.abs(this.fOffsetT);
            }
            if (this.fOffsetR < 0) {
                tx -= Math.abs(this.fOffsetR);
            }
            if (this.fOffsetB < 0) {
                ty -= Math.abs(this.fOffsetB);
            }

            // final translation values
            var ftx = tx,
                fty = ty;

            if (this.options.centered) {

                var translationValue = this._getTranslationValue();

                if (translationValue.x > 0 && this.fOffsetR + translationValue.x >= 0) {

                    ftx = ( this.fOffsetL >= 0 ) ? Math.min(translationValue.x, this.fOffsetR) : translationValue.x + ( tx - translationValue.x );

                }
                else if (translationValue.x < 0 && this.fOffsetL + translationValue.x >= 0) {

                    ftx = ( this.fOffsetR >= 0 ) ? Math.min(translationValue.x, this.fOffsetL) : translationValue.x + ( tx - translationValue.x );

                }
                else {

                    ftx = translationValue.x + ( tx - translationValue.x );

                }

                if (translationValue.y > 0 && this.fOffsetB + translationValue.y >= 0) {

                    fty = ( this.fOffsetT >= 0 ) ? Math.min(translationValue.y, this.fOffsetB) : translationValue.y + ( ty - translationValue.y );

                }
                else if (translationValue.y < 0 && this.fOffsetT + translationValue.y >= 0) {

                    fty = ( this.fOffsetB >= 0 ) ? Math.min(translationValue.y, this.fOffsetT) : translationValue.y + ( ty - translationValue.y );

                }
                else {

                    fty = translationValue.y + ( ty - translationValue.y );

                }

            }

            return {
                ftx: ftx,
                fty: fty
            };

        },
        // sets the last step's content
        _setLastStep: function (direction, styleCSS) {

            var contentBottom, contentTopBack,
                contentBottomStyle = '',
                contentTopBackStyle = '';

            switch (direction) {

                case 'bottom' :
                    contentTopBackStyle = 'margin-top: -' + styleCSS.height + 'px';
                    break;
                case 'top' :
                    contentBottomStyle = 'margin-top: -' + styleCSS.height + 'px';
                    break;
                case 'left' :
                    contentTopBackStyle = 'width:' + ( styleCSS.width * 2 ) + 'px';
                    contentBottomStyle = 'width:' + ( styleCSS.width * 2 ) + 'px;margin-left: -' + styleCSS.width + 'px';
                    break;
                case 'right' :
                    contentTopBackStyle = 'with:' + ( styleCSS.width * 2 ) + 'px;margin-left: -' + styleCSS.width + 'px';
                    contentBottomStyle = 'width:' + ( styleCSS.width * 2 ) + 'px';
                    break;

            }

            contentBottom = '<div class="uc-inner"><div class="uc-inner-content" style="' + contentBottomStyle + '">' + this.fContent + '</div></div>';

            var contentTopBackClasses = direction === 'top' || direction === 'bottom' ? 'uc-inner uc-inner-rotate' : 'uc-inner';
            contentTopBack = '<div class="' + contentTopBackClasses + '"><div class="uc-inner-content" style="' + contentTopBackStyle + '">' + this.fContent + '</div></div>';

            return {
                bottom: contentBottom,
                top: contentTopBack
            };

        },
        // adds overlays to the "(un)folding" elements if the options.overlays is true
        _addOverlays: function (action, $bottomEl, $topEl) {

            var bottomOverlayStyle, topFrontOverlayStyle, topBackOverlayStyle;

            this.$bottomOverlay = $('<div class="uc-overlay"></div>');
            this.$topFrontOverlay = $('<div class="uc-flipoverlay"></div>');
            this.$topBackOverlay = $('<div class="uc-flipoverlay"></div>');

            if (action === 'fold') {

                bottomOverlayStyle = {
                    transition: 'opacity ' + ( this.options.speed / 2 ) + 'ms ' + this.options.easing + ' ' + ( this.options.speed / 2 ) + 'ms'
                };

                topFrontOverlayStyle = {
                    opacity: .5,
                    transition: 'opacity ' + ( this.options.speed / 2 ) + 'ms ' + this.options.easing
                };

                topBackOverlayStyle = {
                    opacity: 0,
                    transition: 'opacity ' + ( this.options.speed / 2 ) + 'ms ' + this.options.easing
                };

            }
            else {

                bottomOverlayStyle = {
                    opacity: 1,
                    transition: 'opacity ' + ( this.options.speed / 2 ) + 'ms ' + this.options.easing
                };

                topFrontOverlayStyle = {
                    transition: 'opacity ' + ( this.options.speed / 2 ) + 'ms ' + this.options.easing
                };

                topBackOverlayStyle = {
                    opacity: .5,
                    transition: 'opacity ' + ( this.options.speed / 2 ) + 'ms ' + this.options.easing + ' ' + ( this.options.speed / 2 ) + 'ms'
                };

            }

            $bottomEl.append(this.$bottomOverlay.css(bottomOverlayStyle));
            $topEl.children('div.uc-front')
                .append(this.$topFrontOverlay.css(topFrontOverlayStyle))
                .end()
                .children('div.uc-back')
                .append(this.$topBackOverlay.css(topBackOverlayStyle));

        },
        // public method: unfolds the element
        unfold: function () {

            // if opened already or currently (un)folding return
            if (this.opened || this.animating) {

                return false;

            }

            this.animating = true;
            this._start('unfold');

        },
        // public method: folds the element
        fold: function () {

            // if not opened or currently (un)folding return
            if (!this.opened || this.animating) {

                return false;

            }

            this.animating = true;
            this._start('fold');

        },
        // public method: returns 'opened' or 'closed'
        getStatus: function () {

            return ( this.opened ) ? 'opened' : 'closed';

        }

    };

    var logError = function (message) {

        if (window.console) {

            window.console.error(message);

        }

    };

    $.fn.pfold = function (options) {

        var instance = $.data(this, 'pfold');
        console.log('instance ', instance);

        if (typeof options === 'string') {

            var args = Array.prototype.slice.call(arguments, 1);

            this.each(function () {

                if (!instance) {

                    logError("cannot call methods on pfold prior to initialization; " +
                        "attempted to call method '" + options + "'");
                    return;

                }

                if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {

                    logError("no such method '" + options + "' for pfold instance");
                    return;

                }

                instance[options].apply(instance, args);

            });

        }
        else {
            this.each(function () {

                console.log('instance 2', instance);
                if (instance) {

                    instance._init();

                }
                else {

                    instance = $.data(this, 'pfold', new $.PFold(options, this));

                }

            });

        }
        console.log('instance ', instance);

        return instance;

    };

})(jQuery, window);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ0aGVtZXMvZm9sZGluZy9qcy9qcXVlcnkucGZvbGQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBqcXVlcnkucGZvbGQuanMgdjEuMC4wXG4gKiBodHRwOi8vd3d3LmNvZHJvcHMuY29tXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMiwgQ29kcm9wc1xuICogaHR0cDovL3d3dy5jb2Ryb3BzLmNvbVxuICovXG5cbjsoZnVuY3Rpb24gKCQsIHdpbmRvdywgdW5kZWZpbmVkKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvKlxuICAgICAqIGRlYm91bmNlZHJlc2l6ZTogc3BlY2lhbCBqUXVlcnkgZXZlbnQgdGhhdCBoYXBwZW5zIG9uY2UgYWZ0ZXIgYSB3aW5kb3cgcmVzaXplXG4gICAgICpcbiAgICAgKiBsYXRlc3QgdmVyc2lvbiBhbmQgY29tcGxldGUgUkVBRE1FIGF2YWlsYWJsZSBvbiBHaXRodWI6XG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL2xvdWlzcmVtaS9qcXVlcnktc21hcnRyZXNpemUvYmxvYi9tYXN0ZXIvanF1ZXJ5LmRlYm91bmNlZHJlc2l6ZS5qc1xuICAgICAqXG4gICAgICogQ29weXJpZ2h0IDIwMTEgQGxvdWlzX3JlbWlcbiAgICAgKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gICAgICovXG4gICAgdmFyICRldmVudCA9ICQuZXZlbnQsXG4gICAgICAgICRzcGVjaWFsLFxuICAgICAgICByZXNpemVUaW1lb3V0O1xuXG4gICAgJHNwZWNpYWwgPSAkZXZlbnQuc3BlY2lhbC5kZWJvdW5jZWRyZXNpemUgPSB7XG4gICAgICAgIHNldHVwOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpLm9uKFwicmVzaXplXCIsICRzcGVjaWFsLmhhbmRsZXIpO1xuICAgICAgICB9LFxuICAgICAgICB0ZWFyZG93bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RlYXIgZG93biAnLCAkKHRoaXMpKTtcbiAgICAgICAgICAgICQodGhpcykub2ZmKFwicmVzaXplXCIsICRzcGVjaWFsLmhhbmRsZXIpO1xuICAgICAgICB9LFxuICAgICAgICBoYW5kbGVyOiBmdW5jdGlvbiAoZXZlbnQsIGV4ZWNBc2FwKSB7XG4gICAgICAgICAgICAvLyBTYXZlIHRoZSBjb250ZXh0XG4gICAgICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0IGNvcnJlY3QgZXZlbnQgdHlwZVxuICAgICAgICAgICAgICAgICAgICBldmVudC50eXBlID0gXCJkZWJvdW5jZWRyZXNpemVcIjtcbiAgICAgICAgICAgICAgICAgICAgJGV2ZW50LmRpc3BhdGNoLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChyZXNpemVUaW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHJlc2l6ZVRpbWVvdXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBleGVjQXNhcCA/XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goKSA6XG4gICAgICAgICAgICAgICAgcmVzaXplVGltZW91dCA9IHNldFRpbWVvdXQoZGlzcGF0Y2gsICRzcGVjaWFsLnRocmVzaG9sZCk7XG4gICAgICAgIH0sXG4gICAgICAgIHRocmVzaG9sZDogNTBcbiAgICB9O1xuXG4gICAgLy8gZ2xvYmFsXG4gICAgdmFyICR3aW5kb3cgPSAkKHdpbmRvdyksXG4gICAgICAgIE1vZGVybml6ciA9IHdpbmRvdy5Nb2Rlcm5penI7XG5cbiAgICAkLlBGb2xkID0gZnVuY3Rpb24gKG9wdGlvbnMsIGVsZW1lbnQpIHtcblxuICAgICAgICB0aGlzLiRlbCA9ICQoZWxlbWVudCk7XG4gICAgICAgIHRoaXMuX2luaXQob3B0aW9ucyk7XG5cbiAgICB9O1xuXG4gICAgLy8gdGhlIG9wdGlvbnNcbiAgICAkLlBGb2xkLmRlZmF1bHRzID0ge1xuICAgICAgICAvLyBwZXJzcGVjdGl2ZSB2YWx1ZVxuICAgICAgICBwZXJzcGVjdGl2ZTogMTIwMCxcbiAgICAgICAgLy8gZWFjaCBmb2xkaW5nIHN0ZXAncyBzcGVlZFxuICAgICAgICBzcGVlZDogNDUwLFxuICAgICAgICAvLyBlYWNoIGZvbGRpbmcgc3RlcCdzIGVhc2luZ1xuICAgICAgICBlYXNpbmc6ICdsaW5lYXInLFxuICAgICAgICAvLyBkZWxheSBiZXR3ZWVuIGVhY2ggKHVuKWZvbGRpbmcgc3RlcCAobXMpXG4gICAgICAgIGZvbGRkZWxheTogMCxcbiAgICAgICAgLy8gbnVtYmVyIG9mIHRpbWVzIHRoZSBlbGVtZW50IHdpbGwgZm9sZFxuICAgICAgICBmb2xkczogMixcbiAgICAgICAgLy8gdGhlIGRpcmVjdGlvbiBvZiBlYWNoIHVuZm9sZGluZyBzdGVwXG4gICAgICAgIGZvbGRkaXJlY3Rpb246IFsncmlnaHQnLCAndG9wJ10sXG4gICAgICAgIC8vIHVzZSBvdmVybGF5cyB0byBzaW11bGF0ZSBhIHNoYWRvdyBmb3IgZWFjaCBmb2xkaW5nIHN0ZXBcbiAgICAgICAgb3ZlcmxheXM6IHRydWUsXG4gICAgICAgIC8vIHRoZSBtYWluIGNvbnRhaW5lciBtb3ZlcyAodHJhbnNsYXRpb24pIGluIG9yZGVyIHRvIGtlZXAgaXRzIGluaXRpYWwgcG9zaXRpb25cbiAgICAgICAgY2VudGVyZWQ6IGZhbHNlLFxuICAgICAgICAvLyBhbGxvd3MgdXMgdG8gc3BlY2lmeSBhIGRpZmZlcmVudCBzcGVlZCBmb3IgdGhlIGNvbnRhaW5lcidzIHRyYW5zbGF0aW9uXG4gICAgICAgIC8vIHZhbHVlcyByYW5nZSA6IFswIC0gMV1cbiAgICAgICAgLy8gaWYgMCB0aGUgY29udGFpbmVyIGp1bXBzIGltbWVkaWF0ZWx5IHRvIHRoZSBmaW5hbCBwb3NpdGlvbiAodHJhbnNsYXRpb24pLlxuICAgICAgICAvLyB0aGlzIGlzIG9ubHkgdmFsaWQgaWYgY2VudGVyZWQgaXMgdHJ1ZVxuICAgICAgICBjb250YWluZXJTcGVlZEZhY3RvcjogMSxcbiAgICAgICAgLy8gZWFzaW5nIGZvciB0aGUgY29udGFpbmVyIHRyYW5zaXRpb25cbiAgICAgICAgLy8gdGhpcyBpcyBvbmx5IHZhbGlkIGlmIGNlbnRlcmVkIGlzIHRydWVcbiAgICAgICAgY29udGFpbmVyRWFzaW5nOiAnbGluZWFyJyxcbiAgICAgICAgLy8gY2FsbGJhY2tzXG4gICAgICAgIG9uRW5kRm9sZGluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBvbkVuZFVuZm9sZGluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgICQuUEZvbGQucHJvdG90eXBlID0ge1xuXG4gICAgICAgIF9kZXN0cm95UGZvbGQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuX3VuYmluZEV2ZW50cygpO1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlRGF0YSgpO1xuICAgICAgICAgICAgLy90aGlzLiRlbC5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAgICAgICAgICAgdmFyICRpbml0aWFsQ29udGVudEVsID0gdGhpcy4kZWwuZmluZCgnZGl2LnVjLWluaXRpYWwtY29udGVudCcpLmZpcnN0KCk7XG4gICAgICAgICAgICB2YXIgJGZpbmFsQ29udGVudEVsID0gdGhpcy4kZWwuZmluZCgnZGl2LnVjLWZpbmFsLWNvbnRlbnQnKTtcbiAgICAgICAgICAgIHRoaXMuJGVsLmh0bWwoJycpO1xuICAgICAgICAgICAgdGhpcy4kZWwuYXBwZW5kKCRpbml0aWFsQ29udGVudEVsKS5hcHBlbmQoJGZpbmFsQ29udGVudEVsKTtcbiAgICAgICAgfSxcbiAgICAgICAgX3VuYmluZEV2ZW50czogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHdpbmRvdy5vZmYoJ2RlYm91bmNlZHJlc2l6ZS5wZm9sZCcpO1xuICAgICAgICB9LFxuICAgICAgICBfaW5pdDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICAgICAgICAgICAgLy8gb3B0aW9uc1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sICQuUEZvbGQuZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdHdpdHRlci9ib290c3RyYXAvaXNzdWVzLzI4NzBcbiAgICAgICAgICAgIHRoaXMudHJhbnNFbmRFdmVudE5hbWVzID0ge1xuICAgICAgICAgICAgICAgICdXZWJraXRUcmFuc2l0aW9uJzogJ3dlYmtpdFRyYW5zaXRpb25FbmQnLFxuICAgICAgICAgICAgICAgICdNb3pUcmFuc2l0aW9uJzogJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgICAgICAgICAgICdPVHJhbnNpdGlvbic6ICdvVHJhbnNpdGlvbkVuZCcsXG4gICAgICAgICAgICAgICAgJ21zVHJhbnNpdGlvbic6ICdNU1RyYW5zaXRpb25FbmQnLFxuICAgICAgICAgICAgICAgICd0cmFuc2l0aW9uJzogJ3RyYW5zaXRpb25lbmQnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy50cmFuc0VuZEV2ZW50TmFtZSA9IHRoaXMudHJhbnNFbmRFdmVudE5hbWVzW01vZGVybml6ci5wcmVmaXhlZCgndHJhbnNpdGlvbicpXTtcblxuICAgICAgICAgICAgLy8gc3Vwb3J0IGZvciBjc3MgM2QgdHJhbnNmb3JtcyBhbmQgY3NzIHRyYW5zaXRpb25zXG4gICAgICAgICAgICB0aGlzLnN1cHBvcnQgPSBNb2Rlcm5penIuY3NzdHJhbnNpdGlvbnMgJiYgTW9kZXJuaXpyLmNzc3RyYW5zZm9ybXMzZDtcblxuICAgICAgICAgICAgLy8gYXBwbHkgcGVyc3BlY3RpdmUgdG8gdGhlIG1haW4gY29udGFpbmVyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXBwb3J0KSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiRlbC5jc3MoJ3BlcnNwZWN0aXZlJywgdGhpcy5vcHRpb25zLnBlcnNwZWN0aXZlICsgJ3B4Jyk7XG5cbiAgICAgICAgICAgICAgICAvLyBzZXQgdGhlIHRyYW5zaXRpb24gdG8gdGhlIG1haW4gY29udGFpbmVyXG4gICAgICAgICAgICAgICAgLy8gd2Ugd2lsbCBuZWVkIHRvIG1vdmUgaXQgaWY6XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5vcHRpb25zLmNlbnRlcmVkIGlzIHRydWU7XG4gICAgICAgICAgICAgICAgLy8gdGhlIG9wZW5lZCBlbGVtZW50IGdvZXMgb3V0c2lkZSBvZiB0aGUgdmlld3BvcnRcbiAgICAgICAgICAgICAgICB0aGlzLiRlbC5jc3MoJ3RyYW5zaXRpb24nLCAnYWxsICcgKyAoIHRoaXMub3B0aW9ucy5zcGVlZCAqIHRoaXMub3B0aW9ucy5mb2xkcyAqIHRoaXMub3B0aW9ucy5jb250YWluZXJTcGVlZEZhY3RvciApICsgJ21zICcgKyB0aGlzLm9wdGlvbnMuY29udGFpbmVyRWFzaW5nKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpbml0aWFsIHNpemVzXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxEaW0gPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuJGVsLndpZHRoKCksXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLiRlbC5oZWlnaHQoKSxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIHRvcDogMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gY2hhbmdlIHRoZSBsYXlvdXRcbiAgICAgICAgICAgIHRoaXMuX2xheW91dCgpO1xuXG4gICAgICAgICAgICAvLyBjYWNoZSBzb21lIGluaXRpYWwgdmFsdWVzOlxuICAgICAgICAgICAgLy8gaW5pdGlhbCBjb250ZW50XG4gICAgICAgICAgICB0aGlzLiRpQ29udGVudCA9IHRoaXMuJGVsLmZpbmQoJy51Yy1pbml0aWFsJyk7XG4gICAgICAgICAgICB0aGlzLmlDb250ZW50ID0gdGhpcy4kaUNvbnRlbnQuaHRtbCgpO1xuICAgICAgICAgICAgLy8gZmluYWwgY29udGVudFxuICAgICAgICAgICAgdGhpcy4kZkNvbnRlbnQgPSB0aGlzLiRlbC5maW5kKCcudWMtZmluYWwnKTtcbiAgICAgICAgICAgIHRoaXMuZkNvbnRlbnQgPSB0aGlzLiRmQ29udGVudC5odG1sKCk7XG4gICAgICAgICAgICAvLyB0aGlzIGVsZW1lbnQgaXMgaW5zZXJ0ZWQgaW4gdGhlIG1haW4gY29udGFpbmVyIGFuZCBpdCB3aWxsIGNvbnRhaW4gdGhlIGluaXRpYWwgYW5kIGZpbmFsIGNvbnRlbnQgZWxlbWVudHNcbiAgICAgICAgICAgIHRoaXMuJGZpbmFsRWwgPSAkKCc8ZGl2IGNsYXNzPVwidWMtZmluYWwtd3JhcHBlclwiPjwvZGl2PicpLmFwcGVuZCh0aGlzLiRpQ29udGVudC5jbG9uZSgpLmhpZGUoKSwgdGhpcy4kZkNvbnRlbnQpLmhpZGUoKTtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFwcGVuZCh0aGlzLiRmaW5hbEVsKTtcblxuICAgICAgICAgICAgLy8gaW5pdGlhbCBlbGVtZW50J3Mgb2Zmc2V0XG4gICAgICAgICAgICB0aGlzLl9zZXREaW1PZmZzZXQoKTtcblxuICAgICAgICAgICAgLy8gc3RhdHVzXG4gICAgICAgICAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgLy8gaW5pdGlhbGl6ZSBldmVudHNcbiAgICAgICAgICAgIHRoaXMuX2luaXRFdmVudHMoKTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIF91cGRhdGVEaW1zOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxEaW0gPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuJGVsLndpZHRoKCksXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLiRlbC5oZWlnaHQoKSxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIHRvcDogMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIGNoYW5nZSB0aGUgbGF5b3V0XG4gICAgICAgICAgICB0aGlzLl9sYXlvdXQoKTtcblxuICAgICAgICAgICAgLy8gaW5pdGlhbCBjb250ZW50XG4gICAgICAgICAgICB0aGlzLmZDb250ZW50ID0gdGhpcy4kZkNvbnRlbnQuaHRtbCgpO1xuXG4gICAgICAgICAgICAvLyBpbml0aWFsIGVsZW1lbnQncyBvZmZzZXRcbiAgICAgICAgICAgIHRoaXMuX3NldERpbU9mZnNldCgpO1xuXG4gICAgICAgICAgICAvLyBzdGF0dXNcbiAgICAgICAgICAgIHRoaXMub3BlbmVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyBpbml0aWFsaXplIGV2ZW50c1xuICAgICAgICAgICAgdGhpcy5faW5pdEV2ZW50cygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGNoYW5nZXMgdGhlIGluaXRpYWwgaHRtbCBzdHJ1Y3R1cmVcbiAgICAgICAgLy8gYWRkcyB3cmFwcGVycyB0byB0aGUgdWMtaW5pdGlhbC1jb250ZW50IGFuZCB1Yy1maW5hbC1jb250ZW50IGRpdnNcbiAgICAgICAgX2xheW91dDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB2YXIgJGluaXRpYWxDb250ZW50RWwgPSB0aGlzLiRlbC5jaGlsZHJlbignZGl2LnVjLWluaXRpYWwtY29udGVudCcpLFxuICAgICAgICAgICAgICAgIGZpbmFsRGltID0gdGhpcy5fZ2V0RmluYWxEaW0oKSxcbiAgICAgICAgICAgICAgICAkZmluYWxDb250ZW50RWwgPSB0aGlzLiRlbC5jaGlsZHJlbignZGl2LnVjLWZpbmFsLWNvbnRlbnQnKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogZmluYWxEaW0ud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogZmluYWxEaW0uaGVpZ2h0XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRpbml0aWFsQ29udGVudEVsLndyYXAoJzxkaXYgY2xhc3M9XCJ1Yy1pbml0aWFsXCI+PC9kaXY+Jyk7XG4gICAgICAgICAgICAkZmluYWxDb250ZW50RWwuc2hvdygpLndyYXAoJCgnPGRpdiBjbGFzcz1cInVjLWZpbmFsXCI+PC9kaXY+JykpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIC8vIGluaXRpYWxpemUgdGhlIG5lY2Vzc2FyeSBldmVudHNcbiAgICAgICAgX2luaXRFdmVudHM6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgICAkd2luZG93Lm9uKCdkZWJvdW5jZWRyZXNpemUucGZvbGQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBvZmZzZXRzXG4gICAgICAgICAgICAgICAgc2VsZi5fc2V0RGltT2Zmc2V0KCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sXG4gICAgICAgIC8vIHNldC91cGRhdGUgb2Zmc2V0c1xuICAgICAgICBfc2V0RGltT2Zmc2V0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbERpbS5vZmZzZXRMID0gdGhpcy4kZWwub2Zmc2V0KCkubGVmdCAtICR3aW5kb3cuc2Nyb2xsTGVmdCgpO1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsRGltLm9mZnNldFQgPSB0aGlzLiRlbC5vZmZzZXQoKS50b3AgLSAkd2luZG93LnNjcm9sbFRvcCgpO1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsRGltLm9mZnNldFIgPSAkd2luZG93LndpZHRoKCkgLSB0aGlzLmluaXRpYWxEaW0ub2Zmc2V0TCAtIHRoaXMuaW5pdGlhbERpbS53aWR0aDtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbERpbS5vZmZzZXRCID0gJHdpbmRvdy5oZWlnaHQoKSAtIHRoaXMuaW5pdGlhbERpbS5vZmZzZXRUIC0gdGhpcy5pbml0aWFsRGltLmhlaWdodDtcblxuICAgICAgICB9LFxuICAgICAgICAvLyBnZXRzIHRoZSB2YWx1ZXMgbmVlZGVkIHRvIHRyYW5zbGF0ZSB0aGUgbWFpbiBjb250YWluZXIgKGlmIG9wdGlvbnMuY2VudGVyZWQgaXMgdHJ1ZSlcbiAgICAgICAgX2dldFRyYW5zbGF0aW9uVmFsdWU6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmFyIHggPSAwLFxuICAgICAgICAgICAgICAgIHkgPSAwLFxuICAgICAgICAgICAgICAgIGhvcml6VGltZXMgPSAwLFxuICAgICAgICAgICAgICAgIHZlcnRUaW1lcyA9IDA7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vcHRpb25zLmZvbGRzOyArK2kpIHtcblxuICAgICAgICAgICAgICAgIC8vIGJvdHRvbSBhcyBkZWZhdWx0XG4gICAgICAgICAgICAgICAgdmFyIGRpciA9IHRoaXMub3B0aW9ucy5mb2xkZGlyZWN0aW9uW2ldIHx8ICdib3R0b20nO1xuXG4gICAgICAgICAgICAgICAgc3dpdGNoIChkaXIpIHtcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICdsZWZ0JyA6XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHggKz0gdGhpcy5pbml0aWFsRGltLndpZHRoICogTWF0aC5wb3coMiwgaG9yaXpUaW1lcykgLyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgaG9yaXpUaW1lcyArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncmlnaHQnIDpcblxuICAgICAgICAgICAgICAgICAgICAgICAgeCAtPSB0aGlzLmluaXRpYWxEaW0ud2lkdGggKiBNYXRoLnBvdygyLCBob3JpelRpbWVzKSAvIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICBob3JpelRpbWVzICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICd0b3AnIDpcblxuICAgICAgICAgICAgICAgICAgICAgICAgeSArPSB0aGlzLmluaXRpYWxEaW0uaGVpZ2h0ICogTWF0aC5wb3coMiwgdmVydFRpbWVzKSAvIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0VGltZXMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2JvdHRvbScgOlxuXG4gICAgICAgICAgICAgICAgICAgICAgICB5IC09IHRoaXMuaW5pdGlhbERpbS5oZWlnaHQgKiBNYXRoLnBvdygyLCB2ZXJ0VGltZXMpIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRUaW1lcyArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgICAgIHk6IHlcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSxcbiAgICAgICAgLy8gZ2V0cyB0aGUgYWNjdW11bGF0ZWQgdmFsdWVzIGZvciBsZWZ0LCByaWdodCwgdG9wIGFuZCBib3R0b20gb25jZSB0aGUgZWxlbWVudCBpcyBvcGVuZWRcbiAgICAgICAgX2dldEFjY3VtdWxhdGVkVmFsdWU6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmFyIGwgPSAwLFxuICAgICAgICAgICAgICAgIHIgPSAwLFxuICAgICAgICAgICAgICAgIHQgPSAwLFxuICAgICAgICAgICAgICAgIGIgPSAwLFxuICAgICAgICAgICAgICAgIGhvcml6VGltZXMgPSAwLFxuICAgICAgICAgICAgICAgIHZlcnRUaW1lcyA9IDA7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vcHRpb25zLmZvbGRzOyArK2kpIHtcblxuICAgICAgICAgICAgICAgIC8vIGJvdHRvbSBhcyBkZWZhdWx0XG4gICAgICAgICAgICAgICAgdmFyIGRpciA9IHRoaXMub3B0aW9ucy5mb2xkZGlyZWN0aW9uW2ldIHx8ICdib3R0b20nO1xuXG4gICAgICAgICAgICAgICAgc3dpdGNoIChkaXIpIHtcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICdsZWZ0JyA6XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGwgKz0gdGhpcy5pbml0aWFsRGltLndpZHRoICogTWF0aC5wb3coMiwgaG9yaXpUaW1lcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBob3JpelRpbWVzICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICdyaWdodCcgOlxuXG4gICAgICAgICAgICAgICAgICAgICAgICByICs9IHRoaXMuaW5pdGlhbERpbS53aWR0aCAqIE1hdGgucG93KDIsIGhvcml6VGltZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaG9yaXpUaW1lcyArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndG9wJyA6XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHQgKz0gdGhpcy5pbml0aWFsRGltLmhlaWdodCAqIE1hdGgucG93KDIsIHZlcnRUaW1lcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0VGltZXMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2JvdHRvbScgOlxuXG4gICAgICAgICAgICAgICAgICAgICAgICBiICs9IHRoaXMuaW5pdGlhbERpbS5oZWlnaHQgKiBNYXRoLnBvdygyLCB2ZXJ0VGltZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmVydFRpbWVzICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGw6IGwsXG4gICAgICAgICAgICAgICAgcjogcixcbiAgICAgICAgICAgICAgICB0OiB0LFxuICAgICAgICAgICAgICAgIGI6IGJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSxcbiAgICAgICAgLy8gZ2V0cyB0aGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgZWxlbWVudCB3aGVuIGl0IGlzIG9wZW5lZFxuICAgICAgICBfZ2V0RmluYWxEaW06IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmFyIGwgPSAwLFxuICAgICAgICAgICAgICAgIHIgPSAwLFxuICAgICAgICAgICAgICAgIHQgPSAwLFxuICAgICAgICAgICAgICAgIGIgPSAwLFxuICAgICAgICAgICAgICAgIGhvcml6VGltZXMgPSAwLFxuICAgICAgICAgICAgICAgIHZlcnRUaW1lcyA9IDA7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vcHRpb25zLmZvbGRzOyArK2kpIHtcblxuICAgICAgICAgICAgICAgIC8vIGJvdHRvbSBhcyBkZWZhdWx0XG4gICAgICAgICAgICAgICAgdmFyIGRpciA9IHRoaXMub3B0aW9ucy5mb2xkZGlyZWN0aW9uW2ldIHx8ICdib3R0b20nO1xuXG4gICAgICAgICAgICAgICAgc3dpdGNoIChkaXIpIHtcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICdsZWZ0JyA6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JyA6XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGhvcml6VGltZXMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3RvcCcgOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdib3R0b20nIDpcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydFRpbWVzICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmluaXRpYWxEaW0ud2lkdGggKiBNYXRoLnBvdygyLCBob3JpelRpbWVzKSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuaW5pdGlhbERpbS5oZWlnaHQgKiBNYXRoLnBvdygyLCB2ZXJ0VGltZXMpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0sXG4gICAgICAgIC8vIHJldHVybnMgdGhlIHNpemVzIGFuZCBwb3NpdGlvbnMgZm9yIHRoZSBlbGVtZW50IGFmdGVyIGVhY2ggKHVuKWZvbGRpbmcgc3RlcFxuICAgICAgICBfdXBkYXRlU3RlcFN0eWxlOiBmdW5jdGlvbiAoYWN0aW9uKSB7XG5cbiAgICAgICAgICAgIHZhciB3LCBoLCBsLCB0O1xuXG4gICAgICAgICAgICBpZiAoYWN0aW9uID09PSAnZm9sZCcpIHtcblxuICAgICAgICAgICAgICAgIHcgPSB0aGlzLmxhc3REaXJlY3Rpb24gPT09ICdsZWZ0JyB8fCB0aGlzLmxhc3REaXJlY3Rpb24gPT09ICdyaWdodCcgPyB0aGlzLmxhc3RTdHlsZS53aWR0aCAvIDIgOiB0aGlzLmxhc3RTdHlsZS53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgaCA9IHRoaXMubGFzdERpcmVjdGlvbiA9PT0gJ2xlZnQnIHx8IHRoaXMubGFzdERpcmVjdGlvbiA9PT0gJ3JpZ2h0JyA/IHRoaXMubGFzdFN0eWxlLmhlaWdodCA6IHRoaXMubGFzdFN0eWxlLmhlaWdodCAvIDIsXG4gICAgICAgICAgICAgICAgICAgIGwgPSB0aGlzLmxhc3REaXJlY3Rpb24gPT09ICdsZWZ0JyA/IHRoaXMubGFzdFN0eWxlLmxlZnQgKyB0aGlzLmxhc3RTdHlsZS53aWR0aCAvIDIgOiB0aGlzLmxhc3RTdHlsZS5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICB0ID0gdGhpcy5sYXN0RGlyZWN0aW9uID09PSAndG9wJyA/IHRoaXMubGFzdFN0eWxlLnRvcCArIHRoaXMubGFzdFN0eWxlLmhlaWdodCAvIDIgOiB0aGlzLmxhc3RTdHlsZS50b3A7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgdyA9IHRoaXMubGFzdERpcmVjdGlvbiA9PT0gJ2xlZnQnIHx8IHRoaXMubGFzdERpcmVjdGlvbiA9PT0gJ3JpZ2h0JyA/IHRoaXMubGFzdFN0eWxlLndpZHRoICogMiA6IHRoaXMubGFzdFN0eWxlLndpZHRoLFxuICAgICAgICAgICAgICAgICAgICBoID0gdGhpcy5sYXN0RGlyZWN0aW9uID09PSAnbGVmdCcgfHwgdGhpcy5sYXN0RGlyZWN0aW9uID09PSAncmlnaHQnID8gdGhpcy5sYXN0U3R5bGUuaGVpZ2h0IDogdGhpcy5sYXN0U3R5bGUuaGVpZ2h0ICogMixcbiAgICAgICAgICAgICAgICAgICAgbCA9IHRoaXMubGFzdERpcmVjdGlvbiA9PT0gJ2xlZnQnID8gdGhpcy5sYXN0U3R5bGUubGVmdCAtIHRoaXMubGFzdFN0eWxlLndpZHRoIDogdGhpcy5sYXN0U3R5bGUubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgdCA9IHRoaXMubGFzdERpcmVjdGlvbiA9PT0gJ3RvcCcgPyB0aGlzLmxhc3RTdHlsZS50b3AgLSB0aGlzLmxhc3RTdHlsZS5oZWlnaHQgOiB0aGlzLmxhc3RTdHlsZS50b3A7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGgsXG4gICAgICAgICAgICAgICAgbGVmdDogbCxcbiAgICAgICAgICAgICAgICB0b3A6IHRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSxcbiAgICAgICAgLy8gZ2V0IHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb25cbiAgICAgICAgX2dldE9wcG9zaXRlRGlyZWN0aW9uOiBmdW5jdGlvbiAocmVhbGRpcmVjdGlvbikge1xuXG4gICAgICAgICAgICB2YXIgcnZkO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHJlYWxkaXJlY3Rpb24pIHtcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2xlZnQnIDpcbiAgICAgICAgICAgICAgICAgICAgcnZkID0gJ3JpZ2h0JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAncmlnaHQnIDpcbiAgICAgICAgICAgICAgICAgICAgcnZkID0gJ2xlZnQnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd0b3AnIDpcbiAgICAgICAgICAgICAgICAgICAgcnZkID0gJ2JvdHRvbSc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2JvdHRvbScgOlxuICAgICAgICAgICAgICAgICAgICBydmQgPSAndG9wJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJ2ZDtcblxuICAgICAgICB9LFxuICAgICAgICAvLyBtYWluIGZ1bmN0aW9uOiB1bmZvbGRzIGFuZCBmb2xkcyB0aGUgZWxlbWVudCBbb3B0aW9ucy5mb2xkc10gdGltZXMgYnkgdXNpbmcgcmVjdXJzaXZlIGNhbGxzXG4gICAgICAgIF9zdGFydDogZnVuY3Rpb24gKGFjdGlvbiwgc3RlcCkge1xuXG4gICAgICAgICAgICAvLyBCYXNpY2FsbHkgd2UgYXJlIHJlcGxhY2luZyB0aGUgZWxlbWVudCdzIGNvbnRlbnQgd2l0aCAyIGRpdmlzaW9ucywgdGhlIHRvcCBhbmQgYm90dG9tIGVsZW1lbnRzLlxuICAgICAgICAgICAgLy8gVGhlIHRvcCBlbGVtZW50IHdpbGwgaGF2ZSBhIGZyb250IGFuZCBiYWNrIGZhY2VzLiBUaGUgZnJvbnQgaGFzIHRoZSBpbml0aWFsIGNvbnRlbnQgZm9yIHRoZSBmaXJzdCBzdGVwXG4gICAgICAgICAgICAvLyBhbmQgdGhlIGJhY2sgd2lsbCBoYXZlIHRoZSBmaW5hbCBjb250ZW50IGZvciB0aGUgbGFzdCBzdGVwLiBGb3IgYWxsIHRoZSBvdGhlciBjYXNlcyB0aGUgdG9wIGVsZW1lbnQgd2lsbCBiZSBibGFuay5cbiAgICAgICAgICAgIC8vIFRoZSBib3R0b20gZWxlbWVudCB3aWxsIGhhdmUgdGhlIGZpbmFsIGNvbnRlbnQgZm9yIHRoZSBsYXN0IHN0ZXAgYW5kIHdpbGwgYmUgYmxhbmsgZm9yIGFsbCB0aGUgb3RoZXIgY2FzZXMuXG4gICAgICAgICAgICAvLyBXZSBuZWVkIHRvIGtlZXAgdGhlIHJpZ2h0IHNpemVzIGFuZCBwb3NpdGlvbnMgZm9yIHRoZXNlIDIgZWxlbWVudHMsIHNvIHdlIG5lZWQgdG8gY2FjaGUgdGhlIHByZXZpb3VzIHN0ZXAncyBzdGF0ZS5cblxuICAgICAgICAgICAgc3RlcCB8PSAwO1xuXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICAgICAgc3R5bGVDU1MgPSAoIGFjdGlvbiA9PT0gJ2ZvbGQnICkgPyB7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmxhc3RTdHlsZS53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmxhc3RTdHlsZS5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IHRoaXMubGFzdFN0eWxlLmxlZnQsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogdGhpcy5sYXN0U3R5bGUudG9wXG4gICAgICAgICAgICAgICAgfSA6IHRoaXMuaW5pdGlhbERpbSxcbiAgICAgICAgICAgICAgICBjb250ZW50VG9wRnJvbnQgPSAnJywgY29udGVudEJvdHRvbSA9ICcnLCBjb250ZW50VG9wQmFjayA9ICcnLFxuICAgICAgICAgICAgICAgIC8vIGRpcmVjdGlvbiBmb3Igc3RlcCBbc3RlcF1cbiAgICAgICAgICAgICAgICAvLyBib3R0b20gaXMgdGhlIGRlZmF1bHQgdmFsdWUgaWYgbm9uZSBpcyBwcmVzZW50XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gKCBhY3Rpb24gPT09ICdmb2xkJyApID9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmZvbGRkaXJlY3Rpb25bdGhpcy5vcHRpb25zLmZvbGRzIC0gMSAtIHN0ZXBdIHx8ICdib3R0b20nIDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmZvbGRkaXJlY3Rpb25bc3RlcF0gfHwgJ2JvdHRvbScsXG4gICAgICAgICAgICAgICAgLy8gZnV0dXJlIGRpcmVjdGlvbiB2YWx1ZSAob25seSBmb3IgdGhlIFwiZm9sZFwiIGFjdGlvbilcbiAgICAgICAgICAgICAgICBuZXh0ZGlyZWN0aW9uID0gKCBhY3Rpb24gPT09ICdmb2xkJyApID8gdGhpcy5vcHRpb25zLmZvbGRkaXJlY3Rpb25bdGhpcy5vcHRpb25zLmZvbGRzIC0gMiAtIHN0ZXBdIHx8ICdib3R0b20nIDogJyc7XG5cbiAgICAgICAgICAgIC8vIHJlbW92ZSB1Yy1wYXJ0IGRpdnMgaW5zaWRlIHRoZSBjb250YWluZXIgKHRoZSB0b3AgYW5kIGJvdHRvbSBlbGVtZW50cylcbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJ2Rpdi51Yy1wYXJ0JykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoc3RlcCkge1xuXG4gICAgICAgICAgICAgICAgLy8gZmlyc3Qgc3RlcCAmIGxhc3QgdHJhbnNpdGlvbiBzdGVwXG4gICAgICAgICAgICAgICAgY2FzZSAwIDpcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMub3B0aW9ucy5mb2xkcyAtIDEgOlxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpb24gPT09ICdmb2xkJykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RlcCA9PT0gdGhpcy5vcHRpb25zLmZvbGRzIC0gMSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVDU1MgPSB0aGlzLmluaXRpYWxEaW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFRvcEZyb250ID0gdGhpcy5pQ29udGVudDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RlcCA9PT0gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0RGltT2Zmc2V0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXNldCB0aGUgdHJhbnNsYXRpb24gb2YgdGhlIG1haW4gY29udGFpbmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kZWwuY3NzKHtsZWZ0OiAwLCB0b3A6IDB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gdGhpcy5fc2V0TGFzdFN0ZXAoZGlyZWN0aW9uLCBzdHlsZUNTUyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRCb3R0b20gPSBjb250ZW50LmJvdHRvbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFRvcEJhY2sgPSBjb250ZW50LnRvcDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJGZpbmFsRWwuaGlkZSgpLmNoaWxkcmVuKCkuaGlkZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHsgLy8gdW5mb2xkaW5nXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGVwID09PSAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXREaW1PZmZzZXQoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIG9wdGlvbnMuY2VudGVyZWQgaXMgdHJ1ZSwgd2UgbmVlZCB0byBjZW50ZXIgdGhlIGNvbnRhaW5lci5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlaXRoZXIgd2F5cyB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0aGUgY29udGFpbmVyIGRvZXMgbm90IG1vdmUgb3V0c2lkZSB0aGUgdmlld3BvcnQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGV0J3MgZ2V0IHRoZSBjb3JyZWN0IHRyYW5zbGF0aW9uIHZhbHVlcyBmb3IgdGhlIGNvbnRhaW5lcidzIHRyYW5zaXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29vcmRzID0gdGhpcy5fZ2V0VHJhbnNsYXRpb25WaWV3cG9ydCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ3VjLWN1cnJlbnQnKS5jc3Moe2xlZnQ6IGNvb3Jkcy5mdHgsIHRvcDogY29vcmRzLmZ0eX0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFRvcEZyb250ID0gdGhpcy5pQ29udGVudDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJGZpbmFsRWwuaGlkZSgpLmNoaWxkcmVuKCkuaGlkZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlQ1NTID0gdGhpcy5fdXBkYXRlU3RlcFN0eWxlKGFjdGlvbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0ZXAgPT09IHRoaXMub3B0aW9ucy5mb2xkcyAtIDEpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gdGhpcy5fc2V0TGFzdFN0ZXAoZGlyZWN0aW9uLCBzdHlsZUNTUyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRCb3R0b20gPSBjb250ZW50LmJvdHRvbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFRvcEJhY2sgPSBjb250ZW50LnRvcDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIC8vIGxhc3Qgc3RlcCBpcyB0byByZXBsYWNlIHRoZSB0b3BFbGVtZW50IGFuZCBib3R0b21FbGVtZW50IHdpdGggYSBkaXZpc2lvbiB0aGF0IGhhcyB0aGUgZmluYWwgY29udGVudFxuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5vcHRpb25zLmZvbGRzIDpcblxuICAgICAgICAgICAgICAgICAgICBzdHlsZUNTUyA9ICggYWN0aW9uID09PSAnZm9sZCcpID8gdGhpcy5pbml0aWFsRGltIDogdGhpcy5fdXBkYXRlU3RlcFN0eWxlKGFjdGlvbik7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRvcCBhbmQgYm90dG9tIGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb250ZW50SWR4ID0gKCBhY3Rpb24gPT09ICdmb2xkJyApID8gMCA6IDE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGVsXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnLnVjLXBhcnQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGZpbmFsRWwuY3NzKHN0eWxlQ1NTKS5zaG93KCkuY2hpbGRyZW4oKS5lcShjb250ZW50SWR4KS5zaG93KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuZWQgPSAoIGFjdGlvbiA9PT0gJ2ZvbGQnICkgPyBmYWxzZSA6IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdGhpbmcgZWxzZSB0byBkb1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSAnZm9sZCcpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ3VjLWN1cnJlbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vbkVuZEZvbGRpbmcoKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMub25FbmRVbmZvbGRpbmcoKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIC8vIGFsbCB0aGUgb3RoZXIgc3RlcHNcbiAgICAgICAgICAgICAgICBkZWZhdWx0IDpcblxuICAgICAgICAgICAgICAgICAgICAvLyBzdHlsZSBvZiBuZXcgbGF5b3V0IHdpbGwgZGVwZW5kIG9uIHRoZSBsYXN0IHN0ZXAgZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlQ1NTID0gdGhpcy5fdXBkYXRlU3RlcFN0eWxlKGFjdGlvbik7XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdHJhbnNpdGlvbiBwcm9wZXJ0aWVzIGZvciB0aGUgc3RlcFxuICAgICAgICAgICAgaWYgKHRoaXMuc3VwcG9ydCkge1xuXG4gICAgICAgICAgICAgICAgc3R5bGVDU1MudHJhbnNpdGlvbiA9ICdhbGwgJyArIHRoaXMub3B0aW9ucy5zcGVlZCArICdtcyAnICsgdGhpcy5vcHRpb25zLmVhc2luZztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdW5mb2xkQ2xhc3MgPSAndWMtdW5mb2xkLScgKyBkaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgdG9wRWxDbGFzc2VzID0gKCBhY3Rpb24gPT09ICdmb2xkJyApID8gJ3VjLXVuZm9sZCB1Yy1wYXJ0ICcgKyB1bmZvbGRDbGFzcyA6ICd1Yy1wYXJ0ICcgKyB1bmZvbGRDbGFzcyxcbiAgICAgICAgICAgICAgICAkdG9wRWwgPSAkKCc8ZGl2IGNsYXNzPVwiJyArIHRvcEVsQ2xhc3NlcyArICdcIj48ZGl2IGNsYXNzPVwidWMtZnJvbnRcIj4nICsgY29udGVudFRvcEZyb250ICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJ1Yy1iYWNrXCI+JyArIGNvbnRlbnRUb3BCYWNrICsgJzwvZGl2PjwvZGl2PicpLmNzcyhzdHlsZUNTUyksXG4gICAgICAgICAgICAgICAgJGJvdHRvbUVsID0gJCgnPGRpdiBjbGFzcz1cInVjLXBhcnQgdWMtc2luZ2xlXCI+JyArIGNvbnRlbnRCb3R0b20gKyAnPC9kaXY+JykuY3NzKHN0eWxlQ1NTKTtcblxuICAgICAgICAgICAgLy8gY2FjaGUgbGFzdCBkaXJlY3Rpb24gYW5kIHN0eWxlXG4gICAgICAgICAgICB0aGlzLmxhc3REaXJlY3Rpb24gPSAoIGFjdGlvbiA9PT0gJ2ZvbGQnICkgPyBuZXh0ZGlyZWN0aW9uIDogZGlyZWN0aW9uO1xuICAgICAgICAgICAgdGhpcy5sYXN0U3R5bGUgPSBzdHlsZUNTUztcblxuICAgICAgICAgICAgLy8gYXBwZW5kIG5ldyBlbGVtZW50c1xuICAgICAgICAgICAgdGhpcy4kZWwuYXBwZW5kKCRib3R0b21FbCwgJHRvcEVsKTtcblxuICAgICAgICAgICAgLy8gYWRkIG92ZXJsYXlzXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLm92ZXJsYXlzICYmIHRoaXMuc3VwcG9ydCkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fYWRkT3ZlcmxheXMoYWN0aW9uLCAkYm90dG9tRWwsICR0b3BFbCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBhcHBseSBzdHlsZVxuICAgICAgICAgICAgICAgICggYWN0aW9uID09PSAnZm9sZCcgKSA/ICR0b3BFbC5yZW1vdmVDbGFzcygndWMtdW5mb2xkJykgOiAkdG9wRWwuYWRkQ2xhc3MoJ3VjLXVuZm9sZCcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuc3VwcG9ydCkge1xuXG4gICAgICAgICAgICAgICAgICAgICR0b3BFbC5vbihzZWxmLnRyYW5zRW5kRXZlbnROYW1lLCBmdW5jdGlvbiAoZXZlbnQpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc05hbWUgIT09ICd1Yy1mbGlwb3ZlcmxheScgJiYgc3RlcCA8IHNlbGYub3B0aW9ucy5mb2xkcykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ290byBuZXh0IHN0ZXAgaW4gW29wdGlvbnMuZm9sZGRlbGF5XSBtc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9zdGFydChhY3Rpb24sIHN0ZXAgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBzZWxmLm9wdGlvbnMuZm9sZGRlbGF5KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGdvdG8gbmV4dCBzdGVwXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3N0YXJ0KGFjdGlvbiwgc3RlcCArIDEpO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5vdmVybGF5cyAmJiBzZWxmLnN1cHBvcnQpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYm8gPSAoIGFjdGlvbiA9PT0gJ2ZvbGQnICkgPyAxIDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRibyA9ICggYWN0aW9uID09PSAnZm9sZCcgKSA/IC41IDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRmbyA9ICggYWN0aW9uID09PSAnZm9sZCcgKSA/IDAgOiAuNTtcblxuICAgICAgICAgICAgICAgICAgICBzZWxmLiRib3R0b21PdmVybGF5LmNzcygnb3BhY2l0eScsIGJvKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kdG9wQmFja092ZXJsYXkuY3NzKCdvcGFjaXR5JywgdGJvKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kdG9wRnJvbnRPdmVybGF5LmNzcygnb3BhY2l0eScsIHRmbyk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0sIDMwKTtcblxuICAgICAgICB9LFxuICAgICAgICAvLyBnZXRzIHRoZSB0cmFuc2xhdGlvbiB2YWx1ZXMgZm9yIHRoZSBjb250YWluZXIncyB0cmFuc2l0aW9uXG4gICAgICAgIF9nZXRUcmFuc2xhdGlvblZpZXdwb3J0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIC8vIHRoZSBhY2N1bXVsYXRlZFZhbHVlcyBzdG9yZXMgdGhlIGxlZnQsIHJpZ2h0LCB0b3AgYW5kIGJvdHRvbSBpbmNyZW1lbnRzIHRvIHRoZSBmaW5hbC9vcGVuZWQgZWxlbWVudCByZWxhdGl2ZWx5IHRvIHRoZSBpbml0aWFsL2Nsb3NlZCBlbGVtZW50XG4gICAgICAgICAgICB2YXIgYWNjdW11bGF0ZWRWYWx1ZXMgPSB0aGlzLl9nZXRBY2N1bXVsYXRlZFZhbHVlKCksXG4gICAgICAgICAgICAgICAgdHggPSAwLFxuICAgICAgICAgICAgICAgIHR5ID0gMDtcblxuICAgICAgICAgICAgLy8gdGhlIGZpbmFsIG9mZnNldHMgZm9yIHRoZSBvcGVuZWQgZWxlbWVudFxuICAgICAgICAgICAgdGhpcy5mT2Zmc2V0TCA9IHRoaXMuaW5pdGlhbERpbS5vZmZzZXRMIC0gYWNjdW11bGF0ZWRWYWx1ZXMubDtcbiAgICAgICAgICAgIHRoaXMuZk9mZnNldFQgPSB0aGlzLmluaXRpYWxEaW0ub2Zmc2V0VCAtIGFjY3VtdWxhdGVkVmFsdWVzLnQ7XG4gICAgICAgICAgICB0aGlzLmZPZmZzZXRSID0gdGhpcy5pbml0aWFsRGltLm9mZnNldFIgLSBhY2N1bXVsYXRlZFZhbHVlcy5yO1xuICAgICAgICAgICAgdGhpcy5mT2Zmc2V0QiA9IHRoaXMuaW5pdGlhbERpbS5vZmZzZXRCIC0gYWNjdW11bGF0ZWRWYWx1ZXMuYjtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZk9mZnNldEwgPCAwKSB7XG4gICAgICAgICAgICAgICAgdHggPSBNYXRoLmFicyh0aGlzLmZPZmZzZXRMKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmZPZmZzZXRUIDwgMCkge1xuICAgICAgICAgICAgICAgIHR5ID0gTWF0aC5hYnModGhpcy5mT2Zmc2V0VCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5mT2Zmc2V0UiA8IDApIHtcbiAgICAgICAgICAgICAgICB0eCAtPSBNYXRoLmFicyh0aGlzLmZPZmZzZXRSKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmZPZmZzZXRCIDwgMCkge1xuICAgICAgICAgICAgICAgIHR5IC09IE1hdGguYWJzKHRoaXMuZk9mZnNldEIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmaW5hbCB0cmFuc2xhdGlvbiB2YWx1ZXNcbiAgICAgICAgICAgIHZhciBmdHggPSB0eCxcbiAgICAgICAgICAgICAgICBmdHkgPSB0eTtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jZW50ZXJlZCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHRyYW5zbGF0aW9uVmFsdWUgPSB0aGlzLl9nZXRUcmFuc2xhdGlvblZhbHVlKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodHJhbnNsYXRpb25WYWx1ZS54ID4gMCAmJiB0aGlzLmZPZmZzZXRSICsgdHJhbnNsYXRpb25WYWx1ZS54ID49IDApIHtcblxuICAgICAgICAgICAgICAgICAgICBmdHggPSAoIHRoaXMuZk9mZnNldEwgPj0gMCApID8gTWF0aC5taW4odHJhbnNsYXRpb25WYWx1ZS54LCB0aGlzLmZPZmZzZXRSKSA6IHRyYW5zbGF0aW9uVmFsdWUueCArICggdHggLSB0cmFuc2xhdGlvblZhbHVlLnggKTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0cmFuc2xhdGlvblZhbHVlLnggPCAwICYmIHRoaXMuZk9mZnNldEwgKyB0cmFuc2xhdGlvblZhbHVlLnggPj0gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGZ0eCA9ICggdGhpcy5mT2Zmc2V0UiA+PSAwICkgPyBNYXRoLm1pbih0cmFuc2xhdGlvblZhbHVlLngsIHRoaXMuZk9mZnNldEwpIDogdHJhbnNsYXRpb25WYWx1ZS54ICsgKCB0eCAtIHRyYW5zbGF0aW9uVmFsdWUueCApO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGZ0eCA9IHRyYW5zbGF0aW9uVmFsdWUueCArICggdHggLSB0cmFuc2xhdGlvblZhbHVlLnggKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0cmFuc2xhdGlvblZhbHVlLnkgPiAwICYmIHRoaXMuZk9mZnNldEIgKyB0cmFuc2xhdGlvblZhbHVlLnkgPj0gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGZ0eSA9ICggdGhpcy5mT2Zmc2V0VCA+PSAwICkgPyBNYXRoLm1pbih0cmFuc2xhdGlvblZhbHVlLnksIHRoaXMuZk9mZnNldEIpIDogdHJhbnNsYXRpb25WYWx1ZS55ICsgKCB0eSAtIHRyYW5zbGF0aW9uVmFsdWUueSApO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRyYW5zbGF0aW9uVmFsdWUueSA8IDAgJiYgdGhpcy5mT2Zmc2V0VCArIHRyYW5zbGF0aW9uVmFsdWUueSA+PSAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZnR5ID0gKCB0aGlzLmZPZmZzZXRCID49IDAgKSA/IE1hdGgubWluKHRyYW5zbGF0aW9uVmFsdWUueSwgdGhpcy5mT2Zmc2V0VCkgOiB0cmFuc2xhdGlvblZhbHVlLnkgKyAoIHR5IC0gdHJhbnNsYXRpb25WYWx1ZS55ICk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZnR5ID0gdHJhbnNsYXRpb25WYWx1ZS55ICsgKCB0eSAtIHRyYW5zbGF0aW9uVmFsdWUueSApO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZnR4OiBmdHgsXG4gICAgICAgICAgICAgICAgZnR5OiBmdHlcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSxcbiAgICAgICAgLy8gc2V0cyB0aGUgbGFzdCBzdGVwJ3MgY29udGVudFxuICAgICAgICBfc2V0TGFzdFN0ZXA6IGZ1bmN0aW9uIChkaXJlY3Rpb24sIHN0eWxlQ1NTKSB7XG5cbiAgICAgICAgICAgIHZhciBjb250ZW50Qm90dG9tLCBjb250ZW50VG9wQmFjayxcbiAgICAgICAgICAgICAgICBjb250ZW50Qm90dG9tU3R5bGUgPSAnJyxcbiAgICAgICAgICAgICAgICBjb250ZW50VG9wQmFja1N0eWxlID0gJyc7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdib3R0b20nIDpcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFRvcEJhY2tTdHlsZSA9ICdtYXJnaW4tdG9wOiAtJyArIHN0eWxlQ1NTLmhlaWdodCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RvcCcgOlxuICAgICAgICAgICAgICAgICAgICBjb250ZW50Qm90dG9tU3R5bGUgPSAnbWFyZ2luLXRvcDogLScgKyBzdHlsZUNTUy5oZWlnaHQgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdsZWZ0JyA6XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUb3BCYWNrU3R5bGUgPSAnd2lkdGg6JyArICggc3R5bGVDU1Mud2lkdGggKiAyICkgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50Qm90dG9tU3R5bGUgPSAnd2lkdGg6JyArICggc3R5bGVDU1Mud2lkdGggKiAyICkgKyAncHg7bWFyZ2luLWxlZnQ6IC0nICsgc3R5bGVDU1Mud2lkdGggKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdyaWdodCcgOlxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VG9wQmFja1N0eWxlID0gJ3dpdGg6JyArICggc3R5bGVDU1Mud2lkdGggKiAyICkgKyAncHg7bWFyZ2luLWxlZnQ6IC0nICsgc3R5bGVDU1Mud2lkdGggKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50Qm90dG9tU3R5bGUgPSAnd2lkdGg6JyArICggc3R5bGVDU1Mud2lkdGggKiAyICkgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb250ZW50Qm90dG9tID0gJzxkaXYgY2xhc3M9XCJ1Yy1pbm5lclwiPjxkaXYgY2xhc3M9XCJ1Yy1pbm5lci1jb250ZW50XCIgc3R5bGU9XCInICsgY29udGVudEJvdHRvbVN0eWxlICsgJ1wiPicgKyB0aGlzLmZDb250ZW50ICsgJzwvZGl2PjwvZGl2Pic7XG5cbiAgICAgICAgICAgIHZhciBjb250ZW50VG9wQmFja0NsYXNzZXMgPSBkaXJlY3Rpb24gPT09ICd0b3AnIHx8IGRpcmVjdGlvbiA9PT0gJ2JvdHRvbScgPyAndWMtaW5uZXIgdWMtaW5uZXItcm90YXRlJyA6ICd1Yy1pbm5lcic7XG4gICAgICAgICAgICBjb250ZW50VG9wQmFjayA9ICc8ZGl2IGNsYXNzPVwiJyArIGNvbnRlbnRUb3BCYWNrQ2xhc3NlcyArICdcIj48ZGl2IGNsYXNzPVwidWMtaW5uZXItY29udGVudFwiIHN0eWxlPVwiJyArIGNvbnRlbnRUb3BCYWNrU3R5bGUgKyAnXCI+JyArIHRoaXMuZkNvbnRlbnQgKyAnPC9kaXY+PC9kaXY+JztcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBib3R0b206IGNvbnRlbnRCb3R0b20sXG4gICAgICAgICAgICAgICAgdG9wOiBjb250ZW50VG9wQmFja1xuICAgICAgICAgICAgfTtcblxuICAgICAgICB9LFxuICAgICAgICAvLyBhZGRzIG92ZXJsYXlzIHRvIHRoZSBcIih1bilmb2xkaW5nXCIgZWxlbWVudHMgaWYgdGhlIG9wdGlvbnMub3ZlcmxheXMgaXMgdHJ1ZVxuICAgICAgICBfYWRkT3ZlcmxheXM6IGZ1bmN0aW9uIChhY3Rpb24sICRib3R0b21FbCwgJHRvcEVsKSB7XG5cbiAgICAgICAgICAgIHZhciBib3R0b21PdmVybGF5U3R5bGUsIHRvcEZyb250T3ZlcmxheVN0eWxlLCB0b3BCYWNrT3ZlcmxheVN0eWxlO1xuXG4gICAgICAgICAgICB0aGlzLiRib3R0b21PdmVybGF5ID0gJCgnPGRpdiBjbGFzcz1cInVjLW92ZXJsYXlcIj48L2Rpdj4nKTtcbiAgICAgICAgICAgIHRoaXMuJHRvcEZyb250T3ZlcmxheSA9ICQoJzxkaXYgY2xhc3M9XCJ1Yy1mbGlwb3ZlcmxheVwiPjwvZGl2PicpO1xuICAgICAgICAgICAgdGhpcy4kdG9wQmFja092ZXJsYXkgPSAkKCc8ZGl2IGNsYXNzPVwidWMtZmxpcG92ZXJsYXlcIj48L2Rpdj4nKTtcblxuICAgICAgICAgICAgaWYgKGFjdGlvbiA9PT0gJ2ZvbGQnKSB7XG5cbiAgICAgICAgICAgICAgICBib3R0b21PdmVybGF5U3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5ICcgKyAoIHRoaXMub3B0aW9ucy5zcGVlZCAvIDIgKSArICdtcyAnICsgdGhpcy5vcHRpb25zLmVhc2luZyArICcgJyArICggdGhpcy5vcHRpb25zLnNwZWVkIC8gMiApICsgJ21zJ1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB0b3BGcm9udE92ZXJsYXlTdHlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogLjUsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5ICcgKyAoIHRoaXMub3B0aW9ucy5zcGVlZCAvIDIgKSArICdtcyAnICsgdGhpcy5vcHRpb25zLmVhc2luZ1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB0b3BCYWNrT3ZlcmxheVN0eWxlID0ge1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAnICsgKCB0aGlzLm9wdGlvbnMuc3BlZWQgLyAyICkgKyAnbXMgJyArIHRoaXMub3B0aW9ucy5lYXNpbmdcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGJvdHRvbU92ZXJsYXlTdHlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgJyArICggdGhpcy5vcHRpb25zLnNwZWVkIC8gMiApICsgJ21zICcgKyB0aGlzLm9wdGlvbnMuZWFzaW5nXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHRvcEZyb250T3ZlcmxheVN0eWxlID0ge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAnICsgKCB0aGlzLm9wdGlvbnMuc3BlZWQgLyAyICkgKyAnbXMgJyArIHRoaXMub3B0aW9ucy5lYXNpbmdcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdG9wQmFja092ZXJsYXlTdHlsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogLjUsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5ICcgKyAoIHRoaXMub3B0aW9ucy5zcGVlZCAvIDIgKSArICdtcyAnICsgdGhpcy5vcHRpb25zLmVhc2luZyArICcgJyArICggdGhpcy5vcHRpb25zLnNwZWVkIC8gMiApICsgJ21zJ1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGJvdHRvbUVsLmFwcGVuZCh0aGlzLiRib3R0b21PdmVybGF5LmNzcyhib3R0b21PdmVybGF5U3R5bGUpKTtcbiAgICAgICAgICAgICR0b3BFbC5jaGlsZHJlbignZGl2LnVjLWZyb250JylcbiAgICAgICAgICAgICAgICAuYXBwZW5kKHRoaXMuJHRvcEZyb250T3ZlcmxheS5jc3ModG9wRnJvbnRPdmVybGF5U3R5bGUpKVxuICAgICAgICAgICAgICAgIC5lbmQoKVxuICAgICAgICAgICAgICAgIC5jaGlsZHJlbignZGl2LnVjLWJhY2snKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQodGhpcy4kdG9wQmFja092ZXJsYXkuY3NzKHRvcEJhY2tPdmVybGF5U3R5bGUpKTtcblxuICAgICAgICB9LFxuICAgICAgICAvLyBwdWJsaWMgbWV0aG9kOiB1bmZvbGRzIHRoZSBlbGVtZW50XG4gICAgICAgIHVuZm9sZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAvLyBpZiBvcGVuZWQgYWxyZWFkeSBvciBjdXJyZW50bHkgKHVuKWZvbGRpbmcgcmV0dXJuXG4gICAgICAgICAgICBpZiAodGhpcy5vcGVuZWQgfHwgdGhpcy5hbmltYXRpbmcpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9zdGFydCgndW5mb2xkJyk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZDogZm9sZHMgdGhlIGVsZW1lbnRcbiAgICAgICAgZm9sZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAvLyBpZiBub3Qgb3BlbmVkIG9yIGN1cnJlbnRseSAodW4pZm9sZGluZyByZXR1cm5cbiAgICAgICAgICAgIGlmICghdGhpcy5vcGVuZWQgfHwgdGhpcy5hbmltYXRpbmcpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9zdGFydCgnZm9sZCcpO1xuXG4gICAgICAgIH0sXG4gICAgICAgIC8vIHB1YmxpYyBtZXRob2Q6IHJldHVybnMgJ29wZW5lZCcgb3IgJ2Nsb3NlZCdcbiAgICAgICAgZ2V0U3RhdHVzOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHJldHVybiAoIHRoaXMub3BlbmVkICkgPyAnb3BlbmVkJyA6ICdjbG9zZWQnO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICB2YXIgbG9nRXJyb3IgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuXG4gICAgICAgIGlmICh3aW5kb3cuY29uc29sZSkge1xuXG4gICAgICAgICAgICB3aW5kb3cuY29uc29sZS5lcnJvcihtZXNzYWdlKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgJC5mbi5wZm9sZCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgICAgICAgdmFyIGluc3RhbmNlID0gJC5kYXRhKHRoaXMsICdwZm9sZCcpO1xuICAgICAgICBjb25zb2xlLmxvZygnaW5zdGFuY2UgJywgaW5zdGFuY2UpO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcblxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKCFpbnN0YW5jZSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGxvZ0Vycm9yKFwiY2Fubm90IGNhbGwgbWV0aG9kcyBvbiBwZm9sZCBwcmlvciB0byBpbml0aWFsaXphdGlvbjsgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJhdHRlbXB0ZWQgdG8gY2FsbCBtZXRob2QgJ1wiICsgb3B0aW9ucyArIFwiJ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCEkLmlzRnVuY3Rpb24oaW5zdGFuY2Vbb3B0aW9uc10pIHx8IG9wdGlvbnMuY2hhckF0KDApID09PSBcIl9cIikge1xuXG4gICAgICAgICAgICAgICAgICAgIGxvZ0Vycm9yKFwibm8gc3VjaCBtZXRob2QgJ1wiICsgb3B0aW9ucyArIFwiJyBmb3IgcGZvbGQgaW5zdGFuY2VcIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGluc3RhbmNlW29wdGlvbnNdLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW5zdGFuY2UgMicsIGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UpIHtcblxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS5faW5pdCgpO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlID0gJC5kYXRhKHRoaXMsICdwZm9sZCcsIG5ldyAkLlBGb2xkKG9wdGlvbnMsIHRoaXMpKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZygnaW5zdGFuY2UgJywgaW5zdGFuY2UpO1xuXG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcblxuICAgIH07XG5cbn0pKGpRdWVyeSwgd2luZG93KTsiXSwiZmlsZSI6InRoZW1lcy9mb2xkaW5nL2pzL2pxdWVyeS5wZm9sZC5qcyJ9
