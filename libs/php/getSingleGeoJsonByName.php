<?php

    $countryName = $_REQUEST['name'];    

	$executionStartTime = microtime(true);

    $countryData = json_decode(file_get_contents("../../vendors/json/countryBorders.geo.json"), true);

    $data;

    foreach ($countryData['features'] as $feature) {
        if( $feature["properties"]['name'] == $countryName){
            $data['code'] = $feature["properties"]['iso_a2'];
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