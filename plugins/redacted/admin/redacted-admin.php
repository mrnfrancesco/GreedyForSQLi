<?php

require __DIR__ . '/vendor/autoload.php';

use Firebase\JWT\JWT;

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://redacted.online
 * @since      1.0.0
 *
 * @package    Redacted
 * @subpackage Redacted/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Redacted
 * @subpackage Redacted/admin
 * @author     Redacted
 */
class Redacted_Admin {

    /**
     * The ID of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $plugin_name    The ID of this plugin.
     */
    private $plugin_name;

    /**
     * The version of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $version    The current version of this plugin.
     */
    private $version;

    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     * @param      string    $plugin_name       The name of this plugin.
     * @param      string    $version    The version of this plugin.
     */
    public function __construct( $plugin_name, $version ) {

        $this->plugin_name = $plugin_name;
        $this->version = $version;

    }

    /**
     * Register the stylesheets for the admin area.
     *
     * @since    1.0.0
     */
    public function enqueue_styles() {

        /**
         * This function is provided for demonstration purposes only.
         *
         * An instance of this class should be passed to the run() function
         * defined in Redacted_Loader as all of the hooks are defined
         * in that particular class.
         *
         * The Redacted_Loader will then create the relationship
         * between the defined hooks and the functions defined in this
         * class.
         */

        wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/redacted-admin.css', array(), $this->version, 'all' );

    }

    /**
     * Register the JavaScript for the admin area.
     *
     * @since    1.0.0
     */
    public function enqueue_scripts() {

        /**
         * This function is provided for demonstration purposes only.
         *
         * An instance of this class should be passed to the run() function
         * defined in Redacted_Loader as all of the hooks are defined
         * in that particular class.
         *
         * The Redacted_Loader will then create the relationship
         * between the defined hooks and the functions defined in this
         * class.
         */

        wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/redacted-admin.js', array( 'jquery' ), $this->version, false );

    }

    public function handle_orgin() {
        header("Access-Control-Allow-Origin: " . get_http_origin());
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Credentials: true");

        if ( 'OPTIONS' == $_SERVER['REQUEST_METHOD'] ) {
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
                header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");

            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
                header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
                exit(0);
        }
    }

    public function wcfm_after_enquiry_submit($enquiry_id, $customer_id, $product_id, $vendor_id, $enquiry, $wcfm_enquiry_tab_form_data) {

        $product = wc_get_product( $product_id );

        $title = 'You have new enquiry';
        $description = $wcfm_enquiry_tab_form_data['enquiry'];

        $meaasge = array (
            'body'  => $description,
            'title'     => $title,
            'sound'     => 1,
        );

        $player_ids = array();
        $meta_key = 'bao_fcm_token';

        $admins = get_users( [ 'role__in' => [ 'administrator' ] ] );
        foreach ( $admins as $user ) {
            $player_ids[] = get_user_meta( $user->id, $meta_key, true );
        }

        $player_ids[] = get_user_meta( $vendor_id, $meta_key, true );

        $fields = array (
            'notification' => $meaasge,
            'data' => array(
                'product' => $product_id,
                'enquiry_id' => $enquiry_id,
                'customer_id' => $customer_id,
                'vendor_id' => $vendor_id,
            )
        );

        $players = array_values(array_filter(array_unique($player_ids)));

        foreach ($players as $key => $value) {
            $fields['to'] = $value;
            $this->fcm($fields);
        }

    }

    public function wpcf7_mail_sent($contact_form) {

        if(isset($_POST['your-message'])) {
            $meaasge = array (
                'body'  => sanitize_text_field($_POST['your-message']),
                'title' => 'New Enquiry',
                'sound' => 1,
            );

            if(isset($_POST['your-subject'])) {
                $meaasge['title'] = sanitize_text_field($_POST['your-subject']);
            }

            $player_ids = array();
            $meta_key = 'bao_fcm_token';

            $admins = get_users( [ 'role__in' => [ 'administrator' ] ] );
            foreach ( $admins as $user ) {
                $player_ids[] = get_user_meta( $user->id, $meta_key, true );
            }

            $fields = array (
                'notification' => $meaasge,
            );

            $players = array_values(array_filter(array_unique($player_ids)));

            foreach ($players as $key => $value) {
                $fields['to'] = $value;
                $this->fcm($fields);
            }
        }
    }



    /**
     * A wrapper function delegating to WP delete_option() but it prefixes the input $optionName
     * to enforce "scoping" the options in the WP options table thereby avoiding name conflicts
     * @param  $optionName string defined in settings.php and set as keys of $this->optionMetaData
     * @return bool from delegated call to delete_option()
     */
    public function deleteOption($optionName) {
        //$prefixedOptionName = $this->prefix($optionName); // how it is stored in DB
        return delete_option($optionName);
    }

    /**
     * A wrapper function delegating to WP add_option() but it prefixes the input $optionName
     * to enforce "scoping" the options in the WP options table thereby avoiding name conflicts
     * @param  $optionName string defined in settings.php and set as keys of $this->optionMetaData
     * @param  $value mixed the new value
     * @return null from delegated call to delete_option()
     */
    public function addOption($optionName, $value) {
        //$prefixedOptionName = $this->prefix($optionName); // how it is stored in DB
        return add_option($optionName, $value);
    }

    /**
     * A wrapper function delegating to WP add_option() but it prefixes the input $optionName
     * to enforce "scoping" the options in the WP options table thereby avoiding name conflicts
     * @param  $optionName string defined in settings.php and set as keys of $this->optionMetaData
     * @param  $value mixed the new value
     * @return null from delegated call to delete_option()
     */
    public function updateOption($optionName, $value) {
        //$prefixedOptionName = $this->prefix($optionName); // how it is stored in DB
        return update_option($optionName, $value);
    }


    /**
     * A wrapper function delegating to WP get_option() but it prefixes the input $optionName
     * to enforce "scoping" the options in the WP options table thereby avoiding name conflicts
     * @param $optionName string defined in settings.php and set as keys of $this->optionMetaData
     * @param $default string default value to return if the option is not set
     * @return string the value from delegated call to get_option(), or optional default value
     * if option is not set.
     */
    public function getOption($optionName, $default = null) {

        //$prefixedOptionName = $this->prefix($optionName); // how it is stored in DB
        $retVal = get_option($optionName);
        if (!$retVal && $default) {
            $retVal = $default;
        }
        return $retVal;
    }


    public function push_notification_menu() {

       // add_menu_page('Mstoreapp Push Notification', 'Push Notification', 'manage_options', 'mstoreapp-push-notification', array(&$this, 'push_notification_page'), 'dashicons-smartphone');

    }


    public function save_new_post( $post_id, $post, $update ) {

        $options = get_option('bao_firebase');

        $product = wc_get_product( $post_id );

        if($product && $options['notifyNewProduct'] && $product->get_status() == 'publish' && !$product->is_type( 'variation' )) {

            $server_key = $options['serverKey'];

            $title = $product->get_name();
            $description = $product->get_description();

            $meaasge = array (
                'body'  => wp_strip_all_tags($description),
                'title'     => $title,
                'sound'     => 1,
            );

            if ( $product->get_image_id() ) {
                $attachment_id = $product->get_image_id();

                $attachment = wp_get_attachment_image_src( $attachment_id, 'full' );
                if ( is_array( $attachment ) ) {
                    $meaasge['picture'] = current( $attachment );
                    $meaasge['style'] = "picture";
                }
            }

            $categories = get_the_terms( $post_id, 'product_cat' );

            /*$topic = reset($categories)->slug;//Send to specific category
            if(!$topic) {
                $topic = 'all';//Send to all
            }*/

            $topic = 'all';

            $fields = array (
                'to'  => '/topics/' . $topic,
                'notification' => $meaasge,
                'data' => array(
                    'product' => $product->get_id()
                )
            );

            $this->fcm($fields);

        }

    }

    //Thank you message hook used for order changing
    public function send_admin_and_vendor_push_notification($thank_you_title, $order) {

        $options = get_option('bao_firebase');

        $fields = array();

        $player_ids = array();

        $order_id = $order->get_id();

        $meta_key = 'bao_fcm_token';

        /// This is to send order notification for vendors WCFM and Dokan Plugin and WC Marketplace
        if($options['notifyNewOrder']) {
            global $wpdb;

            if(is_plugin_active( 'dc-woocommerce-multi-vendor/dc_product_vendor.php' )){
                $table_name = $wpdb->prefix . 'wcmp_vendor_orders';
                $field_name = 'vendor_id';

                $suborders = get_wcmp_suborders( $order_id, false, false);
                if( $suborders ) {
                    foreach ( $suborders as $v_order_id ) {
                        $vendor_id = get_post_meta($v_order_id, '_vendor_id', true);
                        $player_ids[] = get_user_meta( $vendor_id, $meta_key, true );
                    }
                }

            } else if(is_plugin_active( 'dokan-lite/dokan.php') || is_plugin_active( 'dokan/dokan.php' )){
                $table_name = $wpdb->prefix . 'dokan_orders';
                $field_name = 'seller_id';
            } else {
                $table_name = $wpdb->prefix . 'wcfm_marketplace_orders';
                $field_name = 'vendor_id';
            }

            $prepared_statement = $wpdb->prepare( "SELECT {$field_name} FROM {$table_name} WHERE  order_id = %d", $order_id );

            $vendors = $wpdb->get_col( $prepared_statement );

            foreach ($vendors as $key => $vendor) {
                $player_ids[] = get_user_meta( $vendor, $meta_key, true );
            }
        }
        // This is to send order notification for vendors WCFM and Dokan Plugin and WC Marketplace

        if($options['notifyNewOrder']) {
            $admins = get_users( [ 'role__in' => [ 'administrator' ] ] );
            foreach ( $admins as $user ) {
                $player_ids[] = get_user_meta( $user->id, $meta_key, true );
            }
        }
        //$player_ids[] = get_user_meta( 1, $meta_key, true );

        $players = array_values(array_filter(array_unique($player_ids)));

        if(!empty($players)){

            $order_number = $order->get_order_number();

            $title = 'ORDER: #' . $order_number;
            $message = 'YOU HAVE NEW ORDER ' . strtoupper($order->status);

            foreach ($players as $key => $value) {
                $this->send_fcm($value, $title, $message);
            }
        }

        return $thank_you_title;
    }

    public function order_status_changed( $order_id ) {

        if(isset($_REQUEST['onesignal_user_id']))
        update_post_meta( $order_id, 'bao_onesignal_user_id', sanitize_text_field($_REQUEST['onesignal_user_id']) );

        if(isset($_REQUEST['fcm_token']))
        update_post_meta( $order_id, 'bao_fcm_token', $_REQUEST['fcm_token'] );

        $options = get_option('bao_firebase');

        $fields = array();

        $order = wc_get_order($order_id);

        $player_ids = array();

        $meta_key = 'bao_fcm_token';

        // Send User Notification
        if($options['notifyNewOrder']) {
            $player_ids[] = get_post_meta( $order_id, $meta_key, true );
            $user_id = $order->get_user_id();
            $player_ids[] = get_user_meta( $user_id, $meta_key, true );
        }


        $players = array_values(array_filter(array_unique($player_ids)));

        if(!empty($players)){

            $order_number = $order->get_order_number();

            $title = 'ORDER: #' . $order_number;
            $message = 'YOUR ORDER ' . strtoupper($order->status);

            foreach ($players as $key => $value) {
                $this->send_fcm($value, $title, $message);
            }
        }
    }


    public function neworder( $order_id ) {

        //if(isset($_REQUEST['onesignal_user_id']))
        //update_post_meta( $order_id, 'bao_onesignal_user_id', sanitize_text_field($_REQUEST['onesignal_user_id']) );

        if(isset($_REQUEST['fcm_token']))
        update_post_meta( $order_id, 'bao_fcm_token', $_REQUEST['fcm_token'] );

        $options = get_option('bao_firebase');

        $fields = array();

        $order = wc_get_order($order_id);

        $player_ids = array();

        $meta_key = 'bao_fcm_token';

        // Send User Notification
        if($options['notifyNewOrder']) {
            $player_ids[] = get_post_meta( $order_id, $meta_key, true );
            $user_id = $order->get_user_id();
            $player_ids[] = get_user_meta( $user_id, $meta_key, true );
        }


        $players = array_values(array_filter(array_unique($player_ids)));

        if(!empty($players)){

            $order_number = $order->get_order_number();

            $title = 'ORDER: #' . $order_number;
            $message = 'YOUR ORDER ' . strtoupper($order->status);

            foreach ($players as $key => $value) {
                $this->send_fcm($value, $title, $message);
            }
        }
    }

    public function remove_uncategorized_category( $args ) {
      $uncategorized = get_option( 'default_product_cat' );
      $args['exclude'] = $uncategorized;
      return $args;
    }

    public function uploadimage() {

          if ( ! function_exists( 'wp_handle_upload' ) ) {
              require_once( ABSPATH . 'wp-admin/includes/file.php' );
          }

          $uploadedfile = $_FILES['file'];

          $upload_overrides = array( 'test_form' => false );

          $movefile = wp_handle_upload( $uploadedfile, $upload_overrides );

          if ( $movefile && ! isset( $movefile['error'] ) ) {
             // echo "File is valid, and was successfully uploaded.\n";
              wp_send_json( $movefile );
          } else {
              /**
               * Error generated by _wp_handle_upload()
               * @see _wp_handle_upload() in wp-admin/includes/file.php
               */
              wp_send_json( $movefile );      }

             // wp_send_json( $data );

            die();
    }

    public function uploadimages() {


        if(isset($_POST['image'])) {
            $img = $_POST['image'];
            $img = str_replace('data:image/png;base64,', '', $img);
            $img = str_replace(' ', '+', $img);

            $decoded = base64_decode($img);

            $upload_dir = wp_upload_dir();

            // @new
            $upload_path = str_replace( '/', DIRECTORY_SEPARATOR, $upload_dir['path'] ) . DIRECTORY_SEPARATOR;

            $decoded = $image;
            $filename = 'my-base64-image.png';

            $hashed_filename = md5( $filename . microtime() ) . '_' . $filename;

            // @new
            $image_upload = file_put_contents( $upload_path . $hashed_filename, $decoded );

            //HANDLE UPLOADED FILE
            if( !function_exists( 'wp_handle_sideload' ) ) {
              require_once( ABSPATH . 'wp-admin/includes/file.php' );
            }

            // Without that I'm getting a debug error!?
            if( !function_exists( 'wp_get_current_user' ) ) {
              require_once( ABSPATH . 'wp-includes/pluggable.php' );
            }

            // @new
            $file             = array();
            $file['error']    = '';
            $file['tmp_name'] = $upload_path . $hashed_filename;
            $file['name']     = $hashed_filename;
            $file['type']     = 'image/png';
            $file['size']     = filesize( $upload_path . $hashed_filename );

            // upload file to server
            // @new use $file instead of $image_upload
            $file_return = wp_handle_sideload( $file, array( 'test_form' => false ) );

            $filename = $file_return['file'];

            $filepath = $wp_upload_dir['url'] . '/' . basename($filename);

            wp_send_json( $filepath );
        }

    }

    public function mstoreapp_prepare_vendors_query($response, $object, $request){
        if(isset($_REQUEST['wc_vendor'])){
            $data = array();
            foreach ($response->data as $key => $value) {
                /*$data[] = array(
                    'id' => $value['id'],
                    'display_name' => $value['display_name'],
                    'registered' => $value['registered'],
                    'shop' => $value['shop'],
                    'address' => $value['address'],
                    'social' => $value['social'],
                    'message_to_buyers' => $value['message_to_buyers'],
                    'rating_count' => $value['rating_count'],
                    'avg_rating' => $value['avg_rating'],
                    'image'  => wp_get_attachment_image_src( $value['shop']['image'], 'thumbnail', false ),
                    'banner'  => wp_get_attachment_image_src( $value['shop']['banner'], 'medium', false ),
                );*/

                $response->data[$key]['shop']['image'] = wp_get_attachment_image_src( $response->data[$key]['shop']['image'], 'medium', false );
                $response->data[$key]['shop']['banner'] = wp_get_attachment_image_src( $response->data[$key]['shop']['banner'], 'large', false );
                $response->data[$key]['payment'] = null;
            }
            return $response;
        }
        return $response;
    }

    // For Dokan
    public function mstoreapp_prepare_order_query( $args, $request ){

        if ( ! function_exists( 'is_plugin_active' ) ) {
            include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
        }

        if(isset($_REQUEST['vendor']) && isset($_REQUEST['flutter_app'])) {

            if(isset($_REQUEST['new'])) {
                $args['status'] = array('processing', 'pending', 'on-hold');
            } else {
                //
            }

            $id = absint($_REQUEST['vendor']);

            if(is_plugin_active( 'dokan-lite/dokan.php') || is_plugin_active( 'dokan/dokan.php' )){
                $page = isset($_REQUEST['page']) ? absint($_REQUEST['page']) : 1;
                $per_page = isset($_REQUEST['per_page']) ? absint($_REQUEST['per_page']) : 10;
                $offset = ($page - 1) * $per_page;

                $dokan_args = array(
                    'offset' => $offset,
                    'limit' => $per_page
                );

                $orders = dokan_get_seller_orders( $id, $dokan_args );

                $order_ids = array();
                foreach ($orders as $order) {
                    $order_ids[] = $order->order_id;
                }

                $order_ids = ! empty( $order_ids ) ? $order_ids : array( 0 );

                $args['post__in'] = array_merge($args['post__in'], $order_ids);

                return $args;
            }
            else if(is_plugin_active( 'dc-woocommerce-multi-vendor/dc_product_vendor.php' )){
                global $wpdb, $WCMp;

                $vendor_list_prepared = '';
                $prepare_values = array();
                if(!empty($_REQUEST['vendor'])) {
                    $vendor_list_prepared = "%d";
                    $prepare_values[] = $_REQUEST['vendor'];
                } else if(!empty($_REQUEST['include_vendor']) && is_array($_REQUEST['include_vendor'])) {
                    $vendor_list_prepared = implode( ', ', array_fill( 0, count( $_REQUEST['include_vendor'] ), '%d' ) );
                    $prepare_values = $_REQUEST['include_vendor'];
                } else if(!empty($_REQUEST['exclude_vendor']) && is_array($_REQUEST['exclude_vendor'])) {
                    $vendor_list_prepared = implode( ', ', array_fill( 0, count( $_REQUEST['exclude_vendor'] ), '%d' ) );
                    $prepare_values = $_REQUEST['exclude_vendor'];
                }

                $argss = array(
                    'author' => $id,
                );

                $vendor_all_orders = apply_filters('wcmp_datatable_get_vendor_all_orders', wcmp_get_orders($argss), $requestData, $_POST);

                if($vendor_list_prepared != "") {
                    $order_ids = $wpdb->get_col( $wpdb->prepare( "
                        SELECT order_id
                        FROM {$wpdb->prefix}woocommerce_order_items
                        WHERE order_item_id IN ( SELECT order_item_id FROM {$wpdb->prefix}woocommerce_order_itemmeta WHERE meta_key = '_vendor_id' AND meta_value IN ( " . $vendor_list_prepared . " ) )
                        AND order_item_type = 'line_item'
                     ", $prepare_values ) );

                    if(isset($_REQUEST['exclude_vendor'])) $args['post__not_in'] = array_merge($args['post__not_in'], $vendor_all_orders);
                    else $args['post__in'] = $vendor_all_orders;
                }

                return $args;

            } else if(is_plugin_active( 'wc-multivendor-marketplace/wc-multivendor-marketplace.php' )){
                global $wpdb;

                $order_ids = $wpdb->get_col( $wpdb->prepare( "
                    SELECT order_id
                    FROM {$wpdb->prefix}woocommerce_order_items
                    WHERE order_id IN ( SELECT order_id FROM {$wpdb->prefix}wcfm_marketplace_orders WHERE vendor_id = %d )
                    AND order_item_type = 'shipping'
                 ", $id ) );

                $order_ids = ! empty( $order_ids ) ? $order_ids : array( 0 );

                $args['post__in'] = array_merge($args['post__in'], $order_ids);

                return $args;
            }
        }

        return $args;
    }


    /* Filter For all the app */
    public function mstoreapp_prepare_product_query( $args, $request ) {

        $tax_query = array();

        for ($i=0; $i < 50; $i++) {

            if ( ! empty( $request['attributes' . $i] ) && ! empty( $request['attribute_term' . $i] ) ) {
                if ( in_array( $request['attributes' . $i], wc_get_attribute_taxonomy_names(), true ) ) {
                    $tax_query[] = array(
                        'taxonomy' => $request['attributes' . $i],
                        'field'    => 'term_id',
                        'terms'    => $request['attribute_term' . $i],
                    );
                }
            }

        }

        if ( ! empty( $tax_query ) ) {
            if ( ! empty( $args['tax_query'] ) ) {
                $args['tax_query'] = array_merge( $tax_query, $args['tax_query'] ); // WPCS: slow query ok.
            } else {
                $args['tax_query'] = $tax_query; // WPCS: slow query ok.
            }
        }

        /* For Dokan and WCFM Plugin Only */
        if ( ! empty( $request['vendor'] ) ) {
            $args['author'] = $request['vendor'];
        }

        return $args;
    }

    /* For Dokan and WCFM Plugin Only */
    public function update_vendor_product(){
        if(isset($_REQUEST['id'])){

            $user_id = get_current_user_id();
            $product_id = absint( $_REQUEST['id'] );

            $post = array(
              'ID' => $product_id,
              'post_author' => $user_id,
            );
            wp_update_post( $post );

        }

        wp_send_json(true);
    }

    /* For Dokan Only && WCFM*/
    function mstoreapp_prepare_product( $response, $object, $request ) {

        if( empty( $response->data ) )
            return $response;


        /*if (is_plugin_active('wc-multivendor-marketplace/wc-multivendor-marketplace.php')) {
            $id = $object->get_id();
            if ( 'product' === get_post_type( $id ) || 'product_variation' === get_post_type( $id ) ) {
                $parent = get_post_ancestors( $id );
            if ( $parent ) $id = $parent[ 0 ];

                $seller = get_post_field( 'post_author', $id);
                $author = get_user_by( 'id', $seller );
                $store_user  = wcfmmp_get_store( $author->ID );
                $store_info  = $store_user->get_shop_info();

                $response->data['vendor'] = $store_user->id;
                $response->data['store_name'] = $store_info['store_name'];

            }
        }*/

        if (function_exists('wcfmmp_get_store')) {
            $id = $object->get_id();
            if ( 'product' === get_post_type( $id ) || 'product_variation' === get_post_type( $id ) ) {
                $parent = get_post_ancestors( $id );
            if ( $parent ) $id = $parent[ 0 ];

            global $WCFM, $WCFMmp;

            $vendor_id = $WCFM->wcfm_vendor_support->wcfm_get_vendor_id_from_product( $id );

            if( apply_filters( 'wcfmmp_is_allow_sold_by_linked', true ) ) {
                $store_name = $WCFM->wcfm_vendor_support->wcfm_get_vendor_store_by_vendor( absint($vendor_id) );
            } else {
                $store_name = $WCFM->wcfm_vendor_support->wcfm_get_vendor_store_name_by_vendor( absint($vendor_id) );
            }

                $store_user  = wcfmmp_get_store( $vendor_id );

                $response->data['gravatar'] = $store_user->get_avatar();
                $response->data['email'] = $store_user->get_email();
                $response->data['phone'] = $store_user->get_phone();
                $response->data['address'] = $store_user->get_address_string();

                $response->data['store_info'] = $store_user->get_shop_info();
                $response->data['vendor'] = $store_user->id;
                $response->data['store_name'] = $store_info['store_name'];

            }
        }

        else if(function_exists('dokan_get_store_info')){
            $id = $object->get_id();
            if ( 'product' === get_post_type( $id ) || 'product_variation' === get_post_type( $id ) ) {
                $parent = get_post_ancestors( $id );
            if ( $parent ) $id = $parent[ 0 ];

                $seller = get_post_field( 'post_author', $id);
                $author = get_user_by( 'id', $seller );
                $store_info = dokan_get_store_info( $author->ID );

                $store_info['banner_url'] = wp_get_attachment_url( $store_info['banner'] );
                $store_info['icon_url'] = wp_get_attachment_url( $store_info['gravatar'] );

                //$response->data['store_info'] = $store_info;
                $response->data['vendor'] = $author->ID;
                $response->data['store_name'] = $store_info['store_name'];
                return $response;
            }
        }

        return $response;

    }

    public function loadCurrency($load){

        if(isset($_REQUEST['flutter_app'])) {
            return true;
        }
        return $load;
    }

    public function add_vendor_type_fields($user) {
        if(in_array( 'vendor', (array) $user->roles ) || in_array( 'seller', (array) $user->roles ) || in_array( 'wcfm_vendor', (array) $user->roles )) {
            ?>
                <h3><?php _e("Vendor Type", "blank"); ?></h3>

                <table class="form-table">
                <th><label for="mstoreapp_vendor_type"><?php _e("Vendor Type"); ?></label></th>
                    <td>
                        <input type="text" name="mstoreapp_vendor_type" id="mstoreapp_vendor_type" value="<?php echo esc_attr( get_the_author_meta( 'mstoreapp_vendor_type', $user->ID ) ); ?>" class="regular-text" /><br />
                        <span class="description"><?php _e("Please enter vendor type. example grocery, food, bakery, meat, fish etc"); ?></span>
                    </td>
                </tr>
                </table>
            <?php
        }
    }
    public function save_vendor_type_fields($user_id) {
        if ( !current_user_can( 'edit_user', $user_id ) || !isset($_POST['mstoreapp_vendor_type'])) {
            return false;
        }
        update_user_meta( $user_id, 'mstoreapp_vendor_type', sanitize_text_field($_POST['mstoreapp_vendor_type']) );
    }

    public function test(){



    }

    function attribute_slug_to_title( $attribute ,$slug ) {
        global $woocommerce;
        $value = $slug;
        if ( taxonomy_exists( esc_attr( str_replace( 'attribute_', '', $attribute ) ) ) ) {
            $term = get_term_by( 'slug', $slug, esc_attr( str_replace( 'attribute_', '', $attribute ) ) );
            if ( ! is_wp_error( $term ) && $term->name )
                $value = $term->name;
        } else {
            //$value = apply_filters( 'woocommerce_variation_option_name', $slug );
        }
        return $value;
    }

    /**
     * Gets addons assigned to a product by ID.
     *
     * @param  int    $post_id ID of the product to get addons for.
     * @param  string $prefix for addon field names. Defaults to postid.
     * @param  bool   $inc_parent Set to false to not include parent product addons.
     * @param  bool   $inc_global Set to false to not include global addons.
     * @return array
     */
    public static function get_product_addons( $post_id, $prefix = false, $inc_parent = true, $inc_global = true ) {


        $post_id = 34;

        $addons     = array();
        $raw_addons = array();
        $parent_id  = wp_get_post_parent_id( $post_id );

        if ( defined( 'WC_VERSION' ) && version_compare( WC_VERSION, '3.0.0', '<' ) ) {
            $product_terms  = apply_filters( 'get_product_addons_product_terms', wp_get_post_terms( $post_id, 'product_cat', array( 'fields' => 'ids' ) ), $post_id );
            $exclude        = get_post_meta( $post_id, '_product_addons_exclude_global', true );
            $product_addons = array_filter( (array) get_post_meta( $post_id, '_product_addons', true ) );
        } else {
            $product        = wc_get_product( $post_id );
            $product_terms  = apply_filters( 'get_product_addons_product_terms', wc_get_object_terms( $product->get_id(), 'product_cat', 'term_id' ), $product->get_id() );
            $exclude        = $product->get_meta( '_product_addons_exclude_global' );
            $product_addons = array_filter( (array) $product->get_meta( '_product_addons' ) );
        }

        // Product Parent Level Addons.
        if ( $inc_parent && $parent_id ) {
            $raw_addons[10]['parent'] = apply_filters( 'get_parent_product_addons_fields', self::get_product_addons( $parent_id, $parent_id . '-', false, false ), $post_id, $parent_id );
        }

        // Product Level Addons.
        $raw_addons[10]['product'] = apply_filters( 'get_product_addons_fields', $product_addons, $post_id );

        // Global level addons (all products).
        if ( '1' !== $exclude && $inc_global ) {
            $args = array(
                'posts_per_page'   => -1,
                'orderby'          => 'meta_value',
                'order'            => 'ASC',
                'meta_key'         => '_priority',
                'post_type'        => 'global_product_addon',
                'post_status'      => 'publish',
                'suppress_filters' => true,
                'meta_query' => array(
                    array(
                        'key'   => '_all_products',
                        'value' => '1',
                    ),
                ),
            );

            $global_addons = get_posts( $args );

            if ( $global_addons ) {
                foreach ( $global_addons as $global_addon ) {
                    $priority                                     = get_post_meta( $global_addon->ID, '_priority', true );
                    $raw_addons[ $priority ][ $global_addon->ID ] = apply_filters( 'get_product_addons_fields', array_filter( (array) get_post_meta( $global_addon->ID, '_product_addons', true ) ), $global_addon->ID );
                }
            }

            // Global level addons (categories).
            if ( $product_terms ) {
                $args = apply_filters( 'get_product_addons_global_query_args', array(
                    'posts_per_page'   => -1,
                    'orderby'          => 'meta_value',
                    'order'            => 'ASC',
                    'meta_key'         => '_priority',
                    'post_type'        => 'global_product_addon',
                    'post_status'      => 'publish',
                    'suppress_filters' => true,
                    'tax_query'        => array(
                        array(
                            'taxonomy'         => 'product_cat',
                            'field'            => 'id',
                            'terms'            => $product_terms,
                            'include_children' => false,
                        ),
                    ),
                ), $product_terms );

                $global_addons = get_posts( $args );

                if ( $global_addons ) {
                    foreach ( $global_addons as $global_addon ) {
                        $priority                                     = get_post_meta( $global_addon->ID, '_priority', true );
                        $raw_addons[ $priority ][ $global_addon->ID ] = apply_filters( 'get_product_addons_fields', array_filter( (array) get_post_meta( $global_addon->ID, '_product_addons', true ) ), $global_addon->ID );
                    }
                }
            }
        }

        ksort( $raw_addons );

        foreach ( $raw_addons as $addon_group ) {
            if ( $addon_group ) {
                foreach ( $addon_group as $addon ) {
                    $addons = array_merge( $addons, $addon );
                }
            }
        }

        // Generate field names with unqiue prefixes.
        if ( ! $prefix ) {
            $prefix = apply_filters( 'product_addons_field_prefix', "{$post_id}-", $post_id );
        }

        // Let's avoid exceeding the suhosin default input element name limit of 64 characters.
        $max_addon_name_length = 45 - strlen( $prefix );

        // If the product_addons_field_prefix filter results in a very long prefix, then
        // go ahead and enforce sanity, exceed the default suhosin limit, and just use
        // the prefix and the field counter for the input element name.
        if ( $max_addon_name_length < 0 ) {
            $max_addon_name_length = 0;
        }

        $addon_field_counter = 0;

        foreach ( $addons as $addon_key => $addon ) {
            if ( empty( $addon['name'] ) ) {
                unset( $addons[ $addon_key ] );
                continue;
            }
            if ( empty( $addons[ $addon_key ]['field-name'] ) ) {
                $addon_name = substr( $addon['name'], 0, $max_addon_name_length );
                $addons[ $addon_key ]['field-name'] = sanitize_title( $prefix . $addon_name . '-' . $addon_field_counter );
                $addon_field_counter++;
            }
        }

        //return apply_filters( 'get_product_addons', $addons );

        wp_send_json($addons);

    }

    public function flutter_new_chat_message() {

        if(isset($_REQUEST['message'])) {

            $message = sanitize_text_field($_REQUEST['message']);

            $tokens  = array();

            if(isset($_REQUEST['users'])) {

            foreach($_REQUEST['users'] as $value)  {

                    $args = array(
                               'meta_key' => 'bao_uid',
                               'meta_value' => $value,
                               'number' => 1
                              );

                      $user = reset(get_users($args));

                    if($user) {//And when user not = current user
                        $tokens[] = get_user_meta( $user->id, 'bao_fcm_token', true );
                    }

                }
            }

            if(isset($_REQUEST['vendor_id'])) {
                $vendor_id = absint($_REQUEST['vendor_id']);
                $tokens[] = get_user_meta($vendor_id, 'bao_fcm_token', true);
            } else {
                $admins = get_users( [ 'role__in' => [ 'administrator' ] ] );
                foreach ( $admins as $user ) {
                    $tokens[] = get_user_meta( $user->id, 'bao_fcm_token', true );
                }
            }

            $user = wp_get_current_user();

            $title = 'You have new message from ' . $user->first_name . ' ' . $user->first_name;

            foreach ($tokens as $key => $value) {

                $data = array(
                    'chat' => get_user_meta( $user->id, 'bao_uid', true )
                );

                $this->send_fcm($value, $title, $message, $data);
            }

        }

        wp_send_json(true);
    }

    public function send_fcm($token, $title, $message, $data = array()){

        $fields = array();

        /*$fields['mtitle'] = $title;
        $fields['mdesc'] = $message;

        $data = '{ "notification": { "title": "' . $fields['mtitle'] . '", "body": "' . $fields['mdesc'] . '" }, "to" : "'. $token .'" }';*/

        $notification = array (
            'body'  => $message,
            'title' => $title,
        );

        $fields = array (
            'to'  => $token,
            'notification' => $notification,
            'data' => $data
        );

        $this->fcm($fields);

    }

    public function fcm($data) {

        $fcm_remote_url = "https://fcm.googleapis.com/fcm/send";

        $options = get_option('bao_firebase');
        $server_key = $options['serverKey'];

        $args = array(
          'body' => json_encode($data),
          'timeout' => '5',
          'redirection' => '5',
          'httpversion' => '1.0',
          'blocking' => true,
          'headers' => array(),
          'cookies' => array(),
          'headers' => array(
            'Content-type' => 'application/json',
            'Authorization' => 'key=' . $server_key
          )
        );

        $response = wp_remote_post( $fcm_remote_url, $args );

    }

    public function app_save_options() {
        $entityBody = file_get_contents('php://input');

        if(isset($entityBody) && !empty($entityBody)) {
            $data = json_decode($entityBody, true);
            $user = wp_get_current_user();
            if ( in_array( 'administrator', (array) $user->roles ) ) {
                if(isset($data['vendor_app'])) {
                    $vendor_id = sanitize_text_field($data['vendor_app']);
                    update_option($data['option'] . $vendor_id, $data['data']);
                } else if(isset($data['store_app'])) {
                    update_option($data['option'] . '_store');
                } else if(isset($data['delivery_boy'])) {
                    update_option($data['option'] . '_delivery_boy');
                } else {
                    update_option($data['option'], $data['data']);
                }
            } else if ( in_array( 'editor', (array) $user->roles ) ) {
                update_option($data['option'], $data['data']);
            } else if ( in_array( 'vendor', (array) $user->roles ) ) {
                update_option($data['option'] . $user->id, $data['data']);
            } else if ( in_array( 'shop_manager', (array) $user->roles ) ) {
                update_option($data['option'] . $user->id, $data['data']);
            } else if ( in_array( 'wcfm_vendor', (array) $user->roles ) ) {
                update_option($data['option'] . $user->id, $data['data']);
            } else if ( in_array( 'wcpv_product_vendors', (array) $user->roles ) ) {
                update_option($data['option'] . $user->id, $data['data']);
            } else {
                $notice = array(
                    'success' => false,
                    'data' => array(
                        'notice' => 'Login as admin to edit'
                    )
                );
                wp_send_json_error( $notice, 400 );
            }
        }

        wp_send_json(true);
    }

    public function app_get_options() {
        $user = wp_get_current_user();
        if ( in_array( 'administrator', (array) $user->roles ) ) {

            if(isset($_REQUEST['key'])) {
                $options = get_option($_REQUEST['key'], (object)array());
                wp_send_json($options);
            } else {
                $notice = array(
                    'success' => false,
                    'data' => array(
                        'notice' => 'Option key is required'
                    )
                );
                wp_send_json_error( $notice, 400 );
            }
        } else {
            $notice = array(
                'success' => false,
                'data' => array(
                    'notice' => 'Login as admin to edit'
                )
            );
            wp_send_json_error( $notice, 400 );
        }
    }

    public function site_details() {

        $data = array(
            'name' => get_bloginfo('name'),
            'description' => get_bloginfo('description'),
            'wpurl' => get_bloginfo('wpurl'),
            'home' => get_bloginfo('url')
        );

        wp_send_json($data);

    }

    public function get_order_statuses() {

        $data = array();

        $order_statuses = wc_get_order_statuses();

        foreach ($order_statuses as $key => $value) {
            $data[] = array(
                'key' => str_replace('wc-', '', $key),
                'value' => $value
            );
        }

        wp_send_json($data);

    }

    public function firebase_jwt_token() {

        $user_id = get_current_user_id();

        $uid = get_user_meta( $user_id, 'bao_uid', true );

        if($uid) {
            $custom_token = $this->create_custom_token($uid);
            wp_send_json($custom_token);
        } else {
            //TODO get uid from email of customer from firebase

            //$custom_token = $this->create_custom_token($uid);
        }

    }

    function create_custom_token($uid) {
        $options = get_option('bao_firebase');
        $serviceAccountEmail = $options['serviceAccountEmail'];//firebase-adminsdk-437ko@fir-chat-c59c8.iam.gserviceaccount.com
        $privateKey = $options['privateKey'];
        //$private_key = sanitize_text_field($privateKey);
        //wp_send_json($private_key);
        $service_account_email = $serviceAccountEmail;//"firebase-adminsdk-437ko@fir-chat-c59c8.iam.gserviceaccount.com";
        $private_key = stripcslashes($privateKey);//"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDKImIlSzvRSigs\n0XleSGK6PFJ7KBM4HtvwFl3CpkOYYPwqcBjMuJupcWsBLUG5uAJDmawOt8oKh6RU\nt2d2AQ0oSdkOBwyKpZw/ojAwOY1J6kOU5NW6oo5lE1ZobRySdrPi/bPl8zOug004\nhAY/65xQRXcBk19AwJFOdbtqz+xT39JrLSKyyIC4HRvbyc4ODMUdjsfM6f2ezRPI\nYLqxD2BpnlXl8oPk399KztfMgx7eSs24zwu0uyvyaF35byuxXXt4OarwrcQoGPdh\n8eYf431YZerQOglejKRaLzuwMeTx2DtcRt+eUD3bQp1AZmfKuB+W61x+pjc6JsBI\nyybY+sX9AgMBAAECggEABJKWxZLC5m8IsWgxe+aj98etVm85UPfNTMxS88ZrUibO\nn1JBorKeaRPfpCXznFi1Li6H4VawI32CRA8DaSczYVR+yNpXTYMwduebllnqgDVy\nlGCzFJxSWIrIqxGk0mEpRwyApanTG88z7ByYeO5fNhk22vphfOrzno1Q0UiI2Rf1\nUkYjV3h9siBFr1OQsxHn2nMURwdZ9nFDMutx4QHPP/x7TKWL4DrD5nAkUdcBtVxa\no4Akho5MJ1aCTIlA71OcfqqXLuaMPOubkzj2wsW4bh9v+qdFUo6FffKfh6ZfV5mv\nojfqlqVPG5TDwN5Cwi7RGdHiBbINbUCilk7T6SytRQKBgQD75DDd+hBqZYHXwqQi\nSgTmDIHHmGz4QMG4Pyva0aocET2Yu0qPi1YnpAU8rWfL0ALh3KVrGEk5j/e7SYD6\nwKqw4fU2aIU/V2LKf6LOyKonxrcyfGSldwzRHl/r9uR1bCDMeXyQ+ZKO/y1Sf2p2\nOC4NiPFGZZfUdrNdtgp5xks2mwKBgQDNbmy1LmWneVlHgYPBTEgjiblIDresoQDZ\nE9R64DKXKyA5bpUP1/91jwcjojnGJbJFGbYB6t65e+aO79vm+TziowLsHFcstWrS\nn6PgnCc52mHctTK8GBr+atCmElfCVY34UCvOTn98ZmrwQkbaYGcVatcjKN8vozAv\nR4xbL7VzRwKBgQCjC4jKFlRL2lqag2XkwA69rfjPbo2Sf7AlB9bmM/Ktakd5tjnE\nAogI7rVpGkFmfsVu13jHgpfbR6IuO5zeMpoKFqi3yB3/6xuKQeXrfZ4OUyU/657m\nL9I/Bi9GuLAWhaARWs3TtYg1QV1f2hPaY/EDV9H9JEOMBi2CChRr0Hvc4wKBgDMW\nZP5hvXH6oZNAyC1H9SCxXVxoHJFXsMhLQCoWmz4wwWDG+VbpVmQ734CjFU8LjNvW\nWwb7C8yA3YNqbvtvvA54j398RMmfjCM5BB4Vd0PR5Uhn32gbbosasSy7nwt7D0VT\nWrGBn/6l0a5SLSCdnMUcvsfFoEtOf+siFeuPX8Z9AoGAZZKgTT6I1Sd2gpyz2AMB\nH+4ezZyZ3Ch56elLg8irBtMs9IFGBcI3Zugzl3GEz6cGzXNTRWBw50A/neGeUiz9\nrNMmFmnfDdSP42MuXNF6IfXTZPLufksaPHwyaf5RZ2LZl8WZnzfuJYrLOUzrTaMX\nfFiAz4BBHhIHUHdZc33lp1c=\n-----END PRIVATE KEY-----\n";
        $uid = $uid;//'fQcMwfMGE0YYwW73XjCe1SPjjzV2';
        $is_premium_account = true;

        $now_seconds = time();
        $payload = array(
            "iss" => $service_account_email,
            "sub" => $service_account_email,
            "aud" => "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
            "iat" => $now_seconds,
            "exp" => $now_seconds+(60*60),  // Maximum expiration time is one hour
            "uid" => $uid,
            "claims" => array(
              "premium_account" => $is_premium_account
            )
        );

        return JWT::encode($payload, $private_key, "RS256");
    }

    public function update_user_meta_value() {

        $data = json_decode(file_get_contents("php://input"));

        $user_id = get_current_user_id();
        if($user_id){
            foreach($data as $k => $v) {
                //$value = sanitize_text_field($v);
                update_user_meta( $user_id, $k, $v );
            }
            wp_send_json($v);
        } else wp_send_json(false);
    }

}
