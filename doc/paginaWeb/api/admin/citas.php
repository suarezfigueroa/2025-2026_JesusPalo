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
    $sql = "
        SELECT c.*,
               CONCAT(pp.nombre,' ',pp.apellidos) AS nombre_paciente,
               CONCAT(pd.nombre,' ',pd.apellidos) AS nombre_doctor
        FROM citas c
        JOIN persona pp ON c.id_paciente = pp.id_persona
        JOIN persona pd ON c.id_doctor = pd.id_persona
        ORDER BY c.fecha_hora DESC
    ";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $citas = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    enviarRespuesta($conn, ['success' => true, 'datos' => $citas]);
}

if ($metodo == 'PUT') {
    $datos      = json_decode(file_get_contents("php://input"), true);
    $id_cita    = $datos['id_cita']    ?? '';
    $estado     = $datos['estado']     ?? '';
    $fecha_hora = $datos['fecha_hora'] ?? '';
    $motivo     = $datos['motivo']     ?? '';

    if (!$id_cita || !$estado || !$fecha_hora || !$motivo) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE citas SET estado = ?, fecha_hora = ?, motivo = ? WHERE id_cita = ?");
    $stmt->bind_param("sssi", $estado, $fecha_hora, $motivo, $id_cita);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Cita actualizada']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al actualizar']);
    }
}

if ($metodo == 'DELETE') {
    $datos   = json_decode(file_get_contents("php://input"), true);
    $id_cita = $datos['id_cita'] ?? '';

    if (!$id_cita) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM citas WHERE id_cita = ?");
    $stmt->bind_param("i", $id_cita);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Cita eliminada']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Error al eliminar']);
    }
}

$conn->close();
?>