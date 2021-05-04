<?php

    $countryCode = $_REQUEST['code'];    

	$executionStartTime = microtime(true);

    $countryData = json_decode(file_get_contents("../../vendors/json/countryBorders.geo.json"), true);

    $data;

    foreach ($countryData['features'] as $feature) {
        if( $feature["properties"]['iso_a2'] == $countryCode){
            $data['name'] = $feature["properties"]['name'];
            $data['geometry'] = $feature["geometry"];
        }
	}

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $data;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

?>