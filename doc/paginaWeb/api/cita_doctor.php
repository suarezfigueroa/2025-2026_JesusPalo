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

$id_paciente = $datos['id_paciente'] ?? '';
$fecha_hora  = $datos['fecha_hora'] ?? '';
$motivo      = $datos['motivo'] ?? '';
$id_doctor   = $_SESSION['id'];

if (!$id_paciente || !$fecha_hora || !$motivo) {
    echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
    exit;
}

// Comprobar disponibilidad
$stmt = $conn->prepare("SELECT id_cita FROM citas WHERE id_doctor = ? AND fecha_hora = ? AND estado != 'cancelada'");
$stmt->bind_param("is", $id_doctor, $fecha_hora);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    echo json_encode(['success' => false, 'mensaje' => 'Ya tienes una cita a esa hora']);
    exit;
}

$estado = 'confirmada';
$stmt = $conn->prepare("INSERT INTO citas (id_paciente, id_doctor, fecha_hora, motivo, estado) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("iisss", $id_paciente, $id_doctor, $fecha_hora, $motivo, $estado);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'mensaje' => 'Cita creada correctamente']);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al crear la cita: ' . $conn->error]);
}

$conn->close();
?>