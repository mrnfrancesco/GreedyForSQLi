<?php
$main_handler = 'vsbb-standard-' . preg_replace('/(0)\.(\d+) (\d+)/', '$3$1$2', microtime());
$responsive = $saved_obj->positioning->responsive;
?>

<?php if (!$grid): ?>
<div class="<?php echo $responsive ? 'vsbb-grid__col ' . $saved_obj->positioning->responsiveClass : 'vsbb-clearfix';
echo $responsive && !$saved_obj->positioning->gutters ? ' vsbb-grid--no-gutter' : ''; ?>">
    <?php endif; ?>
    <div id="<?php echo $main_handler; ?>" class="vsbb-standard-initial">
        <customp class="vsbb-standard-p vsbb-angular-text-wrapper"><?php echo $saved_obj->initial->mainText ?></customp>
        <?php if ($saved_obj->initial->backgroundImg != ''): ?>
            <img src="<?php echo $saved_obj->initial->backgroundImg ?>" alt="" class="vsabb-standard-img">
        <?php endif; ?>
        <div class="vsbb-standard-final animated <?php echo ($saved_obj->entranceEffect->outEffect == 'vsbb-slide-down-classic-down-50' || $saved_obj->entranceEffect->outEffect == 'vsbb-slide-down-classic-50') ? $saved_obj->entranceEffect->outEffect : 'vsbb-hidden' ?>">
            <customp class="vsbb-standard-p"><?php echo $saved_obj->final->mainText ?></customp>
            <?php if ($saved_obj->final->link->enabled == true): ?>
                <a class="vsbb-standard-link <?php echo $saved_obj->final->link->position ?>"
                   href="<?php echo $saved_obj->final->link->url ?>"
                   target="<?php echo ($saved_obj->final->link->newTab == true) ? '_blank' : '_self' ?>"><?php echo $saved_obj->final->link->title ?></a>
            <?php endif; ?>
            <?php if ($saved_obj->initial->backgroundImg != ''): ?>
                <img src="<?php echo $saved_obj->final->backgroundImg ?>" alt="" class="vsabb-standard-img">
            <?php endif; ?>
        </div>
    </div>

    <?php if (!$grid): ?>
</div>
<?php endif; ?>

<script id="<?php echo $main_handler ?>_script">
    (function ($) {
        var initialStyles = JSON.parse('<?php echo(json_encode($saved_obj->initial->styles)) ?>');
        var finalStyles = JSON.parse('<?php echo(json_encode($saved_obj->final->styles)) ?>');
        var linkStyles = JSON.parse('<?php echo(json_encode($saved_obj->final->link->styles)) ?>');
        var mainHandler = "#<?php echo $main_handler ?>";
        var inHoverEffect = "<?php echo $saved_obj->entranceEffect->inEffect; ?>";
        var outHoverEffect = "<?php echo $saved_obj->entranceEffect->outEffect; ?>";
        $(mainHandler).css(initialStyles);
        $(mainHandler + ' .vsbb-standard-final').css(finalStyles);
        $(mainHandler + ' .vsbb-standard-link').css(linkStyles);
        //removes annoying p tag
        $(mainHandler).siblings('p').remove();
        $(mainHandler + '_script').siblings('p').remove();
        var responsive = "<?php echo $saved_obj->positioning->responsive || $grid?>"
        var preserveRatio = "<?php echo $saved_obj->positioning->preserveRatio; ?>";
        if (responsive) {
            $(mainHandler).css({'width': '100%'});
            if (preserveRatio) {
                var width = parseInt(initialStyles.width);
                var height = parseInt(initialStyles.height);
                var widthFinal = parseInt(finalStyles.width);
                var heightFinal = parseInt(finalStyles.height);
                var ratio = height / width;
                $(mainHandler).css({'height': $(mainHandler).width() * ratio});
                $(mainHandler + ' .vsbb-standard-final').css({'width': $(mainHandler).height() * (heightFinal / height)});
                $(mainHandler + ' .vsbb-standard-final').css({'height': $(mainHandler).width() * (widthFinal / height)});
                $(window).resize(function () {
                    $(mainHandler).css({'height': $(mainHandler).width() * ratio});
                    $(mainHandler + ' .vsbb-standard-final').css({'width': $(mainHandler).height() * (heightFinal / height)});
                    $(mainHandler + ' .vsbb-standard-final').css({'height': $(mainHandler).width() * (widthFinal / height)});
                });
            } else {
                $(mainHandler).css({'margin': '0 auto'});
            }
        }


        $(mainHandler).on('mouseenter', function () {
            $(this).find('.vsbb-standard-final').removeClass().addClass('vsbb-hovering vsbb-standard-final animated ' + inHoverEffect);
        });
        $(mainHandler).on('mouseleave', function () {
            $(this).find('.vsbb-standard-final').removeClass().addClass('vsbb-standard-final animated ' + outHoverEffect);
        });
    })(jQuery);
</script>
