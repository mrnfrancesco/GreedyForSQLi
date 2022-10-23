<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://buildapp.online
 * @since      1.0.0
 *
 * @package    Redacted
 * @subpackage Redacted/Multivendor
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Redacted
 * @subpackage Redacted/Multivendor
 * @author     Abdul Hakeem <hakeem.nala@gmail.com>
 */
class Redacted_Multivendor
{

    /**
     * The ID of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string $plugin_name The ID of this plugin.
     */
    private $plugin_name;

    /**
     * The version of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string $version The current version of this plugin.
     */
    private $version;

    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     * @param      string $plugin_name The name of the plugin.
     * @param      string $version The version of this plugin.
     */
    public function __construct($plugin_name, $version)
    {

        $this->plugin_name = $plugin_name;
        $this->version = $version;

    }

    public function get_vendors() {

        switch ($this->which_vendor()) {
            case 'dokan':
                return $this->get_dokan_vendor_list();
                break;
            case 'wcfm':
                return $this->get_wcfm_vendor_list();
                break;
            case 'wc_marketplace':
                return $this->get_wc_marketplace_vendor_list();
                break;
            case 'product_vendor':
                return $this->get_product_vendor_list();
                break;
            default:
                wp_send_json(array());
        }
    }

    public function get_wcfm_vendor_list(){
        global $WCFM, $WCFMmp, $wpdb;

        $search_term     = isset( $_REQUEST['search'] ) ? sanitize_text_field( $_REQUEST['search'] ) : '';
        $search_category = isset( $_REQUEST['wcfmmp_store_category'] ) ? sanitize_text_field( $_REQUEST['wcfmmp_store_category'] ) : '';
        $pagination_base = isset( $_REQUEST['pagination_base'] ) ? sanitize_text_field( $_REQUEST['pagination_base'] ) : '';
        $paged           = isset( $_REQUEST['page'] ) ? absint( $_REQUEST['page'] ) : 1;
        $per_row         = isset( $_REQUEST['per_row'] ) ? absint( $_REQUEST['per_row'] ) : 3;
        $per_page        = isset( $_REQUEST['per_page'] ) ? absint( $_REQUEST['per_page'] ) : 30;
        $includes        = isset( $_REQUEST['includes'] ) ? sanitize_text_field( $_REQUEST['includes'] ) : '';
        $excludes        = isset( $_REQUEST['excludes'] ) ? sanitize_text_field( $_REQUEST['excludes'] ) : '';
        $orderby         = isset( $_REQUEST['orderby'] ) ? sanitize_text_field( $_REQUEST['orderby'] ) : 'newness_asc';
        $has_orderby     = isset( $_REQUEST['has_orderby'] ) ? sanitize_text_field( $_REQUEST['has_orderby'] ) : '';
        $has_product     = isset( $_REQUEST['has_product'] ) ? sanitize_text_field( $_REQUEST['has_product'] ) : '';
        $sidebar         = isset( $_REQUEST['sidebar'] ) ? sanitize_text_field( $_REQUEST['sidebar'] ) : '';
        $theme           = isset( $_REQUEST['theme'] ) ? sanitize_text_field( $_REQUEST['theme'] ) : 'simple';
        $search_data     = array();

        if( isset( $_REQUEST['search_data'] ) )
            parse_str($_REQUEST['search_data'], $search_data);

        $length  = absint( $per_page );
        $offset  = ( $paged - 1 ) * $length;

        $search_data['excludes'] = $excludes;

        if( $includes ) $includes = explode(",", $includes);
        else $includes = array();

        $stores = $WCFMmp->wcfmmp_vendor->wcfmmp_search_vendor_list( true, $offset, $length, $search_term, $search_category, $search_data, $has_product, $includes );

        $store_data = array();

        foreach ( $stores as $store_id => $store_name ) {

            $store_user = wcfmmp_get_store( $store_id );

            $banner = $store_user->get_list_banner();
            if( !$banner ) {
                $banner = isset( $WCFMmp->wcfmmp_marketplace_options['store_list_default_banner'] ) ? $WCFMmp->wcfmmp_marketplace_options['store_list_default_banner'] : $WCFMmp->plugin_url . 'assets/images/default_banner.jpg';
                $banner = apply_filters( 'wcfmmp_list_store_default_bannar', $banner );
            }

            $store_info = $store_user->get_shop_info();
            $store_info['payment'] = null;
            $store_info['commission'] = null;
            $store_info['withdrawal'] = null;

            $wcfm_vendor_delivery_time = get_user_meta( $store_id, 'wcfm_vendor_delivery_time', true );
            if(isset( $wcfm_vendor_delivery_time['start_from'] )) {
                $wcfm_delivery_time_start_from = $wcfm_vendor_delivery_time['start_from'];
                $wcfm_delivery_time_start_from_options = get_wcfm_start_from_delivery_times_raw();
                $deliveryTime = $wcfm_delivery_time_start_from_options[$wcfm_delivery_time_start_from];
            }

            $store_data[] = array(
                'id' => $store_id,
                'name' => isset( $store_info['store_name'] ) ? esc_html( $store_info['store_name'] ) : __( 'N/A', 'wc-multivendor-marketplace' ),
                'icon' => $store_user->get_avatar(),
                'banner' => $banner,
                'phone' => $store_user->get_phone(),
                //'store_name' => apply_filters( 'wcfmmp_store_title', $store_name , $store_id ),
                'address' => $store_user->get_address_string(),
                'description' => $store_user->get_shop_description(),
                'latitude'    => isset( $store_info['store_lat'] ) ? esc_attr( $store_info['store_lat'] ) : null,
                'longitude'    => isset( $store_info['store_lng'] ) ? esc_attr( $store_info['store_lng'] ) : null,
                'average_rating' => (float)$store_user->get_avg_review_rating(),
                'rating_count' => (int)$store_user->get_total_review_count(),
                'is_close' => $this->wcfmmp_is_store_close($store_id),
                'categories' => $this->get_vendor_categories($store_id), //Delete after testing for dokan
                'deliveryTime' => $deliveryTime ?  $deliveryTime : null
            );
        }

        wp_send_json( $store_data );
    }

    public function get_product_vendor_list(){

        $page = isset( $_REQUEST['page'] ) ? absint( $_REQUEST['page'] ) : 1;

        $per_page = 40;
        $offset = ( $page-1 ) * $per_page;
        $args = array( 'number' => $per_page, 'offset' => $offset, 'hide_empty' => false );

        $search_term = isset( $_REQUEST['search'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['search'] ) ) : '';

        if ( '' != $search_term ) {
            $args['name__like'] = $search_term;
        }

        $terms = get_terms( 'wcpv_product_vendors', $args );

        $vendors = array();
        $vendor_data = array();
        foreach ( $terms as $term ) {

            $vendor_data = get_term_meta( $term->term_id, 'vendor_data', true );

            $icon = $this->get_image_src($vendor_data['logo'], 'medium', false);

            $vendors[] = array(
                'id' => $term->term_id,
                'product_vendor' => $term->term_id,
                'name' => $term->name,
                'icon' => $icon,
                'banner' => null,
                'address' => null,
                'description' => $term->description,
                'latitude'   => null,
                'longitude'   => null,
                'average_rating' => null,
                'rating_count' => null,
                'count' => $term->count,
                'wcpv_product_vendors' => $term->term_id,
            );
        }

        wp_send_json($vendors);
    }

    public function get_dokan_vendor_list(){

        $_GET = $_POST;

        $vendors  = array();
        $paged    = isset( $_REQUEST['page'] ) ? absint( $_REQUEST['page'] ) : 1;
        $per_page = isset( $_REQUEST['per_page'] ) ? absint( $_REQUEST['per_page'] ) : 30;
        $length   = absint( $per_page );
        $offset   = ( $paged - 1 ) * $length;

        // Get all vendors
        $seller_args = array (
            'role__in'   => array( 'seller', 'administrator' ),
            'orderby' => 'registered',
            'offset'  => $offset,
            'number'  => $per_page,
            'status'     => 'approved',
        );

        $search_term     = isset( $_REQUEST['search'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['search'] ) ) : '';

        if ( '' != $search_term ) {
            $seller_args['meta_query'] = array(
                array(
                    'key'     => 'dokan_store_name',
                    'value'   => $search_term,
                    'compare' => 'LIKE',
                ),
            );
        }

        $show_products = 'yes';

        if ($show_products == 'yes') $vendor_total_args['query_id'] = 'vendors_with_products';


        if(isset($_REQUEST['distance']) && isset($_REQUEST['latitude']) && isset($_REQUEST['longitude'])) {
            set_query_var( 'address', sanitize_text_field($_REQUEST['address']) );
            set_query_var( 'distance', wc_clean($_REQUEST['distance']) );
            set_query_var( 'latitude', wc_clean($_REQUEST['latitude']) );
            set_query_var( 'longitude', wc_clean($_REQUEST['longitude']) );
        }

        $all_vendors = dokan_get_sellers( apply_filters( 'dokan_seller_listing_args', $seller_args, $_GET ) );

        $vendors = array();
        foreach ( $all_vendors['users'] as $i => $value ) {

            $store_info = dokan_get_store_info( $value->ID );
            $store_info['payment'] = null;

            $store_user   = dokan()->vendor->get( $value->ID );
            $rating = $store_user->get_rating();

            // For Dokan Light
            $location = explode(',', $store_info['location']);
            $latitude = number_format((float)$location[0], 6);
            $longitude = number_format((float)$location[1], 6);

            //For Dokan Pro
            //$latitude = get_user_meta( $value->ID, 'dokan_geo_latitude', true );
            //$longitude = get_user_meta( $value->ID, 'dokan_geo_longitude', true );

            $vendors[] = array(
                'id' => $value->ID,
                'name' => $store_info['store_name'],
                'banner' => $store_user->get_banner(),
                'icon' => $store_user->get_avatar(),
                'phone' => $store_user->get_phone(),
                'address' => $store_info['address'],
                'description' => $store_info['description'],
                'is_close' => dokan_is_store_open( $value->ID ) ? false : true,
                'latitude' => $latitude,
                'longitude' => $longitude,
                'average_rating' => $rating['count'] == 0 ? 0 : (float)$rating['rating'],
                'rating_count' => $rating['count']
            );

        }

        wp_send_json(  $vendors );
    }

    public function get_wc_marketplace_vendor_list(){

        $args = array(
            'number' => 10,
            'offset' => isset($_REQUEST['page']) ? (absint($_REQUEST['page']) - 1 ) * 10 : 1
        );

        if ( ! empty( $_REQUEST['orderby'] ) ) {
            $args['orderby'] = sanitize_text_field($_REQUEST['orderby']);
        }

        if ( ! empty( $_REQUEST['order'] ) ) {
            $args['order'] = sanitize_text_field($_REQUEST['order']);
        }

        if ( ! empty( $_REQUEST['status'] ) ) {
            if($_REQUEST['status'] == 'pending') $args['role'] = 'dc_pending_vendor';
            else $args['role'] = $this->post_type;
        }

        $search_term     = isset( $_REQUEST['search'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['search'] ) ) : '';

        $args['search'] = '*' . esc_attr( $search_term ) . '*';

        $object = array();
        $response = array();
        $store_data = array();

        $args = wp_parse_args($args, array('role' => 'dc_vendor', 'fields' => 'ids', 'orderby' => 'registered', 'order' => 'ASC'));

        $user_query = new WP_User_Query($args);
        if (!empty($user_query->results)) {
            foreach ( $user_query->results as $vendor_id) {
                $vendor = get_wcmp_vendor($vendor_id);
                $vendor_term_id = get_user_meta( $vendor->id, '_vendor_term_id', true );
                $vendor_review_info = wcmp_get_vendor_review_info($vendor_term_id);
                $avg_rating = number_format(floatval($vendor_review_info['avg_rating']), 1);
                $rating_count = $vendor_review_info['total_rating'];

                $icon = $this->get_image_src($vendor->image, 'medium', false);
                $banner = $this->get_image_src($vendor->banner, array(800, 300), false);

                $store_data[] = array(
                    'id' => $vendor->id,
                    'name' => $vendor->page_title,
                    'icon' => $icon,
                    'banner' => $banner,
                    //'store_name' => apply_filters( 'wcfmmp_store_title', $store_name , $store_id ),
                    //'address' => $store_user->get_address_string(),
                    //'description' => $store_user->get_shop_description(),
                    'latitude'    => get_user_meta($vendor->id, '_store_lng', true),
                    'longitude'    => get_user_meta($vendor->id, '_store_lat', true),
                    'average_rating' => (float)wc_format_decimal( $avg_rating, 2 ),
                    'rating_count' => (int)$rating_count,
                );
            }
        }

        wp_send_json($store_data);
    }

    public function get_image_src($id, $size = 'medium', $icon = false) {
        $image = wp_get_attachment_image_src($id, $size, $icon);
        if (is_array($image) && count($image)) {
            return $image[0];
        } else {
            return '';
        }
    }

    public function get_vendor_reviews() {

        if(isset($_REQUEST['vendor'])) {
            $vendor_id = absint($_REQUEST['vendor']);

            switch ($this->which_vendor()) {
                case 'dokan':
                    return $this->get_dokan_vendor_reviews($vendor_id);
                    break;
                case 'wcfm':
                    return $this->get_wcfm_vendor_reviews($vendor_id);
                    break;
                case 'wc_marketplace':
                    return $this->get_wc_marketplace_vendor_reviews($vendor_id);
                    break;
                default:
                    wp_send_json(array());
            }
        } else {
            wp_send_json(array());
        }

    }

    public function get_dokan_vendor_reviews($store_id){

        $per_page = !empty($_REQUEST['per_page']) ? intval($_REQUEST['per_page']) : 10;
        $page = !empty($_REQUEST['page']) ? intval($_REQUEST['page']) : 1;

        $args = array(
            'post_type'      => 'dokan_store_reviews',
            'meta_key'       => 'store_id',
            'meta_value'     => $store_id,
            'post_status'    => 'publish',
            'posts_per_page' => absint($_REQUEST['per_page']),
            'paged'          => absint($_REQUEST['page']),
            //'author__not_in' => array( get_current_user_id(), $store_id )
        );

        $query = new WP_Query( $args );

        $reviews = array();
        foreach ($query->posts as $key => $post) {
            //$rating =  intval( get_comment_meta( $post->ID, 'rating', true ) );

            $rating = absint( get_post_meta( $post->ID, 'rating', true ) );

            $user          = get_user_by( 'id', $post->post_author );
            $user_gravatar = get_avatar_url( $user->user_email );

            $reviews[] = array(
                'id' => $post->ID,
                'vendor_id' => $store_id,
                'author_id' => $post->post_author,
                'author_name' => $user->user_login,
                'author_email' => $user->user_email,
                'review_title' => $post->post_title,
                'review_description' => $post->post_content,
                'review_rating' => $rating,
                'approved' => '1',
                'created' => $post->post_date,
            );
        }

        wp_send_json($reviews);
    }

    public function get_wc_marketplace_vendor_reviews($vendor_id){
        wp_send_json(array());
    }

    public function get_wcfm_vendor_reviews($vendor_id){

        global $WCFM, $wpdb, $_POST, $WCFMmp;

        //$vendor_id = $vendor_id; //Replace with Request ID

        if(isset($_REQUEST['vendor'])) {
            $vendor_id = $_REQUEST['vendor'];
        }

        $_POST['length'] = !empty($_REQUEST['per_page']) ? intval($_REQUEST['per_page']) : 10;
        $_POST['start'] = !empty($_REQUEST['page']) ? ( intval($_REQUEST['page']) - 1 ) * $_POST['length'] : 0;
        $_POST['orderby'] = !empty($_REQUEST['orderby']) ? sanitize_text_field($_REQUEST['orderby']) : '';
        $_POST['order'] = !empty($_REQUEST['order']) ? sanitize_text_field($_REQUEST['order']) : '';
        $_POST['status_type'] = !empty($_REQUEST['status_type']) ? sanitize_text_field($_REQUEST['status_type']) : '';

        $the_orderby = ! empty( $_POST['orderby'] ) ? sanitize_text_field( $_POST['orderby'] ) : 'ID';
        $the_order   = ( ! empty( $_POST['order'] ) && 'asc' === $_POST['order'] ) ? 'ASC' : 'DESC';

        $length = sanitize_text_field( $_POST['length'] );
        $offset = sanitize_text_field( $_POST['start'] );

        $reviews_vendor_filter = '';
        if( $vendor_id ) {
            $reviews_vendor_filter = " AND `vendor_id` = " . $vendor_id;
        }  elseif ( ! empty( $_POST['reviews_vendor'] ) ) {
            $reviews_vendor = sanitize_text_field( $_POST['reviews_vendor'] );
            $reviews_vendor_filter = " AND `vendor_id` = {$reviews_vendor}";
        }

        $status_filter = '';
        if( isset($_POST['status_type']) && ( $_POST['status_type'] != '' ) ) {
            $status_filter = sanitize_text_field( $_POST['status_type'] );
            if( $status_filter == 'approved' ) {
                $status_filter = ' AND `approved` = 1';
            } elseif( $status_filter == 'pending' ) {
                $status_filter = ' AND `approved` = 0';
            }
        }

        $sql = "SELECT * from {$wpdb->prefix}wcfm_marketplace_reviews";
        $sql .= " WHERE 1=1";
        $sql .= $reviews_vendor_filter;
        $sql .= $status_filter;
        $sql .= " ORDER BY `{$the_orderby}` {$the_order}";
        $sql .= " LIMIT {$length}";
        $sql .= " OFFSET {$offset}";

        $wcfm_reviews_array = $wpdb->get_results($sql);

        wp_send_json($wcfm_reviews_array);

    }

    private function which_vendor() {
        if ( ! function_exists( 'is_plugin_active' ) ) {
            include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
        }
        if(is_plugin_active( 'dokan-lite/dokan.php') || is_plugin_active( 'dokan/dokan.php' )){
            return 'dokan';
        }
        else if(is_plugin_active( 'dc-woocommerce-multi-vendor/dc_product_vendor.php' )){
            return 'wc_marketplace';
        }
        else if(is_plugin_active( 'wc-multivendor-marketplace/wc-multivendor-marketplace.php' )){
            return 'wcfm';
        } else if(is_plugin_active( 'woocommerce-product-vendors/woocommerce-product-vendors.php' )){
            return 'product_vendor';
        }
        else return null;
    }

    private function get_wcfm_store_data( $store_id ) {

        global $WCFMmp;

        $store_user  = wcfmmp_get_store( $store_id );

        $store_info = $store_user->get_shop_info();

        $args = array(
          'post_type'      => array('product', 'product_variation'),
          'post_status'    => 'publish',
          'posts_per_page' => -1,
          'author' => $store_id
        );

        $banner = $store_user->get_list_banner();
        if( !$banner ) {
            $banner = isset( $WCFMmp->wcfmmp_marketplace_options['store_list_default_banner'] ) ? $WCFMmp->wcfmmp_marketplace_options['store_list_default_banner'] : $WCFMmp->plugin_url . 'assets/images/default_banner.jpg';
            $banner = apply_filters( 'wcfmmp_list_store_default_bannar', $banner );
        }

        $banners = array();

        return array(
            'id' => (int)$store_id,
            'name' => $store_info[ 'store_name' ],
            'phone' => $store_user->get_phone(),
            'icon' => $store_user->get_avatar(),
            'banner' => $banner,
            'banners' => $banners,
            'video' => $store_user->get_list_banner_type() == 'video' ?  $store_user->get_list_banner_video() : null,
            'address' => (object)$store_info[ 'address' ],
            'social' => (object)$store_info[ 'social' ],
            'email' => $store_info[ 'store_email' ],
            'description' => $store_user->get_shop_description(),
            'latitude' => (string)$store_info[ 'store_lat' ],
            'longitude' => (string)$store_info[ 'store_lng' ],
            'average_rating' => (float)wc_format_decimal( get_user_meta( $vendor_id, '_wcfmmp_total_review_count', true ), 2 ),
            'rating_count' => (int)$store_user->get_total_review_count(),
            'products_count' => count (wc_get_products($args)),
        );
    }

    private function get_dokan_store_data( $store_id ) {

        $store_user   = dokan()->vendor->get( $store_id );
        $store_info   = $store_user->get_shop_info();
        $map_location = $store_user->get_location();

        $args = array(
          'post_type'      => array('product', 'product_variation'),
          'post_status'    => 'publish',
          'posts_per_page' => -1,
          'author' => $store_id
        );

        $banners = array();

        $banners[] = array(
            'image' => $store_user->get_banner(),
            'url' => null
        );

        $location  = explode( ',', $map_location );
        $longitude = ! empty( $location[1] ) ? $location[1] : '0';
        $latitude  = ! empty( $location[0] ) ? $location[0] : '0';

        $args = array(
            'post_type'      => 'dokan_store_reviews',
            'meta_key'       => 'store_id',
            'meta_value'     => $store_id,
            'post_status'    => 'publish',
        );

        $query = new WP_Query( $args );

        $review_count = $query->post_count;

        return array(
            'id' => (int)$store_id,
            'name' => $store_info[ 'store_name' ],
            'phone' => $store_info[ 'phone' ],
            'icon' => $store_user->get_avatar(),
            'banner' => $store_user->get_banner(),
            'banners' => $banners,
            'video' => null,
            'address' => (object)$store_info[ 'address' ],
            'social' => (object)$store_info[ 'social' ],
            'email' => $store_user->get_email(),
            'description' => $store_user->get_shop_description(),
            'latitude' => (string)$longitude,
            'longitude' => (string)$latitude,
            'average_rating' => (float)wc_format_decimal( dokan_get_seller_rating( $store_id ), 2 ),
            'rating_count' => (int)$review_count,
            'products_count' => count (wc_get_products($args)),
        );
    }

    private function get_wc_marketplace_store_data( $store_id ) {
        global $WCMp;

        //$store_user = new WCMp_Vendor($store_id);

        $vendor = get_wcmp_vendor($store_id);

        $vendor_term_id = get_user_meta( $store_id, '_vendor_term_id', true );
        $vendor_review_info = wcmp_get_vendor_review_info($vendor_term_id);
        $avg_rating = number_format(floatval($vendor_review_info['avg_rating']), 1);
        $rating_count = $vendor_review_info['total_rating'];

        $banners = array();

        $banner = $this->get_image_src($vendor->banner, array(800, 300), false);

        $banners[] = array(
            'image' => $banner,
            'url' => null
        );

        $longitude = ! empty( get_user_meta($vendor->id, '_store_lat', true) ) ? get_user_meta($vendor->id, '_store_lat', true) : 90.40714300000002;
        $latitude  = ! empty( get_user_meta($vendor->id, '_store_lng', true) ) ? get_user_meta($vendor->id, '_store_lng', true) : 23.709921;

        $args = array(
          'post_type'      => array('product', 'product_variation'),
          'post_status'    => 'publish',
          'posts_per_page' => -1,
          'author' => $store_id
        );

        $icon = $this->get_image_src($vendor->image, 'medium', false);
        $banner = $this->get_image_src($vendor->banner, 'medium', false);

        return array(
            'id' => (int)$store_id,
            'name' => $vendor->page_title,
            'phone' => $vendor->phone,
            'icon' => $icon,
            'banner' => $banner,
            'banners' => $banners,
            'video' => null,
            'address' => array(
                'address_1'  => $vendor->address_1,
                'address_2'  => $vendor->address_2,
                'city'  => $vendor->city,
                'state'  => $vendor->state,
                'country'  => $vendor->country,
                'postcode'  => $vendor->postcode,
                'phone'  => $vendor->phone,
            ),
            'social' => array(
                'facebook'  => $vendor->fb_profile,
                'twitter'  => $vendor->twitter_profile,
                'google_plus'  => $vendor->google_plus_profile,
                'linkdin'  => $vendor->linkdin_profile,
                'youtube'  => $vendor->youtube,
                'instagram'  => $vendor->instagram,
            ),
            'email' => $vendor->user_data->data->user_email,
            'description'  => $vendor->description,
            'latitude' => (string)$longitude,
            'longitude' => (string)$latitude,
            'average_rating' => (float)wc_format_decimal( $avg_rating, 2 ),
            'rating_count' => (int)$rating_count,
            'products_count' => count (wc_get_products($args)),
        );

    }

    private function get_store_data( $store_id ) {

        switch ($this->which_vendor()) {
            case 'dokan':
                return $this->get_dokan_store_data( $store_id );
                break;
            case 'wcfm':
                return $this->get_wcfm_store_data( $store_id );
                break;
            case 'wc_marketplace':
                return $this->get_wc_marketplace_store_data( $store_id );
                break;
            case 'product_vendor':
                return $this->get_product_vendor_store_data( $store_id );
                break;
            default:
                return (object)array();
        }
    }

    public function get_product_vendor_store_data( $store_id ) {
        //TODO Prepare Store data for product vendor

        $term = get_term_by( 'id', $store_id, 'wcpv_product_vendors' );

        $vendor_data = get_term_meta( $term->term_id, 'vendor_data', true );

        $icon = $this->get_image_src($vendor_data['logo'], 'medium', false);

        $vendors[] = array(
            'id' => $term->term_id,
            'product_vendor' => $term->term_id,
            'name' => $term->name,
            'icon' => $icon,
            'banner' => null,
            'address' => null,
            'description' => $term->description,
            'latitude'   => null,
            'longitude'   => null,
            'average_rating' => null,
            'rating_count' => null,
            'count' => $term->count,
            'wcpv_product_vendors' => $term->term_id,
        );

        $args = array(
          'post_type'      => array( 'product', 'product_variation'),
          'post_status'    => 'publish',
          'posts_per_page' => -1,
          'author' => $store_id
        );

        return array(
            'id' => (int)$store_id,
            'name' => $term->name,
            'phone' => '',
            'icon' => $icon,
            'banner' => '',
            'banners' => array(),
            'video' => null,
            'address' => array(
                'address_1'  => '',
                'address_2'  => '',
                'city'  => '',
                'state'  => '',
                'country'  => '',
                'postcode'  => '',
                'phone'  => '',
            ),
            'social' => array(
                'facebook'  => '',
                'twitter'  => '',
                'google_plus'  => '',
                'linkdin'  => '',
                'youtube'  => '',
                'instagram'  => '',
            ),
            //'email' => $vendor->user_data->data->user_email,
            'description'  => $term->description,
            //'latitude' => null,
            //'longitude' => null,
            //'average_rating' => (float)wc_format_decimal( $avg_rating, 2 ),
            //'rating_count' => (int)$rating_count,
            'products_count' => count (wc_get_products($args)),
        );

        $data = array();
        return $data;
    }

    public function get_vendor_details() {

        $store_id = 1;

        if(isset($_REQUEST['vendor'])) {
            $store_id = absint($_REQUEST['vendor']);
        } else if (isset($_REQUEST['wcpv_product_vendors'])) {
            $store_id = absint($_REQUEST['wcpv_product_vendors']);
        }

        $data['store'] = $this->get_store_data( $store_id );

        $data['blocks'] = array();

        $data['blocks'][] = $this->build_banner_blocks($data['store']['banners'], 'BANNERS');

        if ( ! empty( $_REQUEST['vendor'] ) ) {
            $args['author'] = absint($_REQUEST['vendor']);
        }

        $data['blocks'][] = $this->get_categories_blocks($store_id);

        /**
        * Vendor On Sale Products.
        */
        $args = array();
        if(isset($_REQUEST['vendor'])) {
            $args['author'] = $store_id;
        }
        $args = array(
          'post_type'      => array('product', 'product_variation'),
          'post_status'    => 'publish',
        );
        $on_sale_key = 'post__in';
        $on_sale_ids = wc_get_product_ids_on_sale();
        $on_sale_ids = empty( $on_sale_ids ) ? array( 0 ) : $on_sale_ids;
        $args['include'] = $on_sale_ids;

        $on_sale_products = $this->get_products($args);

        $data['blocks'][] = $this->build_products_blocks($on_sale_products, 'On Sale', 'on_sale');

        /**
        * Vendor Featured Products.
        */
        $args = array();
        if(isset($_REQUEST['vendor'])) {
            $args['author'] = $store_id;
        }
        $args = array(
          'post_type'      => array('product', 'product_variation'),
          'post_status'    => 'publish',
        );
        $tax_query[] = array(
            'taxonomy' => 'product_visibility',
            'field'    => 'name',
            'terms'    => 'featured',
            'operator' => 'IN',
        );
        $args['tax_query'] = $tax_query;
        $featured = $this->get_products($args);

        $data['blocks'][] = $this->build_products_blocks($featured, 'Featured', 'featured');

        add_filter( 'posts_clauses', array( $this, 'order_by_popularity_post_clauses' ) );

        $best_selling = $this->get_products(array());

        remove_filter( 'posts_clauses', array( $this, 'order_by_popularity_post_clauses' ) );

        $data['blocks'][] = $this->build_products_blocks($best_selling, 'Best Selling', 'popularity');

        $args = array();
        if(isset($_REQUEST['vendor'])) {
            $args['author'] = $store_id;
        }
        $args = array(
          'post_type'      => array('product', 'product_variation'),
          'post_status'    => 'publish',
        );
        $args['orderby'] = 'rand';

        $data['recentProducts'] = $this->get_products($args);

        wp_send_json( $data );
    }

    public function build_banner_blocks($children, $title) {
        return array(
            'id' => 0,
            'children' => $children,
            'products' => array(),
            'title' => $title,
            'header_align' => 'none',
            'title_color' => '#000000',
            'paddingTop' => 20.0,
            'paddingRight' => 16.0,
            'paddingBottom' => 20.0,
            'paddingLeft' => 16.0,
            'marginTop' => 0.0,
            'marginRight' => 0.0,
            'marginBottom' => 0.0,
            'marginLeft' => 0.0,
            'bgColor' => '#FFFFFF',
            'blockType' => 'banner_block',
            'style' => 'slider',
            'sort' => 0,
            'linkId' => null,
            'borderRadius' => 8.0,
            'paddingBetween' => 10.0,
            'childWidth' => 100,
            'childHeigth' => 180,
            'elevation' => 0.5,
            'itemPerRow' => 2,
            'sale_ends' => null
        );
    }

    public function build_products_blocks($products, $title, $filter_by = 'popularity') {
        return array(
            'id' => 0,
            'children' => array(),
            'products' => $products,
            'title' => $title,
            'header_align' => 'top_left',
            'title_color' => '#000000',
            'paddingTop' => 10.0,
            'paddingRight' => 0.0,
            'paddingBottom' => 10.0,
            'paddingLeft' => 0.0,
            'marginTop' => 0.0,
            'marginRight' => 0.0,
            'marginBottom' => 0.0,
            'marginLeft' => 0.0,
            'bgColor' => '#FFFFFF',
            'blockType' => 'product_block',
            'style' => 'scroll',
            'sort' => 0,
            'linkId' => null,
            'borderRadius' => 0.0,
            'paddingBetween' => 10.0,
            'childWidth' => 150,
            'childHeigth' => 180,
            'elevation' => 0.5,
            'itemPerRow' => 2,
            'sale_ends' => null,
            'filter_by' => $filter_by
        );
    }

    public function get_categories_blocks($id) {
        return array(
            'id' => 0,
            'children' => array(),
            'categories' => $this->get_vendor_categories($id),
            'title' => 'Categories',
            'header_align' => 'top_left',
            'title_color' => '#000000',
            'paddingTop' => 10.0,
            'paddingRight' => 16.0,
            'paddingBottom' => 10.0,
            'paddingLeft' => 16.0,
            'marginTop' => 0.0,
            'marginRight' => 0.0,
            'marginBottom' => 0.0,
            'marginLeft' => 0.0,
            'bgColor' => '#FFFFFF',
            'blockType' => 'category_block',
            'style' => 'grid',
            'sort' => 0,
            'linkId' => null,
            'borderRadius' => 50.0,
            'paddingBetween' => 10.0,
            'childWidth' => 200,
            'childHeigth' => 320,
            'elevation' => 0.5,
            'itemPerRow' => 4,
            'sale_ends' => null
        );
    }


    // Products

    public function get_products($args = array()){

        $tax_query   = WC()->query->get_tax_query();

        for ($i=0; $i < 50; $i++) {

            if ( ! empty( $_REQUEST['attributes' . $i] ) && ! empty( $_REQUEST['attribute_term' . $i] ) ) {
                if ( in_array( $_REQUEST['attributes' . $i], wc_get_attribute_taxonomy_names(), true ) ) {
                    $tax_query[] = array(
                        'taxonomy' => sanitize_text_field($_REQUEST['attributes' . $i]),
                        'field'    => 'term_id',
                        'terms'    => sanitize_text_field($_REQUEST['attribute_term' . $i]),
                    );
                }
            }

        }

        if ( ! empty( $_REQUEST['wcpv_product_vendors'] ) ) {
            $tax_query[] = array(
                'taxonomy' => 'wcpv_product_vendors',
                'field'    => 'id',
                'terms'    => absint($_REQUEST['wcpv_product_vendors']),
            );
        }

        if ( ! empty( $tax_query ) ) {
            if ( ! empty( $args['tax_query'] ) ) {
                $args['tax_query'] = array_merge( $tax_query, $args['tax_query'] ); // WPCS: slow query ok.
            } else {
                $args['tax_query'] = $tax_query; // WPCS: slow query ok.
            }
        }

        if ( ! empty( $_REQUEST['random'] ) ) {
            $args['orderby'] = 'rand';
        }

        if ( ! empty( $_REQUEST['tag'] ) ) {
            $args = array(
                'tag' => array( sanitize_text_field($_REQUEST['tag']) ),
            );
        }

        // Filter by on sale products.
        if ( isset( $_REQUEST['on_sale'] ) ) {
            $on_sale_key = $_REQUEST['on_sale'] == '1' ? 'post__in' : 'post__not_in';
            $on_sale_ids = wc_get_product_ids_on_sale();

            // Use 0 when there's no on sale products to avoid return all products.
            $on_sale_ids = empty( $on_sale_ids ) ? array( 0 ) : $on_sale_ids;

            $args['include'] = $on_sale_ids;
        }

        /* For Dokan and WCFM Plugin Only */
        if ( ! empty( $_REQUEST['vendor'] ) ) {
            $args['author'] = absint($_REQUEST['vendor']);
        }

        // search
        if ( ! empty( $_REQUEST['q'] ) ) {
            $args['s'] = sanitize_text_field($_REQUEST['q']);
        }

        // search
        if ( ! empty( $_REQUEST['id'] ) ) {
            $tax_query[] = array(
                'taxonomy' => 'product_cat',
                'field'    => 'term_id',
                'terms'    => absint($_REQUEST['id']),
            );
        }

        // Build tax_query if taxonomies are set.
        if ( ! empty( $tax_query ) ) {
            if ( ! empty( $args['tax_query'] ) ) {
                $args['tax_query'] = array_merge( $tax_query, $args['tax_query'] ); // WPCS: slow query ok.
            } else {
                $args['tax_query'] = $tax_query; // WPCS: slow query ok.
            }
        }

        // Page filter.
        if ( ! empty( $_REQUEST['page'] ) ) {
            $args['page'] = absint($_REQUEST['page']);
        }

        $args['post_status'] = 'publish';

        $args['post_type'] = array( 'product', 'product_variation' );

        $products = wc_get_products( $args );

        $results = array();

        foreach ($products as $i => $product) {

            $available_variations = $product->get_type() == 'variable' ? $product->get_available_variations() : null;
            $variation_attributes = $product->get_type() == 'variable' ? $product->get_variation_attributes() : null;

            $variation_options = array();
            $emptyValuesKeys = array();
            if($available_variations != null) {
                $values = array();
                foreach ( $available_variations as $key => $value ) {
                    foreach ( $value['attributes'] as $atr_key => $atr_value ) {
                        $available_variations[$key]['option'][] = array(
                            'key' => $atr_key,
                            'value' => $this->attribute_slug_to_title($atr_key, $atr_value),
                            'slug' => $atr_value //make it name
                        );
                        //Delete this in future (After 6 month from 2021 dec)
                        $values[] = $this->attribute_slug_to_title($atr_key, $atr_value);

                        //Added new, delete abovce $values[] if this working properly (After 6 month from 2021 dec)
                        $values_array[] = array(
                            'name' => $this->attribute_slug_to_title($attribute_name, $value),
                            'slug' => $value
                        );
                        if(empty($atr_value))
                        $emptyValuesKeys[] = $atr_key;

                        $variation = wc_get_product( $value['variation_id'] );

                        $regular_price = $variation->get_regular_price();
                        $sale_price = $variation->get_sale_price();

                        $available_variations[$key]['formated_price'] = $regular_price ? strip_tags(wc_price(wc_get_price_to_display( $variation, array( 'price' => $regular_price ) ))) : strip_tags(wc_price(wc_get_price_to_display( $variation, array( 'price' => $variation->get_price() ) )));
                        $available_variations[$key]['formated_sales_price'] = $sale_price ? strip_tags(wc_price(wc_get_price_to_display( $variation, array( 'price' => $sale_price ) ))) : null;
                    }
                    $available_variations[$key]['image_id'] = null;
                }
                if($variation_attributes)
                foreach ( $variation_attributes as $attribute_name => $options ) {

                    $new_options = array();
                    $options_array = array();
                    $option_list = null;
                    foreach (array_values($options) as $key => $value) {

                        //Delete this in future (After 6 month from 2021 dec)
                        $new_options[] = $this->attribute_slug_to_title($attribute_name, $value);

                        //Added new, delete abovce $values[] if this working properly (After 6 month from 2021 dec)
                        $options_array[] = array(
                            'name' => $this->attribute_slug_to_title($attribute_name, $value),
                            'slug' => $value
                        );
                    }
                    if (!in_array('attribute_' . $attribute_name, $emptyValuesKeys)) {

                        //Delete this in future (After 6 month from 2021 dec)
                        $options = array_intersect ( array_values($new_options) , $values );

                        //Added new, delete abovce $values[] if this working properly (After 6 month from 2021 dec)
                        $option_list = array_intersect ( $options_array , $values_array );
                    }
                    $variation_options[] = array(
                        'name' => wc_attribute_label( $attribute_name ),
                        'options'   => array_values($options),
                        'option_list' => $option_list != null ? $option_list : $options_array,
                        'attribute' => $attribute_name,
                    );
                }
            }

            $price = (float)$product->get_price();
            if($price == 0 && $available_variations != null) {
                if(!empty($availableVariations)) {
                    if((float)$availableVariations[0]['display_regular_price']) {
                        $regular_price = (float)$availableVariations[0]['display_regular_price'];
                    } else $regular_price = 0;
                    if((float)$availableVariations[0]['display_price']) {
                        $sale_price = (float)$availableVariations[0]['display_price'];
                    } else $sale_price = 0;
                }
            } else {
                $regular_price = (float)$product->get_regular_price();
                $sale_price = (float)$product->get_sale_price();
            }

            $results[] = array(
                'id' => $product->get_id(),
                'name' => $product->get_name(),
                'sku' => $product->get_sku( 'view' ),
                'type' => $product->get_type(),
                'status' => $product->get_status(),
                'permalink'  => $product->get_permalink(),
                'description' => do_shortcode($product->get_description()),
                'short_description' => do_shortcode($product->get_short_description()),
                'formated_price' => $regular_price ? strip_tags(wc_price(wc_get_price_to_display( $product, array( 'price' => $regular_price ) ))) : strip_tags(wc_price(wc_get_price_to_display( $product, array( 'price' => $price ) ))),
                'formated_sales_price' => $sale_price ? strip_tags(wc_price(wc_get_price_to_display( $product, array( 'price' => $sale_price ) ))) : null,
                'price' => (float)$price,
                'regular_price' => (float)$regular_price,
                'sale_price' => (float)$sale_price,
                'stock_status' => $product->get_stock_status(),
                'stock_quantity'     => $product->get_stock_quantity(),
                'on_sale' => $product->is_on_sale( 'view' ),
                'average_rating'        => wc_format_decimal( $product->get_average_rating(), 2 ),
                'rating_count'          => $product->get_rating_count(),
                'related_ids'           => array_map( 'absint', array_values( wc_get_related_products( $product->get_id() ) ) ),
                'upsell_ids'            => array_map( 'absint', $product->get_upsell_ids( 'view' ) ),
                'cross_sell_ids'        => array_map( 'absint', $product->get_cross_sell_ids( 'view' ) ),
                'parent_id'             => $product->get_parent_id( 'view' ),
                'images' => $this->get_images($product),
                'attributes'            => $this->get_attributes( $product ),
                'availableVariations'   => $available_variations,
                'variationAttributes'   => $variation_attributes,
                'meta_data'             => $product->get_meta_data(),
                'variationOptions'      => $variation_options,
                'total_sales'           => (int)$product->get_total_sales(),
                'vendor'                => $this->get_product_vendor($product->get_id()),
                'tags'                  => wc_get_object_terms( $product->get_id(), 'product_tag', 'name' ),
                //'categories'            => wc_get_object_terms( $product->get_id(), 'product_cat', 'term_id' ),
                'addons'                => $this->get_product_addons($product->get_id()),
                //'booking'         => $this->get_booking($product->get_id()),
                //'cashback_amount'       => woo_wallet()->cashback->get_product_cashback_amount($product)
            );
        }

        return $results;

    }

    function get_booking($product_id) {

        $data = array();

        $bookable_product = new WC_Product_Booking($product_id);

        $blocks = $bookable_product->get_blocks_in_range(current_time( 'timestamp' ), current_time( 'timestamp' ) + 60*60*24*30, '', $product_id, '');

        $data['slots'] = $bookable_product->get_available_blocks($blocks, array(), 0, current_time( 'timestamp' ), current_time( 'timestamp' ) + 60*60*24*30);

        $data['duration'] = $bookable_product->get_duration();

        $data['duration_unit'] = $bookable_product->get_duration_unit();

        $data['duration_type'] = $bookable_product->get_duration_type();

        $data['min_duration'] = $bookable_product->get_min_duration();

        $data['max_duration'] = $bookable_product->get_max_duration();

        $data['qty'] = $bookable_product->get_qty();

        $data['has_persons'] = $bookable_product->has_persons();

        $data['min_persons'] = $bookable_product->get_min_persons();

        $data['max_persons'] = $bookable_product->get_max_persons();

        return $data;
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


        //$post_id = 34;

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

                foreach ( $addon['options'] as $key => $value ) {
                    $addons[$addon_key]['options'][$key]['key'] = sanitize_title($value['label']);
                }
            }
        }

        //return apply_filters( 'get_product_addons', $addons );

        return $addons;

    }

    /**
     * Join wc_product_meta_lookup to posts if not already joined.
     *
     * @param string $sql SQL join.
     * @return string
     */
    private function append_product_sorting_table_join( $sql ) {
        global $wpdb;

        if ( ! strstr( $sql, 'wc_product_meta_lookup' ) ) {
            $sql .= " LEFT JOIN {$wpdb->wc_product_meta_lookup} wc_product_meta_lookup ON $wpdb->posts.ID = wc_product_meta_lookup.product_id ";
        }
        return $sql;
    }

    /**
     * WP Core does not let us change the sort direction for individual orderby params - https://core.trac.wordpress.org/ticket/17065.
     *
     * This lets us sort by meta value desc, and have a second orderby param.
     *
     * @param array $args Query args.
     * @return array
     */
    public function order_by_popularity_post_clauses( $args ) {
        $args['join']    = $this->append_product_sorting_table_join( $args['join'] );
        $args['orderby'] = ' wc_product_meta_lookup.total_sales DESC, wc_product_meta_lookup.product_id DESC ';
        return $args;
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

    function get_product_vendor( $id ) {
        $vendor = array();
        switch ($this->which_vendor()) {
            case 'dokan':
                $seller = get_post_field( 'post_author', $id);
                $author = get_user_by( 'id', $seller );
                $store_info = dokan_get_store_info( $author->ID );
                $store_info['icon_url'] = wp_get_attachment_url( $store_info['gravatar'] );
                $vendor = array(
                    'id' => $author->ID,
                    'name' => $store_info['store_name'],
                    'icon' => $store_info['icon_url'],
                    'phone' => $store_info['phone'],
                );
                return $vendor;
                break;
            case 'wcfm':
                global $WCFM, $WCFMmp;
                $vendor_id = $WCFM->wcfm_vendor_support->wcfm_get_vendor_id_from_product( $id );
                $store_user  = wcfmmp_get_store( $vendor_id );
                $store_info = $store_user->get_shop_info();
                $vendor = array(
                    'id' => $vendor_id,
                    'name' => $store_info['store_name'],
                    'icon' => $store_user->get_avatar(),
                    'phone' => $store_info['phone'],
                );
                return $vendor;
                break;
            case 'wc_marketplace':
            //TODO SOLD BY FOR WC MARKETPLACE
                return null;
                break;
            case 'product_vendor':
                $sold_by = get_option( 'wcpv_vendor_settings_display_show_by', 'yes' );
                $term = wp_get_object_terms( $id, 'wcpv_product_vendors', array( 'fields' => 'ids' ) );
                if ( is_wp_error( $term ) || empty( $term ) ) {
                    return null;
                }
                $vendor_data = get_term_meta( $term->term_id, 'vendor_data', true );
                $icon = $this->get_image_src($vendor_data['logo'], 'medium', false);
                if ( 'yes' === $sold_by ) {
                    $sold_by = WC_Product_Vendors_Utils::get_sold_by_link( $post->ID );
                    $vendor = array(
                        'id' => $id,
                        'wcpv_product_vendors' => $id,
                        'name' => $sold_by['name'],
                        'icon' => $icon
                    );
                    return $vendor;
                } return null;
                break;
            default:
                return null;
        }
        return null;
    }

    public function handling_custom_meta_query_keys( $wp_query_args, $query_vars, $data_store_cpt ) {

        // Price filter.
        if ( ! empty( $_REQUEST['min_price'] ) || ! empty( $_REQUEST['max_price'] ) ) {
            $wp_query_args['meta_query'] = $this->add_meta_query( $wp_query_args, wc_get_min_max_price_meta_query( $_REQUEST ) );  // WPCS: slow query ok.
        }

        // Filter product by stock_status.
        if ( ! empty( $_REQUEST['stock_status'] ) ) {
            $wp_query_args['meta_query'] = $this->add_meta_query( // WPCS: slow query ok.
                $wp_query_args, array(
                    'key'   => '_stock_status',
                    'value' => sanitize_text_field($_REQUEST['stock_status']),
                )
            );
        }

        // Filter by sku.
        if ( ! empty( $_REQUEST['sku'] ) ) {
            $skus = explode( ',', sanitize_text_field($_REQUEST['sku']) );
            // Include the current string as a SKU too.
            if ( 1 < count( $skus ) ) {
                $skus[] = sanitize_text_field($_REQUEST['sku']);
            }

            $args['tax_query'] = $this->add_meta_query( $args, array(
                'key'     => '_sku',
                'value'   => $skus,
                'compare' => 'IN',
            ) );
        }

        return $wp_query_args;
    }

    protected function get_variation_ids( $product ) {
        $variations = array();

        foreach ( $product->get_children() as $child_id ) {
            $variation = wc_get_product( $child_id );
            if ( ! $variation || ! $variation->exists() ) {
                continue;
            }

            $variations[] = $variation->get_id();
        }

        return $variations;
    }

    protected function get_variation_data( $product ) {
        $variations = array();

        foreach ( $product->get_children() as $child_id ) {
            $variation = wc_get_product( $child_id );
            if ( ! $variation || ! $variation->exists() ) {
                continue;
            }

            $variations[] = array(
                'id'                 => $variation->get_id(),
                'permalink'          => $variation->get_permalink(),
                'sku'                => $variation->get_sku(),
                'price' => strip_tags(wc_price(wc_get_price_to_display( $variation, array( 'price' => $variation->get_price() ) ))),
                'regular_price' => strip_tags(wc_price(wc_get_price_to_display( $variation, array( 'price' => $variation->get_regular_price() ) ))),
                'sale_price' => strip_tags(wc_price(wc_get_price_to_display( $variation, array( 'price' => $variation->get_sale_price() ) ))),
                'on_sale'            => $variation->is_on_sale(),
                'purchasable'        => $variation->is_purchasable(),
                'visible'            => $variation->is_visible(),
                'virtual'            => $variation->is_virtual(),
                'downloadable'       => $variation->is_downloadable(),
                'download_limit'     => '' !== $variation->get_download_limit() ? (int) $variation->get_download_limit() : -1,
                'download_expiry'    => '' !== $variation->get_download_expiry() ? (int) $variation->get_download_expiry() : -1,
                'stock_quantity'     => $variation->get_stock_quantity(),
                'in_stock'           => $variation->is_in_stock(),
                'image'              => $this->get_images( $variation ),
                'attributes'         => $this->get_attributes( $variation ),
                //'cashback_amount'       => woo_wallet()->cashback->get_product_cashback_amount($variation)
            );
        }

        return $variations;
    }

    protected function get_images( $product ) {
        $images         = array();
        $attachment_ids = array();

        // Add featured image.
        if ( $product->get_image_id() ) {
            $attachment_ids[] = $product->get_image_id();
        }

        // Add gallery images.
        $attachment_ids = array_merge( $attachment_ids, $product->get_gallery_image_ids() );

        // Build image data.
        foreach ( $attachment_ids as $position => $attachment_id ) {
            $attachment_post = get_post( $attachment_id );
            if ( is_null( $attachment_post ) ) {
                continue;
            }

            $attachment = wp_get_attachment_image_src( $attachment_id, 'full' );
            if ( ! is_array( $attachment ) ) {
                continue;
            }

            $images[] = array(
                'id'                => (int) $attachment_id,
                'src'               => current( $attachment ),
                'name'              => get_the_title( $attachment_id ),
                'alt'               => get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ),
                'position'          => (int) $position,
            );
        }

        // Set a placeholder image if the product has no images set.
        if ( empty( $images ) ) {
            $images[] = array(
                'id'                => 0,
                'src'               => wc_placeholder_img_src(),
                'name'              => __( 'Placeholder', 'woocommerce' ),
                'alt'               => __( 'Placeholder', 'woocommerce' ),
                'position'          => 0,
            );
        }

        return $images;
    }

    protected function get_attribute_taxonomy_name( $slug, $product ) {
        $attributes = $product->get_attributes();

        if ( ! isset( $attributes[ $slug ] ) ) {
            return str_replace( 'pa_', '', $slug );
        }

        $attribute = $attributes[ $slug ];

        // Taxonomy attribute name.
        if ( $attribute->is_taxonomy() ) {
            $taxonomy = $attribute->get_taxonomy_object();
            return $taxonomy->attribute_label;
        }

        // Custom product attribute name.
        return $attribute->get_name();
    }

    /**
     * Get default attributes.
     *
     * @param WC_Product $product Product instance.
     *
     * @return array
     */
    protected function get_default_attributes( $product ) {
        $default = array();

        if ( $product->is_type( 'variable' ) ) {
            foreach ( array_filter( (array) $product->get_default_attributes(), 'strlen' ) as $key => $value ) {
                if ( 0 === strpos( $key, 'pa_' ) ) {
                    $default[] = array(
                        'id'     => wc_attribute_taxonomy_id_by_name( $key ),
                        'name'   => $this->get_attribute_taxonomy_name( $key, $product ),
                        'option' => $value,
                    );
                } else {
                    $default[] = array(
                        'id'     => 0,
                        'name'   => $this->get_attribute_taxonomy_name( $key, $product ),
                        'option' => $value,
                    );
                }
            }
        }

        return $default;
    }

    /**
     * Get attribute options.
     *
     * @param int   $product_id Product ID.
     * @param array $attribute  Attribute data.
     *
     * @return array
     */
    protected function get_attribute_options( $product_id, $attribute ) {
        if ( isset( $attribute['is_taxonomy'] ) && $attribute['is_taxonomy'] ) {
            return wc_get_product_terms(
                $product_id, $attribute['name'], array(
                    'fields' => 'names',
                )
            );
        } elseif ( isset( $attribute['value'] ) ) {
            return array_map( 'trim', explode( '|', $attribute['value'] ) );
        }

        return array();
    }

    /**
     * Get the attributes for a product or product variation.
     *
     * @param WC_Product|WC_Product_Variation $product Product instance.
     *
     * @return array
     */
    protected function  get_attributes( $product ) {
        $attributes = array();

        if ( $product->is_type( 'variation' ) ) {
            $_product = wc_get_product( $product->get_parent_id() );
            foreach ( $product->get_variation_attributes() as $attribute_name => $attribute ) {
                $name = str_replace( 'attribute_', '', $attribute_name );

                if ( empty( $attribute ) && '0' !== $attribute ) {
                    continue;
                }

                // Taxonomy-based attributes are prefixed with `pa_`, otherwise simply `attribute_`.
                if ( 0 === strpos( $attribute_name, 'attribute_pa_' ) ) {
                    $option_term  = get_term_by( 'slug', $attribute, $name );
                    $attributes[] = array(
                        'id'     => wc_attribute_taxonomy_id_by_name( $name ),
                        'name'   => $this->get_attribute_taxonomy_name( $name, $_product ),
                        'option' => $option_term && ! is_wp_error( $option_term ) ? $option_term->name : $attribute,
                    );
                } else {
                    $attributes[] = array(
                        'id'     => 0,
                        'name'   => $this->get_attribute_taxonomy_name( $name, $_product ),
                        'option' => $attribute,
                    );
                }
            }
        } else {
            foreach ( $product->get_attributes() as $attribute ) {
                $attributes[] = array(
                    'id'        => $attribute['is_taxonomy'] ? wc_attribute_taxonomy_id_by_name( $attribute['name'] ) : 0,
                    'name'      => $this->get_attribute_taxonomy_name( $attribute['name'], $product ),
                    'position'  => (int) $attribute['position'],
                    'visible'   => (bool) $attribute['is_visible'],
                    'variation' => (bool) $attribute['is_variation'],
                    'options'   => $this->get_attribute_options( $product->get_id(), $attribute ),
                );
            }
        }

        return $attributes;
    }

    public function mstoreapp_location_filter($args, $wp_query) {
        //Return $arg if feature not anabled
        switch ($this->which_vendor()) {
            case 'dokan':
                return $args;
                break;
            case 'wcfm':
                return $this->wcfm_location_filter($args, $wp_query);
                break;
            case 'wc_marketplace':
                return $this->wc_marketplace_location_filter($args, $wp_query);
                break;
            default:
                return $args;
        }
    }

    protected function wc_marketplace_location_filter($args, $wp_query) {

        $address = isset( $_REQUEST['address'] ) ? wc_clean( $_REQUEST['address'] ) : '';
        $distance = isset( $_REQUEST['distance'] ) ? wc_clean( $_REQUEST['distance'] ) : 10;
        $latitude = isset( $_REQUEST['latitude'] ) ? wc_clean( $_REQUEST['latitude'] ) : '';
        $longitude = isset( $_REQUEST['longitude'] ) ? wc_clean( $_REQUEST['longitude'] ) : '';

        if(isset($_REQUEST['mstoreapp']) && !empty( $latitude ) && !empty( $longitude ) && !empty( $distance ) ) {

            global $wpdb;

            $ids = array();

            $vendor_args = array('role' => 'dc_vendor', 'fields' => 'ids', 'orderby' => 'registered', 'order' => 'ASC');
            $user_query = new WP_User_Query($vendor_args);
            if (!empty($user_query->results)) {
                foreach ( $user_query->results as $vendor_id) {
                    $ids[] = $vendor_id;
                }
            }

            $args['where'] .= " AND $wpdb->posts.post_author in (". implode( ',', $ids ).")";

        }

        return $args;
    }

    protected function wcfm_location_filter($args, $wp_query) {
        global $WCFM, $WCFMmp, $wpdb, $wcfmmp_radius_lat, $wcfmmp_radius_lng, $wcfmmp_radius_range;

        $wcfm_google_map_api           = isset( $WCFMmp->wcfmmp_marketplace_options['wcfm_google_map_api'] ) ? $WCFMmp->wcfmmp_marketplace_options['wcfm_google_map_api'] : '';
        $wcfm_map_lib = isset( $WCFMmp->wcfmmp_marketplace_options['wcfm_map_lib'] ) ? $WCFMmp->wcfmmp_marketplace_options['wcfm_map_lib'] : '';
        if( !$wcfm_map_lib && $wcfm_google_map_api ) { $wcfm_map_lib = 'google'; } elseif( !$wcfm_map_lib && !$wcfm_google_map_api ) { $wcfm_map_lib = 'leaftlet'; }
        if( ($wcfm_map_lib == 'google') && empty( $wcfm_google_map_api ) ) return $args;

        $enable_wcfm_product_radius    = isset( $WCFMmp->wcfmmp_marketplace_options['enable_wcfm_product_radius'] ) ? $WCFMmp->wcfmmp_marketplace_options['enable_wcfm_product_radius'] : 'no';
        if( $enable_wcfm_product_radius !== 'yes' ) return $args;

        if ( ( ! isset( $_REQUEST['distance'] ) && ! isset( $_REQUEST['latitude'] ) && ! isset( $_REQUEST['longitude'] ) ) ) {
            return $args;
        }

        $max_radius_to_search = isset( $WCFMmp->wcfmmp_marketplace_options['max_radius_to_search'] ) ? $WCFMmp->wcfmmp_marketplace_options['max_radius_to_search'] : '100';

        $address = isset( $_REQUEST['address'] ) ? wc_clean( $_REQUEST['address'] ) : '';
        $radius_range = isset( $_REQUEST['distance'] ) ? wc_clean( $_REQUEST['distance'] ) : (absint(apply_filters( 'wcfmmp_radius_filter_max_distance', $max_radius_to_search ))/10);
        $latitude = isset( $_REQUEST['latitude'] ) ? wc_clean( $_REQUEST['latitude'] ) : '';
        $longitude = isset( $_REQUEST['longitude'] ) ? wc_clean( $_REQUEST['longitude'] ) : '';

        if(isset($_REQUEST['flutter_app']) && !empty( $latitude ) && !empty( $longitude ) && !empty( $radius_range ) ) {
            $wcfmmp_radius_lat = $latitude;
            $wcfmmp_radius_lng = $longitude;
            $wcfmmp_radius_range = $radius_range;

            $user_args = array(
                'role__in'     => apply_filters( 'wcfmmp_allwoed_vendor_user_roles', array( 'wcfm_vendor' ) ),
                'count_total'  => false,
                'fields'       => array( 'ID', 'display_name' ),
             );
            $all_users = get_users( $user_args );

            $available_vendors = array();
            if( !empty( $all_users ) ) {
                foreach( $all_users as $all_user ) {
                    $available_vendors[$all_user->ID] = $all_user->ID;
                }
            } else {
                $available_vendors = array(0);
            }

            $args['where'] .= " AND $wpdb->posts.post_author in (". implode( ',', $available_vendors ).")";
        }

        return $args;
    }

    public function pre_get_users($query) {

        global $bao_vendor_type;

        if(isset($_REQUEST['vendor_type'])) {
            $vendor_type = sanitize_text_field($_REQUEST['vendor_type']);
            $query->query_vars['meta_query'] = $this->add_meta_query( $query->query_vars['meta_query'], array(
                'key'     => 'mstoreapp_vendor_type',
                'value'   => $vendor_type,
                'compare' => 'LIKE',
            ) );
        } else if(isset($bao_vendor_type)) {

            $query->query_vars['meta_query'] = $this->add_meta_query( $query->query_vars['meta_query'], array(
                'key'     => 'mstoreapp_vendor_type',
                'value'   => $bao_vendor_type,
                'compare' => 'LIKE',
            ) );
        }

        $bao_vendor_type = null;

    }

    protected function add_meta_query( $args, $meta_query ) {
        if ( empty( $args['meta_query'] ) ) {
            $args['meta_query'] = array();
        }

        $args['meta_query'][] = $meta_query;

        return $args['meta_query'];
    }

    public function geo_location_user_query($store_query) {
        global $wpdb;
        switch ($this->which_vendor()) {
            case 'dokan':
                //$this->dokan_geo_location_user_query($store_query);
                break;
            case 'wcfm':
                //
                break;
            case 'wc_marketplace':
                $this->wc_marketplace_geo_location_user_query($store_query);
                break;
            default:
                // Do Nothing
        }
    }

    // Not working Need to check. Dokan defualt filter is working
    public function dokan_geo_location_user_query($store_query) {

        $post = $_POST;

        $distance = isset($post['distance']) ? $post['distance'] : '10';

        if(isset($post['mstoreapp']) && isset($post['latitude']) && isset($post['longitude'])) {

            global $wpdb;

            $latitude = $post['latitude'];
            $longitude = $post['longitude'];
            $distance = $distance;

            $distance_unit = dokan_get_option( 'distance_unit', 'dokan_geolocation', 'km' );

            $distance_earth_center_to_surface = ( 'km' === $distance_unit ) ? 6371 : 3959;

            $store_query->query_fields .= ', metalat.meta_value as dokan_geo_latitude, metalong.meta_value as dokan_geo_longitude, metaaddr.meta_value as dokan_geo_address';

            $store_query->query_fields .= ", (
                {$distance_earth_center_to_surface} * acos(
                    cos( radians( {$latitude} ) ) *
                    cos( radians( metalat.meta_value ) ) *
                    cos(
                        radians( metalong.meta_value ) - radians( {$longitude} )
                    ) +
                    sin( radians( {$latitude} ) ) *
                    sin( radians( metalat.meta_value ) )
                )
            ) as geo_distance";

            $store_query->query_from .= " inner join {$wpdb->usermeta} as metalat on {$wpdb->users}.ID = metalat.user_id and metalat.meta_key = 'dokan_geo_latitude'";
            $store_query->query_from .= " inner join {$wpdb->usermeta} as metalong on {$wpdb->users}.ID = metalong.user_id and metalong.meta_key = 'dokan_geo_longitude'";
            $store_query->query_from .= " inner join {$wpdb->usermeta} as metaaddr on {$wpdb->users}.ID = metaaddr.user_id and metaaddr.meta_key = 'dokan_geo_address'";

            $store_query->query_orderby = "having ( geo_distance < {$distance} or geo_distance is null ) " . $store_query->query_orderby;

        }

    }

    public function wc_marketplace_geo_location_user_query($store_query) {

        $post = $_POST;

        if(isset($post['mstoreapp']) && isset($post['distance']) && isset($post['latitude']) && isset($post['longitude'])) {

            global $wpdb;

            $latitude = $post['latitude'];
            $longitude = $post['longitude'];
            $distance = $post['distance'];

            // Chnage wcfmmp_latitude, wcfmmp_longitude as per wc marketplace
            $store_query->query_fields .= ', userlat.meta_value as user_latitude, userlng.meta_value as user_longitude';

            $radius_unit = 'km';
            $earth_surface = 6371;

            $store_query->query_fields .= ", (
                {$earth_surface} * acos(
                    cos( radians( {$latitude} ) ) *
                    cos( radians( userlat.meta_value ) ) *
                    cos(
                            radians( userlng.meta_value ) - radians( {$longitude} )
                    ) +
                    sin( radians( {$latitude} ) ) *
                    sin( radians( userlat.meta_value ) )
                )
            ) as user_distance";

            $store_query->query_from .= " inner join {$wpdb->usermeta} as userlat on {$wpdb->users}.ID = userlat.user_id and userlat.meta_key = '_store_lat'";
            $store_query->query_from .= " inner join {$wpdb->usermeta} as userlng on {$wpdb->users}.ID = userlng.user_id and userlng.meta_key = '_store_lng'";

            $distance = absint(  $distance );
            $store_query->query_orderby = "having user_distance < {$distance} " . $store_query->query_orderby;

        }

    }

    function wcfmmp_is_store_close( $vendor_id ) {
        global $WCFM, $WCFMmp;

        $is_store_close = false;

        if( !$WCFM->wcfm_vendor_support->wcfm_vendor_has_capability( $vendor_id, 'store_hours' ) ) return $is_store_close;

        if( $vendor_id ) {
            $wcfm_vendor_store_hours = get_user_meta( $vendor_id, 'wcfm_vendor_store_hours', true );
            if( !empty( $wcfm_vendor_store_hours ) ) {
                $wcfm_store_hours_enable = isset( $wcfm_vendor_store_hours['enable'] ) ? 'yes' : 'no';
                if( $wcfm_store_hours_enable == 'yes' ) {
                    $wcfm_store_hours_disable_purchase = isset( $wcfm_vendor_store_hours['disable_purchase'] ) ? 'yes' : 'no';
                    if( $wcfm_store_hours_disable_purchase == 'yes' ) {
                        $wcfm_store_hours_off_days = isset( $wcfm_vendor_store_hours['off_days'] ) ? $wcfm_vendor_store_hours['off_days'] : array();
                        $wcfm_store_hours_day_times = isset( $wcfm_vendor_store_hours['day_times'] ) ? $wcfm_vendor_store_hours['day_times'] : array();

                        $current_time = current_time( 'timestamp' );

                        $today = date( 'N', $current_time );
                        $today -= 1;

                        $today_date = date( 'Y-m-d', $current_time );

                        // OFF Day Check
                        if( !empty( $wcfm_store_hours_off_days ) ) {
                            if( in_array( $today,  $wcfm_store_hours_off_days ) )  $is_store_close = true;
                        }

                        // Closing Hours Check
                        if( !$is_store_close && !empty( $wcfm_store_hours_day_times ) ) {
                            if( isset( $wcfm_store_hours_day_times[$today] ) ) {
                                $wcfm_store_hours_day_time_slots = $wcfm_store_hours_day_times[$today];
                                if( !empty( $wcfm_store_hours_day_time_slots ) ) {
                                    if( isset( $wcfm_store_hours_day_time_slots[0] ) && isset( $wcfm_store_hours_day_time_slots[0]['start'] ) ) {
                                        if( !empty( $wcfm_store_hours_day_time_slots[0]['start'] ) && !empty( $wcfm_store_hours_day_time_slots[0]['end'] ) ) {
                                            $is_store_close = true;
                                            foreach( $wcfm_store_hours_day_time_slots as $slot => $wcfm_store_hours_day_time_slot ) {
                                                $open_hours  = isset( $wcfm_store_hours_day_time_slot['start'] ) ? strtotime( $today_date . ' ' . $wcfm_store_hours_day_time_slot['start'] ) : '';
                                                $close_hours = isset( $wcfm_store_hours_day_time_slot['end'] ) ? strtotime( $today_date . ' ' . $wcfm_store_hours_day_time_slot['end'] ) : '';
                                                //wcfm_log( $current_time . " => " . $open_hours . " ::" . $close_hours );
                                                //wcfm_log( date( wc_date_format() . ' ' . wc_time_format(), $current_time ) . " => " . date( wc_date_format() . ' ' . wc_time_format(), $open_hours ) . " ::" . date( wc_date_format() . ' ' . wc_time_format(), $close_hours ) );
                                                if( $open_hours && $close_hours ) {
                                                    if( ( $current_time > $open_hours ) && ( $current_time < $close_hours ) )  {
                                                        $is_store_close = false;
                                                        break;
                                                    }
                                                } else {
                                                    $is_store_close = false;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return $is_store_close;
    }

    public function contact_vendor() {

        if(isset( $_REQUEST['vendor'] ) && isset($_REQUEST['message'])) {
            $vendor_id = sanitize_text_field( wp_unslash( $_REQUEST['vendor'] ) );
            $body = sanitize_text_field($_REQUEST['message']);
            $name = isset( $_REQUEST['name'] ) ? sanitize_text_field($_REQUEST['name']) : '';
            $email = isset( $_REQUEST['email'] ) ? sanitize_email($_REQUEST['email']) : '';
            $phone = isset( $_REQUEST['phone'] ) ? sanitize_text_field($_REQUEST['phone']) : '';
        } else {
            wp_send_json(false);
        }

        $user = get_user_by( 'id', $vendor_id );

        $admin = get_user_by( 'id', 1 );

        if(isset($user->user_email)) {

            $to = $user->user_email;
            $subject = $name . ' ' . $phone;
            $headers = array('Content-Type: text/html; charset=UTF-8');

            $headers[] = 'From: ' . $email;
            $headers[] = 'Cc: ' . $admin->user_email;


            wp_mail( $to, $subject, $body, $headers );

            wp_send_json(true);
        }

    }

    public function get_vendor_categories($id) {

        $ids = array($id);

        $categories = array();

        if( !empty($ids) ) {
            global $wpdb;

            $unique = implode('', $ids);

            $categories = get_transient( 'dokan-store-category-'.$unique );

            if( true ) {
                $categories = $wpdb->get_results( $wpdb->prepare( "SELECT t.term_id, t.name, tt.parent, tt.count, tt.description FROM $wpdb->terms as t
                    LEFT JOIN $wpdb->term_taxonomy as tt on t.term_id = tt.term_id
                    LEFT JOIN $wpdb->term_relationships AS tr on tt.term_taxonomy_id = tr.term_taxonomy_id
                    LEFT JOIN $wpdb->posts AS p on tr.object_id = p.ID
                    WHERE tt.taxonomy = 'product_cat'
                    AND p.post_type = 'product'
                    AND p.post_status = 'publish'
                    AND p.post_author = %d GROUP BY t.term_id", implode(',', array_map('intval', $ids))
                ) );
                set_transient( 'dokan-store-category-'.$unique , $categories );
            }

        }

        $data = array();

        foreach ($categories as $key => $value) {

            $image_id = get_term_meta( $value->term_id, 'thumbnail_id', true );
            $image = '';

            if ( $image_id ) {
                $image = wp_get_attachment_url( $image_id );
            }

            $data[] = array(
                'id' => (int)$value->term_id,
                'name' => $value->name,
                'description' => $value->description,
                'parent' => (int)$value->parent,
                'count' => (int)$value->count,
                'image' => $image,
            );

        }

        return $data;
    }

    public function getVendorCategories() {
        $id = absint($_REQUEST['vendor']);
        $data = $this->get_vendor_categories($id);
        wp_send_json($data);
    }

    public function add_vendor_review() {

        switch ($this->which_vendor()) {
            case 'dokan':
                return $this->dokan_add_vendor_review();
                break;
            case 'wcfm':
                return $this->wcfm_add_vendor_review();
                break;
            case 'wc_marketplace':
                return $this->wc_marketplace_add_vendor_review();
                break;
            case 'product_vendor':
                return $this->product_vendor_add_vendor_review();
                break;
            default:
                wp_send_json(array());
        }
    }

    public function dokan_add_vendor_review() {

        $title = sanitize_text_field($_REQUEST['title']);
        $comment = sanitize_text_field($_REQUEST['comment']);
        $rating = intval ( $_REQUEST['rating'] );
        $vendor = absint($_REQUEST['vendor']);

        //check if valid customer to proceed
        /*if ( !$this->check_if_valid_dokan_customer( $vendor, get_current_user_id() ) ) {
            wp_send_json( array(
                'success' => false,
                'msg'     => __( 'Sorry, something went wrong!.', 'dokan' ),
            ) );
        }*/

        $my_post = array(
            'post_title'     => sanitize_text_field( $title ),
            'post_content'   => wp_kses_post( $comment ),
            'author'         => get_current_user_id(),
            'post_type'      => 'dokan_store_reviews',
            'post_status'    => 'publish'
        );

        if ( isset( $postdata[ 'post_id' ] ) ) {
            $post_id = intval( $postdata[ 'post_id' ] );
            $post    = get_post( $post_id );

            if ( get_current_user_id() == $post->post_author ) {
                $my_post[ 'ID' ] = $post->ID;
                $post_id = wp_update_post( $my_post );
            } else {
                $post_id = 0;
            }

        } else {
            $post_id = wp_insert_post( $my_post );
        }

        if ( $post_id ) {
            update_post_meta( $post_id, 'store_id', $vendor );
            update_post_meta( $post_id, 'rating', $rating );

            wp_send_json( array(
                'success' => true,
                'msg'     => __( 'Thanks for your review', 'dokan' ),
            ) );
        } else {
            wp_send_json( array(
                'success' => false,
                'msg'     => __( 'Sorry, something went wrong!.', 'dokan' ),
            ) );
        }

        wp_send_json(array(
            'success' => false,
            'msg'     => __( 'Sorry, something went wrong!.', 'dokan' ),
        ));
    }

    function check_if_valid_dokan_customer( $seller_id, $customer_id ) {

        if ( !is_user_logged_in() ) {
            return false;
        }

        if ( get_option( 'woocommerce_review_rating_verification_required' ) === 'no' ) {
            return true;
        }

        $args = array(
            'post_type'           => 'shop_order',
            'author'              => $seller_id,
            'meta_key'            => '_customer_user',
            'meta_value'          => $customer_id,
            'post_status'         => 'wc-completed'
        );

        $query = new WP_Query( $args );

        if( $query->posts ) {
            return true;
        }

        return false;
    }

    public function wcfm_add_vendor_review() {

        $title = sanitize_text_field($_REQUEST['title']);
        $comment = sanitize_text_field($_REQUEST['comment']);
        $rating = wc_clean($_REQUEST['rating']);
        $vendor = absint($_REQUEST['vendor']);

        global $WCFMmp;

        $controllers_path = $WCFMmp->plugin_path . 'controllers/reviews/';

        include_once( $controllers_path . 'wcfmmp-controller-reviews-submit.php' );
        new WCFMmp_Reviews_Submit_Controller();

        wp_send_json(array());
    }

    public function wc_marketplace_add_vendor_review() {

        $title = sanitize_text_field($_REQUEST['title']);
        $comment = sanitize_text_field($_REQUEST['comment']);
        $rating = wc_clean($_REQUEST['rating']);
        $vendor = absint($_REQUEST['vendor']);

        //TODO Inser Review for  wc_marketplace

        wp_send_json(array());
    }

    public function product_vendor_add_vendor_review() {

        $title = sanitize_text_field($_REQUEST['title']);
        $comment = sanitize_text_field($_REQUEST['comment']);
        $rating = wc_clean($_REQUEST['rating']);
        $vendor = absint($_REQUEST['vendor']);

        //TODO Inser Review for  product_vendor

        wp_send_json(array());
    }

}
