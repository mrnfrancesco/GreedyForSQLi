<?php
$main_handler = 'vsbb-modal-' . preg_replace('/(0)\.(\d+) (\d+)/', '$3$1$2', microtime());
?>

<div id="<?php echo $main_handler?> " ng-app="vsbbAngularRenderApp" ng-controller="vsbbModalRenderController as renderCtrl">
    <div id="<?php echo $main_handler; ?>" class="vsbb-modal-initial">
        <a href="" <?php echo "ng-click='renderCtrl.triggerModal($id)'" ?>><?php echo $saved_obj->modalSettings->triggerText ?></a>

    </div>
</div>

<script id="<?php echo $main_handler ?>_script">
    (function ($) {
        var mainHandlerPlain = "<?php echo $main_handler ?>";
        angular.bootstrap(document.getElementById(mainHandlerPlain), ['vsbbAngularRenderApp']);
    })(jQuery);
</script>
