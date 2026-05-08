<?php
session_start();
header('Content-Type: application/json');
require_once '../conexion.php';

if (!isset($_SESSION['id']) || $_SESSION['rol'] != 'admin') {
    echo json_encode(['success' => false, 'mensaje' => 'Acceso no autorizado']);
    exit;
}

$conn    = obtenerConexion();
$metodo  = $_SERVER['REQUEST_METHOD'];

if ($metodo == 'GET') {
    $id_doctor = $_GET['id_doctor'] ?? '';
    if (!$id_doctor) {
        echo json_encode(['success' => false, 'mensaje' => 'Falta id_doctor']);
        exit;
    }
    $stmt = $conn->prepare("SELECT * FROM horarios_doctor WHERE id_doctor = ? ORDER BY fecha, hora_inicio");
    $stmt->bind_param("i", $id_doctor);
    $stmt->execute();
    $datos = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    enviarRespuesta($conn, ['success' => true, 'datos' => $datos]);
}

if ($metodo == 'POST') {
    $datos      = json_decode(file_get_contents("php://input"), true);
    $id_doctor  = $datos['id_doctor']    ?? '';
    $fecha      = $datos['fecha']        ?? '';
    $inicio     = $datos['hora_inicio']  ?? '';
    $fin        = $datos['hora_fin']     ?? '';
    $slot       = $datos['duracion_slot'] ?? 30;

    if (!$id_doctor || !$fecha || !$inicio || !$fin) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO horarios_doctor (id_doctor, fecha, hora_inicio, hora_fin, duracion_slot) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("isssi", $id_doctor, $fecha, $inicio, $fin, $slot);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Horario creado']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al crear']);
    }
}

if ($metodo == 'PUT') {
    $datos      = json_decode(file_get_contents("php://input"), true);
    $id         = $datos['id_horario']   ?? '';
    $fecha      = $datos['fecha']        ?? '';
    $inicio     = $datos['hora_inicio']  ?? '';
    $fin        = $datos['hora_fin']     ?? '';
    $slot       = $datos['duracion_slot'] ?? 30;

    if (!$id || !$fecha || !$inicio || !$fin) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE horarios_doctor SET fecha=?, hora_inicio=?, hora_fin=?, duracion_slot=? WHERE id_horario=?");
    $stmt->bind_param("sssii", $fecha, $inicio, $fin, $slot, $id);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Horario actualizado']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al actualizar']);
    }
}

if ($metodo == 'DELETE') {
    $datos = json_decode(file_get_contents("php://input"), true);
    $id    = $datos['id_horario'] ?? '';

    if (!$id) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM horarios_doctor WHERE id_horario = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Horario eliminado']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al eliminar']);
    }
}

$conn->close();
?>