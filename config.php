<?php
    session_start();

    date_default_timezone_set('America/Sao_Paulo');

    $autoload = function($class) {
        include('class/'.$class.'.php');
    };

    spl_autoload_register($autoload);

    define('INCLUDE_PATH', 'http://localhost/travelers_diary/');

    define('BASE_PATH', realpath(__DIR__ . '/..'));

    // Connect to Database
	define('HOST', 'localhost');
	define('USER','root');
	define('PASSWORD','');
	define('DATABASE','traveler_db');

    define('DIARY_TABLE', 'diary_users');
?>