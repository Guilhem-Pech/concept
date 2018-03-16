<?php
session_start();

$result = new stdClass();
$result->success = true;
$result->message = '';

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Fri, 13 Feb 1998 01:00:00 GMT');
header('Content-type: application/json');

include '../php/game.php';
include '../php/playingUsers.php';

$result->post = $_POST;
if (isset($_POST['gameID']) && Game::findByID($_POST['gameID'])) {
    $_SESSION["GAME_ID"] = $_POST['gameID'];
    playingUsers::setGame($_SESSION['UNIQUE_ID'], $_POST['gameID']);
} else {
    $result->success = false;
    $result->message = 'Sorry, this game does not exist anymore ...';
}

echo json_encode($result);