<?php

require "../php/PlacedJeton.php";

session_start();
$result = new stdClass();
$result->result = true;
$result->message = '';

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Fri, 13 Feb 1998 01:00:00 GMT');
header('Content-type: application/json');

//$_SESSION['GAME_ID'] = 2;

if(isset($_SESSION['ID'])){
    $result->username = $_SESSION['ID'];
    if (isset($_SESSION['GAME_ID'])) {
        $result->gameID = $_SESSION['GAME_ID'];
        if (Game::findByID($_SESSION['GAME_ID'])->guesser->id == $_SESSION['UNIQUE_ID']) {
            $result->imguesser = true;
        }
        $numberOfPlayers = playingUsers::countPlayerByGame($_SESSION['GAME_ID'])->numberOfPlayers;
        $result->number = $numberOfPlayers;
        if ($numberOfPlayers >= 2) {
            $result->placedJeton = PlacedJeton::findAllByGame($_SESSION['GAME_ID']);
        } elseif ($numberOfPlayers == 0) {
            $result->result = false;
            $result->message = 'This game does not exist anymore';
            $_SESSION['GAME_ID'] = null;
            playingUsers::setGame($_SESSION['UNIQUE_ID'], null);
        } else {
            $result->notEnoughPlayer = true;
        }

    } else {
        $result->lookingForAGame = true;
        $result->gameAvailable = Game::findAll();
    }
    echo json_encode($result);
}else{
    $result->result = false;
    $result->message = 'User not connected';
    echo json_encode($result);
}