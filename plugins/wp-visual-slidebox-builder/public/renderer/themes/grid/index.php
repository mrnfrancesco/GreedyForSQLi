<?php
$main_handler = 'vsbb-grid-builder-theme-' . preg_replace('/(0)\.(\d+) (\d+)/', '$3$1$2', microtime());
?>
<div id="<?php echo $main_handler; ?>">
    <?php for ($i = 0; $i < $saved_obj->size->v->value; $i++): ?>
        <div class="vsbb-grid <?php echo !$saved_obj->gutters ? 'vsbb-grid--no-gutter' : '' ?>">
            <?php for ($j = 0; $j < $saved_obj->size->h->value; $j++): ?>
                <?php if (isset($saved_obj->gridIndex[$j][$i])): ?>
                    <div class="vsbb-grid-editor-col vsbb-grid__col vsbb-grid__col--1-of-<?php echo $saved_obj->size->h->value ?>">
                        <div class="vsbb-grid-editor-container vsbb-grid-render">
                            <?php $id = $saved_obj->gridIndex[$j][$i]->idx; ?>
                            <?php echo do_shortcode("[VSBB id=$id grid=true]"); ?>
                        </div>
                    </div>
                <?php endif; ?>
            <?php endfor; ?>
        </div>
    <?php endfor; ?>
</div>


