// ============================================================
//  CONFIG.JS — Constantes de API y rutas de vistas
// ============================================================

const URL_API_DOCTORES            = "api/doctores.php";
const URL_API_TRATAMIENTOS        = "api/tratamientos.php";
const URL_API_LOGIN               = "api/login.php";
const URL_API_REGISTRO            = "api/registro.php";
const URL_API_LOGOUT              = "api/logout.php";
const URL_API_SESION              = "api/sesion.php";
const URL_API_CITAS               = "api/citas.php";
const URL_API_MIS_PACIENTES       = "api/mis_pacientes.php";
const URL_API_ASIGNAR_TRATAMIENTO = "api/asignar_tratamiento.php";
const URL_API_MIS_TRATAMIENTOS    = "api/tratamientos_paciente.php";
const URL_API_HISTORIAL           = "api/historial_paciente.php";
const URL_API_CITA_DOCTOR         = "api/cita_doctor.php";
const URL_ADMIN_HORARIOS          = "api/admin/horarios.php";

const URL_ADMIN_USUARIOS          = "api/admin/usuarios.php";
const URL_ADMIN_CITAS             = "api/admin/citas.php";
const URL_ADMIN_TRATAMIENTOS      = "api/admin/tratamientos.php";
const URL_ADMIN_MAQUINARIA        = "api/admin/maquinaria.php";
const URL_ADMIN_PRODUCTOS         = "api/admin/productos.php";

const rutas = {
  home:              "vistas/home.html",
  tratamientos:      "vistas/tratamientos.html",
  sobreNosotros:     "vistas/sobreNosotros.html",
  clinica:           "vistas/clinica.html",
  contacto:          "vistas/contacto.html",
  login:             "vistas/login.html",
  registro:          "vistas/registro.html",
  perfil:            "vistas/perfil.html",
  admin:             "vistas/admin.html",
  paginaNoEncontrada:"vistas/404.html",
};

const estadoBadges = {
  pendiente:  { color: "#f59e0b", icono: "schedule" },
  confirmada: { color: "#22c55e", icono: "check_circle" },
  cancelada:  { color: "#ef4444", icono: "cancel" },
  completada: { color: "#6399d3", icono: "task_alt" },
};

// Helper para rutas de fotos
function rutaFoto(foto, fallback = "img/icono-de-usuario.png") {
  return foto ? `${foto}?v=${Date.now()}` : fallback;
}