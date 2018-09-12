<?php
    ini_set("mysql.trace_mode", "0");
    $DB_HOSTNAME="localhost";
    $DB_USERNAME="root";
    $DB_PASSWORD="root";
    $DB_NAME="eshop";
    
    $db = new mysqli($DB_HOSTNAME,$DB_USERNAME,$DB_PASSWORD,$DB_NAME);
    if ($db->connect_errno) {
        echo "Fallo al conectar a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
    }
    setlocale(LC_TIME,'spanish','es_AR');
    $db->set_charset("utf8");
    $db->query("SET sql_mode = '';");
    $db->query('SET NAMES "utf8"');
        $db->query("SET @@lc_time_names = 'es_AR';");
        $db->query("SET collation_connection = 'utf8_general_ci'");
?>
