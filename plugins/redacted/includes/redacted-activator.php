<?php

/**
 * Fired during plugin activation
 *
 * @link       https://redacted.online
 * @since      1.0.0
 *
 * @package    Redacted
 * @subpackage Redacted/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Redacted
 * @subpackage Redacted/includes
 * @author     Redacted
 */
class Redacted_Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {

	  // Add the rewrite rule on activation

		global $wpdb;
	    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

	    $charset_collate = '';
	    if (!empty($wpdb->charset)){
	        $charset_collate = "DEFAULT CHARACTER SET $wpdb->charset";
	    }else{
	        $charset_collate = "DEFAULT CHARSET=utf8";
	    }
	    if (!empty($wpdb->collate)){
	        $charset_collate .= " COLLATE $wpdb->collate";
	    }

	    $table_name = $wpdb->prefix . "mstoreapp_wishlist";

	    $lk_tbl_sql = "CREATE TABLE " . $table_name . " (
	              id bigint(20) unsigned NOT NULL auto_increment,
	              customer_id int NOT NULL,
	              product_id int NOT NULL,
	              PRIMARY KEY (id)
	              )" . $charset_collate . ";";
	    dbDelta($lk_tbl_sql);

	    $wpdb->query("CREATE UNIQUE INDEX index_name ON $table_name(customer_id, product_id)");

	}

}
