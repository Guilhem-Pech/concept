<?php

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Fri, 13 Feb 1998 13:13:13 GMT');
header('Content-type: application/json');

include '../php/concept.php';
include "../php/jeton.php";
include '../php/game.php';
session_start();

$result = new stdClass();
$result->success = true;
$result->message = '';
$result->post = $_POST;


if (isset($_POST['concept'])) {
    $concept = filter_input(INPUT_POST, 'concept');

    if (isset($_POST['jeton'])) {
        $jeton = filter_input(INPUT_POST, 'jeton');

    }

} else {
    $result->success = false;
    $result->message = 'Wrong Ajax Request !';
}

echo json_encode($result);
