<?php
session_start();
header('Content-Type: application/json');
require_once 'conexion.php';

if (!isset($_SESSION['id']) || $_SESSION['rol'] !== 'doctor') {
    echo json_encode(['success' => false, 'mensaje' => 'Acceso no autorizado']);
    exit;
}

$conn = obtenerConexion();
$datos = json_decode(file_get_contents("php://input"), true);
$id_paciente    = $datos['id_paciente'] ?? '';
$id_tratamiento = $datos['id_tratamiento'] ?? '';
$fecha_inicio   = $datos['fecha_inicio'] ?? '';
$fecha_fin      = $datos['fecha_fin'] ?? '';

if (!$id_paciente || !$id_tratamiento || !$fecha_inicio || !$fecha_fin) {
    echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
    exit;
}

// Comprobar si ya tiene ese tratamiento asignado
$stmt = $conn->prepare("SELECT * FROM pacientes_tratamientos WHERE id_paciente = ? AND id_tratamiento = ?");
$stmt->bind_param("ii", $id_paciente, $id_tratamiento);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    echo json_encode(['success' => false, 'mensaje' => 'El paciente ya tiene este tratamiento asignado']);
    exit;
}

// Insertar tratamiento
$stmt = $conn->prepare("INSERT INTO pacientes_tratamientos (id_paciente, id_tratamiento, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiss", $id_paciente, $id_tratamiento, $fecha_inicio, $fecha_fin);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'mensaje' => 'Tratamiento asignado correctamente']);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al asignar: ' . $conn->error]);
}

$conn->close();
?>