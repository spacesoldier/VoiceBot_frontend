<?php
ini_set('date.timezone', 'UTC');
$nonce = "test1";
$created = date('Y-m-d\TH:i:s').'Z';
$appkey = "111cb686dbf14b0b9d9635cf72e51328"; // key
$appsecret = "3218eb17411128fc"; // secret
ini_set('date.timezone', 'UTC');
$wssssw_in = base64_encode(hash('sha256', $nonce.$created.$appsecret, 'true'));
$wssssw = "UsernameToken Username="."\"".$appkey."\"".", PasswordDigest="."\"".$wssssw_in."\"".", Nonce="."\"".$nonce."\"".", Created="."\"".$created."\"";
$url = 'http://api.oneapi.ru/sms/sendSms/v1';
$ch = curl_init($url);
$headers = array(
	"Content-Type:application/x-www-form-urlencoded",
	"X-WSSE:".$wssssw,
	"Authorization: WSSE realm=\"SDP\", profile=\"UsernameToken\", type=\"AppKey\""
);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, 'from=OneAPI&to=7926XXXXXX&body=TEST'); // message
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
$response = curl_exec($ch);
curl_close($ch);
?>

