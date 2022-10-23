<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://redacted.online
 * @since      1.0.0
 *
 * @package    Redacted
 * @subpackage Redacted/Booking
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Redacted
 * @subpackage Redacted/Booking
 * @author     Redacted
 */
class Redacted_Booking
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

    public function mstoreapp_prepare_order( $response, $object, $request ) {

        if ( ! function_exists( 'is_plugin_active' ) ) {
            include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
        }

        if(is_plugin_active( 'woocommerce-bookings/woocommerce-bookings.php' )) {
            foreach ($response->data['line_items'] as $key => $value) {
                $item_id = $value['id'];
                $booking_ids = WC_Booking_Data_Store::get_booking_ids_from_order_item_id( $item_id );

                foreach ($booking_ids as $booking_id) {
                    $booking = new WC_Booking( $booking_id );

                    $response->data['line_items'][$key]['booking'][] = array(
                        'status' => $booking->get_status(),
                        'start' => $booking->get_start(),
                        'end' => $booking->get_end(),
                    );
                }
            }
        }

        return $response;

    }

    public static function get_booking() {

        //error_reporting(E_ALL);
        //ini_set('display_errors', '1');

        $product_id = absint($_REQUEST['product_id']);

        $bookable_product = new WC_Product_Booking($product_id);

        $blocks = $bookable_product->get_blocks_in_range(current_time( 'timestamp' ), current_time( 'timestamp' ) + 60*60*24*30, '', $product_id, '');

        $available_blocks = $bookable_product->get_available_blocks($blocks, array(), 0, current_time( 'timestamp' ), current_time( 'timestamp' ) + 60*60*24*30);

        $data = array();

        foreach ( $available_blocks as $key => $field ) {

          if('day' == $bookable_product->get_duration_unit()){
            $data['slots'][] = esc_attr( date( 'd-M-Y', $field ) ); //For Day Booking
            $data['booking_slots'][] = $field;
          }

          if('month' == $bookable_product->get_duration_unit()){
            $data['slots'][] = esc_attr( date( 'M-Y', $field ) ); //For Day Booking
            $data['booking_slots'][] = $field;
          }

          if('hour' == $bookable_product->get_duration_unit()){
            $data['slots'][] = esc_attr( date( 'd-M H:i Y', $field ) ); // For Hour Booking
            $data['booking_slots'][] = $field;
          }

          if($bookable_product->get_duration_unit() == 'minute'){
            $data->slots[] = esc_attr( date( 'd-M H:i Y', $field ) ); // For TimeSlot Booking
            $data['booking_slots'][] = $field;
          }

        }

        $data['duration'] = $bookable_product->get_duration();

        $data['duration_unit'] = $bookable_product->get_duration_unit();

        $data['duration_type'] = $bookable_product->get_duration_type();

        $data['min_duration'] = $bookable_product->get_min_duration();

        $data['max_duration'] = $bookable_product->get_max_duration();

        $data['qty'] = $bookable_product->get_qty();

        $data['has_persons'] = $bookable_product->has_persons();

        $data['min_persons'] = $bookable_product->get_min_persons();

        $data['max_persons'] = $bookable_product->get_max_persons();

        wp_send_json( $data );
        die();
    }

    public function create_booking() {

        global $woocommerce;
        $this->errors = array();
        $step         = 1;
        $message = array();

            if ( ! empty( $_POST['create_booking_2'] && isset($_POST['customer_id']) && isset($_POST['bookable_product_id'])) ) {
                $customer_id         = absint($_POST['customer_id']);
                $bookable_product_id = absint($_POST['bookable_product_id']);
                $booking_order       = 'new';
                $product            = wc_get_product( $bookable_product_id );
                $booking_form        = new WC_Booking_Form( $product );

                $booking_form->prepare_fields();

                $booking_data        = $booking_form->get_posted_data( $_POST );

                $booking_cost        = ( $cost = $booking_form->calculate_booking_cost( $_POST ) ) ? number_format( $cost, 2, '.', '' ) : 0;

                $create_order        = false;
                $order_id            = 0;
                $item_id             = 0;

                if ( 'yes' === get_option( 'woocommerce_prices_include_tax' ) ) {
                    $base_tax_rates = WC_Tax::get_base_tax_rates( $product->get_tax_class() );
                    $base_taxes     = WC_Tax::calc_tax( $booking_cost, $base_tax_rates, true );
                    $booking_cost   = round( $booking_cost - array_sum( $base_taxes ), absint( get_option( 'woocommerce_price_num_decimals' ) ) );
                }

                $props = array(
                    'customer_id'   => $customer_id,
                    'product_id'    => is_callable( array( $product, 'get_id' ) ) ? $product->get_id() : $product->id,
                    'resource_id'   => isset( $booking_data['_resource_id'] ) ? $booking_data['_resource_id'] : '',
                    'person_counts' => $booking_data['_persons'],
                    'cost'          => $booking_cost,
                    'start'         => $booking_data['_start_date'],
                    'end'           => $booking_data['_end_date'],
                    'all_day'       => $booking_data['_all_day'] ? true : false,
                );

                if ( 'new' === $booking_order ) {
                    $create_order = true;
                    $order_id     = $this->create_order( $booking_cost, $customer_id );

                    if ( ! $order_id ) {
                        $message['status'] = false;
                        $message['message'] = 'Could not create order';
                        wp_send_json( $message );
                    }
                } elseif ( $booking_order > 0 ) {
                    $order_id = absint( $booking_order );

                    if ( ! $order_id || get_post_type( $order_id ) !== 'shop_order' ) {
                        $message['status'] = false;
                        $message['message'] = 'Invalid order ID provided';
                        wp_send_json( $message );
                    }

                    $order = new WC_Order( $order_id );

                    if ( version_compare( WC_VERSION, '3.0', '<' ) ) {
                        update_post_meta( $order_id, '_order_total', $order->get_total() + $booking_cost );
                    } else {
                        $order->set_total( $order->get_total( 'edit' ) + $booking_cost );
                        $order->save();
                    }

                    do_action( 'woocommerce_bookings_create_booking_page_add_order_item', $order_id );
                }

                if ( $order_id ) {
                    $item_id  = wc_add_order_item( $order_id, array(
                        'order_item_name' => $product->get_title(),
                        'order_item_type' => 'line_item',
                    ) );

                    if ( ! $item_id ) {
                        $message['status'] = false;
                        $message['message'] = 'Could not create item';
                        wp_send_json( $message );
                    }

                    // set order address
                    $order = wc_get_order( $order_id );
                    $keys  = array(
                        'first_name',
                        'last_name',
                        'company',
                        'address_1',
                        'address_2',
                        'city',
                        'state',
                        'postcode',
                        'country',
                    );
                    $types = array( 'shipping', 'billing' );

                    foreach ( $types as $type ) {
                        $address = array();

                        foreach ( $keys as $key ) {
                            $address[ $key ] = (string) get_user_meta( $customer_id, $type . '_' . $key, true );
                        }
                        $order->set_address( $address, $type );
                    }

                    // Add line item meta
                    wc_add_order_item_meta( $item_id, '_qty', 1 );
                    wc_add_order_item_meta( $item_id, '_tax_class', $product->get_tax_class() );
                    wc_add_order_item_meta( $item_id, '_product_id', $product->get_id() );
                    wc_add_order_item_meta( $item_id, '_variation_id', '' );
                    wc_add_order_item_meta( $item_id, '_line_subtotal', $booking_cost );
                    wc_add_order_item_meta( $item_id, '_line_total', $booking_cost );
                    wc_add_order_item_meta( $item_id, '_line_tax', 0 );
                    wc_add_order_item_meta( $item_id, '_line_subtotal_tax', 0 );

                    do_action( 'woocommerce_bookings_create_booking_page_add_order_item', $order_id );
                }
                // Calculate the order totals with taxes.
                $order = wc_get_order( $order_id );
                if ( is_a( $order, 'WC_Order' ) ) {
                    $order->calculate_totals( wc_tax_enabled() );
                }

                // Create the booking itself
                $new_booking = new WC_Booking( $props );
                $new_booking->set_order_id( $order_id );
                $new_booking->set_order_item_id( $item_id );
                $new_booking->set_status( $create_order ? 'unpaid' : 'confirmed' );
                $new_booking->save();

                $message['status'] = true;
                $message['message'] = 'Booking Order Created';
                wp_send_json( $message );
                exit;
            }
    }

    /**
     * Create order.
     *
     * @param  float $total
     * @param  int $customer_id
     * @return int
     */
    public function create_order( $total, $customer_id ) {
        if ( version_compare( WC_VERSION, '3.0', '<' ) ) {
            $order = wc_create_order( array(
                'customer_id' => absint( $customer_id ),
            ) );
            $order_id = $order->id;
            $order->set_total( $total );
            update_post_meta( $order->id, '_created_via', 'bookings' );
        } else {
            $order = new WC_Order();
            $order->set_customer_id( $customer_id );
            $order->set_total( $total );
            $order->set_created_via( 'bookings' );
            $order_id = $order->save();
        }

        do_action( 'woocommerce_new_booking_order', $order_id );

        return $order_id;
    }

    /**
     * Output any errors
     */
    public function show_errors() {
        foreach ( $this->errors as $error ) {
            echo '<div class="error"><p>' . esc_html( $error ) . '</p></div>';
        }
    }

    /**
     * Use default template form from the extension.
     *
     * This prevents any overridden template via theme being used in
     * create booking screen.
     *
     * @since 1.9.11
     * @see https://github.com/woothemes/woocommerce-bookings/issues/773
     */
    public function use_default_form_template( $located, $template_name, $args, $template_path, $default_path ) {
        if ( 'woocommerce-bookings' === $template_path ) {
            $located = $default_path . $template_name;
        }
        return $located;
    }


    public static function get_user_booking() {



        $args = array(
          'limit'  => 10,
          'offset'  => isset( $_REQUEST['page'] ) ? absint($_REQUEST['page']) * 10 : 0//$_REQUEST['offset'];
        );

        $user_id = get_current_user_id();

        $cls = new WC_Bookings_Controller();
        $bookings = $cls->get_bookings_for_user($user_id, $args);

        $data = array();
        foreach ( $bookings as $booking ) {
            $data[] = array(
                'id' => $booking->get_id(),
                'order_id' => $booking->get_order()->get_order_number(),
                'product_title' => $booking->get_product()->get_title(),
                'product_id' => $booking->get_product()->get_id(),
                'start_date' => $booking->get_start_date(),
                'end_date' => $booking->get_end_date(),
                'status' => wc_bookings_get_status_label( $booking->get_status() ),
                'calcel_url' => $booking->get_cancel_url()
            );
        }

        wp_send_json( $data );

    }

}
