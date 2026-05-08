<?php
session_start();
header('Content-Type: application/json');
require_once 'conexion.php';

if (!isset($_SESSION['id'])) {
    enviarError(403, 'No hay sesión activa');
}

$conn = obtenerConexion();
$id = $_SESSION['id'];
$metodo = $_SERVER['REQUEST_METHOD'];

// GET - obtener datos
if ($metodo === 'GET') {
    $sql = "SELECT id_persona, nombre, apellidos, email, telefono, dni, fecha_nac, rol, Foto, direccion FROM persona WHERE id_persona = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $usuario = $result->fetch_assoc();

    if (!$usuario) {
        enviarError(404, 'Usuario no encontrado', $conn);
    }

    enviarRespuesta($conn, ['success' => true, 'datos' => $usuario]);
}

// POST - actualizar datos
if ($metodo === 'POST') {
    $datos     = json_decode(file_get_contents("php://input"), true);
    $nombre    = $datos['nombre'] ?? '';
    $apellidos = $datos['apellidos'] ?? '';
    $email     = $datos['email'] ?? '';
    $telefono  = $datos['telefono'] ?? '';
    $dni       = $datos['dni'] ?? '';
    $fecha_nac = $datos['fecha_nac'] ?? '';
    $direccion = $datos['direccion'] ?? '';

    if (!$nombre || !$apellidos || !$email) {
        enviarError(400, 'Faltan datos obligatorios', $conn);
    }

    $stmt = $conn->prepare("UPDATE persona SET nombre=?, apellidos=?, email=?, telefono=?, dni=?, fecha_nac=?, direccion=? WHERE id_persona=?");
    $stmt->bind_param("sssssssi", $nombre, $apellidos, $email, $telefono, $dni, $fecha_nac, $direccion, $id);

    if ($stmt->execute()) {
        $_SESSION['nombre'] = $nombre;
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Datos actualizados correctamente']);
    } else {
        enviarError(500, 'Error al actualizar', $conn);
    }
}
?>