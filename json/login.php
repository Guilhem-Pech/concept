<?php
    session_start();
    
    $result = new stdClass();
    $result->success = true;
    $result->message = '';

    header('Cache-Control: no-cache, must-revalidate');
    header('Expires: Fri, 13 Feb 1998 01:00:00 GMT');
    header('Content-type: application/json');
    
    if(isset($_POST['email']) && isset($_POST['password'])  && !empty($_POST['password'])){
        $_SESSION['ID'] = true; 
        echo json_encode($result);
    } else {
        $result->success = false;
        $result->message = 'Invalid logins';
        $result->post = $_POST;
        echo json_encode($result);
    }
    