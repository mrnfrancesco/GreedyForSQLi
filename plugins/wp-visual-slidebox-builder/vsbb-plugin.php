<?php

/*
  Plugin Name: Visual Slide Box Builder
  Plugin URI: http://wpvisualslideboxbuilder.com
  Description: Fancy stand alone animations, guaranteed to make your site stand out.
  Author: Enmanuel Corvo
  Version: 3.2.9
  Author URI: http://wpvisualslideboxbuilder.com
 */

add_action('admin_menu', 'vsbb_menu');
function vsbb_menu()
{
    add_menu_page('Visual Slide Box Builder Settings', 'Visual Slide Box Builder', 'manage_options', 'wpvsbb-settings', 'wpvsbb_settings_page', 'dashicons-twitter');
}


add_shortcode('VSBB', 'vsbb_shortcode');
function vsbb_shortcode($atts)
{
    global $wpdb;
    global $wp_scripts;
    $table_name = $wpdb->prefix . "vsbb_v2";
    extract(shortcode_atts(array(
        'id' => '',
        'grid' => ''
    ), $atts));
    $result = vsbb_get_one($id);
    $saved_obj = json_decode($result->save_object);
    $data = vsbb_get_paid_version_allowed_plugin();
    if (empty($data)) {
        return '';
    }
    $display = false;
    foreach ($data['builders'] as $builder) {
        if ($builder == $saved_obj->themeId) {
            $display = true;
        }
    }
    if (!$display) {
        return '';
    }

    if (isset($saved_obj->pfs) && vsbb_get_paid_version()) {
        unset($saved_obj->pfs);
    }

    ob_start();
    //include(__DIR__ . '/public/renderer/themes/' . $result->theme . '/index.php');
    include(plugin_dir_path(__FILE__) . '/public/renderer/themes/' . $result->theme . '/index.php');
    return ob_get_clean();
    //return $ret;
}

//legacy shortcode render support
add_shortcode('virtual_slide_box', 'box_shortcode');

function box_shortcode($atts)
{

    /* Register bootstrap and custom stylesheet and js for actual page */
    wp_register_style('bootstrap_funBox_style', plugins_url('public/renderer/themes/legacy/bootstrap.min.css', __FILE__));
    wp_register_style('custom_funBox_style', plugins_url('public/renderer/themes/legacy/custom-fun-box.css', __FILE__));
    wp_register_script('funbox_page_js', plugins_url('public/renderer/themes/legacy/fun_box.js', __FILE__), array('jquery'));

    wp_enqueue_style('bootstrap_funBox_style');
    wp_enqueue_style('custom_funBox_style');
    //wp_enqueue_style('animated_css');
    wp_enqueue_script('funbox_page_js');
    //wp_enqueue_script('bootstrap_js');
    extract(shortcode_atts(array(
        'id' => '',
        'mode' => 'bottom-up-full',
        'class' => '',
        'title' => '',
        'desc' => '',
        'alt' => ''
    ), $atts));
    global $wpdb;
    $table_name = $wpdb->prefix . "funbox";
    $aBox = "13";
    $box = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id =%d", $id));
    //exit(var_dump($wpdb->last_query));
    $html_1 = str_replace('\\', '', $box->box_html);
    $html_2 = str_replace('squareDemo', 'squareDemo squareDemo_production', $html_1);
    $html = str_replace('square_preview', 'square_production_' . $box->boxId . rand(1, 9999999), $html_2);
    return $html;
}

function wpvsbb_settings_page()
{
    include 'settings-page.php';
}

add_action('wp_ajax_vsbb_save', 'vsbb_save');
function vsbb_save()
{
    global $wpdb;
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata, 1);
    $table_name = $wpdb->prefix . "vsbb_v2";
    //check if friendly name exists
    $friendly_name_exists = $wpdb->get_results(
        $wpdb->prepare("SELECT * FROM $table_name 
                WHERE friendly_name = %s
                AND theme = %s
                LIMIT 1",
            $request['friendly_name'],
            $request['theme']
        )
    );
    if (!$request['overwrite']) {
        //nothing with that friendly name, brand new entry
        if (!isset($friendly_name_exists) || count($friendly_name_exists) == 0) {
            $data = array(
                'friendly_name' => $request['friendly_name'],
                'save_object' => json_encode($request['save_object']),
                'theme' => $request['theme'],
                'theme_friendly_name' => $request['save_object']['themeFriendlyName']
            );
            $rows_affected = $wpdb->insert($table_name, $data);
            if ($rows_affected > 0) {
                $json = json_encode(array('status' => 'success', 'id' => $wpdb->insert_id));
            } else {
                $json = json_encode(array('status' => 'failed'));
            }
        } else {
            //found one, ask user for overwrite
            $json = json_encode(array('status' => 'overwrite'));
        }
    } else {
        $idx = $friendly_name_exists[0]->idx;
        $rows_affected = $wpdb->update(
            $table_name,
            $data = array(
                'friendly_name' => $request['friendly_name'],
                'save_object' => json_encode($request['save_object']),
                'theme' => $request['theme'],
                'theme_friendly_name' => $request['save_object']['themeFriendlyName']
            ),
            array('idx' => $friendly_name_exists[0]->idx)
        );
        $json = json_encode(array('status' => 'success', 'id' => $idx));
    }

    echo $json;
    wp_die(); // this is required to terminate immediately and return a proper response
}

add_action('wp_ajax_vsbb_get_all', 'vsbb_get_all');
function vsbb_get_all()
{
    global $wpdb;
    $table_name = $wpdb->prefix . "vsbb_v2";
    if (isset($_GET['theme'])) {
        $theme = $_GET['theme'];
        if ($theme != -1) {
            $query = "select * from $table_name WHERE theme = %s order by idx desc";
            $results = $wpdb->get_results($wpdb->prepare($query, $theme));
            $json = json_encode($results);
        } else {
            $table_name = $wpdb->prefix . "funbox";
            $sql = "select * from " . $table_name;

            $results = $wpdb->get_results($sql);
            $json = json_encode($results);
        }
    } else {
        $query = "select * from $table_name order by idx desc";
        $results = $wpdb->get_results($wpdb->prepare($query));
        $json = json_encode($results);
    }
    echo $json;

    wp_die(); // this is required to terminate immediately and return a proper response
}

add_action('wp_ajax_vsbb_get_all_grouped', 'vsbb_get_all_grouped');
function vsbb_get_all_grouped()
{
    global $wpdb;
    $table_name = $wpdb->prefix . "vsbb_v2";

    $query = "select idx, friendly_name, concat(upper(ifnull(theme_friendly_name, theme)), ' - ', friendly_name) as item_theme 
    from $table_name 
    where theme != %s
    group by idx, theme order by theme, idx desc";
    $results = $wpdb->get_results($wpdb->prepare($query, 'grid'));
    $json = json_encode($results);

    echo $json;

    wp_die(); // this is required to terminate immediately and return a proper response
}

add_action('wp_ajax_vsbb_get_grid_ready', 'vsbb_get_grid_ready');
function vsbb_get_grid_ready()
{
    global $wpdb;
    $table_name = $wpdb->prefix . "vsbb_v2";

    $query = "select idx, friendly_name, upper(ifnull(theme_friendly_name, theme)) as theme 
    from $table_name 
    where theme != %s AND theme != %s
    group by idx, theme order by theme, idx desc";
    $results = $wpdb->get_results($wpdb->prepare($query, 'grid', 'folding'));
    $json = json_encode($results);

    echo $json;

    wp_die(); // this is required to terminate immediately and return a proper response
}

add_action('wp_ajax_vsbb_delete_item', 'vsbb_delete_item');
function vsbb_delete_item()
{
    global $wpdb;
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata, 1);
    $idx = $request['idx'];
    $table_name = $wpdb->prefix . "vsbb_v2";
    $wpdb->query("DELETE FROM $table_name WHERE idx = $idx");
    wp_die();
}

add_action('wp_ajax_vsbb_get_one', 'vsbb_load_one');
function vsbb_load_one()
{
    $results = vsbb_get_one($_GET['idx']);
    $json = json_encode($results);
    echo $json;

    wp_die(); // this is required to terminate immediately and return a proper response
}

function vsbb_get_one($id)
{
    global $wpdb;
    $table_name = $wpdb->prefix . "vsbb_v2";
    $idx = isset($id) ? $id : $_GET['idx'];
    $sql = "select * from $table_name where idx =$idx";
    $results = $wpdb->get_results($sql);
    return $results[0];
}


register_activation_hook(__FILE__, 'vsbb_install');
function vsbb_install()
{
    global $wpdb;
    $table_name = $wpdb->prefix . "vsbb_v2";
    $table_name2 = $wpdb->prefix . "vsbb_v2_lic";

    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name''") !== $table_name) {
        $sql = "CREATE TABLE $table_name (
                  idx mediumint(9) NOT NULL AUTO_INCREMENT,
                  friendly_name varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
                  save_object longtext COLLATE utf8_unicode_ci,
                  theme longtext COLLATE utf8_unicode_ci,
                  last_modified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  theme_friendly_name varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
                  UNIQUE KEY id (idx)
                ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";
        $wpdb->query($sql);

    }
    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name2'") !== $table_name2) {
        $sql = "CREATE TABLE $table_name2 (
                  idx mediumint(9) NOT NULL AUTO_INCREMENT,
                  lic varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
                  registered_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  package varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
                  allowed longtext COLLATE utf8_unicode_ci,
                  UNIQUE KEY id (idx)
                ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";
        $wpdb->query($sql);
    } else {
        $sql = "ALTER TABLE $table_name2
                ADD COLUMN 'package' VARCHAR(45) NULL,
                ADD COLUMN 'allowed' LONGTEXT NULL";
        $wpdb->query($sql);
    }
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
}

/** Licensing **/
//register license hook
add_action('wp_ajax_vsbb_register_lic', 'vsbb_register_lic');
function vsbb_register_lic()
{
    global $wpdb;
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata, 1);
    $lic = $request['license'];
    if (vsbb_validate_license($lic)) {
        $a_lic = vsbb_get_user_license();
        if ($a_lic['lic'] != $lic || empty($a_lic['allowed'])) {
            $lic_settings = vsbb_get_user_license_settings($lic);
            $table_name = $wpdb->prefix . "vsbb_v2_lic";
            $data = array(
                'lic' => $lic,
                'package' => $lic_settings->package,
                'allowed' => json_encode($lic_settings->allowed)
            );
            $rows_affected = $wpdb->insert($table_name, $data);
            if ($rows_affected > 0) {
                $json = json_encode(array('status' => 'success', 'id' => $wpdb->insert_id));
            } else {
                $json = json_encode(array('status' => 'failed'));
            }
        } else {
            $json = json_encode(array('status' => 'success'));
        }
    } else {
        $json = json_encode(array('status' => 'failed'));
    }
    echo $json;


    wp_die(); // this is required to terminate immediately and return a proper response
}

//calls home to fetch license allowed and package
function vsbb_get_user_license_settings($lic)
{
    $site = get_site_url();
    $response = wp_remote_get("http://wpvisualslideboxbuilder.com/wp-json/vsbb/v1/lic-settings?lic=$lic");
    $ret = wp_remote_retrieve_body($response);
    return json_decode($ret);
}

//validates license back home
function vsbb_validate_license($lic)
{
    $site = get_site_url();
    $response = wp_remote_get("http://wpvisualslideboxbuilder.com/wp-json/vsbb/v1/validate-lic?lic=$lic&s=$site");
    return wp_remote_retrieve_body($response) == 'true';
}

//fetch user license, package and allowed features from DB
function vsbb_get_user_license()
{
    global $wpdb;
    $table_name = $wpdb->prefix . "vsbb_v2_lic";
    $query = "select * from $table_name order by idx desc limit 1";
    $results = $wpdb->get_results($query);
    if (!empty($results)) {
        $lic = $results[0]->lic;
        $package = $results[0]->package;
        $allowed = $results[0]->allowed;
        return array('lic' => $lic, 'package' => $package, 'allowed' => $allowed);
    } else {
        return array();
    }
}

//returns user license string to the front end
add_action('wp_ajax_vsbb_get_license', 'vsbb_get_license');
function vsbb_get_license()
{
    $data = vsbb_get_user_license();
    echo !empty($data) ? $data['lic'] : '';
    wp_die();
}

//sync home for allowed features per package
function vsbb_get_paid_version_allowed_home()
{
    $data = vsbb_get_user_license();
    if (!empty($data)) {
        $ret = $data['allowed'];
    } else {
        $ret = '{"builders":["image_caption","folding","standard","grid","modal"],"creations":-1,"responsive":true,"clone":true,"updates":true,"support":true,"advanced-c2a":true}';
    }

    //$lic = !empty($data) ? $data['lic'] : '';
    //$ret = wp_remote_retrieve_body($response);
    //update_local_lic_allowed($lic, $ret);
    return json_decode($ret);
}

//update local lic allowed features after home call
function update_local_lic_allowed($lic, $home_data)
{
    global $wpdb;
    $table_name = $wpdb->prefix . "vsbb_v2_lic";
    $rows_affected = $wpdb->update(
        $table_name,
        $data = array(
            'allowed' => $home_data
        ),
        array('lic' => $lic)
    );
}

//returns allowed featured from local db (constantly synced with home)
function vsbb_get_paid_version_allowed_plugin()
{
    $data_lic = vsbb_get_user_license();
    $data = array(
        'builders' => array(
            'image_caption'
        ),
        'responsive' => false,
        'clone' => false
    );
    if (!empty($data_lic)) {
        $dt = $data_lic['allowed'];
        $data = json_decode($dt, true);
    }
    return $data;
}

//returns a boolean free trial vs paid version
function vsbb_get_paid_version($validate = false)
{
    $data_lic = vsbb_get_user_license();
    $lic = !empty($data_lic) ? $data_lic['lic'] : '';
    if (!empty($lic)) {
        if ($validate) {
            $resp = vsbb_validate_license($lic);
        } else {
            $resp = $lic != '';
        }
    } else {
        $resp = false;
    }

    return $resp;
}


/** Licensing end **/

add_action('wp_enqueue_scripts', 'scripts_load');
function scripts_load()
{
    //gridcss
    wp_register_style('vsbb-gridcss', plugins_url('/public/css/vsbb.grid.styles.css', __FILE__));
    wp_enqueue_style('vsbb-gridcss');
    //themescss
    wp_register_style('vsbb-themescss', plugins_url('/public/css/vsbb.themes.styles.css', __FILE__));
    wp_enqueue_style('vsbb-themescss');
    //additional styles
    wp_register_style('vsbb-renderstyles', plugins_url('/public/renderer/styles.css', __FILE__));
    wp_enqueue_style('vsbb-renderstyles');
    wp_register_script('vsbb-modernize', plugins_url('/public/plugins/modernize/js/modernizr.custom.79639.js', __FILE__));
    wp_enqueue_script('vsbb-modernize');
    //themesjs
    wp_register_script('vsbb-themesjs', plugins_url('/public/js/vsbb.themes.scripts.js', __FILE__));
    wp_enqueue_script('vsbb-themesjs', array('vsbb-modernize', 'jQuery'));
    //animate css
    wp_register_style('vsbb-animatecss', plugins_url('/public/modules/animate.css/animate.css', __FILE__));
    wp_enqueue_style('vsbb-animatecss');

    wp_register_style('bootstrap_funBox_style', plugins_url('public/renderer/themes/legacy/bootstrap.min.css', __FILE__));
    wp_register_style('custom_funBox_style', plugins_url('public/renderer/themes/legacy/custom-fun-box.css', __FILE__));
    wp_register_script('funbox_page_js', plugins_url('public/renderer/themes/legacy/fun_box.js', __FILE__), array('jquery'));

    wp_enqueue_style('bootstrap_funBox_style');
    wp_enqueue_style('custom_funBox_style');
    //wp_enqueue_style('animated_css');
    wp_enqueue_script('funbox_page_js');

    //angular
    wp_register_script('vsbb-angularjs', plugins_url('/public/modules/angular/angular.js', __FILE__));
    wp_enqueue_script('vsbb-angularjs', array('jquery'));

    //ngDialog
    wp_register_script('vsbb-ngDialog', plugins_url('/public/modules/ng-dialog/js/ngDialog.min.js', __FILE__));
    wp_enqueue_script('vsbb-ngDialog');
    wp_register_style('vsbb-ngDialogcss', plugins_url('/public/modules/ng-dialog/css/ngDialog.min.css', __FILE__));
    wp_enqueue_style('vsbb-ngDialogcss');
    wp_register_style('vsbb-ngDialogcsstheme', plugins_url('/public/modules/ng-dialog/css/ngDialog-theme-default.min.css', __FILE__));
    wp_enqueue_style('vsbb-ngDialogcsstheme');

    //js app
    wp_register_script('vsbb-jsRenderapp', plugins_url('/public/js/vsbb.renderApp.js', __FILE__));
    wp_enqueue_script('vsbb-jsRenderapp', array('vsbb-angularjs'));
    //localize
    wp_localize_script('vsbb-jsRenderapp', 'vsbb_ajax_obj',
        array('ajax_url' => admin_url('admin-ajax.php'), 'we_value' => 1234));

    //render styles
    wp_register_style('vsbb-renderStyles', plugins_url('/public/css/vsbb.renderStyles.css', __FILE__));
    wp_enqueue_style('vsbb-renderStyles');
}

add_action('admin_enqueue_scripts', 'admin_scripts_load');
function admin_scripts_load()
{
    //load wp media - for image upload modal
    wp_enqueue_media();
    /** styles */
    wp_register_style('vsbb-styles', plugins_url('/public/css/vsbb.styles.css', __FILE__));
    wp_enqueue_style('vsbb-styles');

    /** js dev dependencies */
    wp_register_script('vsbb-angularjs', plugins_url('/public/modules/angular/angular.js', __FILE__));
    wp_enqueue_script('vsbb-angularjs', array('jquery', 'vsbb-fontawesomepicker'));
    wp_register_script('vsbb-ngroute', plugins_url('/public/modules/angular-route/angular-route.js', __FILE__));
    wp_enqueue_script('vsbb-ngroute', array('vsbb-angularjs'));
    wp_register_script('vsbb-nganimate', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular-animate.js');
    wp_enqueue_script('vsbb-nganimate', array('vsbb-angularjs'));
    /** js dev plugins */
    //font picker
    wp_register_script('vsbb-fontawesomepicker', plugins_url('/local_plugins/fontawesome-picker/fontawesome-iconpicker.min.js', __FILE__));
    wp_enqueue_script('vsbb-fontawesomepicker', array('vsbb-angularjs'));
    wp_register_style('vsbb-fontawesomepickercss', plugins_url('/local_plugins/fontawesome-picker/fontawesome-iconpicker.min.css', __FILE__));
    wp_enqueue_style('vsbb-fontawesomepickercss');
    //slider
    wp_register_script('vsbb-angularslider', plugins_url('/public/modules/angularjs-slider/dist/rzslider.js', __FILE__));
    wp_enqueue_script('vsbb-angularslider', array('vsbb-angularjs'));
    wp_register_style('vsbb-angularslidercss', plugins_url('/public/modules/angularjs-slider/dist/rzslider.css', __FILE__));
    wp_enqueue_style('vsbb-angularslidercss');
    //tiny color
    wp_register_script('vsbb-tinycolor', plugins_url('/public/modules/tinycolor2/dist/tinycolor-min.js', __FILE__));
    wp_enqueue_script('vsbb-tinycolor', array('vsbb-angularjs'));
    //color picker
    wp_register_script('vsbb-angularcolorpicker', plugins_url('/public/modules/angularjs-color-picker/dist/angularjs-color-picker.js', __FILE__));
    wp_enqueue_script('vsbb-angularcolorpicker', array('vsbb-angularjs'));
    wp_register_style('vsbb-angularcolorpickercss', plugins_url('public/modules/angularjs-color-picker/dist/angularjs-color-picker.css', __FILE__));
    wp_enqueue_style('vsbb-angularcolorpickercss');
    //angular-ui-switch
    wp_register_script('vsbb-angularuiswitch', plugins_url('/public/modules/angular-ui-switch/angular-ui-switch.js', __FILE__));
    wp_enqueue_script('vsbb-angularuiswitch', array('vsbb-angularjs'));
    wp_register_style('vsbb-angularuiswitchcss', plugins_url('public/modules/angular-ui-switch/angular-ui-switch.css', __FILE__));
    wp_enqueue_style('vsbb-angularuiswitchcss');
    //spectrum
    wp_register_script('vsbb-spectrum', 'https://bgrins.github.io/spectrum/spectrum.js');
    wp_enqueue_script('vsbb-spectrum', array('jquery'));
    wp_register_style('vsbb-spectrumcss', 'https://bgrins.github.io/spectrum/spectrum.css');
    wp_enqueue_style('vsbb-spectrumcss');
    wp_register_script('vsbb-angularspectrum', plugins_url('/public/modules/angular-spectrum-colorpicker/dist/angular-spectrum-colorpicker.js', __FILE__));
    wp_enqueue_script('vsbb-angularspectrum', array('vsbb-angularjs', 'vsbb-spectrum'));


    //textAngular text editor
    wp_register_script('vsbb-textangular', plugins_url('/public/modules/textangular/dist/textAngular-rangy.min.js', __FILE__));
    wp_enqueue_script('vsbb-textangular', array('vsbb-angularjs'));
    wp_register_script('vsbb-textangular2', plugins_url('/public/modules/textangular/dist/textAngular-sanitize.js', __FILE__));
    wp_enqueue_script('vsbb-textangular2', array('vsbb-angularjs'));
    wp_register_script('vsbb-textangular3', plugins_url('/public/modules/textangular/dist/textAngularSetup.js', __FILE__));
    wp_enqueue_script('vsbb-textangular3', array('vsbb-angularjs'));
    wp_register_script('vsbb-textangular4', plugins_url('/public/modules/textangular/dist/textAngular.js', __FILE__));
    wp_enqueue_script('vsbb-textangular4', array('vsbb-angularjs'));
    wp_register_style('vsbb-textangularcss', plugins_url('/public/modules/textangular/dist/textAngular.css', __FILE__));
    wp_enqueue_style('vsbb-textangularcss');
    //font awesome
    wp_register_style('vsbb-fontawesome', plugins_url('/public/modules/font-awesome/css/font-awesome.min.css', __FILE__));
    wp_enqueue_style('vsbb-fontawesome');
    //angular dropdown
    wp_register_script('vsbb-angulardropdown', plugins_url('/public/modules/angular-dropdowns/dist/angular-dropdowns.js', __FILE__));
    wp_enqueue_script('vsbb-angulardropdown', array('vsbb-angularjs'));
    wp_register_style('vsbb-angulardropdowncss', plugins_url('public/modules/angular-dropdowns/dist/angular-dropdowns.css', __FILE__));
    wp_enqueue_style('vsbb-angulardropdowncss');
    /** Public plugins */
    //modernize
    wp_register_script('vsbb-modernize', plugins_url('/public/plugins/modernize/js/modernizr.custom.79639.js', __FILE__));
    wp_enqueue_script('vsbb-modernize');
    //ngTable
    wp_register_script('vsbb-ngtable', plugins_url('/public/modules/ng-table/dist/ng-table.js', __FILE__));
    wp_enqueue_script('vsbb-ngtable');
    wp_register_style('vsbb-ngtablecss', plugins_url('/public/modules/ng-table/dist/ng-table.min.css', __FILE__));
    wp_enqueue_style('vsbb-ngtablecss');
    //ui-select
    wp_register_script('vsbb-uiselect', plugins_url('/public/modules/ui-select/dist/select.js', __FILE__));
    wp_enqueue_script('vsbb-uiselect');
    wp_register_style('vsbb-uiselectcss', plugins_url('/public/modules/ui-select/dist/select.css', __FILE__));
    wp_enqueue_style('vsbb-uiselectcss');
    wp_register_style('vsbb-uiselectthemecss', 'https://cdnjs.cloudflare.com/ajax/libs/select2/3.4.5/select2.css');
    wp_enqueue_style('vsbb-uiselectthemecss');

    //ngDialog
    wp_register_script('vsbb-ngDialog', plugins_url('/public/modules/ng-dialog/js/ngDialog.min.js', __FILE__));
    wp_enqueue_script('vsbb-ngDialog');
    wp_register_style('vsbb-ngDialogcss', plugins_url('/public/modules/ng-dialog/css/ngDialog.min.css', __FILE__));
    wp_enqueue_style('vsbb-ngDialogcss');
    wp_register_style('vsbb-ngDialogcsstheme', plugins_url('/public/modules/ng-dialog/css/ngDialog-theme-default.min.css', __FILE__));
    wp_enqueue_style('vsbb-ngDialogcsstheme');
    //angular spinner
    wp_register_script('vsbb-jsspinner', plugins_url('/local_plugins/spinjs/spin.min.js', __FILE__));
    wp_enqueue_script('vsbb-jsspinner');
    wp_register_script('vsbb-ngspinner', plugins_url('public/modules/angular-spinner/dist/angular-spinner.min.js', __FILE__));
    wp_enqueue_script('vsbb-ngspinner', array('vsbb-angularjs'));
    //animate css
    wp_register_style('vsbb-animatecss', plugins_url('/public/modules/animate.css/animate.css', __FILE__));
    wp_enqueue_style('vsbb-animatecss');
    /** Themes */
    //themesjs
    wp_register_script('vsbb-themesjs', plugins_url('/public/js/vsbb.themes.scripts.js', __FILE__));
    wp_enqueue_script('vsbb-themesjs');
    //themescss
    wp_register_style('vsbb-themescss', plugins_url('/public/css/vsbb.themes.styles.css', __FILE__));
    wp_enqueue_style('vsbb-themescss');

    global $wpdb;
    $table_name = $wpdb->prefix . "funbox";
    $legacy_support = false;
    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") == $table_name) {
        $legacy_support = true;
    }


    /** js app */
    wp_register_script('vsbb-jsapp', plugins_url('/public/js/vsbb.app.js', __FILE__));
    wp_enqueue_script('vsbb-jsapp', array('vsbb-angularjs', 'vsbb-ngroute', 'vsbb-nganimate', 'uiselect'));
    /** js global vars */
    wp_localize_script('vsbb-jsapp', 'vsbbGlobalVars', array(
        'publicRoot' => plugins_url('/public/',__FILE__),
        'partials' => plugins_url('/public/partials',__FILE__),
        'plugins' => plugins_url('/public/plugins',__FILE__),
        'legacySupport' => $legacy_support,
        'paidVersion' => vsbb_get_paid_version(),
        'allowed_f' => (vsbb_get_paid_version_allowed_home())
    ));
}