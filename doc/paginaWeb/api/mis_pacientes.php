<?php
session_start();
header('Content-Type: application/json');
require_once 'conexion.php';

if (!isset($_SESSION['id']) || $_SESSION['rol'] !== 'doctor') {
    enviarError(403, 'Acceso no autorizado');
}

$conn = obtenerConexion();
$id_doctor = $_SESSION['id'];

$sql = "
    SELECT DISTINCT 
        pa.id_paciente, 
        p.nombre, 
        p.apellidos, 
        p.email, 
        p.telefono, 
        p.dni, 
        p.Foto
    FROM citas c
    JOIN pacientes pa ON c.id_paciente = pa.id_paciente
    JOIN persona p ON pa.id_paciente = p.id_persona
    WHERE c.id_doctor = ?
    ORDER BY p.apellidos ASC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_doctor);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows >= 0) {
    $pacientes = $result->fetch_all(MYSQLI_ASSOC);
    enviarRespuesta($conn, ['success' => true, 'datos' => $pacientes]);
} else {
    enviarError(404, 'Error al obtener pacientes', $conn);
}
?>