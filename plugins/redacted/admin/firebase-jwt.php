
<?php // Silence is golden
// Requires: composer require firebase/php-jwt

require __DIR__ . '\vendor\autoload.php';

use Firebase\JWT\JWT;

// Get your service account's email address and private key from the JSON key file
$service_account_email = "firebase-adminsdk-437ko@fir-chat-c59c8.iam.gserviceaccount.com";
$private_key = "ab0401701bb53734ee3d8bb22585a2ce74a878c4";

function create_custom_token($uid, $is_premium_account) {
  global $service_account_email, $private_key;

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