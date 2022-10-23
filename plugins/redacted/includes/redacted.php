<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://redacted.online
 * @since      1.0.0
 *
 * @package    Redacted
 * @subpackage Redacted/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Redacted
 * @subpackage Redacted/includes
 * @author     Redacted
 */
class Redacted {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Redacted_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if ( defined( 'REDACTED_VERSION' ) ) {
			$this->version = REDACTED_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'redacted';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();
		$this->define_payments_hooks();

		//Booking Hooks
		$this->define_booking_hooks();

		//Booking Hooks
		$this->define_blog_hooks();

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Redacted_Loader. Orchestrates the hooks of the plugin.
	 * - Redacted_i18n. Defines internationalization functionality.
	 * - Redacted_Admin. Defines all hooks for the admin area.
	 * - Redacted_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/redacted-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/redacted-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/redacted-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/redacted-public.php';

		/**
		 * The class responsible for defining all actions that occur in the multivendor of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/redacted-multivendor.php';

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/redacted-payments.php';

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/redacted-booking.php';

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/redacted-blog-public.php';

		$this->loader = new Redacted_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Redacted_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Redacted_i18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Redacted_Admin( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );

		$this->loader->add_action( 'edit_user_profile', $plugin_admin, 'add_vendor_type_fields' );
		$this->loader->add_action( 'edit_user_profile_update', $plugin_admin, 'save_vendor_type_fields' );

		$this->loader->add_action( 'init', $plugin_admin, 'handle_orgin' );

		//$this->loader->add_action( 'wpcf7_mail_sent', $plugin_admin, 'wpcf7_mail_sent', 10, 1 );

		//$this->loader->add_action( 'wcfm_after_enquiry_submit', $plugin_admin, 'wcfm_after_enquiry_submit', 10, 6 );

        $this->loader->add_action( 'woocommerce_new_order', $plugin_admin, 'neworder',  10, 1  );

        $this->loader->add_filter( 'woocommerce_thankyou_order_received_text', $plugin_admin, 'send_admin_and_vendor_push_notification', 199, 2 );

        $this->loader->add_action( 'save_post_product', $plugin_admin, 'save_new_post', 10, 3  );
        $this->loader->add_filter('wcml_load_multi_currency_in_ajax', $plugin_admin, 'loadCurrency', 20, 1);

        $this->loader->add_action('woocommerce_order_status_changed', $plugin_admin, 'order_status_changed', 10, 1  );

        $this->loader->add_filter('woocommerce_rest_product_object_query', $plugin_admin, 'mstoreapp_prepare_product_query', 10, 2);

        $this->loader->add_filter('woocommerce_rest_product_cat_query', $plugin_admin, 'remove_uncategorized_category', 10, 1);

        /* For All Multi Vendor */
        $this->loader->add_action('wp_ajax_redacted-upload_image', $plugin_admin, 'uploadimage');
        $this->loader->add_action('wp_ajax_nopriv_redacted-upload_image', $plugin_admin, 'uploadimage');

        $this->loader->add_action('wp_ajax_redacted-upload_images', $plugin_admin, 'uploadimages');
        $this->loader->add_action('wp_ajax_nopriv_redacted-upload_images', $plugin_admin, 'uploadimages');

        $this->loader->add_action('wp_ajax_redacted-new_chat_message', $plugin_admin, 'flutter_new_chat_message');
        $this->loader->add_action('wp_ajax_nopriv_redacted-new_chat_message', $plugin_admin, 'flutter_new_chat_message');

        $this->loader->add_action('wp_ajax_redacted-test', $plugin_admin, 'test');
        $this->loader->add_action('wp_ajax_nopriv_redacted-test', $plugin_admin, 'test');

        $this->loader->add_action('wp_ajax_redacted-site_details', $plugin_admin, 'site_details');
        $this->loader->add_action('wp_ajax_nopriv_redacted-site_details', $plugin_admin, 'site_details');

        $this->loader->add_action('wp_ajax_redacted-product_addons', $plugin_admin, 'get_product_addons');
        $this->loader->add_action('wp_ajax_nopriv_redacted-product_addons', $plugin_admin, 'get_product_addons');

        $this->loader->add_action('wp_ajax_app_save_options', $plugin_admin, 'app_save_options');
        $this->loader->add_action('wp_ajax_nopriv_app_save_options', $plugin_admin, 'app_save_options');

        $this->loader->add_action('wp_ajax_redacted-bao_options', $plugin_admin, 'app_get_options');
        $this->loader->add_action('wp_ajax_nopriv_redacted-bao_options', $plugin_admin, 'app_get_options');

        $this->loader->add_action('wp_ajax_redacted-save_options', $plugin_admin, 'app_save_options');
        $this->loader->add_action('wp_ajax_nopriv_redacted-save_options', $plugin_admin, 'app_save_options');

        $this->loader->add_action('wp_ajax_redacted-jwt_token', $plugin_admin, 'firebase_jwt_token');
        $this->loader->add_action('wp_ajax_nopriv_redacted-jwt_token', $plugin_admin, 'firebase_jwt_token');

        $this->loader->add_action('wp_ajax_redacted-update_user_metavalue', $plugin_admin, 'update_user_meta_value');
        $this->loader->add_action('wp_ajax_nopriv_redacted-update_user_metavalue', $plugin_admin, 'update_user_meta_value');

        $this->loader->add_action('wp_ajax_redacted-order_statuses', $plugin_admin, 'get_order_statuses');
        $this->loader->add_action('wp_ajax_nopriv_redacted-order_statuses', $plugin_admin, 'get_order_statuses');

        /* This is for WC Marketplace only */
        $this->loader->add_filter('wcmp_rest_prepare_dc_vendor_object', $plugin_admin, 'mstoreapp_prepare_vendors_query', 10, 3);

        /* WC Marketplace and WCFM Same Function, Dokan Different Function. */
        $this->loader->add_filter('woocommerce_rest_shop_order_object_query', $plugin_admin, 'mstoreapp_prepare_order_query', 10, 2);

        /* For Dokan and WCFM Only */
        $this->loader->add_action('wp_ajax_redacted-update-vendor-product', $plugin_admin, 'update_vendor_product');
        $this->loader->add_action('wp_ajax_nopriv_redacted-update-vendor-product', $plugin_admin, 'update_vendor_product');

        /* For Dokan Only */
        $this->loader->add_filter('woocommerce_rest_prepare_product_object', $plugin_admin, 'mstoreapp_prepare_product', 10, 3);

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Redacted_Public( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );

		$this->loader->add_filter( 'query_vars', $plugin_public, 'add_query_vars' );

		//$this->loader->add_filter( 'woocommerce_product_query_tax_query', $plugin_public, 'update_product_query_tax_query', 10, 2 );

		$this->loader->add_action('wp_ajax_redacted-add_all_products_cart', $plugin_public, 'add_all_products_cart');
        $this->loader->add_action('wp_ajax_nopriv_redacted-add_all_products_cart', $plugin_public, 'add_all_products_cart');

        $this->loader->add_action('wp_ajax_redacted-set_user_cart', $plugin_public, 'set_user_cart');
        $this->loader->add_action('wp_ajax_nopriv_redacted-set_user_cart', $plugin_public, 'set_user_cart');

        $this->loader->add_action('wp_ajax_redacted-dotapp', $plugin_public, 'dotapp');
        $this->loader->add_action('wp_ajax_nopriv_redacted-dotapp', $plugin_public, 'dotapp');

        $this->loader->add_action('wp_ajax_redacted-keys', $plugin_public, 'keys');
        $this->loader->add_action('wp_ajax_nopriv_redacted-keys', $plugin_public, 'keys');

        $this->loader->add_action('wp_ajax_redacted-login', $plugin_public, 'login');
        $this->loader->add_action('wp_ajax_nopriv_redacted-login', $plugin_public, 'login');

        $this->loader->add_action('wp_ajax_redacted-cart', $plugin_public, 'cart');
        $this->loader->add_action('wp_ajax_nopriv_redacted-cart', $plugin_public, 'cart');

        $this->loader->add_action('wp_ajax_redacted-apply_coupon', $plugin_public, 'apply_coupon');
        $this->loader->add_action('wp_ajax_nopriv_redacted-apply_coupon', $plugin_public, 'apply_coupon');

        $this->loader->add_action('wp_ajax_redacted-test', $plugin_public, 'test');
        $this->loader->add_action('wp_ajax_nopriv_redacted-test', $plugin_public, 'test');

        $this->loader->add_action('wp_ajax_redacted-remove_coupon', $plugin_public, 'remove_coupon');
        $this->loader->add_action('wp_ajax_nopriv_redacted-remove_coupon', $plugin_public, 'remove_coupon');

        $this->loader->add_action('wp_ajax_redacted-update_shipping_method', $plugin_public, 'update_shipping_method');
        $this->loader->add_action('wp_ajax_nopriv_redacted-update_shipping_method', $plugin_public, 'update_shipping_method');

        $this->loader->add_action('wp_ajax_redacted-remove_cart_item', $plugin_public, 'remove_cart_item');
        $this->loader->add_action('wp_ajax_nopriv_redacted-remove_cart_item', $plugin_public, 'remove_cart_item');

        $this->loader->add_action('wp_ajax_redacted-get_checkout_form', $plugin_public, 'get_checkout_form');
        $this->loader->add_action('wp_ajax_nopriv_redacted-get_checkout_form', $plugin_public, 'get_checkout_form');

        $this->loader->add_action('wp_ajax_redacted-update_order_review', $plugin_public, 'update_order_review');
        $this->loader->add_action('wp_ajax_nopriv_redacted-update_order_review', $plugin_public, 'update_order_review');

        $this->loader->add_action('wp_ajax_redacted-add_to_cart', $plugin_public, 'add_to_cart');
        $this->loader->add_action('wp_ajax_nopriv_redacted-add_to_cart', $plugin_public, 'add_to_cart');

        $this->loader->add_action('wp_ajax_redacted-add_product_to_cart', $plugin_public, 'add_product_to_cart');
        $this->loader->add_action('wp_ajax_nopriv_redacted-add_product_to_cart', $plugin_public, 'add_product_to_cart');

        $this->loader->add_action('wp_ajax_redacted-payment', $plugin_public, 'payment');
        $this->loader->add_action('wp_ajax_nopriv_redacted-payment', $plugin_public, 'payment');

        $this->loader->add_action('wp_ajax_redacted-userdata', $plugin_public, 'userdata');
        $this->loader->add_action('wp_ajax_nopriv_redacted-userdata', $plugin_public, 'userdata');

        $this->loader->add_action('wp_ajax_redacted-json_search_products', $plugin_public, 'json_search_products');
        $this->loader->add_action('wp_ajax_nopriv_redacted-json_search_products', $plugin_public, 'json_search_products');

        $this->loader->add_action('wp_ajax_redacted-nonce', $plugin_public, 'nonce');
        $this->loader->add_action('wp_ajax_nopriv_redacted-nonce', $plugin_public, 'nonce');

        $this->loader->add_action('wp_ajax_redacted-passwordreset', $plugin_public, 'passwordreset');
        $this->loader->add_action('wp_ajax_nopriv_redacted-passwordreset', $plugin_public, 'passwordreset');

        $this->loader->add_action('wp_ajax_redacted-get_country', $plugin_public, 'get_country');
        $this->loader->add_action('wp_ajax_nopriv_redacted-get_country', $plugin_public, 'get_country');

        $this->loader->add_action('wp_ajax_redacted-get_wishlist', $plugin_public, 'get_wishlist');
        $this->loader->add_action('wp_ajax_nopriv_redacted-get_wishlist', $plugin_public, 'get_wishlist');

        $this->loader->add_action('wp_ajax_redacted-wishlistids', $plugin_public, 'get_wishlistids');
        $this->loader->add_action('wp_ajax_nopriv_redacted-wishlistids', $plugin_public, 'get_wishlistids');

        $this->loader->add_action('wp_ajax_redacted-update_wishlist', $plugin_public, 'update_wishlist');
        $this->loader->add_action('wp_ajax_nopriv_redacted-update_wishlist', $plugin_public, 'update_wishlist');

        //Delete
        $this->loader->add_action('wp_ajax_dotapp_get_wishlist', $plugin_public, 'fetch_wishlist');
        $this->loader->add_action('wp_ajax_nopriv_dotapp_get_wishlist', $plugin_public, 'fetch_wishlist');

        //Delete
        $this->loader->add_action('wp_ajax_redacted-remove_wishlist', $plugin_public, 'remove_wishlist');
        $this->loader->add_action('wp_ajax_nopriv_redacted-remove_wishlist', $plugin_public, 'remove_wishlist');

        $this->loader->add_action('wp_ajax_redacted-page_content', $plugin_public, 'pagecontent');
        $this->loader->add_action('wp_ajax_nopriv_redacted-page_content', $plugin_public, 'pagecontent');

        $this->loader->add_action('wp_ajax_redacted-set_fulfill_status', $plugin_public, 'set_fulfill_status');
        $this->loader->add_action('wp_ajax_nopriv_redacted-set_fulfill_status', $plugin_public, 'set_fulfill_status');

        $this->loader->add_action('wp_ajax_redacted-facebook_login', $plugin_public, 'facebook_login');
        $this->loader->add_action('wp_ajax_nopriv_redacted-facebook_login', $plugin_public, 'facebook_login');

	    $this->loader->add_action('wp_ajax_redacted-google_login', $plugin_public, 'google_login');
        $this->loader->add_action('wp_ajax_nopriv_redacted-google_login', $plugin_public, 'google_login');

	    $this->loader->add_action('wp_ajax_redacted-apple_login', $plugin_public, 'apple_login');
        $this->loader->add_action('wp_ajax_nopriv_redacted-apple_login', $plugin_public, 'apple_login');

        $this->loader->add_action('wp_ajax_redacted-otp_verification', $plugin_public, 'otp_verification');
        $this->loader->add_action('wp_ajax_nopriv_redacted-otp_verification', $plugin_public, 'otp_verification');

	    $this->loader->add_action('wp_ajax_redacted-logout', $plugin_public, 'logout');
        $this->loader->add_action('wp_ajax_nopriv_redacted-logout', $plugin_public, 'logout');

	    $this->loader->add_action('wp_ajax_redacted-emptyCart', $plugin_public, 'emptyCart');
        $this->loader->add_action('wp_ajax_nopriv_redacted-emptyCart', $plugin_public, 'emptyCart');

	    $this->loader->add_action('wp_ajax_redacted-update_user_notification', $plugin_public, 'update_user_notification');
        $this->loader->add_action('wp_ajax_nopriv_redacted-update_user_notification', $plugin_public, 'update_user_notification');

	    $this->loader->add_action('wp_ajax_redacted-email-otp', $plugin_public, 'email_otp');
        $this->loader->add_action('wp_ajax_nopriv_redacted-email-otp', $plugin_public, 'email_otp');

        $this->loader->add_action('wp_ajax_redacted-reset-user-password', $plugin_public, 'reset_user_password');
        $this->loader->add_action('wp_ajax_nopriv_redacted-reset-user-password', $plugin_public, 'reset_user_password');

        $this->loader->add_action('wp_ajax_redacted-create-user', $plugin_public, 'create_user');
        $this->loader->add_action('wp_ajax_nopriv_redacted-create-user', $plugin_public, 'create_user');

        $this->loader->add_action('wp_ajax_redacted-update-address', $plugin_public, 'update_address');
        $this->loader->add_action('wp_ajax_nopriv_redacted-update-address', $plugin_public, 'update_address');

        $this->loader->add_action('wp_ajax_redacted-get-states', $plugin_public, 'get_states');
        $this->loader->add_action('wp_ajax_nopriv_redacted-get-states', $plugin_public, 'get_states');

        $this->loader->add_action('wp_ajax_redacted-product-attributes', $plugin_public, 'product_attributes');
        $this->loader->add_action('wp_ajax_nopriv_redacted-product-attributes', $plugin_public, 'product_attributes');

        //$this->loader->add_action('wp_ajax_redacted-locations', $plugin_public, 'locations');
        //$this->loader->add_action('wp_ajax_nopriv_redacted-locations', $plugin_public, 'locations');

        $this->loader->add_action('wp_ajax_redacted-wallet', $plugin_public, 'get_wallet');
        $this->loader->add_action('wp_ajax_nopriv_redacted-wallet', $plugin_public, 'get_wallet');

        $this->loader->add_action('wp_ajax_redacted-woo_refund_key', $plugin_public, 'woo_refund_key');
        $this->loader->add_action('wp_ajax_nopriv_redacted-woo_refund_key', $plugin_public, 'woo_refund_key');

        $this->loader->add_action('wp_ajax_redacted-categories', $plugin_public, 'get_categories');
        $this->loader->add_action('wp_ajax_nopriv_redacted-categories', $plugin_public, 'get_categories');

        $this->loader->add_action('wp_ajax_redacted-products', $plugin_public, 'getProducts');
        $this->loader->add_action('wp_ajax_nopriv_redacted-products', $plugin_public, 'getProducts');

        $this->loader->add_action('wp_ajax_redacted-product', $plugin_public, 'getProduct');
        $this->loader->add_action('wp_ajax_nopriv_redacted-product', $plugin_public, 'getProduct');

        $this->loader->add_action('wp_ajax_redacted-orders', $plugin_public, 'getOrders');
        $this->loader->add_action('wp_ajax_nopriv_redacted-orders', $plugin_public, 'getOrders');

        $this->loader->add_action('wp_ajax_redacted-order', $plugin_public, 'getOrder');
        $this->loader->add_action('wp_ajax_nopriv_redacted-order', $plugin_public, 'getOrder');

        $this->loader->add_action('wp_ajax_redacted-customer', $plugin_public, 'getCustomerDetail');
        $this->loader->add_action('wp_ajax_nopriv_redacted-customer', $plugin_public, 'getCustomerDetail');

        $this->loader->add_action('wp_ajax_redacted-product_details', $plugin_public, 'getProductDetail');
        $this->loader->add_action('wp_ajax_nopriv_redacted-product_details', $plugin_public, 'getProductDetail');

        $this->loader->add_action('wp_ajax_redacted-product_reviews', $plugin_public, 'getProductReviews');
        $this->loader->add_action('wp_ajax_nopriv_redacted-product_reviews', $plugin_public, 'getProductReviews');

        $this->loader->add_action('wp_ajax_redacted-cancel_order', $plugin_public, 'cancel_order');
        $this->loader->add_action('wp_ajax_nopriv_redacted-cancel_order', $plugin_public, 'cancel_order');

        $this->loader->add_action('wp_ajax_redacted-update-cart-item-qty', $plugin_public, 'updateCartQty');
        $this->loader->add_action('wp_ajax_nopriv_redacted-update-cart-item-qty', $plugin_public, 'updateCartQty');

        $this->loader->add_action('wp_ajax_redacted-apply-vendor', $plugin_public, 'dokan_apply_for_vendor');
        $this->loader->add_action('wp_ajax_nopriv_redacted-apply-vendor', $plugin_public, 'dokan_apply_for_vendor');

        $this->loader->add_action('wp_ajax_redacted-checkout_form', $plugin_public, 'checkout_form');
        $this->loader->add_action('wp_ajax_nopriv_redacted-checkout_form', $plugin_public, 'checkout_form');

        $this->loader->add_filter( 'woocommerce_product_data_store_cpt_get_products_query', $plugin_public, 'handling_custom_meta_query_keys', 10, 3 );

        $this->loader->add_action('wp_ajax_redacted-downloads', $plugin_public, 'get_downloads');
        $this->loader->add_action('wp_ajax_nopriv_redacted-downloads', $plugin_public, 'get_downloads');

        $this->loader->add_action('wp_ajax_fcm_details', $plugin_public, 'fcm_details');
        $this->loader->add_action('wp_ajax_nopriv_fcm_details', $plugin_public, 'fcm_details');

        $this->loader->add_action('wp_ajax_redacted-store_details', $plugin_public, 'store_details');
        $this->loader->add_action('wp_ajax_nopriv_redacted-store_details', $plugin_public, 'store_details');

        $this->loader->add_action('wp_ajax_redacted-design_app_details', $plugin_public, 'design_app_details');
        $this->loader->add_action('wp_ajax_nopriv_redacted-design_app_details', $plugin_public, 'design_app_details');

        $this->loader->add_action('wp_ajax_redacted-taxonomy', $plugin_public, 'blocks_taxonomy');
        $this->loader->add_action('wp_ajax_nopriv_redacted-taxonomy', $plugin_public, 'blocks_taxonomy');

        $this->loader->add_action('wp_ajax_redacted-myblocks', $plugin_public, 'bao_my_blocks');
        $this->loader->add_action('wp_ajax_nopriv_redacted-myblocks', $plugin_public, 'bao_my_blocks');

        $this->loader->add_action('wp_ajax_redacted-block', $plugin_public, 'get_blocks');
        $this->loader->add_action('wp_ajax_nopriv_redacted-block', $plugin_public, 'get_blocks');

        $this->loader->add_action('wp_ajax_redacted-delete_my_account', $plugin_public, 'delete_my_account');
        $this->loader->add_action('wp_ajax_nopriv_redacted-delete_my_account', $plugin_public, 'delete_my_account');

        //$this->loader->add_filter('woocommerce_login_redirect', $plugin_public, 'wc_custom_user_redirect', 101, 3);

        //---REWARD POINTS--------/
        $this->loader->add_action('wp_ajax_redacted-ajax_maybe_apply_discount', $plugin_public, 'ajax_maybe_apply_discount');
        $this->loader->add_action('wp_ajax_nopriv_redacted-ajax_maybe_apply_discount', $plugin_public, 'ajax_maybe_apply_discount');

		$this->loader->add_action('wp_ajax_redacted-getPointsHistory', $plugin_public, 'getPointsHistory');
        $this->loader->add_action('wp_ajax_nopriv_redacted-getPointsHistory', $plugin_public, 'getPointsHistory');

        $plugin_multivendor = new Redacted_Multivendor( $this->get_plugin_name(), $this->get_version() );

        $this->loader->add_filter( 'posts_clauses', $plugin_multivendor, 'mstoreapp_location_filter', 99, 2);

        //For WC Marketplace geo user query
        $this->loader->add_action( 'pre_user_query', $plugin_multivendor, 'geo_location_user_query', 99, 1  );

        $this->loader->add_action( 'pre_get_users', $plugin_multivendor, 'pre_get_users', 99, 1  );

        $this->loader->add_action('wp_ajax_redacted-vendor_reviews', $plugin_multivendor, 'get_vendor_reviews');
        $this->loader->add_action('wp_ajax_nopriv_redacted-vendor_reviews', $plugin_multivendor, 'get_vendor_reviews');

        $this->loader->add_action('wp_ajax_redacted-vendor_details', $plugin_multivendor, 'get_vendor_details');
        $this->loader->add_action('wp_ajax_nopriv_redacted-vendor_details', $plugin_multivendor, 'get_vendor_details');

	    $this->loader->add_action('wp_ajax_redacted-vendors', $plugin_multivendor, 'get_vendors');
        $this->loader->add_action('wp_ajax_nopriv_redacted-vendors', $plugin_multivendor, 'get_vendors');

        $this->loader->add_action('wp_ajax_redacted-contact_vendor', $plugin_multivendor, 'contact_vendor');
        $this->loader->add_action('wp_ajax_nopriv_redacted-contact_vendor', $plugin_multivendor, 'contact_vendor');

        $this->loader->add_action('wp_ajax_redacted-add_vendor_review', $plugin_multivendor, 'add_vendor_review');
        $this->loader->add_action('wp_ajax_nopriv_redacted-add_vendor_review', $plugin_multivendor, 'add_vendor_review');

        $this->loader->add_action('wp_ajax_redacted-vendor_categories', $plugin_multivendor, 'getVendorCategories');
        $this->loader->add_action('wp_ajax_nopriv_redacted-vendor_categories', $plugin_multivendor, 'getVendorCategories');

        $this->loader->add_action('wp_ajax_redacted-update_user_meta', $plugin_public, 'update_user_meta');
        $this->loader->add_action('wp_ajax_nopriv_redacted-update_user_meta', $plugin_public, 'update_user_meta');

	}

	private function define_payments_hooks() {

		$plugin_payments = new Redacted_Payments( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action('wp_ajax_dotapp_verify_payment', $plugin_payments, 'verify_payment');
        $this->loader->add_action('wp_ajax_nopriv_dotapp_verify_payment', $plugin_payments, 'verify_payment');

        $this->loader->add_action('wp_ajax_redacted_razorpay_order_id', $plugin_payments, 'get_razorpay_order_id');
        $this->loader->add_action('wp_ajax_nopriv_redacted_razorpay_order_id', $plugin_payments, 'get_razorpay_order_id');

	}

	private function define_booking_hooks() {

		$plugin_booking = new Redacted_Booking( $this->get_plugin_name(), $this->get_version() );

        //UnComment Only for Booking
        $this->loader->add_filter('woocommerce_rest_prepare_shop_order_object', $plugin_booking, 'mstoreapp_prepare_order', 10, 3);

	    $this->loader->add_action('wp_ajax_redacted-get_booking', $plugin_booking, 'get_booking');
        $this->loader->add_action('wp_ajax_nopriv_redacted-get_booking', $plugin_booking, 'get_booking');

        $this->loader->add_action('wp_ajax_redacted-create_booking', $plugin_booking, 'create_booking');
        $this->loader->add_action('wp_ajax_nopriv_redacted-create_booking', $plugin_booking, 'create_booking');

        $this->loader->add_action('wp_ajax_redacted-user_booking', $plugin_booking, 'get_user_booking');
        $this->loader->add_action('wp_ajax_nopriv_redacted-user_booking', $plugin_booking, 'get_user_booking');

	}

	private function define_blog_hooks() {

		$plugin_blog = new Redacted_Blog_Public( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action('wp_ajax_redacted-blog-posts', $plugin_blog, 'get_posts');
        $this->loader->add_action('wp_ajax_nopriv_redacted-blog-posts', $plugin_blog, 'get_posts');

        $this->loader->add_action('wp_ajax_redacted-blog-design_app_details', $plugin_blog, 'design_app_details');
        $this->loader->add_action('wp_ajax_nopriv_redacted-blog-design_app_details', $plugin_blog, 'design_app_details');

		$this->loader->add_action('wp_ajax_redacted-blog-details', $plugin_blog, 'app_details');
        $this->loader->add_action('wp_ajax_nopriv_redacted-blog-details', $plugin_blog, 'app_details');

        $this->loader->add_action('wp_ajax_redacted-blog-login', $plugin_blog, 'login');
        $this->loader->add_action('wp_ajax_nopriv_redacted-blog-login', $plugin_blog, 'login');

        $this->loader->add_action( 'save_post', $plugin_blog, 'save_new_post', 10, 3  );

        $this->loader->add_action('wp_ajax_redacted-blog-site_details', $plugin_blog, 'site_details');
        $this->loader->add_action('wp_ajax_nopriv_redacted-blog-site_details', $plugin_blog, 'site_details');

        $this->loader->add_action('wp_ajax_redacted-blog-save_options', $plugin_blog, 'app_save_options');
        $this->loader->add_action('wp_ajax_nopriv_redacted-blog-save_options', $plugin_blog, 'app_save_options');

		$this->loader->add_action('wp_ajax_redacted-blog-fcm_details', $plugin_blog, 'fcm_details');
        $this->loader->add_action('wp_ajax_nopriv_redacted-blog-fcm_details', $plugin_blog, 'fcm_details');

        $this->loader->add_action('wp_ajax_redacted-blog-get_bookmark', $plugin_blog, 'get_bookmark');
        $this->loader->add_action('wp_ajax_nopriv_redacted-blog-get_bookmark', $plugin_blog, 'get_bookmark');

        $this->loader->add_action('wp_ajax_redacted-blog-bookmarkids', $plugin_blog, 'get_bookmarkids');
        $this->loader->add_action('wp_ajax_nopriv_redacted-blog-bookmarkids', $plugin_blog, 'get_bookmarkids');

        $this->loader->add_action('wp_ajax_redacted-blog-update_bookmark', $plugin_blog, 'update_bookmark');
        $this->loader->add_action('wp_ajax_nopriv_redacted-blog-update_bookmark', $plugin_blog, 'update_bookmark');

        $this->loader->add_action('wp_ajax_redacted-blog-myblocks', $plugin_blog, 'bao_my_blocks');
        $this->loader->add_action('wp_ajax_nopriv_redacted-blog-myblocks', $plugin_blog, 'bao_my_blocks');

        $this->loader->add_action('wp_ajax_redacted-blog-block', $plugin_blog, 'get_blocks');
        $this->loader->add_action('wp_ajax_nopriv_redacted-blog-block', $plugin_blog, 'get_blocks');

	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Redacted_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
