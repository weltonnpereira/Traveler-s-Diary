<?php
    if (Site::logged() == false) {
        header('Location: '.INCLUDE_PATH.'404');
        die();
    }

    if (!isset($_GET['book'])) {
        header('Location: '.INCLUDE_PATH.'to_note?book=default');
        die();
    }
?>
<?php
    $user = $_SESSION['user'];

    $userDir = 'main-files/uploads-users/'.$user;
    if (!is_dir($userDir)) {
        mkdir($userDir, 0777, true);
    }

    $selectedBook = $_GET['book'];

    // Prepara a consulta ao banco de dados para buscar as páginas e o conteúdo
    $sql = MySql::connect()->prepare("SELECT current_pages, content FROM ".DIARY_TABLE." WHERE user = ?");
    $sql->execute([$user]);
    $result = $sql->fetch(PDO::FETCH_ASSOC);

    // Decodifica os dados JSON para arrays
    $currentPages = json_decode($result['current_pages'], true);
    $content = json_decode($result['content'], true);

    // Se os dados de páginas estiverem faltando, inicializa com um valor padrão para o livro selecionado
    if ($currentPages === null || !is_array($currentPages)) {
        $currentPages = [$selectedBook => ['left' => 1, 'right' => 2]];
    } elseif (!isset($currentPages[$selectedBook])) {
        $currentPages[$selectedBook] = ['left' => 1, 'right' => 2];
    }

    // Se os dados de conteúdo estiverem faltando, inicializa com um valor padrão para o livro selecionado
    if ($content === null || !is_array($content)) {
        $content = [$selectedBook => [
            1 => ['objects' => []],
            2 => ['objects' => []]
        ]];
    } elseif (!isset($content[$selectedBook])) {
        $content[$selectedBook] = [
            1 => ['objects' => []],
            2 => ['objects' => []]
        ];
    }

    // Atualiza os dados no banco de dados
    $sql = MySql::connect()->prepare("UPDATE ".DIARY_TABLE." SET current_pages = ?, content = ? WHERE user = ?");
    $sql->execute([json_encode($currentPages), json_encode($content), $user]);

    // Obtém os números das páginas para o tipo de livro selecionado
    $leftPageN = $currentPages[$selectedBook]['left'];
    $rightPageN = $currentPages[$selectedBook]['right'];
?>
<div id="left" class="page">
    <span class="number-page left"><?php echo htmlspecialchars($leftPageN); ?>.</span>
    <canvas id="canvas-left" width="990" height="1080"></canvas>
</div>
<div id="right" class="page">
    <span class="number-page right"><?php echo htmlspecialchars($rightPageN); ?>.</span>
    <canvas id="canvas-right" width="990" height="1080"></canvas>
</div>