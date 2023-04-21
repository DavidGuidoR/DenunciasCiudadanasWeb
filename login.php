<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "DenunciasCiudadanas";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$phone = $_POST['phone'];
$password = $_POST['password'];

$sql = "SELECT * FROM ciudadanos WHERE telefono = '$phone' AND password = '$password'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Iniciar sesión y redirigir al usuario
    session_start();
    $_SESSION['loggedin'] = true;
    $_SESSION['phone'] = $phone;
    header("Location: principal.php"); // Cambia "index.html" por la página a la que deseas redirigir al usuario después de iniciar sesión
} else {
    echo "Error: Teléfono o contraseña incorrectos.";
}

$conn->close();
