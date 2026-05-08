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
    $stmt = $conn->prepare("SELECT * FROM productos_clinicos ORDER BY nombre");
    $stmt->execute();
    $datos = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    enviarRespuesta($conn, ['success' => true, 'datos' => $datos]);
}

if ($metodo == 'POST') {
    $datos       = json_decode(file_get_contents("php://input"), true);
    $nombre      = $datos['nombre'] ?? '';
    $descripcion = $datos['descripcion'] ?? '';
    $stock       = $datos['stock'] ?? 0;
    $proveedor   = $datos['proveedor'] ?? '';
    $fecha       = $datos['fecha_compra'] ?? '';

    if (!$nombre) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO productos_clinicos (nombre, descripcion, stock, proveedor, fecha_compra) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssiss", $nombre, $descripcion, $stock, $proveedor, $fecha);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Producto creado']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al crear']);
    }
}

if ($metodo == 'PUT') {
    $datos       = json_decode(file_get_contents("php://input"), true);
    $id          = $datos['id_producto'] ?? '';
    $nombre      = $datos['nombre'] ?? '';
    $descripcion = $datos['descripcion'] ?? '';
    $stock       = $datos['stock'] ?? 0;
    $proveedor   = $datos['proveedor'] ?? '';
    $fecha       = $datos['fecha_compra'] ?? '';

    if (!$id || !$nombre) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE productos_clinicos SET nombre=?, descripcion=?, stock=?, proveedor=?, fecha_compra=? WHERE id_producto=?");
    $stmt->bind_param("ssissi", $nombre, $descripcion, $stock, $proveedor, $fecha, $id);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Producto actualizado']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al actualizar']);
    }
}

if ($metodo == 'DELETE') {
    $datos = json_decode(file_get_contents("php://input"), true);
    $id    = $datos['id_producto'] ?? '';

    if (!$id) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM productos_clinicos WHERE id_producto = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Producto eliminado']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al eliminar']);
    }
}

$conn->close();
?>