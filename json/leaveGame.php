<?php
session_start();

$result = new stdClass();
$result->success = true;
$result->message = '';

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Fri, 13 Feb 1998 01:00:00 GMT');
header('Content-type: application/json');

include_once '../php/game.php';
include_once '../php/playingUsers.php';


if (isset($_SESSION["GAME_ID"])) {
    $game = Game::findByID($_SESSION["GAME_ID"]);
    if ($game) {

        if (playingUsers::countPlayerByGame($_SESSION['GAME_ID'])->numberOfPlayers <= 2) {
            Game::remove($_SESSION['GAME_ID']);
        }
        playingUsers::setGame($_SESSION['UNIQUE_ID'], null);
        if ($game->guesser == $_SESSION['UNIQUE_ID']) {
            Game::remove($_SESSION['GAME_ID']);
        }
    }
    $_SESSION['GAME_ID'] = null;

} else {
    $result->success = true;
    $result->message = '';
}

echo json_encode($result);