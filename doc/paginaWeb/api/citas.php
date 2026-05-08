<?php
session_start();
header('Content-Type: application/json');
require_once 'conexion.php';

if (!isset($_SESSION['id']) || !isset($_SESSION['rol'])) {
    echo json_encode(['success' => false, 'mensaje' => 'No hay sesión activa']);
    exit;
}

$conn = obtenerConexion();
$id_persona = $_SESSION['id'];
$rol = $_SESSION['rol'];
$metodo = $_SERVER['REQUEST_METHOD'];

// =====================
// GET - Obtener citas
// =====================
if ($metodo === 'GET') {

    if ($rol === 'paciente') {
        $sql = "
            SELECT c.*, CONCAT(p.nombre, ' ', p.apellidos) AS nombre_doctor
            FROM citas c
            JOIN persona p ON c.id_doctor = p.id_persona
            WHERE c.id_paciente = ?
            ORDER BY c.fecha_hora DESC
        ";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id_persona);

    } elseif ($rol === 'doctor') {
        $sql = "
            SELECT c.*, CONCAT(p.nombre, ' ', p.apellidos) AS nombre_paciente
            FROM citas c
            JOIN persona p ON c.id_paciente = p.id_persona
            WHERE c.id_doctor = ?
            ORDER BY c.fecha_hora DESC
        ";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id_persona);

    } elseif ($rol === 'admin') {
        $sql = "
            SELECT c.*,
                   CONCAT(pp.nombre, ' ', pp.apellidos) AS nombre_paciente,
                   CONCAT(pd.nombre, ' ', pd.apellidos) AS nombre_doctor
            FROM citas c
            JOIN persona pp ON c.id_paciente = pp.id_persona
            JOIN persona pd ON c.id_doctor = pd.id_persona
            ORDER BY c.fecha_hora DESC
        ";
        $stmt = $conn->prepare($sql);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows >= 0) {
        $citas = $result->fetch_all(MYSQLI_ASSOC);
        enviarRespuesta($conn, ['success' => true, 'datos' => $citas]);
    } else {
        enviarError(404, 'Error al obtener citas', $conn);
    }
}

// =====================
// POST - Crear cita (paciente)
// =====================
if ($metodo === 'POST') {
    if ($rol !== 'paciente') {
        enviarError(403, 'Solo los pacientes pueden crear citas', $conn);
    }

    $datos = json_decode(file_get_contents("php://input"), true);
    $id_doctor  = $datos['id_doctor'] ?? '';
    $fecha_hora = $datos['fecha_hora'] ?? '';
    $motivo     = $datos['motivo'] ?? '';

    if (!$id_doctor || !$fecha_hora || !$motivo) {
        enviarError(400, 'Faltan datos', $conn);
    }

    // Comprobar disponibilidad del doctor
    $stmt = $conn->prepare("SELECT id_cita FROM citas WHERE id_doctor = ? AND fecha_hora = ? AND estado != 'cancelada'");
    $stmt->bind_param("is", $id_doctor, $fecha_hora);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        enviarError(400, 'El doctor ya tiene una cita a esa hora', $conn);
    }

    $estado = 'pendiente';
    $stmt = $conn->prepare("INSERT INTO citas (id_paciente, id_doctor, fecha_hora, motivo, estado) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("iisss", $id_persona, $id_doctor, $fecha_hora, $motivo, $estado);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Cita solicitada correctamente']);
    } else {
        enviarError(500, 'Error al crear la cita', $conn);
    }
}

// =====================
// PUT - Actualizar estado (doctor/admin)
// =====================
if ($metodo === 'PUT') {
    if (!in_array($rol, ['doctor', 'admin'])) {
        enviarError(403, 'No autorizado', $conn);
    }

    $datos = json_decode(file_get_contents("php://input"), true);
    $id_cita = $datos['id_cita'] ?? '';
    $estado  = $datos['estado'] ?? '';

    if (!$id_cita || !$estado) {
        enviarError(400, 'Faltan datos', $conn);
    }

    $stmt = $conn->prepare("UPDATE citas SET estado = ? WHERE id_cita = ?");
    $stmt->bind_param("si", $estado, $id_cita);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Cita actualizada']);
    } else {
        enviarError(500, 'Error al actualizar', $conn);
    }
}

// =====================
// DELETE - Cancelar cita
// =====================
if ($metodo === 'DELETE') {
    $datos = json_decode(file_get_contents("php://input"), true);
    $id_cita = $datos['id_cita'] ?? '';

    if (!$id_cita) {
        enviarError(400, 'Faltan datos', $conn);
    }

    $estado = 'cancelada';
    $stmt = $conn->prepare("UPDATE citas SET estado = ? WHERE id_cita = ?");
    $stmt->bind_param("si", $estado, $id_cita);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Cita cancelada']);
    } else {
        enviarError(500, 'Error al cancelar', $conn);
    }
}

$conn->close();
?>