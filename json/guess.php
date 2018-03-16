<?php
session_start();
include_once '../php/game.php';
$result = new stdClass();
$result->success = true;
$result->message = '';

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Fri, 13 Feb 1998 01:00:00 GMT');
header('Content-type: application/json');

if (isset($_POST['guess']) && isset($_SESSION['UNIQUE_ID']) && isset($_SESSION['GAME_ID'])) {
    $game = Game::findByID($_SESSION['GAME_ID']);
    if (strtoupper($game->word->word) != strtoupper($_POST['guess'])) {
        $result->success = false;
        $result->message = 'Nope it\'s not correct !';
    } else {
        Game::setWordRandom($_SESSION['GAME_ID']);
        Game::setGuesser($_SESSION['GAME_ID'], $_SESSION['UNIQUE_ID']);
    }

}

echo json_encode($result);