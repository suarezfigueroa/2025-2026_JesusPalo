<?php
session_start();
header('Content-Type: application/json');
require_once 'conexion.php';

if (!isset($_SESSION['id'])) {
    enviarError(403, 'No hay sesión activa');
}

$conn = obtenerConexion();
$id = $_SESSION['id'];

// Obtener foto actual
$stmt = $conn->prepare("SELECT Foto FROM persona WHERE id_persona = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$usuario = $result->fetch_assoc();

if ($usuario['Foto']) {
    $ruta = __DIR__ . '/../' . $usuario['Foto'];
    if (file_exists($ruta)) {
        unlink($ruta);
    }
}

// Borrar de la BD
$stmt = $conn->prepare("UPDATE persona SET Foto = NULL WHERE id_persona = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    enviarRespuesta($conn, ['success' => true]);
} else {
    enviarError(500, 'Error al borrar la foto', $conn);
}
?>