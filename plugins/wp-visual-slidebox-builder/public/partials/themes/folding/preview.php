<div class="vsbb-preview-sub">
    <div id="uc-container" class="uc-container" ng-style="editorCtrl.saveObject.folded.styles">
        <div class="uc-initial-content">
            <!-- custom content -->
            <div class="scrollwrap-1">
                <p class="vsbb-angular-text-wrapper" ng-bind-html="editorCtrl.saveObject.preContent"></p>
            </div>
            <span class="vsbb-pfold-clickme" ng-style="editorCtrl.saveObject.triggers.open.styles"><i class="fa" ng-class="editorCtrl.saveObject.triggers.open.styleClass"></i></span>
            <img ng-show="editorCtrl.saveObject.folded.backgroundImg != ''" ng-src="{{editorCtrl.saveObject.folded.backgroundImg}}" alt="">
        </div>
        <div class="uc-final-content">
            <!-- custom content -->
            <div class="scrollwrap">
                <p class="vsbb-angular-text-wrapper" ng-bind-html="editorCtrl.saveObject.mainText"></p>
            </div>
            <span class="vsbb-pfold-close" ng-style="editorCtrl.saveObject.triggers.close.styles"><i class="fa" ng-class="editorCtrl.saveObject.triggers.close.styleClass"></i></span>
            <img ng-show="editorCtrl.saveObject.unfolded.backgroundImg != ''" ng-src="{{editorCtrl.saveObject.unfolded.backgroundImg}}" alt="">
        </div>
    </div>
</div>
<div ng-include="ctrl.getThemePartialItem(ctrl.selectedTheme.value, 'forced-styles')"></div>