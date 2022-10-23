<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://redacted.online
 * @since      1.0.0
 *
 * @package    Redacted
 * @subpackage Redacted/Payments
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Redacted
 * @subpackage Redacted/Payments
 * @author     Redacted
 */
class Redacted_Payments
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

    public function verify_payment() {

        if ( isset( $_REQUEST['reference'] ) ) {
            $reference = sanitize_text_field( $_REQUEST['reference'] );
        } elseif ( isset( $_REQUEST['reference'] ) ) {
            $reference = sanitize_text_field( $_REQUEST['reference'] );
        } else {
            $this->send_error();
        }

        $order_id      = (int) $reference;
        $order         = wc_get_order( $order_id );

        switch ($order->payment_method) {
            case 'paystack':
                return $this->verify_paystack_transaction($reference);
                break;
            case 'paytm':
                return $this->verify_paytm_transaction($reference);
                break;
            case 'razorpay':
                return $this->verify_razorpay_transaction($reference);
                break;
            case 'cashfree':
                return $this->verify_cashfree_transaction($reference);
                break;
            default:
                $this->send_error();
        }
    }

    /**
     * Verify Paystack payment.
     */
    public function verify_cashfree_transaction($reference) {

        $order_id = $_REQUEST['order_id'];
        $order = wc_get_order( $order_id );

        if ( $order && $order->needs_payment() ) {
            try {
                $post_data['order_status'] = 'PAID';
                //$post_data['transaction_msg'] = $_REQUEST['txMsg'];
                //$this->adapter->notify( $post_data );
                $order->payment_complete( $_REQUEST['reference'] );
                $order->add_order_note(
                    sprintf(
                        __( 'Webhook - Cashfree payment successful <br/>Transaction Id: %1$s.', 'cashfree' ),
                        $post_data['referenceId']
                    )
                );

                WC()->cart->empty_cart();
                wp_send_json(array('status' => 'success'));


            } catch ( Exception $e ) {
                WC_Cashfree::log( 'notify : ' . $e->getMessage(), 'critical' );
            }
        }
    }

    /**
     * Verify Paystack payment.
     */
    public function verify_paytm_transaction($reference) {}

    /**
     * Verify Paystack payment.
     */
    public function verify_razorpay_transaction($reference) {}

    /**
     * Verify Paystack payment.
     */
    public function verify_paystack_transaction($reference) {


        //$reference = 420;

        $settings  = get_option( 'woocommerce_paystack_settings', "" );

        if(isset($settings['enabled'])) {

            if($settings['testmode'] == 'yes') {
                $secret_key = $settings['test_secret_key'];
                $public_key = $settings['test_public_key'];
            } else {
                $secret_key = $settings['live_secret_key'];
                $public_key = $settings['live_public_key'];
            }

            if ( $reference ) {

                $settings  = get_option( 'woocommerce_paystack_settings', '' );

                $paystack_url = 'https://api.paystack.co/transaction/verify/' . $reference;

                $headers = array(
                    'Authorization' => 'Bearer ' . $secret_key,
                );

                $args = array(
                    'headers' => $headers,
                    'timeout' => 60,
                );

                $request = wp_remote_get( $paystack_url, $args );

                $paystack_response = json_decode( wp_remote_retrieve_body( $request ) );

                if ( ! is_wp_error( $request ) && 200 === wp_remote_retrieve_response_code( $request ) ) {


                    if ( 'success' == $paystack_response->data->status ) {

                        //$order_details = explode( '_', $paystack_response->data->reference );
                        $order_id      = (int) $reference;
                        $order         = wc_get_order( $order_id );

                        if ( in_array( $order->get_status(), array( 'processing', 'completed', 'on-hold' ) ) ) {

                            wp_send_json($paystack_response);

                            exit;

                        }


                        $order_total      = $order->get_total();
                        $order_currency   = method_exists( $order, 'get_currency' ) ? $order->get_currency() : $order->get_order_currency();
                        $currency_symbol  = get_woocommerce_currency_symbol( $order_currency );
                        $amount_paid      = $paystack_response->data->amount / 100;
                        $paystack_ref     = $paystack_response->data->reference;
                        $payment_currency = strtoupper( $paystack_response->data->currency );
                        $gateway_symbol   = get_woocommerce_currency_symbol( $payment_currency );

                        // check if the amount paid is equal to the order amount.
                        if ( $amount_paid < $order_total ) {

                            $order->update_status( 'on-hold', '' );

                            add_post_meta( $order_id, '_transaction_id', $paystack_ref, true );

                            $notice      = sprintf( __( 'Thank you for shopping with us.%1$sYour payment transaction was successful, but the amount paid is not the same as the total order amount.%2$sYour order is currently on hold.%3$sKindly contact us for more information regarding your order and payment status.', 'woo-paystack' ), '<br />', '<br />', '<br />' );
                            $notice_type = 'notice';

                            // Add Customer Order Note
                            $order->add_order_note( $notice, 1 );

                            // Add Admin Order Note
                            $admin_order_note = sprintf( __( '<strong>Look into this order</strong>%1$sThis order is currently on hold.%2$sReason: Amount paid is less than the total order amount.%3$sAmount Paid was <strong>%4$s (%5$s)</strong> while the total order amount is <strong>%6$s (%7$s)</strong>%8$s<strong>Paystack Transaction Reference:</strong> %9$s', 'woo-paystack' ), '<br />', '<br />', '<br />', $currency_symbol, $amount_paid, $currency_symbol, $order_total, '<br />', $paystack_ref );
                            $order->add_order_note( $admin_order_note );

                            function_exists( 'wc_reduce_stock_levels' ) ? wc_reduce_stock_levels( $order_id ) : $order->reduce_order_stock();

                            wc_add_notice( $notice, $notice_type );

                        } else {

                            if ( $payment_currency !== $order_currency ) {

                                $order->update_status( 'on-hold', '' );

                                update_post_meta( $order_id, '_transaction_id', $paystack_ref );

                                $notice      = sprintf( __( 'Thank you for shopping with us.%1$sYour payment was successful, but the payment currency is different from the order currency.%2$sYour order is currently on-hold.%3$sKindly contact us for more information regarding your order and payment status.', 'woo-paystack' ), '<br />', '<br />', '<br />' );
                                $notice_type = 'notice';

                                // Add Customer Order Note
                                $order->add_order_note( $notice, 1 );

                                // Add Admin Order Note
                                $admin_order_note = sprintf( __( '<strong>Look into this order</strong>%1$sThis order is currently on hold.%2$sReason: Order currency is different from the payment currency.%3$sOrder Currency is <strong>%4$s (%5$s)</strong> while the payment currency is <strong>%6$s (%7$s)</strong>%8$s<strong>Paystack Transaction Reference:</strong> %9$s', 'woo-paystack' ), '<br />', '<br />', '<br />', $order_currency, $currency_symbol, $payment_currency, $gateway_symbol, '<br />', $paystack_ref );
                                $order->add_order_note( $admin_order_note );

                                function_exists( 'wc_reduce_stock_levels' ) ? wc_reduce_stock_levels( $order_id ) : $order->reduce_order_stock();

                                wc_add_notice( $notice, $notice_type );

                            } else {

                                $order->payment_complete( $paystack_ref );
                                $order->add_order_note( sprintf( __( 'Payment via Paystack successful (Transaction Reference: %s)', 'woo-paystack' ), $paystack_ref ) );

                                if ( $this->is_autocomplete_order_enabled( $order ) ) {
                                    $order->update_status( 'completed' );
                                }
                            }
                        }

                        $this->save_card_details( $paystack_response, $order->get_user_id(), $order_id, $settings['saved_cards'] );

                        WC()->cart->empty_cart();

                    } else {

                        $order_id = (int) $reference;

                        $order = wc_get_order( $order_id );

                        $order->update_status( 'failed', __( 'Payment was declined by Paystack.', 'woo-paystack' ) );

                    }
                }

                wp_send_json($paystack_response);

                exit;
            }

        }

        wp_send_json(array(
            'status' => false,
            'message' => 'Unknown error'
        ));;

        exit;

    }

        /**
     * Save Customer Card Details.
     *
     * @param $paystack_response
     * @param $user_id
     * @param $order_id
     */
    public function save_card_details( $paystack_response, $user_id, $order_id, $saved_cards ) {

        $this->save_subscription_payment_token( $order_id, $paystack_response );

        $save_card = get_post_meta( $order_id, '_wc_paystack_save_card', true );

        if ( $user_id && $saved_cards && $save_card && $paystack_response->data->authorization->reusable && 'card' == $paystack_response->data->authorization->channel ) {

            $order = wc_get_order( $order_id );

            $gateway_id = $order->get_payment_method();

            $last4     = $paystack_response->data->authorization->last4;
            $exp_year  = $paystack_response->data->authorization->exp_year;
            $brand     = $paystack_response->data->authorization->card_type;
            $exp_month = $paystack_response->data->authorization->exp_month;
            $auth_code = $paystack_response->data->authorization->authorization_code;

            $token = new WC_Payment_Token_CC();
            $token->set_token( $auth_code );
            $token->set_gateway_id( $gateway_id );
            $token->set_card_type( strtolower( $brand ) );
            $token->set_last4( $last4 );
            $token->set_expiry_month( $exp_month );
            $token->set_expiry_year( $exp_year );
            $token->set_user_id( $user_id );
            $token->save();

            delete_post_meta( $order_id, '_wc_paystack_save_card' );

        }

    }

    /**
     * Save payment token to the order for automatic renewal for further subscription payment.
     *
     * @param $order_id
     * @param $paystack_response
     */
    public function save_subscription_payment_token( $order_id, $paystack_response ) {

        if ( ! function_exists( 'wcs_order_contains_subscription' ) ) {
            return;
        }

        if ( $this->order_contains_subscription( $order_id ) && $paystack_response->data->authorization->reusable && 'card' == $paystack_response->data->authorization->channel ) {

            $auth_code = $paystack_response->data->authorization->authorization_code;

            // Also store it on the subscriptions being purchased or paid for in the order
            if ( function_exists( 'wcs_order_contains_subscription' ) && wcs_order_contains_subscription( $order_id ) ) {

                $subscriptions = wcs_get_subscriptions_for_order( $order_id );

            } elseif ( function_exists( 'wcs_order_contains_renewal' ) && wcs_order_contains_renewal( $order_id ) ) {

                $subscriptions = wcs_get_subscriptions_for_renewal_order( $order_id );

            } else {

                $subscriptions = array();

            }

            foreach ( $subscriptions as $subscription ) {

                $subscription_id = $subscription->get_id();

                update_post_meta( $subscription_id, '_paystack_token', $auth_code );

            }
        }

    }

    /**
     * Checks if autocomplete order is enabled for the payment method.
     *
     * @since 5.7
     * @param WC_Order $order Order object.
     * @return bool
     */
    protected function is_autocomplete_order_enabled( $order ) {
        $autocomplete_order = false;

        $payment_method = $order->get_payment_method();

        $paystack_settings = get_option('woocommerce_' . $payment_method . '_settings');

        if ( isset( $paystack_settings['autocomplete_order'] ) && 'yes' === $paystack_settings['autocomplete_order'] ) {
            $autocomplete_order = true;
        }

        return $autocomplete_order;
    }

    public function send_error() {
        wp_send_json(array(
            'status' => false,
            'message' => 'Unknown error'
        ));
    }

    public function get_razorpay_order_id() {
        $razorpay = new WC_Razorpay(false);
        $order_id = $_REQUEST['order_id'];
        $rzp_order_id = $razorpay->createOrGetRazorpayOrderId($order_id, 'yes');
        wp_send_json($rzp_order_id);
    }

}
