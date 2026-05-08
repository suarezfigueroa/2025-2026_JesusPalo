<?php
// ============================================================
//  api/contacto.php — Envío con PHPMailer + Gmail SMTP
// ============================================================

header("Content-Type: application/json");

require_once __DIR__ . '/../phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/../phpmailer/src/SMTP.php';
require_once __DIR__ . '/../phpmailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Leer .env
function cargarEnv($ruta) {
    if (!file_exists($ruta)) return;
    foreach (file($ruta, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $linea) {
        if (str_starts_with(trim($linea), '#')) continue;
        [$clave, $valor] = explode('=', $linea, 2);
        $_ENV[trim($clave)] = trim($valor);
    }
}
cargarEnv(__DIR__ . '/../.env');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "mensaje" => "Método no permitido"]);
    exit;
}

$datos    = json_decode(file_get_contents("php://input"), true);
$nombre   = trim($datos["nombre"]   ?? "");
$email    = trim($datos["email"]    ?? "");
$telefono = trim($datos["telefono"] ?? "");
$mensaje  = trim($datos["mensaje"]  ?? "");

if (!$nombre || !$email || !$mensaje) {
    echo json_encode(["success" => false, "mensaje" => "Rellena todos los campos obligatorios"]);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "mensaje" => "El email no es válido"]);
    exit;
}
if (strlen($mensaje) < 10) {
    echo json_encode(["success" => false, "mensaje" => "El mensaje es demasiado corto"]);
    exit;
}

$gmailUsuario  = $_ENV['MAIL_USER']     ?? '';
$gmailPassword = $_ENV['MAIL_PASSWORD'] ?? '';
$emailDestino  = $_ENV['MAIL_DESTINO']  ?? '';

try {
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host       = "smtp.gmail.com";
    $mail->SMTPAuth   = true;
    $mail->Username   = $gmailUsuario;
    $mail->Password   = $gmailPassword;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = "UTF-8";

    $mail->setFrom($gmailUsuario, "Formulario Zafisio");
    $mail->addAddress($emailDestino, "Zafisio");
    $mail->addReplyTo($email, $nombre);

    $mail->isHTML(false);
    $mail->Subject = "Solicitud de contacto de $nombre";
    $mail->Body    = "Nombre:   $nombre\nEmail:    $email\nTeléfono: " . ($telefono ?: "No facilitado") . "\n\nMensaje:\n$mensaje";

    $mail->send();
    echo json_encode(["success" => true, "mensaje" => "Mensaje enviado correctamente"]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "mensaje" => "No se pudo enviar: " . $mail->ErrorInfo]);
}