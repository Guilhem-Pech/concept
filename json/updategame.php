<?php
include '../php/pdo.php';
session_start();

$result = new stdClass();
$result->success = true;
$result->message = '';

$database = MyPdo::getConnection();

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Fri, 13 Feb 1998 01:00:00 GMT');
header('Content-type: application/json');

echo json_encode($result);
