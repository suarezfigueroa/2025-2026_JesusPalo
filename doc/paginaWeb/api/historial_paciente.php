<?php
session_start();
header('Content-Type: application/json');
require_once 'conexion.php';

if (!isset($_SESSION['id']) || $_SESSION['rol'] !== 'doctor') {
    echo json_encode(['success' => false, 'mensaje' => 'Acceso no autorizado']);
    exit;
}

$conn = obtenerConexion();
$id_doctor  = $_SESSION['id'];
$id_paciente = $_GET['id_paciente'] ?? '';

if (!$id_paciente) {
    echo json_encode(['success' => false, 'mensaje' => 'Falta id_paciente']);
    exit;
}

// Citas del paciente con este doctor
$sql_citas = "
    SELECT id_cita, fecha_hora, motivo, estado
    FROM citas
    WHERE id_paciente = ? AND id_doctor = ?
    ORDER BY fecha_hora DESC
";
$stmt = $conn->prepare($sql_citas);
$stmt->bind_param("ii", $id_paciente, $id_doctor);
$stmt->execute();
$citas = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Tratamientos asignados al paciente
$sql_tratamientos = "
    SELECT t.nombre_tratamiento, t.descripcion, t.foto,
           pt.fecha_inicio, pt.fecha_fin
    FROM pacientes_tratamientos pt
    JOIN tratamientos t ON pt.id_tratamiento = t.id_tratamiento
    WHERE pt.id_paciente = ?
    ORDER BY pt.fecha_inicio DESC
";
$stmt = $conn->prepare($sql_tratamientos);
$stmt->bind_param("i", $id_paciente);
$stmt->execute();
$tratamientos = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

echo json_encode([
    'success'      => true,
    'citas'        => $citas,
    'tratamientos' => $tratamientos
]);

$conn->close();
?>