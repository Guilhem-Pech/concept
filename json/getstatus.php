<?php

session_start();
$result = new stdClass();
$result->result = true;
$result->message = '';

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Fri, 13 Feb 1998 01:00:00 GMT');
header('Content-type: application/json');

if(isset($_SESSION['ID'])){
    $result->username = $_SESSION['ID'];
    echo json_encode($result);
}else{
    $result->result = false;
    $result->message = 'User not connected';
    echo json_encode($result);
}