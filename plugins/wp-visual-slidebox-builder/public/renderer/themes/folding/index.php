<?php
$main_handler = 'vsbb-uc-container-' . preg_replace('/(0)\.(\d+) (\d+)/', '$3$1$2', microtime());
$unfolded_styles = $saved_obj->unfolded->styles;
$folded_styles = $saved_obj->folded->styles;
?>
<div class="<?php echo 'vsbb-grid__col ' . $saved_obj->positioning->responsiveClass;
echo !$saved_obj->positioning->gutters ? ' vsbb-grid--no-gutter' : ''; ?>">
    <div id="<?php echo $main_handler; ?>" class="uc-container">
        <div class="uc-initial-content">
            <!-- custom content -->
            <span class="vsbb-pfold-clickme"><i
                        class="fa <?php echo $saved_obj->triggers->open->styleClass ?>"></i></span>
            <?php if (isset($saved_obj->folded->backgroundImg)): ?>
                <img src="<?php echo $saved_obj->folded->backgroundImg ?>" alt="">
            <?php endif; ?>
        </div>
        <div class="uc-final-content">
            <!-- custom content -->
            <div class="scrollwrap">
                <p><?php echo $saved_obj->mainText ?></p>
            </div>
            <span class="vsbb-pfold-close"><i
                        class="fa <?php echo $saved_obj->triggers->close->styleClass ?>"></i></span>
            <?php if (isset($saved_obj->unfolded->backgroundImg)): ?>
                <img src="<?php echo $saved_obj->unfolded->backgroundImg ?>" alt="">
            <?php endif; ?>
        </div>
    </div>
</div>
<style id="<?php echo $main_handler ?>_styles">
    <?php if(isset($unfolded_styles->{'background-color'})): ?>
    <?php echo '#'.$main_handler . ' .uc-single,'?>
    <?php echo '#'.$main_handler . ' .uc-final,' ?>
    <?php echo '#'.$main_handler . ' .uc-back,' ?>
    <?php echo '#'.$main_handler . ' .uc-front'?>
    {
    <?php echo 'background-color:'. $unfolded_styles->{'background-color'} ?>
    }
    <?php endif?>
    <?php if(isset($folded_styles->{'background-color'})): ?>
    <?php echo '#'.$main_handler . ' .uc-initial-content' ?>
    {
    <?php echo 'background-color:'. $folded_styles->{'background-color'} ?>
    }
    <?php endif?>
</style>

<script id="<?php echo $main_handler ?>_script">
    (function ($) {
        var foldedStyles = JSON.parse('<?php echo(json_encode($saved_obj->folded->styles)) ?>');
        var openTriggerStyles = JSON.parse('<?php echo(json_encode($saved_obj->triggers->open->styles)) ?>');
        var closeTriggerStyles = JSON.parse('<?php echo(json_encode($saved_obj->triggers->close->styles)) ?>');
        var mainHandler = "#<?php echo $main_handler ?>";
        $(mainHandler).css(foldedStyles);
        $(mainHandler + ' .vsbb-pfold-clickme').css(openTriggerStyles);
        $(mainHandler + ' .vsbb-pfold-close').css(closeTriggerStyles);
        var respClass = "<?php echo $saved_obj->positioning->responsiveClass; ?>";
        if (respClass !== 'vsbb-grid__col--12-of-12') {
            $(mainHandler).css({'margin': '0 auto'});
        }
        var pfold = null;
        setTimeout(function () {
            pfold = $(mainHandler).pfold({
                easing: 'ease-in',
                folds: <?php echo $saved_obj->folds->value; ?>,
                folddirection: <?php echo '[' . "'" . implode("','", $saved_obj->foldDirections->value) . "'" . ']'; ?>,
                containerEasing: 'ease-in',
                centered: '<?php echo $saved_obj->centered; ?>',
                overlays: <?php echo $saved_obj->overlays; ?>,
                containerSpeedFactor: 1,
                speed:<?php echo $saved_obj->speed; ?>,
                perspective: <?php echo $saved_obj->depth; ?>
            });
        }, 600);

        $(mainHandler + ' .vsbb-pfold-clickme').off('click');
        $(mainHandler + ' .vsbb-pfold-clickme').on('click', function () {
            pfold.unfold();
        });
        $(mainHandler + ' .vsbb-pfold-close').off('click');
        $(mainHandler + ' .vsbb-pfold-close').on('click', function () {
            pfold.fold();
        });
        //removes annoying p tag
        $(mainHandler).siblings('p').remove();
        $(mainHandler + '_script').siblings('p').remove();
    })(jQuery);
</script>
