<?php

session_start();
$server = "localhost";
$username = "root";
$password = "";
$dbname = "DenunciasCiudadanas";

// Create connection
try {
   $conn = new PDO("mysql:host=$server;dbname=$dbname", "$username", "$password");
   $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
   die('No se puede conectar con la base de datos');
}
