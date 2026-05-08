<?php
session_start();
require_once 'conexion.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['success' => false, 'mensaje' => 'Método no permitido']);
    exit;
}

$id_doctor = $_GET['id_doctor'] ?? null;
$fecha     = $_GET['fecha'] ?? null;

if (!$id_doctor || !$fecha) {
    echo json_encode(['success' => false, 'mensaje' => 'Faltan parámetros']);
    exit;
}

$conexion = obtenerConexion();

// 1. Obtener los turnos del doctor ese día
$stmt = $conexion->prepare("
    SELECT hora_inicio, hora_fin, duracion_slot
    FROM horarios_doctor
    WHERE id_doctor = ? AND fecha = ?
");
$stmt->bind_param("is", $id_doctor, $fecha);
$stmt->execute();
$turnos = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

if (empty($turnos)) {
    enviarRespuesta($conexion, ['success' => true, 'slots' => [], 'mensaje' => 'El doctor no trabaja ese día']);
}

// 2. Generar todos los slots de todos los turnos
$slots = [];
$ahora = date('H:i');
$esHoy = ($fecha === date('Y-m-d'));

foreach ($turnos as $turno) {
    $current = strtotime($fecha . ' ' . $turno['hora_inicio']);
    $fin     = strtotime($fecha . ' ' . $turno['hora_fin']);
    $dur     = $turno['duracion_slot'] * 60;

    while ($current < $fin) {
        $hora = date('H:i', $current);
        if (!$esHoy || $hora > $ahora) {
            $slots[] = $hora;
        }
        $current += $dur;
    }
}

// 3. Horas ocupadas (doctor O paciente)
$id_paciente = $_GET['id_paciente'] ?? $_SESSION['id'];
$stmt2 = $conexion->prepare("
    SELECT DATE_FORMAT(fecha_hora, '%H:%i') AS hora
    FROM citas
    WHERE DATE(fecha_hora) = ?
      AND estado != 'cancelada'
      AND (id_doctor = ? OR id_paciente = ?)
");
$stmt2->bind_param("sii", $fecha, $id_doctor, $id_paciente);
$stmt2->execute();
$filas = $stmt2->get_result()->fetch_all(MYSQLI_ASSOC);
$horasOcupadas = array_column($filas, 'hora');

// 4. Marcar cada slot
$resultado = array_map(fn($s) => [
    'hora'       => $s,
    'disponible' => !in_array($s, $horasOcupadas)
], $slots);

enviarRespuesta($conexion, ['success' => true, 'slots' => $resultado]);