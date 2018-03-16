<?php
session_start();
require '../php/game.php';
require_once '../php/playingUsers.php';
$result = new stdClass();
$result->success = true;
$result->message = '';

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Fri, 13 Feb 1998 01:00:00 GMT');
header('Content-type: application/json');

if (isset($_POST['gameName']) && !empty($_POST['gameName'])) {
    $gameName = filter_input(INPUT_POST, 'gameName', FILTER_SANITIZE_SPECIAL_CHARS);
    $_SESSION['GAME_ID'] = Game::insert($gameName, $_SESSION['UNIQUE_ID']);
    Game::setWordRandom($_SESSION{'GAME_ID'});
    playingUsers::setGame($_SESSION['UNIQUE_ID'], $_SESSION['GAME_ID']);
    $result->session = $_SESSION;

} else {
    $result->success = false;
    $result->message = 'Game name is not correctly set';
}

echo json_encode($result);