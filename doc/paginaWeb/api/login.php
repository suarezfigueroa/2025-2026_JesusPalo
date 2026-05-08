<?php
session_start();
header('Content-Type: application/json');
require_once 'conexion.php';

$conn = obtenerConexion();

$datos = json_decode(file_get_contents("php://input"), true);
$email    = $datos['email'] ?? '';
$password = $datos['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM persona WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$usuario = $stmt->get_result()->fetch_assoc();

if (!$usuario || $password !== $usuario['password']) {
    echo json_encode(['success' => false, 'mensaje' => 'Email o contraseña incorrectos']);
    exit;
}

// Guardar sesión
$_SESSION['id']     = $usuario['id_persona'];
$_SESSION['nombre'] = $usuario['nombre'];
$_SESSION['rol']    = $usuario['rol'];
$_SESSION['foto'] = $usuario['Foto'];

enviarRespuesta($conn, [
    'success' => true,
    'usuario' => [
        'id'       => $usuario['id_persona'],
        'nombre'   => $usuario['nombre'],
        'apellidos'=> $usuario['apellidos'],
        'email'    => $usuario['email'],
        'rol'      => $usuario['rol'],
        'foto'     => $usuario['Foto']
    ]
]);
?>