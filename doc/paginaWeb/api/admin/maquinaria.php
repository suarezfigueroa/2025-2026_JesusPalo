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
    $stmt = $conn->prepare("SELECT * FROM maquinaria ORDER BY nombre");
    $stmt->execute();
    $datos = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    enviarRespuesta($conn, ['success' => true, 'datos' => $datos]);
}

if ($metodo == 'POST') {
    $datos       = json_decode(file_get_contents("php://input"), true);
    $nombre      = $datos['nombre'] ?? '';
    $tipo        = $datos['tipo'] ?? '';
    $modelo      = $datos['modelo'] ?? '';
    $descripcion = $datos['descripcion'] ?? '';
    $estado      = $datos['estado'] ?? 'disponible';
    $fecha       = $datos['fecha_adquisicion'] ?? '';

    if (!$nombre || !$tipo) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO maquinaria (nombre, tipo, modelo, descripcion, estado, fecha_adquisicion) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $nombre, $tipo, $modelo, $descripcion, $estado, $fecha);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Maquinaria creada']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al crear']);
    }
}

if ($metodo == 'PUT') {
    $datos       = json_decode(file_get_contents("php://input"), true);
    $id          = $datos['id_maquinaria'] ?? '';
    $nombre      = $datos['nombre'] ?? '';
    $tipo        = $datos['tipo'] ?? '';
    $modelo      = $datos['modelo'] ?? '';
    $descripcion = $datos['descripcion'] ?? '';
    $estado      = $datos['estado'] ?? '';
    $fecha       = $datos['fecha_adquisicion'] ?? '';

    if (!$id || !$nombre || !$tipo) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE maquinaria SET nombre=?, tipo=?, modelo=?, descripcion=?, estado=?, fecha_adquisicion=? WHERE id_maquinaria=?");
    $stmt->bind_param("ssssssi", $nombre, $tipo, $modelo, $descripcion, $estado, $fecha, $id);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Maquinaria actualizada']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al actualizar']);
    }
}

if ($metodo == 'DELETE') {
    $datos = json_decode(file_get_contents("php://input"), true);
    $id    = $datos['id_maquinaria'] ?? '';

    if (!$id) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM maquinaria WHERE id_maquinaria = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Maquinaria eliminada']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al eliminar']);
    }
}

$conn->close();
?>