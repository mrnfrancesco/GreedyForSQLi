<div class="vsbb-main-parent" ng-app="vsbbAngularApp">
    <div class="vsbb-header clearfix">
        <h3>Visual Slide Builder</h3>
        <span> - The most complete slide animation tool</span>
        <div class="vsbb-nav" ng-controller="vsbbNavController as navCtrl">
            <ul>
                <li><a ng-class="navCtrl.navClass('#builder')" href="#builder">Builder</a></li>
                <li><a ng-class="navCtrl.navClass('#history')" href="#history">History</a></li>
                <li><a ng-class="navCtrl.navClass('#my')" href="#my">My VAB</a></li>
            </ul>
        </div>
    </div>
    <div ng-view></div>
    <div class="vsbb-footer vsbb-grid">
    </div>
</div>
