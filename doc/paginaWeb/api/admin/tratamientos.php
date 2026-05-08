<?php
session_start();
header('Content-Type: application/json');
require_once '../conexion.php';

if (!isset($_SESSION['id']) || $_SESSION['rol'] != 'admin') {
    echo json_encode(['success' => false, 'mensaje' => 'Acceso no autorizado']);
    exit;
}

$conn = obtenerConexion();
$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo == 'GET') {
    $stmt = $conn->prepare("SELECT * FROM tratamientos ORDER BY nombre_tratamiento");
    $stmt->execute();
    $datos = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    enviarRespuesta($conn, ['success' => true, 'datos' => $datos]);
}

if ($metodo == 'POST') {
    $datos            = json_decode(file_get_contents("php://input"), true);
    $nombre           = $datos['nombre_tratamiento'] ?? '';
    $descripcion      = $datos['descripcion'] ?? '';
    $duracion         = $datos['duracion'] ?? '';
    $precio           = $datos['precio'] ?? '';

    if (!$nombre || !$duracion || !$precio) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO tratamientos (nombre_tratamiento, descripcion, duracion, precio) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssid", $nombre, $descripcion, $duracion, $precio);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Tratamiento creado']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al crear']);
    }
}

if ($metodo == 'PUT') {
    $datos       = json_decode(file_get_contents("php://input"), true);
    $id          = $datos['id_tratamiento'] ?? '';
    $nombre      = $datos['nombre_tratamiento'] ?? '';
    $descripcion = $datos['descripcion'] ?? '';
    $duracion    = $datos['duracion'] ?? '';
    $precio      = $datos['precio'] ?? '';

    if (!$id || !$nombre || !$duracion || !$precio) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE tratamientos SET nombre_tratamiento=?, descripcion=?, duracion=?, precio=? WHERE id_tratamiento=?");
    $stmt->bind_param("ssidi", $nombre, $descripcion, $duracion, $precio, $id);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Tratamiento actualizado']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al actualizar']);
    }
}

if ($metodo == 'DELETE') {
    $datos = json_decode(file_get_contents("php://input"), true);
    $id    = $datos['id_tratamiento'] ?? '';

    if (!$id) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM tratamientos WHERE id_tratamiento = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Tratamiento eliminado']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al eliminar']);
    }
}

$conn->close();
?>