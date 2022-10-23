<?php
/**
 * Plugin Name: Mal Plugin
 * Description: Vulnerable plugin for talk "Greedy for SQL Injection: how we found them on scale"
 * Version: 0.2
 * Author: Donato Di Pasquale & Francesco Marano
 * Authors URI: https://www.linkedin.com/in/ddipa
 * Authors URI: https://www.linkedin.com/in/mrnfrancesco
 */

// If this file is called directly, abort.
if (!defined( 'ABSPATH' )) {
	die;
}

add_action( 'init', 'register_actions' );

function register_actions() {
    add_action('wp_ajax_echo', 'echo_callback');
    add_action('wp_ajax_nopriv_echo', 'echo_callback');

    add_action('wp_ajax_sqli', 'sqli_callback');
    add_action('wp_ajax_nopriv_sqli', 'sqli_callback');
}

function echo_callback() {

    echo "<h1>{$_GET['string']}</h1>";
    wp_die();
}

function sqli_callback() {

    global $wpdb;

    $user_id = isset($_GET['id']) ? $_GET['id'] : 0;

    $sql  = "SELECT user_login FROM {$wpdb->prefix}users ";
    $sql .= "WHERE ID={$user_id}";

    $result = $wpdb->get_row($sql);
    if ( !empty($result) ) {
        echo "<h1>{$result->user_login}</h1>";
    } else {
        echo "<h1>No user found with ID {$user_id}</h1> " . `date`;
    }
    wp_die();
}
