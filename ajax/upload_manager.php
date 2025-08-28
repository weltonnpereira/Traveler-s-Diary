<?php

    include('../config.php');

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $user = $_SESSION['user'];

        if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = '../main-files/uploads-users/'.$user.'/';

            $fileEx = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
            $fileName = substr(uniqid('', true), 0, 13) . '.' . $fileEx;
            $uploadFilePath = $uploadDir . $fileName;
    
            if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadFilePath)) {
                $url = 'main-files/uploads-users/'.$user.'/'.$fileName;
                echo json_encode(['status' => 'success', 'filePath' => $url]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Falha ao mover o arquivo.']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Nenhum arquivo enviado ou erro no upload.']);
        }
    }


?>