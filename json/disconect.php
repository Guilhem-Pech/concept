<?php
session_start();
require_once '../php/playingUsers.php';
    $result = new stdClass();
    $result->success = true;
    $result->message = '';

    header('Cache-Control: no-cache, must-revalidate');
    header('Expires: Fri, 13 Feb 1998 01:00:00 GMT');
    header('Content-type: application/json');

playingUsers::remove($_SESSION['UNIQUE_ID']);
$_SESSION = array();
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}
session_destroy();

echo json_encode($result);