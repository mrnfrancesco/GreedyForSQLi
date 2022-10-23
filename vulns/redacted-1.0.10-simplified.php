<?php

// redacted/includes/redacted-loader.php

class Redacted_Loader {

    protected $actions;

	public function add_action( $hook, $component, $callback, $priority = 10, $accepted_args = 1 ) {
		$this->actions = $this->add( $this->actions, $hook, $component, $callback, $priority, $accepted_args );
	}

    private function add( $hooks, $hook, $component, $callback, $priority, $accepted_args ) {

		$hooks[] = array(
			'hook'          => $hook,
			'component'     => $component,
			'callback'      => $callback,
			'priority'      => $priority,
			'accepted_args' => $accepted_args
		);

		return $hooks;

	}

	public function run() {

		foreach ( $this->actions as $hook ) {
			add_action( $hook['hook'], array( $hook['component'], $hook['callback'] ), $hook['priority'], $hook['accepted_args'] );
		}
	}
}


// redacted/includes/redacted.php

class Redacted {

    protected $loader;

    public function __construct() {

		$this->load_dependencies();
        $this->define_admin_hooks();
    }

    private function load_dependencies() {

        $this->loader = new Redacted_Loader();
    }

    private function define_admin_hooks() {

        $this->loader->add_action('wp_ajax_redacted-vendor_reviews', $plugin_multivendor, 'get_vendor_reviews');
        $this->loader->add_action('wp_ajax_nopriv_redacted-vendor_reviews', $plugin_multivendor, 'get_vendor_reviews');
    }
}


// redacted/public/redacted-multivendor.php

class Redacted_Multivendor
{
    function which_vendor() {

        if(is_plugin_active( 'wc-multivendor-marketplace/wc-multivendor-marketplace.php' )){
            return 'wcfm';
        }
    }

    function get_vendor_reviews() {

      if(isset($_REQUEST['vendor'])) {
        $vendor_id = absint($_REQUEST['vendor']);

        switch ($this->which_vendor()) {
          case 'wcfm':
            return $this->get_wcfm_vendor_reviews($vendor_id);
        }
      }
    }
}

// redacted/public/redacted-multivendor.php

class Redacted_Multivendor
{
    function get_wcfm_vendor_reviews($vendor_id){
        global $wpdb;

        $vendor_id = $_REQUEST['vendor'];
        $the_orderby = $_REQUEST['orderby'];
        $reviews_vendor = $_POST['reviews_vendor'];

        $reviews_vendor_filter = '';
        if( $vendor_id ) {
            $reviews_vendor_filter = " AND `vendor_id` = $vendor_id";
        } elseif ( $reviews_vendor ) {
            $reviews_vendor_filter = " AND `vendor_id` = $reviews_vendor";
        }

        $sql = "SELECT * from wp_wcfm_marketplace_reviews";
        $sql .= " WHERE 1=1";
        $sql .= $reviews_vendor_filter;
        $sql .= " ORDER BY `{$the_orderby}` ASC";

        $wcfm_reviews_array = $wpdb->get_results($sql);
        wp_send_json($wcfm_reviews_array);
    }
}
