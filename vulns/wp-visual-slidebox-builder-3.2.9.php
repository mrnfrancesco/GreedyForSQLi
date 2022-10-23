<?php

// wp-visual-slidebox-builder/vsbb-plugin.php

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

// wp-visual-slidebox-builder/vsbb-plugin.php

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
