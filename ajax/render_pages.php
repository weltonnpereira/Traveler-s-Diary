<?php

    include('../config.php');

    if ($_SERVER['REQUEST_METHOD']=='GET' && isset($_GET['right'])) {
        $user = $_SESSION['user'];

        $sql = MySql::connect()->prepare("SELECT current_pages, content FROM `".DIARY_TABLE."` WHERE user = ?");
        $sql->execute([$user]);
        $result = $sql->fetch(PDO::FETCH_ASSOC);

        $bookType = $_GET['book'];
        $currentPages = json_decode($result['current_pages'], true);
        $content = json_decode($result['content'], true);

        $leftPage = $currentPages[$bookType]['left'];
        $rightPage = $currentPages[$bookType]['right'];

        $nextLeftPage = $leftPage + 2;
        $nextRightPage = $rightPage + 2;

        $newPagesNeeded = false;

        /*
        if (!isset($content[$nextLeftPage])) {
            $content[$nextLeftPage] = '';
            $newPagesNeeded = true;
        }

        if (!isset($content[$nextRightPage])) {
            $content[$nextRightPage] = '';
            $newPagesNeeded = true;
        }
            */

        if (!isset($content[$bookType][$nextLeftPage])) {
            $content[$bookType][$nextLeftPage] = ['objects' => []];
            $newPagesNeeded = true;
        }

        if (!isset($content[$bookType][$nextRightPage])) {
            $content[$bookType][$nextRightPage] = ['objects' => []];
            $newPagesNeeded = true;
        }

        if ($newPagesNeeded) {
            $sql = MySql::connect()->prepare("UPDATE `".DIARY_TABLE."` SET content = ? WHERE user = ?");
            $sql->execute([json_encode($content), $user]);
        }

        $currentPages[$bookType]['left'] = $nextLeftPage;
        $currentPages[$bookType]['right'] = $nextRightPage;

        $sql = MySql::connect()->prepare("UPDATE `".DIARY_TABLE."` SET current_pages = ? WHERE user = ?");
        $sql->execute([json_encode($currentPages), $user]);

        echo json_encode([
            'status' => 'success', 
            'left_content' => !empty($content[$bookType][$nextLeftPage]), 
            'right_content' => !empty($content[$bookType][$nextRightPage]),
            'left' => $nextLeftPage, 
            'right' => $nextRightPage
        ]);
        exit();
    }

    if ($_SERVER['REQUEST_METHOD']=='GET' && isset($_GET['left'])) {
        $user = $_SESSION['user'];

        $sql = MySql::connect()->prepare("SELECT current_pages, content FROM `".DIARY_TABLE."` WHERE user = ?");
        $sql->execute([$user]);
        $result = $sql->fetch(PDO::FETCH_ASSOC);

        $bookType = $_GET['book'];
        $currentPages = json_decode($result['current_pages'], true);
        $content = json_decode($result['content'], true);

        $leftPage = $currentPages[$bookType]['left'];
        $rightPage = $currentPages[$bookType]['right'];

        $prevLeftPage = $leftPage - 2;
        $prevRightPage = $rightPage - 2;

        if ($leftPage == 1 || $rightPage == 2 || !isset($content[$bookType][$prevLeftPage]) || !isset($content[$bookType][$prevRightPage])) {
            echo json_encode(['status' => 'failure']);
            exit();
        }

        $currentPages[$bookType]['left'] = $prevLeftPage;
        $currentPages[$bookType]['right'] = $prevRightPage;

        $sql = MySql::connect()->prepare("UPDATE `".DIARY_TABLE."` SET current_pages = ? WHERE user = ?");
        $sql->execute([json_encode($currentPages), $user]);

        echo json_encode([
            'status' => 'success',
            'left' => $prevLeftPage,
            'right' => $prevRightPage,
            'left_content' => !empty($content[$bookType][$prevLeftPage]),
            'right_content' => !empty($content[$bookType][$prevRightPage])
        ]);
        exit();
    }

    // Salvar páginas

    if ($_SERVER['REQUEST_METHOD']==='POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['type'])) {
            echo json_encode(['status' => 'failure']);
            exit();
        }

        $type = $data['type'];

        if (isset($data['page']) && isset($data['book']) && isset($data['action'])) {
            $bookType = $data['book'];

            if ($type === 'save_source') {
                $user = $_SESSION['user'];
                $pageKey = $data['page'];
                $objectContent = $data['object'];
                $action = $data['action'];
        
                $sql = MySql::connect()->prepare("SELECT source_pages FROM `".DIARY_TABLE."` WHERE user = ?");
                $sql->execute([$user]);
                $result = $sql->fetch(PDO::FETCH_ASSOC);
        
                $pages = json_decode($result['source_pages'], true);
        
                if ($pages === null) {
                    $pages[$bookType] = [];
                }
        
                if ($action === 'addOrUpdate') {
                    $object = json_decode(json_encode($objectContent), true);

                    if (!isset($object['id']) || !isset($object['title']) || !isset($object['url'])) {
                        echo json_encode(['status' => 'failure', 'message' => 'Invalid object']);
                        exit();
                    }
        
                    if (!isset($pages[$bookType][$pageKey])) {
                        $pages[$bookType][$pageKey] = [];
                    }

                    // Mudar dps (provavelmente)
                    if (count($pages[$bookType][$pageKey]) >= 4) {
                        echo json_encode(['status' => 'failure', 'message' => 'Max links reached for this page']);
                        exit();
                    }

                    $pages[$bookType][$pageKey][$object['id']] = [
                        'title' => $object['title'],
                        'url' => $object['url']
                    ];
                } else if ($action === 'remove') {
                    $object = json_decode(json_encode($objectContent), true);

                    if (!isset($object['title'])) {
                        echo json_encode(['status' => 'failure', 'message' => 'Invalid object for removal']);
                        exit();
                    }
            
                    $linkTitle = $object['title'];
                    if (isset($pages[$bookType][$pageKey])) {
                        foreach ($pages[$bookType][$pageKey] as $id => $link) {
                            if ($link['title'] === $linkTitle) {
                                unset($pages[$bookType][$pageKey][$id]);
                                break;
                            }
                        }
                    }
                }
        
                $sql = MySql::connect()->prepare("UPDATE `".DIARY_TABLE."` SET source_pages = ? WHERE user = ?");
                $success = $sql->execute([json_encode($pages), $user]);
        
                echo json_encode(['status' => $success ? 'success' : 'failure']);
                exit();
            } else if ($type === 'save_canvas') {
                $user = $_SESSION['user'];
                $pageSide = $data['page'];
                $objectContent = $data['object'];
    
                $action = $data['action'];
    
                $sql = MySql::connect()->prepare("SELECT current_pages, content FROM `".DIARY_TABLE."` WHERE user = ?");
                $sql->execute([$user]);
                $result = $sql->fetch(PDO::FETCH_ASSOC);
    
                $currentPages = json_decode($result['current_pages'], true);
                $pages = json_decode($result['content'], true);
    
                if ($currentPages === null || $pages === null) {
                    echo json_encode(['status' => 'failure', 'message' => 'Erro ao decodificar o JSON']);
                    exit();
                }
    
                if ($pageSide === 'left') {
                    $pageNumber = $currentPages[$bookType]['left'];
                } else if ($pageSide === 'right') {
                    $pageNumber = $currentPages[$bookType]['right'];
                } else {
                    echo json_encode(['status' => 'failure', 'message' => 'Lado da página inválido']);
                    exit();
                }
    
                if ($action === 'addOrUpdate') {
                    $object = json_decode($objectContent, true);
                    if (!isset($object['id'])) {
                        echo json_encode(['status' => 'failure', 'message' => 'Objeto inválido']);
                        exit();
                    }
    
                    /*
                    if (!isset($pages[$pageNumber]['objects'])) {
                        $pages[$pageNumber]['objects'] = [];
                    }
                        */
    
                    $pages[$bookType][$pageNumber]['objects'][$object['id']] = $object;
                } else if ($action === 'remove') {
                    $object = json_decode($objectContent, true);
                    if (!isset($object['id'])) {
                        echo json_encode(['status' => 'failure', 'message' => 'Objeto inválido para remoção']);
                        exit();
                    }
    
                    unset($pages[$bookType][$pageNumber]['objects'][$object['id']]);
                }
    
                $sql = MySql::connect()->prepare("UPDATE `".DIARY_TABLE."` SET content = ? WHERE user = ?");
                $success = $sql->execute([json_encode($pages), $user]);
    
                echo json_encode(['status' => $success ? 'success' : 'failure']);
                exit();   
            } else if ($type === 'save_mark') {
                $user = $_SESSION['user'];
                $pageKey = $data['page'];
                $keyWord = $data['keyWord'];
                $action = $data['action'];
    
                // Log para verificar os parâmetros recebidos
                error_log("Saving mark for pageKey: $pageKey, keyWord: $keyWord");
    
                $sql = MySql::connect()->prepare("SELECT key_words FROM `" . DIARY_TABLE . "` WHERE user = ?");
                $sql->execute([$user]);
                $result = $sql->fetch(PDO::FETCH_ASSOC);
    
                if ($result === false) {
                    echo json_encode(['status' => 'failure', 'message' => 'User data not found']);
                    exit();
                }
    
                $marks = json_decode($result['key_words'], true);
    
                if ($action === 'addOrUpdate') {
                    if ($marks === null) {
                        $marks[$bookType] = [];
                    }
        
                    if (!isset($marks[$bookType][$pageKey])) {
                        $marks[$bookType][$pageKey] = [];
                    }
        
                    $marks[$bookType][$pageKey][] = $keyWord;
        
                    $sql = MySql::connect()->prepare("UPDATE `" . DIARY_TABLE . "` SET key_words = ? WHERE user = ?");
                    $success = $sql->execute([json_encode($marks), $user]);
        
                    if ($success) {
                        echo json_encode(['status' => 'success']);
                    } else {
                        echo json_encode(['status' => 'failure', 'message' => 'Database update failed']);
                    }
                    exit();
                } else if ($action === 'remove') {
                    if ($marks !== null && isset($marks[$bookType][$pageKey])) {
                        $index = array_search($keyWord, $marks[$bookType][$pageKey]);
                        if ($index !== false) {
                            unset($marks[$bookType][$pageKey][$index]);

                            // if (empty($marks[$bookType][$pageKey])) {
                            //     unset($marks[$bookType][$pageKey]);
                            // }

                            $sql = MySql::connect()->prepare("UPDATE `".DIARY_TABLE."` SET key_words = ? WHERE user = ?");
                            $success = $sql->execute([json_encode($marks), $user]);

                            if ($success) {
                                echo json_encode(['status' => 'success']);
                            } else {
                                echo json_encode(['status' => 'failure', 'message' => 'Database update failed']);
                            }
                            exit();
                        } else {
                            echo json_encode(['status' => 'failure', 'message' => 'KeyWord not found']);
                            exit();
                        }
                    } else {
                        echo json_encode(['status' => 'failure', 'message' => 'PageKey or KeyWords not found']);
                        exit();
                    }
                }
            }
        } else {
            echo json_encode(['status' => 'failure']);
            exit();
        }
    }

    // Load pages

    if ($_SERVER['REQUEST_METHOD']=='GET' && isset($_GET['load'])) {
        $page = $_GET['page'];
        $user = $_SESSION['user'];

        $bookType = $_GET['book'];

        $sql = MySql::connect()->prepare("SELECT content, key_words FROM `".DIARY_TABLE."` WHERE user = ?");
        $sql->execute([$user]);
        $result = $sql->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            $pages = json_decode($result['content'], true);
            $keyWords = json_decode($result['key_words'], true);

            $partnerPage = $page % 2 === 0 ? $page - 1 : $page + 1;
            $pageKey = $page < $partnerPage ? "$page-$partnerPage" : "$partnerPage-$page";

            if (isset($pages[$bookType][$page])) {
                $pageContent = $pages[$bookType][$page];
    
                if (isset($pageContent['objects'])) {
                    $pageContent['objects'] = array_filter($pageContent['objects'], function ($object) {
                        return $object !== null;
                    });
                }
    
                echo json_encode([
                    'status' => 'success',
                    'content' => $pageContent,
                    'key_words' => $keyWords[$bookType][$pageKey] ?? []
                ]);
            } else {
                echo json_encode(['status' => 'failure', 'message' => $pages]);
            }
        } else {
            echo json_encode(['status' => 'failure', 'message' => 'User data not found']);
        }
        exit();
    }

    if ($_SERVER['REQUEST_METHOD']=='GET' && isset($_GET['current_page'])) {
        $user = $_SESSION['user'];

        $sql = MySql::connect()->prepare("SELECT current_pages FROM `".DIARY_TABLE."` WHERE user = ?");
        $sql->execute([$user]);
        $currentPages = json_decode($sql->fetchColumn(), true);

        $bookType = $_GET['book'];
        echo json_encode([
            'status' => 'success', 
            'left' => $currentPages[$bookType]['left'], 
            'right' => $currentPages[$bookType]['right']
        ]);
        exit();
    }

    if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['searchPage'])) {
        $bookType = $_GET['book'];
        $pageN = (int)$_GET['searchPage'];
        $user = $_SESSION['user'];
    
        $sql = MySql::connect()->prepare("SELECT current_pages, content FROM `".DIARY_TABLE."` WHERE user = ?");
        $sql->execute([$user]);
        $result = $sql->fetch(PDO::FETCH_ASSOC);

        $currentPages = json_decode($result['current_pages'], true);
        $content = json_decode($result['content'], true);
    
        if ($pageN % 2 != 0) {
            $leftPage = $pageN;
            $rightPage = $pageN + 1;
        } else {
            $rightPage = $pageN;
            $leftPage = $pageN - 1;
        }
    
        if ($currentPages[$bookType]['left'] == $leftPage && $currentPages[$bookType]['right'] == $rightPage) {
            echo json_encode(['status' => 'failure', 'message' => 'You are already on these pages.']);
            exit();
        }
    
        if (isset($content[$bookType][$pageN])) {
            if (isset($content[$bookType][$leftPage]) && isset($content[$bookType][$rightPage])) {
                $currentPages[$bookType]['left'] = $leftPage;
                $currentPages[$bookType]['right'] = $rightPage;
    
                $sql = MySql::connect()->prepare("UPDATE `".DIARY_TABLE."` SET current_pages = ? WHERE user = ?");
                $sql->execute([json_encode($currentPages), $user]);
    
                echo json_encode([
                    'status' => 'success',
                    'left_content' => !empty($content[$bookType][$leftPage]),
                    'right_content' => !empty($content[$bookType][$rightPage]),
                    'left' => $leftPage,
                    'right' => $rightPage
                ]);
            } else {
                echo json_encode(['status' => 'failure', 'message' => 'Content not found.']);
                exit();
            }
        } else {
            echo json_encode(['status' => 'failure', 'message' => 'Page not found']);
            exit();
        }
    }

    // Load sources

    if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['load_sources']) && $_GET['load_sources'] === 'true') {
        $user = $_SESSION['user'];
        $pageKey = $_GET['page_key'];

        $bookType = $_GET['book'];
        $sql = MySql::connect()->prepare("SELECT source_pages FROM `".DIARY_TABLE."` WHERE user = ?");
        $sql->execute([$user]);
        $result = $sql->fetch(PDO::FETCH_ASSOC);

        $pages = json_decode($result['source_pages'], true);

        if (isset($pages[$bookType][$pageKey])) {
            echo json_encode(['status' => 'success', 'links' => $pages[$bookType][$pageKey]]);
        } else {
            echo json_encode(['status' => 'success', 'links' => []]);
        }
        exit();
    }

?>