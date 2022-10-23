<?php

/**
 * Fired during plugin deactivation
 *
 * @link       https://redacted.online
 * @since      1.0.0
 *
 * @package    Redacted
 * @subpackage Redacted/includes
 */

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.0.0
 * @package    Redacted
 * @subpackage Redacted/includes
 * @author     Redacted
 */
class Redacted_Deactivator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function deactivate() {

	  // Remove the rewrite rule on deactivation
	  global $wp_rewrite;
	  $wp_rewrite->flush_rules();

	}

}
