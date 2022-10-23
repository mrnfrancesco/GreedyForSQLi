<div class="vsbb-preview-sub" ng-show="editorCtrl.loaded">
    <div class="vsbb-grid"
         ng-class="{' vsbb-grid--no-gutter' : !editorCtrl.saveObject.gutters}"
         ng-repeat="v in editorCtrl.getNumber(editorCtrl.saveObject.size.v.value) track by $index">
        <div ng-repeat="h in editorCtrl.getNumber(editorCtrl.saveObject.size.h.value) track by $index"
             class="vsbb-grid-editor-col vsbb-grid__col vsbb-grid__col--1-of-{{editorCtrl.saveObject.size.h.value}}">
            <div class="vsbb-grid-editor-container">
                <p>Search and select an item</p>
                <!--<div class="vsbb-flex-select" dropdown-select="editorCtrl.savedBoxes"-->
                     <!--dropdown-model="editorCtrl.saveObject.gridIndex[$index][$parent.$index]"-->
                     <!--dropdown-item-label="friendly_name">-->
                <!--</div>-->
                <ui-select ng-model="editorCtrl.saveObject.gridIndex[$index][$parent.$parent.$index]" theme="select2" title="Choose a creation">
                    <ui-select-match placeholder="Search...">{{$select.selected.friendly_name}}</ui-select-match>
                    <ui-select-choices repeat="item in editorCtrl.savedBoxes | propsFilter: {friendly_name: $select.search, theme: $select.search}">
                        <div ng-bind-html="item.friendly_name | highlight: $select.search"></div>
                        <small>
                            ID: {{item.idx}}
                            <span>Theme: <span ng-bind-html="''+item.theme | highlight: $select.search"></span></span>
                        </small>
                    </ui-select-choices>
                </ui-select>
            </div>
        </div>
    </div>
</div>
