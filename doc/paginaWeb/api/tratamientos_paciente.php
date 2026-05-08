<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();
header('Content-Type: application/json');
require_once 'conexion.php';

if (!isset($_SESSION['id']) || $_SESSION['rol'] !== 'paciente') {
    echo json_encode(['success' => false, 'mensaje' => 'Acceso no autorizado']);
    exit;
}

$conn = obtenerConexion();
$id_paciente = $_SESSION['id'];
$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo == 'GET') {
    $sql = "
        SELECT t.id_tratamiento, t.nombre_tratamiento, t.descripcion, t.duracion, t.precio, t.foto,
               pt.id_paciente, pt.fecha_inicio, pt.fecha_fin,
               pt.pago, pt.metodo_pago, pt.fecha_pago
        FROM pacientes_tratamientos pt
        JOIN tratamientos t ON pt.id_tratamiento = t.id_tratamiento
        WHERE pt.id_paciente = ?
        ORDER BY pt.fecha_inicio DESC
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_paciente);
    $stmt->execute();
    $tratamientos = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    enviarRespuesta($conn, ['success' => true, 'datos' => $tratamientos]);
}

if ($metodo == 'POST') {
    $datos        = json_decode(file_get_contents("php://input"), true);
    $id_tratamiento = $datos['id_tratamiento'] ?? '';
    $metodo_pago  = $datos['metodo_pago'] ?? '';

    if (!$id_tratamiento || !$metodo_pago) {
        echo json_encode(['success' => false, 'mensaje' => 'Faltan datos']);
        exit;
    }

    $stmt = $conn->prepare("
        UPDATE pacientes_tratamientos 
        SET pago = 'pagado', metodo_pago = ?, fecha_pago = NOW()
        WHERE id_paciente = ? AND id_tratamiento = ? AND pago = 'pendiente'
    ");
    $stmt->bind_param("sii", $metodo_pago, $id_paciente, $id_tratamiento);

    if ($stmt->execute() && $stmt->affected_rows > 0) {
        enviarRespuesta($conn, ['success' => true, 'mensaje' => 'Pago realizado correctamente']);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'No se pudo procesar el pago']);
    }
}

$conn->close();
?>