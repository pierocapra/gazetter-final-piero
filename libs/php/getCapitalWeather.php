<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    // $url = 'http://api.openweathermap.org/data/2.5/weather?q=Rome,IT&appid=ed42a3a486f2c215a1938306c7683f8e';
    $url='http://api.openweathermap.org/data/2.5/weather?q=' . $_REQUEST['city'] . ',' . $_REQUEST['countryCode'] . '&appid=ed42a3a486f2c215a1938306c7683f8e';
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
