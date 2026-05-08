<?php
session_start();
header('Content-Type: application/json');
require_once 'conexion.php';

if (!isset($_SESSION['id'])) {
    enviarError(403, 'No hay sesión activa');
}

if (!isset($_FILES['foto'])) {
    enviarError(400, 'No se recibió ninguna foto');
}

$file = $_FILES['foto'];
$extensiones = ['jpg', 'jpeg', 'png', 'webp'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, $extensiones)) {
    enviarError(400, 'Formato no permitido');
}

// Carpeta según rol
switch ($_SESSION['rol']) {
    case 'doctor':
        $carpeta = 'img/Doctores/';
        break;
    case 'admin':
        $carpeta = 'img/Admin/';
        break;
    default:
        $carpeta = 'img/Pacientes/';
        break;
}

$nombreArchivo = 'usuario_' . $_SESSION['id'] . '.' . $ext;
$rutaDestino   = __DIR__ . '/../' . $carpeta . $nombreArchivo;
$rutaBD        = $carpeta . $nombreArchivo;

if (!is_dir(__DIR__ . '/../' . $carpeta)) {
    mkdir(__DIR__ . '/../' . $carpeta, 0777, true);
}

if (move_uploaded_file($file['tmp_name'], $rutaDestino)) {
    $conn = obtenerConexion();
    $id   = $_SESSION['id'];
    $stmt = $conn->prepare("UPDATE persona SET Foto = ? WHERE id_persona = ?");
    $stmt->bind_param("si", $rutaBD, $id);
    $stmt->execute();
    enviarRespuesta($conn, ['success' => true, 'foto' => $rutaBD]);
} else {
    enviarError(500, 'Error al subir la foto');
}
?>