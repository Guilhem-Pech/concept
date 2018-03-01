<?php
    session_start();
    
    $result = new stdClass();
    $result->success = true;
    $result->message = '';

    header('Cache-Control: no-cache, must-revalidate');
    header('Expires: Fri, 13 Feb 1998 01:00:00 GMT');
    header('Content-type: application/json');
    
    if(isset($_POST['username']) && !empty($_POST['username'])){
        
        $_SESSION['ID'] = filter_input(INPUT_POST,'username',FILTER_SANITIZE_SPECIAL_CHARS);
        
        echo json_encode($result);
    } else {
        $result->success = false;
        $result->message = 'Impossible to set the username';
        echo json_encode($result);
    }
    