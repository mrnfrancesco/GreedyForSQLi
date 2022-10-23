<div class="vsbb-preview-sub" ng-show="editorCtrl.loaded">
    <div class="vsbb-standard-initial" ng-style="editorCtrl.saveObject.initial.styles">
        <p class="vsbb-standard-p vsbb-angular-text-wrapper" ng-bind-html="editorCtrl.saveObject.initial.mainText"></p>
        <img ng-show="editorCtrl.saveObject.initial.backgroundImg != null && editorCtrl.saveObject.initial.backgroundImg != ''"
             ng-src="{{editorCtrl.saveObject.initial.backgroundImg}}" alt="" class="vsabb-standard-img">
        <div class="vsbb-standard-final vsbb-hidden" ng-style="editorCtrl.saveObject.final.styles">
            <p class="vsbb-standard-p vsbb-angular-text-wrapper" ng-bind-html="editorCtrl.saveObject.final.mainText"></p>
            <a ng-if="editorCtrl.saveObject.final.link.enabled" ng-style="editorCtrl.saveObject.final.link.styles"
               href="{{editorCtrl.saveObject.final.link.url}}"
               target="{{editorCtrl.saveObject.final.link.newTab ? '_blank' : '_self'}}" class="vsbb-standard-link" ng-class="editorCtrl.saveObject.final.link.position"
               ng-bind-html="editorCtrl.saveObject.final.link.title"></a>
            <img ng-show="editorCtrl.saveObject.final.backgroundImg != null && editorCtrl.saveObject.final.backgroundImg != ''"
                 ng-src="{{editorCtrl.saveObject.final.backgroundImg}}" alt="" class="vsabb-standard-img">
        </div>
    </div>
</div>