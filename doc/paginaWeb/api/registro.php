<?php
session_start();
header('Content-Type: application/json');
require_once 'conexion.php';

$conn = obtenerConexion();

$datos     = json_decode(file_get_contents("php://input"), true);
$nombre    = $datos['nombre'] ?? '';
$apellidos = $datos['apellidos'] ?? '';
$email     = $datos['email'] ?? '';
$password  = $datos['password'] ?? '';
$telefono  = $datos['telefono'] ?? '';
$dni       = $datos['dni'] ?? '';
$fecha_nac = $datos['fecha_nac'] ?? '';

if (!$nombre || !$apellidos || !$email || !$password) {
    echo json_encode(['success' => false, 'mensaje' => 'Faltan datos obligatorios']);
    exit;
}

// Comprobar si el email ya existe
$stmt = $conn->prepare("SELECT id_persona FROM persona WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    echo json_encode(['success' => false, 'mensaje' => 'El email ya está registrado']);
    exit;
}

// Comprobar si el DNI ya existe
if ($dni) {
    $stmt = $conn->prepare("SELECT id_persona FROM persona WHERE dni = ?");
    $stmt->bind_param("s", $dni);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        echo json_encode(['success' => false, 'mensaje' => 'El DNI ya está registrado']);
        exit;
    }
}

$rol = 'paciente';

$stmt = $conn->prepare("INSERT INTO persona (nombre, apellidos, email, password, telefono, dni, fecha_nac, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssssss", $nombre, $apellidos, $email, $password, $telefono, $dni, $fecha_nac, $rol);

if ($stmt->execute()) {
    $id_nuevo = $conn->insert_id;

    $stmt2 = $conn->prepare("INSERT INTO pacientes (id_paciente) VALUES (?)");
    $stmt2->bind_param("i", $id_nuevo);
    $stmt2->execute();

    enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Registro exitoso']);
} else {
    enviarError(500, 'Error al registrar: ' . $conn->error, $conn);
}
?>