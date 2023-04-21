<?php
include "config.php";

// Verificar si se ha enviado el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Recuperar los datos del formulario
    $name = $_POST["name"];
    $description = $_POST["description"];
    $email = $_POST["email"];

    // Preparar la consulta SQL para insertar los datos en la base de datos
    $sql = "INSERT INTO mensajes (name, description, email) VALUES (:name, :description, :email)";

    // Preparar la declaración y ejecutar la consulta
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':email', $email);

    if ($stmt->execute()) {
        echo "Mensaje enviado con éxito.";
    } else {
        echo "Error al enviar el mensaje.";
    }
} else {
    header("Location: contact.php");
    exit();
}
