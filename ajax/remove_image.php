<?php

    include('../config.php');

    if ($_SERVER['REQUEST_METHOD']=='POST') {
        $user = $_SESSION['user'];
        $data = json_decode(file_get_contents('php://input'), true);

        if (isset($data['imagePath'])) {
            $imagePath = $data['imagePath'];

            $physicalPath = '../' . $imagePath;

            if (file_exists($physicalPath)) {
                if (unlink($physicalPath)) {
                    echo json_encode(['status' => 'success', 'message' => 'Imagem removida com sucesso.']);
                    exit();
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Falha ao remover a imagem.']);
                    exit();
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Arquivo não encontrado.']);
                exit();
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Caminho da imagem não fornecido.']);
            exit();
        }
    }

?>