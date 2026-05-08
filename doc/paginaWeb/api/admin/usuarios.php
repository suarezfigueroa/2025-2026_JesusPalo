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
    $sql = "SELECT id_persona, nombre, apellidos, email, telefono, dni, fecha_nac, rol, Foto FROM persona ORDER BY rol, apellidos";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $usuarios = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    enviarRespuesta($conn, ['success' => true, 'datos' => $usuarios]);
}


if ($metodo == 'POST') {
    $datos     = json_decode(file_get_contents("php://input"), true);
    $nombre    = $datos['nombre'] ?? '';
    $apellidos = $datos['apellidos'] ?? '';
    $email     = $datos['email'] ?? '';
    $password  = $datos['password'] ?? '';
    $telefono  = $datos['telefono'] ?? '';
    $dni       = $datos['dni'] ?? '';
    $rol       = $datos['rol'] ?? 'paciente';

    if (!$nombre || !$apellidos || !$email || !$password) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
        exit;
    }

    $stmt = $conn->prepare("SELECT id_persona FROM persona WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        echo json_encode(['success' => false, 'mensaje' => 'El email ya está registrado']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO persona (nombre, apellidos, email, password, telefono, dni, rol) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $nombre, $apellidos, $email, $password, $telefono, $dni, $rol);

    if ($stmt->execute()) {
        $id_nuevo = $conn->insert_id;
        if ($rol === 'paciente') {
            $stmt2 = $conn->prepare("INSERT INTO pacientes (id_paciente) VALUES (?)");
            $stmt2->bind_param("i", $id_nuevo);
            $stmt2->execute();
        }
        if ($rol === 'doctor') {
            $stmt2 = $conn->prepare("INSERT INTO doctores (id_doctor) VALUES (?)");
            $stmt2->bind_param("i", $id_nuevo);
            $stmt2->execute();
        }
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Usuario creado correctamente']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al crear: ' . $conn->error]);
    }
}


if ($metodo == 'PUT') {
    $datos = json_decode(file_get_contents("php://input"), true);
    $id       = $datos['id_persona'] ?? '';
    $nombre   = $datos['nombre'] ?? '';
    $apellidos= $datos['apellidos'] ?? '';
    $email    = $datos['email'] ?? '';
    $telefono = $datos['telefono'] ?? '';
    $dni      = $datos['dni'] ?? '';
    $rol      = $datos['rol'] ?? '';

    if (!$id || !$nombre || !$apellidos || !$email || !$rol) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
        exit;
    }

    // Si cambia a doctor, crear registro en doctores si no existe
    if ($rol == 'doctor') {
        $stmt = $conn->prepare("SELECT id_doctor FROM doctores WHERE id_doctor = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        if ($stmt->get_result()->num_rows === 0) {
            $stmt = $conn->prepare("INSERT INTO doctores (id_doctor) VALUES (?)");
            $stmt->bind_param("i", $id);
            $stmt->execute();
        }
    }

    // Si cambia a paciente, crear registro en pacientes si no existe
    if ($rol == 'paciente') {
        $stmt = $conn->prepare("SELECT id_paciente FROM pacientes WHERE id_paciente = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        if ($stmt->get_result()->num_rows === 0) {
            $stmt = $conn->prepare("INSERT INTO pacientes (id_paciente) VALUES (?)");
            $stmt->bind_param("i", $id);
            $stmt->execute();
        }
    }

    $stmt = $conn->prepare("UPDATE persona SET nombre=?, apellidos=?, email=?, telefono=?, dni=?, rol=? WHERE id_persona=?");
    $stmt->bind_param("ssssssi", $nombre, $apellidos, $email, $telefono, $dni, $rol, $id);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Usuario actualizado']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al actualizar']);
    }
}

if ($metodo == 'DELETE') {
    $datos = json_decode(file_get_contents("php://input"), true);
    $id = $datos['id_persona'] ?? '';

    if (!$id) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM persona WHERE id_persona = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Usuario eliminado']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al eliminar']);
    }
}




$conn->close();
?>