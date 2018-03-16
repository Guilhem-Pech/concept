<?php

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Fri, 13 Feb 1998 13:13:13 GMT');
header('Content-type: application/json');

include_once '../php/concept.php';
include_once "../php/jeton.php";
include_once '../php/game.php';
include_once '../php/PlacedJeton.php';
session_start();

$result = new stdClass();
$result->success = true;
$result->message = '';
$result->post = $_POST;


if (Game::findByID($_SESSION['GAME_ID'])->guesser->id == $_SESSION['UNIQUE_ID'] && isset($_POST['concept'])) {
    $concept = filter_input(INPUT_POST, 'concept');
    if (isset($_POST['jeton'])) {
        $jeton = filter_input(INPUT_POST, 'jeton');
        $result->gameID = $_SESSION['GAME_ID'];
        $insert = PlacedJeton::insertJetonOnConcept($_SESSION['GAME_ID'], $concept, $jeton);
        if (is_string($insert)) {
            $result->success = false;
            $result->message = $insert;
        }
    } else {
        $remove = PlacedJeton::removeJetonOnConcept($_SESSION['GAME_ID'], $concept);
        if (is_string($remove)) {
            $result->success = false;
            $result->message = $remove;
        }
    }

} else {
    $result->success = false;
    $result->message = 'YOU CANNOT DO THAT!';
}

echo json_encode($result);
