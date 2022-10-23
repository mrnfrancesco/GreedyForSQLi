<?php
$main_handler = 'vsbb-image-caption-view-' . preg_replace('/(0)\.(\d+) (\d+)/', '$3$1$2', microtime());

if (isset($saved_obj->pfs)) {
    $pfs_obj = $saved_obj->pfs;
    foreach ($saved_obj->pfs as $item) {
        if ($item->render->action == 'replace') {
            if (count($item->f) == 1) {
                $saved_obj->{$item->f[0]} = $item->render->val;
            } elseif (count($item->f) == 2) {
                $saved_obj->{$item->f[0]}->{$item->f[1]} = $item->render->val;
            } elseif (count($item->f) == 3) {
                $saved_obj->{$item->f[0]}->{$item->f[1]}->{$item->f[2]} = $item->render->val;
            }
        }
        if ($item->render->action == 'remove') {
            unset($saved_obj->{$item['f']});
        }
    }

}

$responsive = $saved_obj->positioning->responsive;
?>
<?php if (!$grid): ?>
<div class="<?php echo $responsive ? 'vsbb-grid__col ' . $saved_obj->positioning->responsiveClass : 'vsbb-clearfix';
echo $responsive && !$saved_obj->positioning->gutters ? ' vsbb-grid--no-gutter' : ''; ?>">
    <?php endif; ?>
    <?php if ($saved_obj->hoverEffect->value == 1): ?>
        <div id="<?php echo $main_handler; ?>" class="vsbb-image-caption-view vsbb-image-caption-view-first">
            <?php if ($saved_obj->initial->backgroundImg != ''): ?>
                <img src="<?php echo $saved_obj->initial->backgroundImg ?>" alt="">
            <?php endif; ?>
            <div class="vsbb-image-caption-mask">
                <h2 class="vsbb-image-caption-heading"><?php echo $saved_obj->heading ?></h2>
                <customp class="vsbb-angular-text-wrapper"><?php echo $saved_obj->mainContent ?></customp>
                <?php if (isset($saved_obj->c2a) && $saved_obj->c2a->final->category == 'button'): ?>
                    <?php if (!isset($saved_obj->c2a) || $saved_obj->c2a->final->type != 'modal'): ?>
                        <a class="vsbb-image-caption-link info" href="<?php echo $saved_obj->final->link->url ?>"
                           target="<?php echo ($saved_obj->final->link->newTab == true) ? '_blank' : '_self' ?>"><?php echo $saved_obj->final->link->title ?></a>
                    <?php elseif ($saved_obj->c2a->final->type == 'modal'): ?>
                        <div ng-controller="vsbbModalRenderController as renderCtrl">
                            <?php $modal_idx = $saved_obj->c2a->final->modal->idx ?>
                            <a class="vsbb-image-caption-link info"
                               href="" <?php echo "ng-click='renderCtrl.triggerModal($modal_idx)'" ?>><?php echo $saved_obj->final->link->title ?></a>
                        </div>
                    <?php endif ?>
                <?php elseif (isset($saved_obj->c2a) && $saved_obj->c2a->final->category == 'mask'): ?>
                    <?php if ($saved_obj->c2a->final->type == 'modal'): ?>
                        <div style="display: none" ng-controller="vsbbModalRenderController as renderCtrl">
                            <?php $modal_idx = $saved_obj->c2a->final->modal->idx ?>
                            <a id="<?php echo $main_handler?>-modal-trigger" class="vsbb-image-caption-link info"
                               href="" <?php echo "ng-click='renderCtrl.triggerModal($modal_idx)'" ?>><?php echo $saved_obj->final->link->title ?></a>
                        </div>
                    <?php endif ?>
                <?php endif ?>
            </div>
        </div>
    <?php elseif ($saved_obj->hoverEffect->value == 2): ?>
        <div id="<?php echo $main_handler; ?>" class="vsbb-image-caption-view vsbb-image-caption-view-second">
            <?php if ($saved_obj->initial->backgroundImg != ''): ?>
                <img src="<?php echo $saved_obj->initial->backgroundImg ?>" alt="">
            <?php endif; ?>
            <div class="vsbb-image-caption-mask">
            </div>
            <div class="vsbb-image-caption-content">
                <h2 class="vsbb-image-caption-heading"><?php echo $saved_obj->heading ?></h2>
                <customp class="vsbb-angular-text-wrapper"><?php echo $saved_obj->mainContent ?></customp>
                <?php if (isset($saved_obj->c2a) && $saved_obj->c2a->final->category == 'button'): ?>
                    <?php if (!isset($saved_obj->c2a) || $saved_obj->c2a->final->type != 'modal'): ?>
                        <a class="vsbb-image-caption-link info" href="<?php echo $saved_obj->final->link->url ?>"
                           target="<?php echo ($saved_obj->final->link->newTab == true) ? '_blank' : '_self' ?>"><?php echo $saved_obj->final->link->title ?></a>
                    <?php elseif ($saved_obj->c2a->final->type == 'modal'): ?>
                        <div ng-controller="vsbbModalRenderController as renderCtrl">
                            <?php $modal_idx = $saved_obj->c2a->final->modal->idx ?>
                            <a class="vsbb-image-caption-link info"
                               href="" <?php echo "ng-click='renderCtrl.triggerModal($modal_idx)'" ?>><?php echo $saved_obj->final->link->title ?></a>
                        </div>
                    <?php endif ?>
                <?php elseif (isset($saved_obj->c2a) && $saved_obj->c2a->final->category == 'mask'): ?>
                    <?php if ($saved_obj->c2a->final->type == 'modal'): ?>
                        <div style="display: none" ng-controller="vsbbModalRenderController as renderCtrl">
                            <?php $modal_idx = $saved_obj->c2a->final->modal->idx ?>
                            <a id="<?php echo $main_handler?>-modal-trigger" class="vsbb-image-caption-link info"
                               href="" <?php echo "ng-click='renderCtrl.triggerModal($modal_idx)'" ?>><?php echo $saved_obj->final->link->title ?></a>
                        </div>
                    <?php endif ?>
                <?php endif ?>
            </div>
        </div>
    <?php elseif ($saved_obj->hoverEffect->value == 3): ?>
        <div id="<?php echo $main_handler; ?>" class="vsbb-image-caption-view vsbb-image-caption-view-third">
            <?php if ($saved_obj->initial->backgroundImg != ''): ?>
                <img src="<?php echo $saved_obj->initial->backgroundImg ?>" alt="">
            <?php endif; ?>
            <div class="vsbb-image-caption-mask">
            </div>
            <div class="vsbb-image-caption-content">
                <h2 class="vsbb-image-caption-heading"><?php echo $saved_obj->heading ?></h2>
                <customp class="vsbb-angular-text-wrapper"><?php echo $saved_obj->mainContent ?></customp>
                <?php if (isset($saved_obj->c2a) && $saved_obj->c2a->final->category == 'button'): ?>
                    <?php if (!isset($saved_obj->c2a) || $saved_obj->c2a->final->type != 'modal'): ?>
                        <a class="vsbb-image-caption-link info" href="<?php echo $saved_obj->final->link->url ?>"
                           target="<?php echo ($saved_obj->final->link->newTab == true) ? '_blank' : '_self' ?>"><?php echo $saved_obj->final->link->title ?></a>
                    <?php elseif ($saved_obj->c2a->final->type == 'modal'): ?>
                        <div ng-controller="vsbbModalRenderController as renderCtrl">
                            <?php $modal_idx = $saved_obj->c2a->final->modal->idx ?>
                            <a class="vsbb-image-caption-link info"
                               href="" <?php echo "ng-click='renderCtrl.triggerModal($modal_idx)'" ?>><?php echo $saved_obj->final->link->title ?></a>
                        </div>
                    <?php endif ?>
                <?php elseif (isset($saved_obj->c2a) && $saved_obj->c2a->final->category == 'mask'): ?>
                    <?php if ($saved_obj->c2a->final->type == 'modal'): ?>
                        <div style="display: none" ng-controller="vsbbModalRenderController as renderCtrl">
                            <?php $modal_idx = $saved_obj->c2a->final->modal->idx ?>
                            <a id="<?php echo $main_handler?>-modal-trigger" class="vsbb-image-caption-link info"
                               href="" <?php echo "ng-click='renderCtrl.triggerModal($modal_idx)'" ?>><?php echo $saved_obj->final->link->title ?></a>
                        </div>
                    <?php endif ?>
                <?php endif ?>
            </div>
        </div>
    <?php elseif ($saved_obj->hoverEffect->value == 4): ?>
        <div id="<?php echo $main_handler; ?>" class="vsbb-image-caption-view vsbb-image-caption-view-fourth">
            <?php if ($saved_obj->initial->backgroundImg != ''): ?>
                <img src="<?php echo $saved_obj->initial->backgroundImg ?>" alt="">
            <?php endif; ?>
            <div class="vsbb-image-caption-mask">
                <h2 class="vsbb-image-caption-heading"><?php echo $saved_obj->heading ?></h2>
                <customp class="vsbb-angular-text-wrapper"><?php echo $saved_obj->mainContent ?></customp>
                <?php if (isset($saved_obj->c2a) && $saved_obj->c2a->final->category == 'button'): ?>
                    <?php if (!isset($saved_obj->c2a) || $saved_obj->c2a->final->type != 'modal'): ?>
                        <a class="vsbb-image-caption-link info" href="<?php echo $saved_obj->final->link->url ?>"
                           target="<?php echo ($saved_obj->final->link->newTab == true) ? '_blank' : '_self' ?>"><?php echo $saved_obj->final->link->title ?></a>
                    <?php elseif ($saved_obj->c2a->final->type == 'modal'): ?>
                        <div ng-controller="vsbbModalRenderController as renderCtrl">
                            <?php $modal_idx = $saved_obj->c2a->final->modal->idx ?>
                            <a class="vsbb-image-caption-link info"
                               href="" <?php echo "ng-click='renderCtrl.triggerModal($modal_idx)'" ?>><?php echo $saved_obj->final->link->title ?></a>
                        </div>
                    <?php endif ?>
                <?php elseif (isset($saved_obj->c2a) && $saved_obj->c2a->final->category == 'mask'): ?>
                    <?php if ($saved_obj->c2a->final->type == 'modal'): ?>
                        <div style="display: none" ng-controller="vsbbModalRenderController as renderCtrl">
                            <?php $modal_idx = $saved_obj->c2a->final->modal->idx ?>
                            <a id="<?php echo $main_handler?>-modal-trigger" class="vsbb-image-caption-link info"
                               href="" <?php echo "ng-click='renderCtrl.triggerModal($modal_idx)'" ?>><?php echo $saved_obj->final->link->title ?></a>
                        </div>
                    <?php endif ?>
                <?php endif ?>
            </div>
        </div>
    <?php elseif ($saved_obj->hoverEffect->value == 6): ?>
        <div id="<?php echo $main_handler; ?>" class="vsbb-image-caption-view vsbb-image-caption-view-sixth">
            <?php if ($saved_obj->initial->backgroundImg != ''): ?>
                <img src="<?php echo $saved_obj->initial->backgroundImg ?>" alt="">
            <?php endif; ?>
            <div class="vsbb-image-caption-mask">
                <h2 class="vsbb-image-caption-heading"><?php echo $saved_obj->heading ?></h2>
                <customp class="vsbb-angular-text-wrapper"><?php echo $saved_obj->mainContent ?></customp>
                <?php if (isset($saved_obj->c2a) && $saved_obj->c2a->final->category == 'button'): ?>
                    <?php if (!isset($saved_obj->c2a) || $saved_obj->c2a->final->type != 'modal'): ?>
                        <a class="vsbb-image-caption-link info" href="<?php echo $saved_obj->final->link->url ?>"
                           target="<?php echo ($saved_obj->final->link->newTab == true) ? '_blank' : '_self' ?>"><?php echo $saved_obj->final->link->title ?></a>
                    <?php elseif ($saved_obj->c2a->final->type == 'modal'): ?>
                        <div ng-controller="vsbbModalRenderController as renderCtrl">
                            <?php $modal_idx = $saved_obj->c2a->final->modal->idx ?>
                            <a class="vsbb-image-caption-link info"
                               href="" <?php echo "ng-click='renderCtrl.triggerModal($modal_idx)'" ?>><?php echo $saved_obj->final->link->title ?></a>
                        </div>
                    <?php endif ?>
                <?php elseif (isset($saved_obj->c2a) && $saved_obj->c2a->final->category == 'mask'): ?>
                    <?php if ($saved_obj->c2a->final->type == 'modal'): ?>
                        <div style="display: none" ng-controller="vsbbModalRenderController as renderCtrl">
                            <?php $modal_idx = $saved_obj->c2a->final->modal->idx ?>
                            <a id="<?php echo $main_handler?>-modal-trigger" class="vsbb-image-caption-link info"
                               href="" <?php echo "ng-click='renderCtrl.triggerModal($modal_idx)'" ?>><?php echo $saved_obj->final->link->title ?></a>
                        </div>
                    <?php endif ?>
                <?php endif ?>
            </div>
        </div>
    <?php elseif ($saved_obj->hoverEffect->value == 7): ?>
        <div id="<?php echo $main_handler; ?>" class="vsbb-image-caption-view vsbb-image-caption-view-seventh">
            <?php if ($saved_obj->initial->backgroundImg != ''): ?>
                <img src="<?php echo $saved_obj->initial->backgroundImg ?>" alt="">
            <?php endif; ?>
            <div class="vsbb-image-caption-mask">
                <h2 class="vsbb-image-caption-heading"><?php echo $saved_obj->heading ?></h2>
                <customp class="vsbb-angular-text-wrapper"><?php echo $saved_obj->mainContent ?></customp>
                <?php if (isset($saved_obj->c2a) && $saved_obj->c2a->final->category == 'button'): ?>
                    <?php if (!isset($saved_obj->c2a) || $saved_obj->c2a->final->type != 'modal'): ?>
                        <a class="vsbb-image-caption-link info" href="<?php echo $saved_obj->final->link->url ?>"
                           target="<?php echo ($saved_obj->final->link->newTab == true) ? '_blank' : '_self' ?>"><?php echo $saved_obj->final->link->title ?></a>
                    <?php elseif ($saved_obj->c2a->final->type == 'modal'): ?>
                        <div ng-controller="vsbbModalRenderController as renderCtrl">
                            <?php $modal_idx = $saved_obj->c2a->final->modal->idx ?>
                            <a class="vsbb-image-caption-link info"
                               href="" <?php echo "ng-click='renderCtrl.triggerModal($modal_idx)'" ?>><?php echo $saved_obj->final->link->title ?></a>
                        </div>
                    <?php endif ?>
                <?php elseif (isset($saved_obj->c2a) && $saved_obj->c2a->final->category == 'mask'): ?>
                    <?php if ($saved_obj->c2a->final->type == 'modal'): ?>
                        <div style="display: none" ng-controller="vsbbModalRenderController as renderCtrl">
                            <?php $modal_idx = $saved_obj->c2a->final->modal->idx ?>
                            <a id="<?php echo $main_handler?>-modal-trigger" class="vsbb-image-caption-link info"
                               href="" <?php echo "ng-click='renderCtrl.triggerModal($modal_idx)'" ?>><?php echo $saved_obj->final->link->title ?></a>
                        </div>
                    <?php endif ?>
                <?php endif ?>
            </div>
        </div>
    <?php elseif ($saved_obj->hoverEffect->value == 9): ?>
        <div id="<?php echo $main_handler; ?>" class="vsbb-image-caption-view vsbb-image-caption-view-ninth">
            <?php if ($saved_obj->initial->backgroundImg != ''): ?>
                <img src="<?php echo $saved_obj->initial->backgroundImg ?>" alt="">
            <?php endif; ?>
            <div class="vsbb-image-caption-mask vsbb-image-caption-mask-1"></div>
            <div class="vsbb-image-caption-mask vsbb-image-caption-mask-2"></div>
            <div class="vsbb-image-caption-content">
                <h2 class="vsbb-image-caption-heading"><?php echo $saved_obj->heading ?></h2>
                <customp class="vsbb-angular-text-wrapper"><?php echo $saved_obj->mainContent ?></customp>
                <?php if (isset($saved_obj->c2a) && $saved_obj->c2a->final->category == 'button'): ?>
                    <?php if (!isset($saved_obj->c2a) || $saved_obj->c2a->final->type != 'modal'): ?>
                        <a class="vsbb-image-caption-link info" href="<?php echo $saved_obj->final->link->url ?>"
                           target="<?php echo ($saved_obj->final->link->newTab == true) ? '_blank' : '_self' ?>"><?php echo $saved_obj->final->link->title ?></a>
                    <?php elseif ($saved_obj->c2a->final->type == 'modal'): ?>
                        <div ng-controller="vsbbModalRenderController as renderCtrl">
                            <?php $modal_idx = $saved_obj->c2a->final->modal->idx ?>
                            <a class="vsbb-image-caption-link info"
                               href="" <?php echo "ng-click='renderCtrl.triggerModal($modal_idx)'" ?>><?php echo $saved_obj->final->link->title ?></a>
                        </div>
                    <?php endif ?>
                <?php elseif (isset($saved_obj->c2a) && $saved_obj->c2a->final->category == 'mask'): ?>
                    <?php if ($saved_obj->c2a->final->type == 'modal'): ?>
                        <div style="display: none" ng-controller="vsbbModalRenderController as renderCtrl">
                            <?php $modal_idx = $saved_obj->c2a->final->modal->idx ?>
                            <a id="<?php echo $main_handler?>-modal-trigger" class="vsbb-image-caption-link info"
                               href="" <?php echo "ng-click='renderCtrl.triggerModal($modal_idx)'" ?>><?php echo $saved_obj->final->link->title ?></a>
                        </div>
                    <?php endif ?>
                <?php endif ?>
            </div>
        </div>
    <?php endif; ?>

    <?php if (!$grid): ?>
</div>
<?php endif; ?>

<script id="<?php echo $main_handler ?>_script">
    (function ($) {
        var c2aFinalType = <?php echo(json_encode($saved_obj->c2a->final->type)) ?>;
        var c2aFinalCategory = <?php echo(json_encode($saved_obj->c2a->final->category)) ?>;
        var link = JSON.parse('<?php echo(json_encode($saved_obj->final->link)) ?>');
        var initialStyles = JSON.parse('<?php echo(json_encode($saved_obj->initial->styles)) ?>');
        var maskStyles = JSON.parse('<?php echo(json_encode($saved_obj->mask->styles)) ?>');
        var headingStyles = JSON.parse('<?php echo(json_encode($saved_obj->final->heading->styles)) ?>');
        var linkStyles = JSON.parse('<?php echo(json_encode($saved_obj->final->link->styles)) ?>');
        var mainHandler = "#<?php echo $main_handler ?>";
        var mainHandlerPlain = "<?php echo $main_handler ?>";
        $(mainHandler).css(initialStyles);
        var responsive = "<?php echo $saved_obj->positioning->responsive || $grid?>";
        var preserveRatio = "<?php echo $saved_obj->positioning->preserveRatio; ?>";
        if (responsive) {
            $(mainHandler).css({'width': '100%'});
            if (preserveRatio) {
                var width = parseInt(initialStyles.width);
                var height = parseInt(initialStyles.height);
                var ratio = height / width;
                $(mainHandler).css({'height': $(mainHandler).width() * ratio});
                $(window).resize(function () {
                    $(mainHandler).css({'height': $(mainHandler).width() * ratio});
                });
            } else {
                $(mainHandler).css({'margin': '0 auto'});
            }
        }

        if (c2aFinalCategory === 'mask') {
            $(mainHandler).addClass('vsbb-pointer-cursor');
            $(mainHandler).off('click');
            $(mainHandler).on('click', function ($e) {
                if (c2aFinalType === 'link') {
                    if (link.newTab) {
                        window.open(link.url, '_blank');
                    } else {
                        window.location.href = link.url;
                    }
                } else {
                    angular.element(mainHandler+'-modal-trigger').triggerHandler('click');
                }
            });
        }

        $(mainHandler + ' .vsbb-image-caption-mask').css(maskStyles);
        $(mainHandler + ' .vsbb-image-caption-heading').css(headingStyles);
        $(mainHandler + ' .vsbb-image-caption-link').css(linkStyles);
        $(mainHandler + '.vsbb-image-caption-view-ninth .vsbb-image-caption-content').css(linkStyles);
        //removes annoying p tag
        $(mainHandler).siblings('p').remove();
        $(mainHandler + '_script').siblings('p').remove();
        angular.bootstrap(document.getElementById(mainHandlerPlain), ['vsbbAngularRenderApp']);
    })(jQuery);
</script>

