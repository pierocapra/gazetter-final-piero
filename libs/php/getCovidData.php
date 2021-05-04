<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	// $url='https://api.covid19api.com/country/' . $_REQUEST['country']; //this API returns wrong data for UK and US

	$curl = curl_init();

	curl_setopt_array($curl, [
		CURLOPT_URL => "https://covid-19-data.p.rapidapi.com/country/code?code=". $_REQUEST['country'], //this API returns wrong data for Italy
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_FOLLOWLOCATION => true,
		CURLOPT_ENCODING => "",
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 30,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => "GET",
		CURLOPT_HTTPHEADER => [
			"x-rapidapi-host: covid-19-data.p.rapidapi.com",
			"x-rapidapi-key: 413ea385famsh3947dcd559bad75p1d3f7ajsn68c6cf511f6c"
		],
	]);

	$response = curl_exec($curl);
	$err = curl_error($curl);

	curl_close($curl);

	if ($err) {
		echo "cURL Error #:" . $err;
	} else {
		$decode = json_decode($response,true);	
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
?>
