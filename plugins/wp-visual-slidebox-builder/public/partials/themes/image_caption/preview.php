<div class="vsbb-preview-sub" ng-show="editorCtrl.loaded">
    <div ng-click="editorCtrl.ctaMask()" ng-class="{'vsbb-pointer-cursor':editorCtrl.saveObject.c2a.final.category == 'mask'}"  ng-if="editorCtrl.saveObject.hoverEffect.value == '1'" ng-style="editorCtrl.saveObject.initial.styles"
         class="vsbb-image-caption-view vsbb-image-caption-view-first">
        <img ng-show="editorCtrl.saveObject.initial.backgroundImg != null" ng-src="{{editorCtrl.saveObject.initial.backgroundImg}}" alt="">
        <div ng-style="editorCtrl.saveObject.mask.styles" class="vsbb-image-caption-mask">
            <h2 ng-style="editorCtrl.saveObject.final.heading.styles" ng-bind-html="editorCtrl.saveObject.heading"></h2>
            <p class="vsbb-angular-text-wrapper" ng-bind-html="editorCtrl.saveObject.mainContent"></p>
            <div ng-if="editorCtrl.saveObject.c2a.final.category == 'button'">
                <a ng-if="editorCtrl.saveObject.c2a.final.type != 'modal'" ng-style="editorCtrl.saveObject.final.link.styles" href="{{editorCtrl.saveObject.final.link.url}}"
                   target="{{editorCtrl.saveObject.final.link.newTab ? '_blank' : '_self'}}" class="info"
                   ng-bind-html="editorCtrl.saveObject.final.link.title"></a>
                <div ng-controller="vsbbModalTriggerController as modalCtrl" ng-if="editorCtrl.saveObject.c2a.final.type == 'modal'">
                    <a href="" ng-click="modalCtrl.triggerModal(editorCtrl.saveObject.c2a.final.modal.idx)"ng-bind-html="editorCtrl.saveObject.final.link.title" class="info"></a>
                </div>
            </div>
        </div>
    </div>
    <div ng-click="editorCtrl.ctaMask()" ng-class="{'vsbb-pointer-cursor':editorCtrl.saveObject.c2a.final.category == 'mask'}"  ng-if="editorCtrl.saveObject.hoverEffect.value == '2'" ng-style="editorCtrl.saveObject.initial.styles"
         class="vsbb-image-caption-view vsbb-image-caption-view-second">
        <img ng-show="editorCtrl.saveObject.initial.backgroundImg != null" ng-src="{{editorCtrl.saveObject.initial.backgroundImg}}" alt="">
        <div ng-style="editorCtrl.saveObject.mask.styles" class="vsbb-image-caption-mask">
        </div>
        <div class="vsbb-image-caption-content">
            <h2 ng-style="editorCtrl.saveObject.final.heading.styles" ng-bind-html="editorCtrl.saveObject.heading"></h2>
            <p class="vsbb-angular-text-wrapper" ng-bind-html="editorCtrl.saveObject.mainContent"></p>
            <div ng-if="editorCtrl.saveObject.c2a.final.category == 'button'">
                <a ng-if="editorCtrl.saveObject.c2a.final.type != 'modal'" ng-style="editorCtrl.saveObject.final.link.styles" href="{{editorCtrl.saveObject.final.link.url}}"
                   target="{{editorCtrl.saveObject.final.link.newTab ? '_blank' : '_self'}}" class="info"
                   ng-bind-html="editorCtrl.saveObject.final.link.title"></a>
                <div ng-controller="vsbbModalTriggerController as modalCtrl" ng-if="editorCtrl.saveObject.c2a.final.type == 'modal'">
                    <a href="" ng-style="editorCtrl.saveObject.final.link.styles" ng-click="modalCtrl.triggerModal(editorCtrl.saveObject.c2a.final.modal.idx)"ng-bind-html="editorCtrl.saveObject.final.link.title" class="info"></a>
                </div>
            </div>
        </div>
    </div>
    <div ng-click="editorCtrl.ctaMask()" ng-class="{'vsbb-pointer-cursor':editorCtrl.saveObject.c2a.final.category == 'mask'}"  ng-if="editorCtrl.saveObject.hoverEffect.value == '3'" ng-style="editorCtrl.saveObject.initial.styles"
         class="vsbb-image-caption-view vsbb-image-caption-view-third">
        <img ng-show="editorCtrl.saveObject.initial.backgroundImg != null" ng-src="{{editorCtrl.saveObject.initial.backgroundImg}}" alt="">
        <div ng-style="editorCtrl.saveObject.mask.styles" class="vsbb-image-caption-mask">
        </div>
        <div class="vsbb-image-caption-content">
            <h2 ng-style="editorCtrl.saveObject.final.heading.styles" ng-bind-html="editorCtrl.saveObject.heading"></h2>
            <p class="vsbb-angular-text-wrapper" ng-bind-html="editorCtrl.saveObject.mainContent"></p>
            <div ng-if="editorCtrl.saveObject.c2a.final.category == 'button'">
                <a ng-if="editorCtrl.saveObject.c2a.final.type != 'modal'" ng-style="editorCtrl.saveObject.final.link.styles" href="{{editorCtrl.saveObject.final.link.url}}"
                   target="{{editorCtrl.saveObject.final.link.newTab ? '_blank' : '_self'}}" class="info"
                   ng-bind-html="editorCtrl.saveObject.final.link.title"></a>
                <div ng-controller="vsbbModalTriggerController as modalCtrl" ng-if="editorCtrl.saveObject.c2a.final.type == 'modal'">
                    <a href="" ng-style="editorCtrl.saveObject.final.link.styles" ng-click="modalCtrl.triggerModal(editorCtrl.saveObject.c2a.final.modal.idx)"ng-bind-html="editorCtrl.saveObject.final.link.title" class="info"></a>
                </div>
            </div>
        </div>
    </div>
    <div ng-click="editorCtrl.ctaMask()" ng-class="{'vsbb-pointer-cursor':editorCtrl.saveObject.c2a.final.category == 'mask'}"  ng-if="editorCtrl.saveObject.hoverEffect.value == '4'" ng-style="editorCtrl.saveObject.initial.styles"
         class="vsbb-image-caption-view vsbb-image-caption-view-fourth">
        <img ng-show="editorCtrl.saveObject.initial.backgroundImg != null" ng-src="{{editorCtrl.saveObject.initial.backgroundImg}}" alt="">
        <div ng-style="editorCtrl.saveObject.mask.styles" class="vsbb-image-caption-mask">
            <h2 ng-style="editorCtrl.saveObject.final.heading.styles" ng-bind-html="editorCtrl.saveObject.heading"></h2>
            <p ng-bind-html="editorCtrl.saveObject.mainContent"></p>
            <div ng-if="editorCtrl.saveObject.c2a.final.category == 'button'">
                <a ng-if="editorCtrl.saveObject.c2a.final.type != 'modal'" ng-style="editorCtrl.saveObject.final.link.styles" href="{{editorCtrl.saveObject.final.link.url}}"
                   target="{{editorCtrl.saveObject.final.link.newTab ? '_blank' : '_self'}}" class="info"
                   ng-bind-html="editorCtrl.saveObject.final.link.title"></a>
                <div ng-controller="vsbbModalTriggerController as modalCtrl" ng-if="editorCtrl.saveObject.c2a.final.type == 'modal'">
                    <a href="" ng-style="editorCtrl.saveObject.final.link.styles" ng-click="modalCtrl.triggerModal(editorCtrl.saveObject.c2a.final.modal.idx)"ng-bind-html="editorCtrl.saveObject.final.link.title" class="info"></a>
                </div>
            </div>
        </div>
    </div>
    <div ng-click="editorCtrl.ctaMask()" ng-class="{'vsbb-pointer-cursor':editorCtrl.saveObject.c2a.final.category == 'mask'}"  ng-if="editorCtrl.saveObject.hoverEffect.value == '6'" ng-style="editorCtrl.saveObject.initial.styles"
         class="vsbb-image-caption-view vsbb-image-caption-view-sixth">
        <img ng-show="editorCtrl.saveObject.initial.backgroundImg != null" ng-src="{{editorCtrl.saveObject.initial.backgroundImg}}" alt="">
        <div ng-style="editorCtrl.saveObject.mask.styles" class="vsbb-image-caption-mask">
            <h2 ng-style="editorCtrl.saveObject.final.heading.styles" ng-bind-html="editorCtrl.saveObject.heading"></h2>
            <p class="vsbb-angular-text-wrapper"ng-bind-html="editorCtrl.saveObject.mainContent"></p>
            <div ng-if="editorCtrl.saveObject.c2a.final.category == 'button'">
                <a ng-if="editorCtrl.saveObject.c2a.final.type != 'modal'" ng-style="editorCtrl.saveObject.final.link.styles" href="{{editorCtrl.saveObject.final.link.url}}"
                   target="{{editorCtrl.saveObject.final.link.newTab ? '_blank' : '_self'}}" class="info"
                   ng-bind-html="editorCtrl.saveObject.final.link.title"></a>
                <div ng-controller="vsbbModalTriggerController as modalCtrl" ng-if="editorCtrl.saveObject.c2a.final.type == 'modal'">
                    <a href="" ng-style="editorCtrl.saveObject.final.link.styles" ng-click="modalCtrl.triggerModal(editorCtrl.saveObject.c2a.final.modal.idx)"ng-bind-html="editorCtrl.saveObject.final.link.title" class="info"></a>
                </div>
            </div>
        </div>
    </div>
    <div ng-click="editorCtrl.ctaMask()" ng-class="{'vsbb-pointer-cursor':editorCtrl.saveObject.c2a.final.category == 'mask'}" ng-if="editorCtrl.saveObject.hoverEffect.value == '7'" ng-style="editorCtrl.saveObject.initial.styles"
         class="vsbb-image-caption-view vsbb-image-caption-view-seventh">
        <img ng-show="editorCtrl.saveObject.initial.backgroundImg != null" ng-src="{{editorCtrl.saveObject.initial.backgroundImg}}" alt="">
        <div ng-style="editorCtrl.saveObject.mask.styles" class="vsbb-image-caption-mask">
            <h2 ng-style="editorCtrl.saveObject.final.heading.styles" ng-bind-html="editorCtrl.saveObject.heading"></h2>
            <p class="vsbb-angular-text-wrapper"ng-bind-html="editorCtrl.saveObject.mainContent"></p>
            <div ng-if="editorCtrl.saveObject.c2a.final.category == 'button'">
                <a ng-if="editorCtrl.saveObject.c2a.final.type != 'modal'" ng-style="editorCtrl.saveObject.final.link.styles" href="{{editorCtrl.saveObject.final.link.url}}"
                   target="{{editorCtrl.saveObject.final.link.newTab ? '_blank' : '_self'}}" class="info"
                   ng-bind-html="editorCtrl.saveObject.final.link.title"></a>
                <div ng-controller="vsbbModalTriggerController as modalCtrl" ng-if="editorCtrl.saveObject.c2a.final.type == 'modal'">
                    <a href="" ng-style="editorCtrl.saveObject.final.link.styles" ng-click="modalCtrl.triggerModal(editorCtrl.saveObject.c2a.final.modal.idx)"ng-bind-html="editorCtrl.saveObject.final.link.title" class="info"></a>
                </div>
            </div>
        </div>
    </div>
    <div ng-click="editorCtrl.ctaMask()" ng-class="{'vsbb-pointer-cursor':editorCtrl.saveObject.c2a.final.category == 'mask'}" ng-if="editorCtrl.saveObject.hoverEffect.value == '9'" ng-style="editorCtrl.saveObject.initial.styles"
         class="vsbb-image-caption-view vsbb-image-caption-view-ninth">
        <img ng-show="editorCtrl.saveObject.initial.backgroundImg != null" ng-src="{{editorCtrl.saveObject.initial.backgroundImg}}" alt="">
        <div ng-style="editorCtrl.saveObject.mask.styles" class="vsbb-image-caption-mask vsbb-image-caption-mask-1"></div>
        <div ng-style="editorCtrl.saveObject.mask.styles" class="vsbb-image-caption-mask vsbb-image-caption-mask-2"></div>

        <div class="vsbb-image-caption-content" ng-style="editorCtrl.saveObject.final.link.styles">
            <h2 ng-style="editorCtrl.saveObject.final.heading.styles" ng-bind-html="editorCtrl.saveObject.heading"></h2>
            <p class="vsbb-angular-text-wrapper"ng-bind-html="editorCtrl.saveObject.mainContent"></p>
            <div ng-if="editorCtrl.saveObject.c2a.final.category == 'button'">
                <a ng-if="editorCtrl.saveObject.c2a.final.type != 'modal'" ng-style="editorCtrl.saveObject.final.link.styles" href="{{editorCtrl.saveObject.final.link.url}}"
                   target="{{editorCtrl.saveObject.final.link.newTab ? '_blank' : '_self'}}" class="info"
                   ng-bind-html="editorCtrl.saveObject.final.link.title"></a>
                <div ng-controller="vsbbModalTriggerController as modalCtrl" ng-if="editorCtrl.saveObject.c2a.final.type == 'modal'">
                    <a href="" ng-style="editorCtrl.saveObject.final.link.styles" ng-click="modalCtrl.triggerModal(editorCtrl.saveObject.c2a.final.modal.idx)"ng-bind-html="editorCtrl.saveObject.final.link.title" class="info"></a>
                </div>
            </div>
        </div>
    </div>

</div>
