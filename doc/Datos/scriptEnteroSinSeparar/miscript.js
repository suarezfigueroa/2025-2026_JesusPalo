const URL_API_DOCTORES = "api/doctores.php";
const URL_API_TRATAMIENTOS = "api/tratamientos.php";
const URL_API_LOGIN = "api/login.php";
const URL_API_REGISTRO = "api/registro.php";
const URL_API_LOGOUT = "api/logout.php";
const URL_API_SESION = "api/sesion.php";
const URL_API_CITAS = "api/citas.php";
const URL_API_MIS_PACIENTES = "api/mis_pacientes.php";
const URL_API_ASIGNAR_TRATAMIENTO = "api/asignar_tratamiento.php";
const URL_API_MIS_TRATAMIENTOS = "api/tratamientos_paciente.php";
const URL_API_HISTORIAL = "api/historial_paciente.php";
const URL_API_CITA_DOCTOR = "api/cita_doctor.php";
const URL_ADMIN_HORARIOS = "api/admin/horarios.php";

const rutas = {
  home: "vistas/home.html",
  tratamientos: "vistas/tratamientos.html",
  sobreNosotros: "vistas/sobreNosotros.html",
  clinica: "vistas/clinica.html",
  contacto: "vistas/contacto.html",
  login: "vistas/login.html",
  registro: "vistas/registro.html",
  perfil: "vistas/perfil.html",
  admin: "vistas/admin.html",
  paginaNoEncontrada: "vistas/404.html",
};

// *** HELPER RUTAS DE FOTOS ***
function rutaFoto(foto, fallback = "img/icono-de-usuario.png") {
  return foto ? foto : fallback;
}

//  nav y toggle declarados aquí para que todo el código los pueda usar
const nav = document.querySelector("nav");
const toggle = document.querySelector(".menu-toggle");

// ******NAVEGACIÓN POR CLICKS *****
nav.addEventListener("click", (e) => {
  if (e.target.classList.contains("nav-link")) {
    location.hash = e.target.dataset.link;
    nav.classList.remove("open");
  }
});


//  NAVEGACIÓN CON FLECHAS ATRÁS/ADELANTE
// Un único punto que gestiona toda la navegación
window.addEventListener("hashchange", () => {
  const pagina = location.hash.slice(1);
  paginaActual = null;
  cargarVista(rutas[pagina] ? pagina : "paginaNoEncontrada"); // ← si está vacío carga home
  console.log("HASHCHANGE:", location.hash);
});

// **** LOGO LLEVA A HOME *****
document.querySelector(".logo").addEventListener("click", () => {
  location.hash = "home";
});

//*** TOGGLE MENÚ MÓVIL ****
toggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

// **** SCROLL HEADER ****
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ****** CARGAR VISTAS *****
let paginaActual = null;

async function cargarVista(nombre) {
  if (nombre == paginaActual) return;
  paginaActual = nombre;
  
if (location.hash.slice(1) !== nombre) {
  location.hash = nombre;
}


  const contenido = document.querySelector("#contenido");
  contenido.innerHTML = '<p class="cargando">Cargando...</p>';

  try {
    const res = await fetch(rutas[nombre]);
    if (!res.ok) throw new Error("Vista no encontrada");
    const html = await res.text();
    contenido.innerHTML = html;
    window.scrollTo({ top: 0, behavior: "smooth" });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
      if (link.dataset.link == nombre) link.classList.add("active");
    });

    if (nombre == "sobreNosotros") {
      pintarDoctores();
      
    }
    if (nombre == "tratamientos") {
      pintarTratamientos();
    }

    if (nombre == "home") {
      pintarTratamientosHome();

    }

    if (nombre == "clinica") {
      iniciarCarrusel();
        
    }

    if (nombre == "login") {
      iniciarLogin();
    }
    if (nombre == "registro") {
      iniciarRegistro();
    }

    if (nombre == "perfil") {
      iniciarPerfil();
    }

    if (nombre == "admin") {
      iniciarAdmin();
    }

    
  } catch {
    contenido.innerHTML =
      '<p class="error-vista">No se pudo cargar la sección.</p>';
   
}
}
//FUNCIONES PARA PINTAR VISTAS
// ******* DOCTORES *****
async function pintarDoctores() {
  const contenedorDoctores = document.querySelector("#contenedor-doctores");
  try {
    const response = await fetch(URL_API_DOCTORES);
    const { success, datos } = await response.json();

    if (success) {
      contenedorDoctores.innerHTML = "";
      datos.forEach((doctor) => {
        contenedorDoctores.appendChild(crearCardDoctor(doctor));
      });
    } else {
      alert("Error al cargar los doctores.");
    }
  } catch (err) {
    console.error(err);
    alert("Error al cargar los doctores.");
  }
}

async function pintarTratamientos() {
  const contenedorTratamientos = document.querySelector(
    "#contenedor-tratamientos",
  );
  try {
    const response = await fetch(URL_API_TRATAMIENTOS);
    const { success, datos } = await response.json();

    if (success) {
      contenedorTratamientos.innerHTML = "";
      datos.forEach((tratamiento) => {
        contenedorTratamientos.appendChild(crearCardTratamiento(tratamiento));
      });
    } else {
      alert("Error al cargar los tratamientos.");
    }
  } catch (err) {
    console.error(err);
    alert("Error al cargar los tratamientos.");
  }
}

async function pintarTratamientosHome() {
  const contenedor = document.querySelector("#contenedor-tratamientos-home");
  if (!contenedor) return;

  try {
    const response = await fetch(URL_API_TRATAMIENTOS);
    const { success, datos } = await response.json();

    if (success) {
      // Mezclar aleatoriamente y coger los 3 primeros
      const aleatorios = datos.sort(() => Math.random() - 0.5).slice(0, 3);

      contenedor.innerHTML = "";
      aleatorios.forEach((tratamiento) => {
        contenedor.appendChild(crearCardTratamiento(tratamiento));
      });
    }
  } catch (err) {
    console.error(err);
  }
}


// ***** INICIAR FORMULARIO LOGIN ******
function iniciarLogin() {
  document
    .querySelector("#form-login")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.querySelector("#login-email").value;
      const password = document.querySelector("#login-password").value;
      const error = document.querySelector("#auth-error");
      const btn = document.querySelector(".auth-btn");

      btn.disabled = true;
      btn.innerHTML =
        '<span class="material-symbols-outlined">hourglass_empty</span><span>Entrando...</span>';

      const data = await login(email, password);

      if (!data.success) {
        error.textContent = data.mensaje;
        error.style.display = "block";
        btn.disabled = false;
        btn.innerHTML =
          '<span class="material-symbols-outlined">login</span><span>Iniciar Sesión</span>';
      }
    });

  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      if (input.type == "password") {
        input.type = "text";
        btn.querySelector("span").textContent = "visibility_off";
      } else {
        input.type = "password";
        btn.querySelector("span").textContent = "visibility";
      }
    });
  });
}

// ***** INICIAR FORMULARIO REGISTRO *****
function iniciarRegistro() {
  document
    .querySelector("#form-registro")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const error = document.querySelector("#registro-error");
      const exito = document.querySelector("#registro-exito");
      const btn = document.querySelector(".auth-btn");

      error.style.display = "none";
      exito.style.display = "none";

      const password = document.querySelector("#reg-password").value;
      const password2 = document.querySelector("#reg-password2").value;

      if (password !== password2) {
        error.textContent = "Las contraseñas no coinciden";
        error.style.display = "block";
        return;
      }

      if (password.length < 6) {
        error.textContent = "La contraseña debe tener al menos 6 caracteres";
        error.style.display = "block";
        return;
      }

      btn.disabled = true;
      btn.innerHTML =
        '<span class="material-symbols-outlined">hourglass_empty</span><span>Registrando...</span>';

      const datosRegistro = {
        nombre: document.querySelector("#reg-nombre").value,
        apellidos: document.querySelector("#reg-apellidos").value,
        email: document.querySelector("#reg-email").value,
        password: password,
        telefono: document.querySelector("#reg-telefono").value,
        dni: document.querySelector("#reg-dni").value,
        fecha_nac: document.querySelector("#reg-fecha").value,
      };

      console.log("Datos:", datosRegistro);
      const data = await registro(datosRegistro);

      if (data.success) {
        exito.textContent = "¡Cuenta creada correctamente! Redirigiendo...";
        exito.style.display = "block";
        setTimeout(() => cargarVista("login"), 2000);
      } else {
        error.textContent = data.mensaje;
        error.style.display = "block";
        btn.disabled = false;
        btn.innerHTML =
          '<span class="material-symbols-outlined">person_add</span><span>Crear Cuenta</span>';
      }
    });

  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      if (input.type == "password") {
        input.type = "text";
        btn.querySelector("span").textContent = "visibility_off";
      } else {
        input.type = "password";
        btn.querySelector("span").textContent = "visibility";
      }
    });
  });
}

// ***** PERFIL *****
async function iniciarPerfil() { 
  
  if (!usuarioActual) {
    cargarVista("login");
    return;
  }

  try {
    const res = await fetch("api/perfil.php");
    const { success, datos } = await res.json();

    if (success) {
      // Rellenar avatar sidebar
      document.querySelector("#perfil-foto").src = rutaFoto(datos.Foto);
      document.querySelector("#perfil-nombre-sidebar").textContent = datos.nombre + " " + datos.apellidos;
      document.querySelector("#perfil-rol-badge").textContent = datos.rol;

      // Rellenar formulario
      document.querySelector("#perfil-nombre").value    = datos.nombre;
      document.querySelector("#perfil-apellidos").value = datos.apellidos;
      document.querySelector("#perfil-email").value     = datos.email;
      document.querySelector("#perfil-telefono").value  = datos.telefono || "";
      document.querySelector("#perfil-dni").value       = datos.dni || "";
      document.querySelector("#perfil-fecha").value     = datos.fecha_nac || "";
      document.querySelector("#perfil-direccion").value = datos.direccion || "";

      // Cambio de foto
      document.querySelector("#perfil-foto-input").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("foto", file);
        const res = await fetch("api/subir_foto.php", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) {
          document.querySelector("#perfil-foto").src = rutaFoto(data.foto);
          usuarioActual.foto = data.foto;
          actualizarBotonSesion();  
          document.querySelector("#perfil-foto-borrar").style.display = "flex";        
        } else {
          alert(data.mensaje);
        }
        
      });

      // Mostrar botón borrar solo si tiene foto
      if (datos.Foto) {
        document.querySelector("#perfil-foto-borrar").style.display = "flex";
      }

      // Borrar foto
      document.querySelector("#perfil-foto-borrar").addEventListener("click", async () => {
        if (!confirm("¿Seguro que quieres eliminar tu foto de perfil?")) return;
        const res = await fetch("api/borrar_foto.php", { method: "POST" });
        const data = await res.json();
        if (data.success) {
          document.querySelector("#perfil-foto").src = "img/icono-de-usuario.png";
          document.querySelector("#perfil-foto-borrar").style.display = "none";
          usuarioActual.foto = null;
          actualizarBotonSesion();        
        } else {
          alert(data.mensaje);
        }

       
      });

      // Mostrar botones según rol dejando que el CSS controle el display
      const rol = datos.rol;
      document.querySelectorAll(".perfil-nav-btn[data-seccion]").forEach(btn => {
        const esDeRol = btn.className.includes("rol-");
        const esDeEsteRol = btn.classList.contains(`rol-${rol}`);
        if (!esDeRol || esDeEsteRol) {
          btn.style.display = ""; // ← deja que CSS decida
        } else {
          btn.style.display = "none";
        }
      });
    }
  } catch (err) {
    console.error(err);
  }

// Navegación entre secciones
document.querySelectorAll(".perfil-nav-btn[data-seccion]").forEach(btn => {
  btn.addEventListener("click", () => {
    const seccion = btn.dataset.seccion;

    // Admin va a su propia página
    if (seccion == "admin") {
      cargarVista("admin");
      return;
    }

    document.querySelectorAll(".perfil-nav-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".perfil-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.querySelector(`#seccion-${seccion}`).classList.add("active");

    if (seccion == "citas") {
      if (usuarioActual.rol == "paciente") iniciarCitasPaciente();
      if (usuarioActual.rol == "doctor") iniciarCitasDoctor();
    }
    if (seccion == "pacientes") iniciarPacientesDoctor();
    if (seccion == "tratamientos") iniciarTratamientosPaciente();
  });
});


  // Cerrar sesión
  document.querySelector("#btn-logout").addEventListener("click", () => {
    logout();
  });

  // Guardar datos
  document.querySelector("#form-perfil").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.querySelector("#perfil-msg");
    const btn = e.target.querySelector("button[type=submit]");
    btn.disabled = true;

    const res = await fetch("api/perfil.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre:    document.querySelector("#perfil-nombre").value,
        apellidos: document.querySelector("#perfil-apellidos").value,
        email:     document.querySelector("#perfil-email").value,
        telefono:  document.querySelector("#perfil-telefono").value,
        dni:       document.querySelector("#perfil-dni").value,
        fecha_nac: document.querySelector("#perfil-fecha").value,
        direccion: document.querySelector("#perfil-direccion").value,
      })
    });

    const data = await res.json();
    msg.style.display = "block";
    if (data.success) {
      msg.className = "auth-mensaje exito";
      msg.textContent = "Datos actualizados correctamente";
      usuarioActual.nombre = document.querySelector("#perfil-nombre").value;
      actualizarBotonSesion();
    } else {
      msg.className = "auth-mensaje error";
      msg.textContent = data.mensaje;
    }

    btn.disabled = false;
    setTimeout(() => msg.style.display = "none", 3000);
  });
}



const estadoBadges = {
  pendiente:  { color: "#f59e0b", icono: "schedule" },
  confirmada: { color: "#22c55e", icono: "check_circle" },
  cancelada:  { color: "#ef4444", icono: "cancel" },
  completada: { color: "#6399d3", icono: "task_alt" },
};

// ***** CITAS PACIENTE *****
async function iniciarCitasPaciente() {
  const contenedor = document.querySelector("#contenedor-citas");
  contenedor.innerHTML = '<p class="cargando">Cargando citas...</p>';

  try {
    const res = await fetch(URL_API_CITAS);
    const { success, datos } = await res.json();

    if (success) {
      contenedor.innerHTML = `
        <div class="citas-header">
          <button class="buttons btn-nueva-cita" id="btn-nueva-cita">
            <span class="material-symbols-outlined">add</span>
            <span>Nueva cita</span>
          </button>
        </div>
        <div id="lista-citas"></div>
        <div id="form-nueva-cita" style="display:none;"></div>
      `;

      const lista = document.querySelector("#lista-citas");
      añadirBuscadorCards("lista-citas", "cita-card", ["cita-doctor", "cita-motivo", "cita-estado-texto"]);
      if (datos.length == 0) {
        lista.innerHTML = '<p class="sin-datos">No tienes citas registradas.</p>';
      } else {
        datos.forEach(cita => lista.appendChild(crearCardCita(cita)));
      }

      document.querySelector("#btn-nueva-cita").addEventListener("click", () => {
        const form = document.querySelector("#form-nueva-cita");
        if (form.style.display == "none") {
          mostrarFormNuevaCita();
          form.style.display = "block";
        } else {
          form.style.display = "none";
        }
      });
    }
  } catch (err) {
    console.error(err);
    contenedor.innerHTML = '<p class="error-vista">Error al cargar las citas.</p>';
  }
}

function crearCardCita(cita) {
  const clon = document.querySelector("#template-cita-paciente").content.cloneNode(true);
  const card = clon.querySelector(".cita-card");
  card.classList.add(`estado-${cita.estado}`);

  const badge = estadoBadges[cita.estado] || { color: "#6b7280", icono: "help" };
  const fecha = new Date(cita.fecha_hora).toLocaleString("es-ES", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });

  clon.querySelector(".cita-estado").style.color = badge.color;
  clon.querySelector(".cita-estado-icono").textContent = badge.icono;
  clon.querySelector(".cita-estado-texto").textContent = cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1);
  clon.querySelector(".cita-fecha-texto").textContent = fecha;
  clon.querySelector(".cita-doctor").textContent = "Dr. " + cita.nombre_doctor;
  clon.querySelector(".cita-motivo").textContent = cita.motivo;

  if (cita.estado == "pendiente" || cita.estado == "confirmada") {
    const footer = clon.querySelector(".cita-footer-cancelar");
    footer.style.display = "flex";
    footer.querySelector(".btn-cancelar-cita").addEventListener("click", async () => {
      if (!confirm("¿Seguro que quieres cancelar esta cita?")) return;
      const res = await fetch(URL_API_CITAS, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_cita: cita.id_cita })
      });
      const data = await res.json();
      if (data.success) iniciarCitasPaciente();
      else alert(data.mensaje);
    });
  }

  return clon;
}


async function mostrarFormNuevaCita() {
  const modal = document.querySelector("#modal-nueva-cita");
  const form  = modal.querySelector("#form-nueva-cita");

  modal.classList.add("visible");

  modal.querySelector("#btn-cerrar-nueva-cita").addEventListener("click", () => modal.classList.remove("visible"));
  modal.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("visible"); });

  form.innerHTML = '<p class="cargando">Cargando doctores...</p>';

  const res = await fetch(URL_API_DOCTORES);
  const { success, datos } = await res.json();
  if (!success) {
    form.innerHTML = '<p class="error-vista">Error al cargar los doctores.</p>';
    return;
  }

  const clon = document.querySelector("#template-form-nueva-cita").content.cloneNode(true);
  const selectDoctor = clon.querySelector("#cita-doctor");
  datos.forEach(d => {
    const option = document.createElement("option");
    option.value = d.id_persona;
    option.textContent = `Dr. ${d.nombre} ${d.apellidos}`;
    selectDoctor.appendChild(option);
  });

  // Fecha mínima hoy, sin fines de semana
  const fechaInput  = clon.querySelector("#cita-fecha");
  const horaSelect  = clon.querySelector("#cita-hora");
  fechaInput.min = new Date().toISOString().slice(0, 10);

  form.innerHTML = "";
  form.appendChild(clon);

  // Cargar slots cuando cambie doctor o fecha
  async function cargarSlots() {
    const id_doctor = form.querySelector("#cita-doctor").value;
    const fecha     = form.querySelector("#cita-fecha").value;
    const horaSelect = form.querySelector("#cita-hora");

    if (!id_doctor || !fecha) return;

    // Bloquear fines de semana
    const dia = new Date(fecha + "T00:00:00").getDay();
    if (dia === 0 || dia === 6) {
      horaSelect.innerHTML = '<option value="">Solo días laborables (L-V)</option>';
      horaSelect.disabled = true;
      return;
    }

    horaSelect.innerHTML = '<option value="">Cargando horarios...</option>';
    horaSelect.disabled = true;

    const res  = await fetch(`api/horarios_disponibles.php?id_doctor=${id_doctor}&fecha=${fecha}`);
    const data = await res.json();

    if (!data.slots || data.slots.length === 0) {
      horaSelect.innerHTML = '<option value="">El doctor no trabaja ese día</option>';
      return;
    }

    horaSelect.innerHTML = '<option value="">-- Elige hora --</option>';
    data.slots.forEach(slot => {
      const opt = document.createElement("option");
      opt.value = slot.hora;
      opt.textContent = slot.disponible ? slot.hora : `${slot.hora} (ocupado)`;
      opt.disabled = !slot.disponible;
      horaSelect.appendChild(opt);
    });

    horaSelect.disabled = false;
  }

  form.querySelector("#cita-doctor").addEventListener("change", cargarSlots);
  form.querySelector("#cita-fecha").addEventListener("change", cargarSlots);

  // Enviar cita
  form.querySelector("#btn-enviar-cita").addEventListener("click", async () => {
    const id_doctor  = form.querySelector("#cita-doctor").value;
    const fecha      = form.querySelector("#cita-fecha").value;
    const hora       = form.querySelector("#cita-hora").value;
    const motivo     = form.querySelector("#cita-motivo").value;
    const msg        = form.querySelector("#cita-msg");
    const btn        = form.querySelector("#btn-enviar-cita");

    if (!id_doctor || !fecha || !hora || !motivo) {
      msg.className = "auth-mensaje error";
      msg.textContent = "Rellena todos los campos";
      msg.style.display = "block";
      return;
    }

    const fecha_hora = `${fecha} ${hora}:00`;

    btn.disabled = true;
    const res = await fetch(URL_API_CITAS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_doctor, fecha_hora, motivo })
    });

    const data = await res.json();
    msg.style.display = "block";
    if (data.success) {
      msg.className = "auth-mensaje exito";
      msg.textContent = "¡Cita solicitada correctamente!";
      iniciarCitasPaciente();
      setTimeout(() => modal.classList.remove("visible"), 1500);
    } else {
      msg.className = "auth-mensaje error";
      msg.textContent = data.mensaje;
      btn.disabled = false;
    }
  });
}



// ***** CITAS DOCTOR *****
async function iniciarCitasDoctor() {
  const contenedor = document.querySelector("#contenedor-citas");
  contenedor.innerHTML = '<p class="cargando">Cargando citas...</p>';

  try {
    const res = await fetch(URL_API_CITAS);
    const { success, datos } = await res.json();

    if (!success) throw new Error();

    contenedor.innerHTML = `
      <div class="citas-filtros">
        <button class="filtro-btn active" data-estado="todas">Todas</button>
        <button class="filtro-btn" data-estado="pendiente">Pendientes</button>
        <button class="filtro-btn" data-estado="confirmada">Confirmadas</button>
        <button class="filtro-btn" data-estado="completada">Completadas</button>
        <button class="filtro-btn" data-estado="cancelada">Canceladas</button>
      </div>
      <div id="lista-citas-doctor"></div>
    `;

    let citasActuales = datos;

    function renderCitas(citas) {
      const lista = document.querySelector("#lista-citas-doctor");
      lista.innerHTML = "";
      if (citas.length == 0) {
        lista.innerHTML = '<p class="sin-datos">No hay citas en esta categoría.</p>';
        return;
      }
      citas.forEach(cita => lista.appendChild(crearCardCitaDoctor(cita)));
      
    }

    renderCitas(datos);
    añadirBuscadorCards("lista-citas-doctor", "cita-card", ["cita-paciente", "cita-motivo", "cita-estado-texto"]);
    document.querySelectorAll(".filtro-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filtro-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const estado = btn.dataset.estado;
        renderCitas(estado == "todas" ? citasActuales : citasActuales.filter(c => c.estado == estado));
      });
    });

  } catch (err) {
    console.error(err);
    contenedor.innerHTML = '<p class="error-vista">Error al cargar las citas.</p>';
  }
}

function crearCardCitaDoctor(cita) {
  const clon = document.querySelector("#template-cita-doctor").content.cloneNode(true);
  const card = clon.querySelector(".cita-card");
  card.classList.add(`estado-${cita.estado}`);

  const badge = estadoBadges[cita.estado] || { color: "#6b7280", icono: "help" };
  const fecha = new Date(cita.fecha_hora).toLocaleString("es-ES", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });

  clon.querySelector(".cita-estado").style.color = badge.color;
  clon.querySelector(".cita-estado-icono").textContent = badge.icono;
  clon.querySelector(".cita-estado-texto").textContent = cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1);
  clon.querySelector(".cita-fecha-texto").textContent = fecha;
  clon.querySelector(".cita-paciente").textContent = cita.nombre_paciente;
  clon.querySelector(".cita-motivo").textContent = cita.motivo;

  const footer = clon.querySelector(".cita-card-footer");
  const btnConfirmar = clon.querySelector(".btn-accion.confirmar");
  const btnCompletar = clon.querySelector(".btn-accion.completar");
  const btnCancelar  = clon.querySelector(".btn-accion.cancelar");

  if (cita.estado == "pendiente") {
    footer.style.display = "flex";
    btnConfirmar.style.display = "flex";
    btnCancelar.style.display = "flex";
  } else if (cita.estado == "confirmada") {
    footer.style.display = "flex";
    btnCompletar.style.display = "flex";
    btnCancelar.style.display = "flex";
  }

  [btnConfirmar, btnCompletar, btnCancelar].forEach(btn => {
    btn.addEventListener("click", async () => {
      const estado = btn.classList.contains("confirmar") ? "confirmada"
                   : btn.classList.contains("completar") ? "completada"
                   : "cancelada";
      const res = await fetch(URL_API_CITAS, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_cita: cita.id_cita, estado })
      });
      const data = await res.json();
      if (data.success) iniciarCitasDoctor();
      else alert(data.mensaje);
    });
  });

  return clon;
}

//***** PACIENTES DOCTOR *****
async function iniciarPacientesDoctor() {
  const contenedor = document.querySelector("#contenedor-mis-pacientes");
  contenedor.innerHTML = '<p class="cargando">Cargando pacientes...</p>';

  try {
    const res = await fetch(URL_API_MIS_PACIENTES);
    const { success, datos } = await res.json();

    if (!success) throw new Error();

    contenedor.innerHTML = "";

    if (datos.length == 0) {
      contenedor.innerHTML = '<p class="sin-datos">No tienes pacientes asignados.</p>';
      return;
    }

    datos.forEach(paciente => {
      const clon = document.querySelector("#template-paciente-doctor").content.cloneNode(true);
      clon.querySelector(".paciente-foto").src = rutaFoto(paciente.Foto);
      clon.querySelector(".paciente-nombre").textContent = paciente.nombre + " " + paciente.apellidos;
      clon.querySelector(".paciente-email").textContent = paciente.email;
      clon.querySelector(".paciente-telefono").textContent = paciente.telefono || "No disponible";
      clon.querySelector(".paciente-dni").textContent = paciente.dni || "No disponible";
      clon.querySelector(".btn-accion.confirmar").addEventListener("click", () => {
        mostrarFormAsignarTratamiento(paciente);
      });    
      clon.querySelector(".btn-ver-historial").addEventListener("click", () => {
        mostrarHistorialPaciente(paciente);
      });
      clon.querySelector(".btn-crear-cita-doctor").addEventListener("click", () => {
        mostrarFormCrearCitaDoctor(paciente);
      });
      contenedor.appendChild(clon);
    });

    añadirBuscadorCards("contenedor-mis-pacientes", "cita-card", ["paciente-nombre", "paciente-email", "paciente-telefono"]);
  } catch (err) {
    console.error(err);
    contenedor.innerHTML = '<p class="error-vista">Error al cargar los pacientes.</p>';
  }
}



// ***** ASIGNAR TRATAMIENTO *****
async function mostrarFormAsignarTratamiento(paciente) {
  const modal = document.querySelector("#modal-tratamiento");

  // Selectores dentro del modal
  const titulo = modal.querySelector(".asignar-titulo");
  const select = modal.querySelector("#select-tratamiento");
  const fechaInicio = modal.querySelector("#fecha-inicio-trat");
  const fechaFin = modal.querySelector("#fecha-fin-trat");
  const msg = modal.querySelector("#asignar-msg");

  // Reset del formulario
  select.innerHTML = "<option value=''>Selecciona un tratamiento</option>";
  fechaInicio.value = "";
  fechaFin.value = "";
  msg.style.display = "none";

  // Título
  titulo.textContent = `Asignar tratamiento a ${paciente.nombre} ${paciente.apellidos}`;

  // Mostrar modal
  modal.classList.add("visible");

  // ========================
  // Cerrar modal
  // ========================
  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.remove("visible");
  };
  modal.querySelector("#btn-cerrar-tratamiento").onclick = () => modal.classList.remove("visible");
  modal.querySelector("#btn-cancelar-asignar").onclick = () => modal.classList.remove("visible");

  // ========================
  // Cargar tratamientos
  // ========================
  const resTrat = await fetch(URL_API_TRATAMIENTOS);
  const { success, datos } = await resTrat.json();
  if (!success) return;

  datos.forEach(t => {
    const option = document.createElement("option");
    option.value = t.id_tratamiento;
    option.textContent = t.nombre_tratamiento;
    select.appendChild(option);
  });

  fechaInicio.min = new Date().toISOString().slice(0, 10);

  // ========================
  // Asignar tratamiento
  // ========================
  modal.querySelector("#btn-asignar").onclick = async () => {
    const id_tratamiento = select.value;
    const fi = fechaInicio.value;
    const ff = fechaFin.value;

    if (!id_tratamiento || !fi || !ff) {
      msg.className = "auth-mensaje error";
      msg.textContent = "Rellena todos los campos";
      msg.style.display = "block";
      return;
    }

    const res = await fetch(URL_API_ASIGNAR_TRATAMIENTO, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_paciente: paciente.id_paciente,
        id_tratamiento,
        fecha_inicio: fi,
        fecha_fin: ff
      })
    });

    const data = await res.json();
    msg.style.display = "block";
    if (data.success) {
      msg.className = "auth-mensaje exito";
      msg.textContent = "Tratamiento asignado correctamente";
      setTimeout(() => modal.classList.remove("visible"), 1500);
    } else {
      msg.className = "auth-mensaje error";
      msg.textContent = data.mensaje;
    }
  };
}

// ***** TRATAMIENTOS PACIENTE *****
async function iniciarTratamientosPaciente() {
  const contenedor = document.querySelector("#contenedor-mis-tratamientos");
  contenedor.innerHTML = '<p class="cargando">Cargando tratamientos...</p>';

  try {
    const res = await fetch(URL_API_MIS_TRATAMIENTOS);
    const { success, datos } = await res.json();

    contenedor.innerHTML = "";

    if (!success || datos.length == 0) {
      contenedor.innerHTML = '<p class="sin-datos">No tienes tratamientos asignados.</p>';
      return;
    }

    datos.forEach(t => {
      const clon = document.querySelector("#template-tratamiento-paciente").content.cloneNode(true);
      clon.querySelector(".trat-img").src = rutaFoto(t.foto, "");
      clon.querySelector(".trat-nombre").textContent = t.nombre_tratamiento;
      clon.querySelector(".trat-descripcion").textContent = t.descripcion;
      clon.querySelector(".trat-fechas").textContent = `${t.fecha_inicio} → ${t.fecha_fin}`;
      clon.querySelector(".trat-precio").textContent = `${t.precio}€`;

      // Estado del pago
      const estadoPago = clon.querySelector(".trat-pago-estado");
      if (t.pago === "pagado") {
        estadoPago.textContent = `Pagado con ${t.metodo_pago} el ${new Date(t.fecha_pago).toLocaleDateString("es-ES")}`;
        estadoPago.style.color = "var(--green-500, #22c55e)";
      } else {
        estadoPago.textContent = "Pendiente de pago";
        estadoPago.style.color = "var(--orange-500, #f59e0b)";

        // Mostrar botón pagar
        const footer = clon.querySelector(".trat-footer-pago");
        footer.style.display = "flex";
        footer.querySelector(".btn-pagar").addEventListener("click", () => {
          mostrarModalPago(t, () => iniciarTratamientosPaciente());
        });
      }

      contenedor.appendChild(clon);
    });

    añadirBuscadorCards("contenedor-mis-tratamientos", "cita-card", ["trat-nombre", "trat-descripcion"]);
  } catch (err) {
    console.error(err);
    contenedor.innerHTML = '<p class="error-vista">Error al cargar los tratamientos.</p>';
  }
}

function mostrarModalPago(t, onExito) {
  const metodos = ["Tarjeta de crédito", "Tarjeta de débito", "Transferencia bancaria", "Efectivo"];

  const confirmar = confirm(
    `¿Seguro que quieres pagar el tratamiento "${t.nombre_tratamiento}" por ${t.precio}€?`
  );
  if (!confirmar) return;

  // Selector de método de pago
  const metodo = prompt(
    `Selecciona el método de pago introduciendo el número:\n` +
    metodos.map((m, i) => `${i + 1}. ${m}`).join("\n")
  );

  const indice = parseInt(metodo) - 1;
  if (isNaN(indice) || indice < 0 || indice >= metodos.length) {
    alert("Método de pago no válido");
    return;
  }

  const metodo_pago = metodos[indice];

  // Confirmar pago
  const confirmacionFinal = confirm(`Vas a pagar ${t.precio}€ con ${metodo_pago}. ¿Confirmas?`);
  if (!confirmacionFinal) return;

  fetch(URL_API_MIS_TRATAMIENTOS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_tratamiento: t.id_tratamiento, metodo_pago })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("¡Pago realizado correctamente!");
      onExito();
    } else {
      alert(data.mensaje);
    }
  });
}


//MOSTRAR HISTORIAL PACIENTE
async function mostrarHistorialPaciente(paciente) {
  const res = await fetch(`${URL_API_HISTORIAL}?id_paciente=${paciente.id_paciente}`);
  const { success, citas, tratamientos } = await res.json();
  if (!success) return;

  const modal = document.querySelector("#modal-historial");
  const titulo = document.querySelector("#historial-titulo");

  // Título
  titulo.textContent = `Historial de ${paciente.nombre} ${paciente.apellidos}`;

  // Mostrar modal
  modal.classList.add("visible");

  // Cerrar modal (click fuera)
  modal.onclick = (e) => {
    if (e.target == modal) {
      modal.classList.remove("visible");
    }
  };

  // Botón cerrar
  document.querySelector("#btn-cerrar-historial").onclick = () => {
    modal.classList.remove("visible");
  };

  // ========================
  // CITAS
  // ========================
  const contCitas = document.querySelector("#historial-citas");
  contCitas.innerHTML = "";

  if (citas.length == 0) {
    contCitas.innerHTML = '<p class="sin-datos">No hay citas registradas.</p>';
  } else {
    citas.forEach(cita => {
      const clon = document
        .querySelector("#template-historial-cita")
        .content.cloneNode(true);

      const badge = estadoBadges[cita.estado] || {
        color: "#6b7280",
        icono: "help"
      };

      const fecha = new Date(cita.fecha_hora).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      clon.querySelector(".cita-estado").style.color = badge.color;
      clon.querySelector(".hist-icono").textContent = badge.icono;
      clon.querySelector(".hist-estado").textContent =
        cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1);
      clon.querySelector(".hist-fecha").textContent = fecha;
      clon.querySelector(".hist-motivo").textContent = cita.motivo;

      contCitas.appendChild(clon);
    });
  }

  // ========================
  // TRATAMIENTOS
  // ========================
  const contTrat = document.querySelector("#historial-tratamientos");
  contTrat.innerHTML = "";

  if (tratamientos.length == 0) {
    contTrat.innerHTML = '<p class="sin-datos">No hay tratamientos asignados.</p>';
  } else {
    tratamientos.forEach(t => {
      const clon = document
        .querySelector("#template-historial-tratamiento")
        .content.cloneNode(true);

      clon.querySelector(".hist-trat-img").src = rutaFoto(t.foto, "");
      clon.querySelector(".hist-trat-nombre").textContent = t.nombre_tratamiento;
      clon.querySelector(".hist-trat-fechas").textContent =
        `${t.fecha_inicio} → ${t.fecha_fin}`;
      clon.querySelector(".hist-trat-descripcion").textContent = t.descripcion;

      contTrat.appendChild(clon);
    });
  }
}

async function mostrarFormCrearCitaDoctor(paciente) {
  const modal = document.querySelector("#modal-cita-doctor");
  modal.querySelector(".cita-doctor-titulo").textContent = `Nueva cita para ${paciente.nombre} ${paciente.apellidos}`;

  // Resetear campos
  const fechaInput = modal.querySelector("#cita-doctor-fecha");
  const horaSelect = modal.querySelector("#cita-doctor-hora");
  fechaInput.min   = new Date().toISOString().slice(0, 10);
  fechaInput.value = "";
  horaSelect.innerHTML = '<option value="">-- Elige primero una fecha --</option>';
  horaSelect.disabled  = true;
  modal.querySelector("#cita-doctor-motivo").value = "";
  modal.querySelector("#cita-doctor-msg").style.display = "none";
  modal.querySelector("#btn-enviar-cita-doctor").disabled = false;

  modal.classList.add("visible");

  modal.querySelector("#btn-cerrar-cita-doctor").onclick = () => modal.classList.remove("visible");
  modal.onclick = e => { if (e.target === modal) modal.classList.remove("visible"); };

  // Cargar slots cuando cambie la fecha
  async function cargarSlotsDoctor() {
    const fecha = fechaInput.value;
    if (!fecha) return;

    // Bloquear fines de semana
    const dia = new Date(fecha + "T00:00:00").getDay();
    if (dia === 0 || dia === 6) {
      horaSelect.innerHTML = '<option value="">Solo días laborables (L-V)</option>';
      horaSelect.disabled = true;
      return;
    }

    horaSelect.innerHTML = '<option value="">Cargando horarios...</option>';
    horaSelect.disabled = true;

    // El doctor logueado es el id_doctor, lo sacamos de usuarioActual
    const res = await fetch(`api/horarios_disponibles.php?id_doctor=${usuarioActual.id}&fecha=${fecha}&id_paciente=${paciente.id_paciente}`);
    const data = await res.json();

    if (!data.slots || data.slots.length === 0) {
      horaSelect.innerHTML = '<option value="">No hay horarios disponibles</option>';
      return;
    }

    horaSelect.innerHTML = '<option value="">-- Elige hora --</option>';
    data.slots.forEach(slot => {
      const opt = document.createElement("option");
      opt.value = slot.hora;
      opt.textContent = slot.disponible ? slot.hora : `${slot.hora} (ocupado)`;
      opt.disabled = !slot.disponible;
      horaSelect.appendChild(opt);
    });

    horaSelect.disabled = false;
  }

  fechaInput.addEventListener("change", cargarSlotsDoctor);

  modal.querySelector("#btn-enviar-cita-doctor").onclick = async () => {
    const fecha    = fechaInput.value;
    const hora     = horaSelect.value;
    const motivo   = modal.querySelector("#cita-doctor-motivo").value;
    const msg      = modal.querySelector("#cita-doctor-msg");
    const btn      = modal.querySelector("#btn-enviar-cita-doctor");

    if (!fecha || !hora || !motivo) {
      msg.className = "auth-mensaje error";
      msg.textContent = "Rellena todos los campos";
      msg.style.display = "block";
      return;
    }

    const fecha_hora = `${fecha} ${hora}:00`;

    btn.disabled = true;
    const res = await fetch(URL_API_CITA_DOCTOR, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_paciente: paciente.id_paciente,
        fecha_hora,
        motivo
      })
    });

    const data = await res.json();
    msg.style.display = "block";
    if (data.success) {
      msg.className = "auth-mensaje exito";
      msg.textContent = "¡Cita creada correctamente!";
      setTimeout(() => modal.classList.remove("visible"), 1500);
    } else {
      msg.className = "auth-mensaje error";
      msg.textContent = data.mensaje;
      btn.disabled = false;
    }
  };
}

function añadirBuscadorCards(contenedorId, claseCard, camposBusqueda) {
  const contenedor = document.querySelector(`#${contenedorId}`);
  if (!contenedor) return;

  // Evitar duplicar el buscador
  if (contenedor.querySelector(".admin-buscador")) return;

  const buscador = document.createElement("div");
  buscador.className = "admin-buscador";
  buscador.innerHTML = `
    <div class="input-buscador">
      <span class="material-symbols-outlined">search</span>
      <input type="text" placeholder="Buscar..." id="input-buscar-${contenedorId}">
    </div>
  `;
  contenedor.insertBefore(buscador, contenedor.firstChild);

  document.querySelector(`#input-buscar-${contenedorId}`).addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase();
    document.querySelectorAll(`#${contenedorId} .${claseCard}`).forEach(card => {
      const contenido = camposBusqueda
        .map(clase => card.querySelector(`.${clase}`)?.textContent || "")
        .join(" ")
        .toLowerCase();
      card.style.display = contenido.includes(texto) ? "" : "none";
    });
  });
}


//*****TEMPLATES*****
function crearCardDoctor(doctor) {
  const clon = document
    .querySelector("#template-doctores")
    .content.cloneNode(true);
  clon.querySelector(".card-img").src = doctor.foto;
  clon.querySelector(".card-nombre").textContent =
    doctor.nombre + " " + doctor.apellidos;
  clon.querySelector(".card-descripcion").textContent = doctor.datosExtras;
  return clon;
}

function crearCardTratamiento(tratamiento) {
  const template = document.querySelector("#template-tratamientos");

  if (template) {
    // Usa el template si existe
    const clon = template.content.cloneNode(true);
    clon.querySelector(".card-img").src = tratamiento.foto;
    clon.querySelector(".card-nombre").textContent =
      tratamiento.nombre_tratamiento;
    clon.querySelector(".card-descripcion").textContent =
      tratamiento.descripcion;
    const card = clon.querySelector(".card");
    card.addEventListener("click", () => abrirModal(tratamiento));
    return clon;
  } else {
    // Crea la card manualmente si no hay template
    const card = document.createElement("div");
    card.className = "card card-tratamiento";
    card.innerHTML = `
      <img class="card-img" src="${tratamiento.foto}" alt="${tratamiento.nombre_tratamiento}">
      <div class="card-content">
        <h3 class="card-nombre">${tratamiento.nombre_tratamiento}</h3>
        <p class="card-descripcion">${tratamiento.descripcion}</p>
      </div>
    `;
    card.addEventListener("click", () => abrirModal(tratamiento));
    return card;
  }
}

//*****MODAL*****
function abrirModal(tratamiento) {
  const modal = document.querySelector("#modal");
  modal.classList.add("visible");
  modal.querySelector("img").src = tratamiento.foto;
  modal.querySelector("#modal-nombre").textContent =
    tratamiento.nombre_tratamiento;
  modal.querySelector("#modal-descripcion").textContent =
    tratamiento.des_completa;

  // Cerrar con botón X
  modal.querySelector("#modal-cerrar").onclick = () => {
    modal.classList.remove("visible");
  };

  // Cerrar al hacer click fuera
  modal.onclick = (e) => {
    if (e.target == modal) modal.classList.remove("visible");
  };
}

//*****CARRUSEL*****
function iniciarCarrusel() {
  const carrusel = document.querySelector(".carrusel");
  if (!carrusel) return;

  const track = carrusel.querySelector(".carrusel-track");
  const dots = carrusel.querySelectorAll(".dot");
  const total = track.children.length;
  let actual = 0;
  let intervalo;

  function irA(index) {
    actual = (index + total) % total;
    track.style.transform = `translateX(-${actual * 100}%)`;
    dots.forEach((d) => d.classList.remove("active"));
    dots[actual].classList.add("active");
  }

  carrusel.querySelector(".carrusel-prev").addEventListener("click", () => {
    irA(actual - 1);
    reiniciarIntervalo();
  });

  carrusel.querySelector(".carrusel-next").addEventListener("click", () => {
    irA(actual + 1);
    reiniciarIntervalo();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      irA(i);
      reiniciarIntervalo();
    });
  });

  function reiniciarIntervalo() {
    clearInterval(intervalo);
    intervalo = setInterval(() => irA(actual + 1), 4000);
  }

  // Auto-avance cada 4 segundos
  intervalo = setInterval(() => irA(actual + 1), 4000);
}

//CONTROL DE INICIO SESION, CIERRE SESION Y REGISTRO
let usuarioActual = null;

//***** COMPROBAR SESIÓN AL CARGAR *****
async function comprobarSesion() {
  try {
    const res = await fetch(URL_API_SESION);
    const { success, usuario } = await res.json();
    if (success) {
      usuarioActual = usuario;  
      // Guardar en localStorage
      localStorage.setItem('usuario', JSON.stringify(usuario));    
      actualizarBotonSesion();
    } 
    else {
      // Limpiar si no hay sesión
      localStorage.removeItem('usuario');
    }
  } catch (err) {
    console.error(err);
  }
}

// ***** ACTUALIZAR BOTÓN SEGÚN SESIÓN *****
function actualizarBotonSesion() {
  const boton = document.querySelector(".buttons");
  if (usuarioActual) {
    const foto = usuarioActual.foto ? rutaFoto(usuarioActual.foto) : null;

    if (foto) {
      boton.innerHTML = `
        <img src="${foto}" 
             style="width:32px; height:32px; border-radius:50%; object-fit:cover;">
        <span class="button-text">${usuarioActual.nombre}</span>
      `;
    } else {
      boton.innerHTML = `
        <span class="material-symbols-outlined">account_circle</span>
        <span class="button-text">${usuarioActual.nombre}</span>
      `;
    }
    boton.onclick = () => cargarVista("perfil");
  } else {
    boton.innerHTML = `
      <span class="material-symbols-outlined">account_circle</span>
      <span class="button-text">Iniciar sesión</span>
    `;
    boton.onclick = () => cargarVista("login");
  }
}

// ***** LOGIN *****
async function login(email, password) {
  try {
    const res = await fetch(URL_API_LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      usuarioActual = data.usuario;
      actualizarBotonSesion();
      cargarVista("perfil")
    }
    return data;
  } catch (err) {
    console.error(err);
    return { success: false, mensaje: "Error de conexión" };
  }
}

// **** LOGOUT *****
async function logout() {
  await fetch(URL_API_LOGOUT);
  usuarioActual = null;
  actualizarBotonSesion();
  cargarVista("home");
}

// ***** REGISTRO ****
async function registro(datos) {
  try {
    const res = await fetch(URL_API_REGISTRO, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return { success: false, mensaje: "Error de conexión" };
  }
}


// ===== CONSTANTES ADMIN =====
const URL_ADMIN_USUARIOS    = "api/admin/usuarios.php";
const URL_ADMIN_CITAS       = "api/admin/citas.php";
const URL_ADMIN_TRATAMIENTOS = "api/admin/tratamientos.php";
const URL_ADMIN_MAQUINARIA  = "api/admin/maquinaria.php";
const URL_ADMIN_PRODUCTOS   = "api/admin/productos.php";

// ===== ADMIN =====
async function iniciarAdmin() {
  if (!usuarioActual || usuarioActual.rol !== "admin") {
    cargarVista("home");
    return;
  }

  document.querySelectorAll(".admin-nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin-nav-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      cargarSeccionAdmin(btn.dataset.seccion);
    });
  });

  cargarSeccionAdmin("usuarios");
}

function cargarSeccionAdmin(seccion) {
  const panel = document.querySelector("#admin-panel");
  panel.innerHTML = '<p class="cargando">Cargando...</p>';
  switch (seccion) {
    case "usuarios":     adminUsuarios(); break;
    case "doctores":     adminDoctores(); break;
    case "pacientes":    adminPacientes(); break;
    case "citas":        adminCitas(); break;
    case "tratamientos": adminTratamientos(); break;
    case "maquinaria":   adminMaquinaria(); break;
    case "productos":    adminProductos(); break;
    case "horarios":     adminHorarios(); break;
  }
}


// ===== UTILIDADES ADMIN =====
function abrirModalAdmin(titulo, htmlContenido, onGuardar) {
  let modal = document.querySelector("#modal-admin");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-admin";
    modal.innerHTML = `
      <div class="modal-admin-contenido">
        <div class="modal-admin-header">
          <h3 class="modal-admin-titulo"></h3>
          <button class="btn-cerrar-modal-admin">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="modal-admin-body"></div>
        <div class="modal-admin-footer" style="margin-top:1.5rem; display:flex; justify-content:flex-end; gap:1rem;">
          <button class="btn-tabla" id="btn-cancelar-admin" style="padding:0.6rem 1.2rem;">Cancelar</button>
          <button class="buttons" id="btn-guardar-admin" style="padding:0.6rem 1.5rem;">Guardar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  modal.querySelector(".modal-admin-titulo").textContent = titulo;
  modal.querySelector(".modal-admin-body").innerHTML = htmlContenido;
  modal.classList.add("visible");

  modal.querySelector(".btn-cerrar-modal-admin").onclick = () => modal.classList.remove("visible");
  modal.querySelector("#btn-cancelar-admin").onclick = () => modal.classList.remove("visible");
  modal.onclick = e => { if (e.target === modal) modal.classList.remove("visible"); };
  modal.querySelector("#btn-guardar-admin").onclick = async () => {
    const resultado = await onGuardar();
    if (resultado) modal.classList.remove("visible");
  };
}

function mostrarMsgAdmin(msg, tipo = "exito") {
  const panel = document.querySelector("#admin-panel");
  const div = document.createElement("div");
  div.className = `auth-mensaje ${tipo}`;
  div.textContent = msg;
  div.style.marginBottom = "1rem";
  panel.insertBefore(div, panel.firstChild);
  setTimeout(() => div.remove(), 3000);
}

// ===== USUARIOS =====
async function adminUsuarios() {
  const panel = document.querySelector("#admin-panel");
  const res = await fetch(URL_ADMIN_USUARIOS);
  const { success, datos } = await res.json();
  if (!success) return;

  panel.innerHTML = `
    <div class="admin-panel-titulo">
      Usuarios
      <button class="buttons btn-tabla" id="btn-nuevo-usuario" style="font-size:0.85rem; padding:0.5rem 1rem;">
        <span class="material-symbols-outlined">add</span> Nuevo usuario
      </button>
    </div>
    <div class="admin-tabla-wrapper">
      <table class="admin-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>DNI</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tabla-usuarios"></tbody>
      </table>
    </div>
  `;

  añadirBuscador("admin-panel", "tabla-usuarios", [0, 1, 2, 3, 4]);

  const tbody = panel.querySelector("#tabla-usuarios");
  datos.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.nombre} ${u.apellidos}</td>
      <td>${u.email}</td>
      <td>${u.telefono || "-"}</td>
      <td>${u.dni || "-"}</td>
      <td><span class="badge-rol ${u.rol}">${u.rol}</span></td>
      <td>
        <button class="btn-tabla editar" data-id="${u.id_persona}">
          <span class="material-symbols-outlined">edit</span> Editar
        </button>
        <button class="btn-tabla borrar" data-id="${u.id_persona}" style="margin-left:0.3rem;">
          <span class="material-symbols-outlined">delete</span> Borrar
        </button>
      </td>
    `;

    tr.querySelector(".editar").addEventListener("click", () => editarUsuario(u));
    tr.querySelector(".borrar").addEventListener("click", () => borrarUsuario(u.id_persona));
    tbody.appendChild(tr);
  });

  panel.querySelector("#btn-nuevo-usuario").addEventListener("click", () => nuevoUsuario());
}

function nuevoUsuario() {
  abrirModalAdmin("Nuevo usuario", `
    <div class="form-grid">
      <div class="form-group"><label>Nombre</label><input type="text" id="u-nombre" required></div>
      <div class="form-group"><label>Apellidos</label><input type="text" id="u-apellidos" required></div>
      <div class="form-group"><label>Email</label><input type="email" id="u-email" required></div>
      <div class="form-group"><label>Contraseña</label><input type="password" id="u-password" required></div>
      <div class="form-group"><label>Teléfono</label><input type="tel" id="u-telefono"></div>
      <div class="form-group"><label>DNI</label><input type="text" id="u-dni"></div>
      <div class="form-group"><label>Rol</label>
        <select id="u-rol">
          <option value="paciente">Paciente</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>
  `, async () => {
    const datos = {
      nombre:    document.querySelector("#u-nombre").value,
      apellidos: document.querySelector("#u-apellidos").value,
      email:     document.querySelector("#u-email").value,
      password:  document.querySelector("#u-password").value,
      telefono:  document.querySelector("#u-telefono").value,
      dni:       document.querySelector("#u-dni").value,
      rol:       document.querySelector("#u-rol").value,
    };

    const res = await fetch(URL_ADMIN_USUARIOS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });
    const data = await res.json();
    if (data.success) { mostrarMsgAdmin(data.mensaje); adminUsuarios(); return true; }
    else { mostrarMsgAdmin(data.mensaje, "error"); return false; }
  });
}

function editarUsuario(u) {
  abrirModalAdmin("Editar usuario", `
    <div class="form-grid">
      <div class="form-group"><label>Nombre</label><input type="text" id="u-nombre" value="${u.nombre}" required></div>
      <div class="form-group"><label>Apellidos</label><input type="text" id="u-apellidos" value="${u.apellidos}" required></div>
      <div class="form-group"><label>Email</label><input type="email" id="u-email" value="${u.email}" required></div>
      <div class="form-group"><label>Teléfono</label><input type="tel" id="u-telefono" value="${u.telefono || ""}"></div>
      <div class="form-group"><label>DNI</label><input type="text" id="u-dni" value="${u.dni || ""}"></div>
      <div class="form-group"><label>Rol</label>
        <select id="u-rol">
          <option value="paciente" ${u.rol==="paciente"?"selected":""}>Paciente</option>
          <option value="doctor" ${u.rol==="doctor"?"selected":""}>Doctor</option>
          <option value="admin" ${u.rol==="admin"?"selected":""}>Admin</option>
        </select>
      </div>
    </div>
  `, async () => {
    const datos = {
      id_persona: u.id_persona,
      nombre:     document.querySelector("#u-nombre").value,
      apellidos:  document.querySelector("#u-apellidos").value,
      email:      document.querySelector("#u-email").value,
      telefono:   document.querySelector("#u-telefono").value,
      dni:        document.querySelector("#u-dni").value,
      rol:        document.querySelector("#u-rol").value,
    };

    const res = await fetch(URL_ADMIN_USUARIOS, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });
    const data = await res.json();
    if (data.success) { mostrarMsgAdmin(data.mensaje); adminUsuarios(); return true; }
    else { mostrarMsgAdmin(data.mensaje, "error"); return false; }
  });
}

async function borrarUsuario(id) {
  if (!confirm("¿Seguro que quieres eliminar este usuario? Esta acción no se puede deshacer.")) return;
  const res = await fetch(URL_ADMIN_USUARIOS, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_persona: id })
  });
  const data = await res.json();
  if (data.success) { mostrarMsgAdmin(data.mensaje); adminUsuarios(); }
  else mostrarMsgAdmin(data.mensaje, "error");
}

// ===== DOCTORES =====
async function adminDoctores() {
  const panel = document.querySelector("#admin-panel");
  const res = await fetch(URL_ADMIN_USUARIOS);
  const { success, datos } = await res.json();
  if (!success) return;

  const doctores = datos.filter(u => u.rol === "doctor");

  panel.innerHTML = `
    <div class="admin-panel-titulo">
      Doctores
      <button class="buttons btn-tabla" id="btn-nuevo-doctor" style="font-size:0.85rem; padding:0.5rem 1rem;">
        <span class="material-symbols-outlined">add</span> Nuevo doctor
      </button>
    </div>
    <div class="admin-tabla-wrapper">
      <table class="admin-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>DNI</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tabla-doctores"></tbody>
      </table>
    </div>
  `;

  añadirBuscador("admin-panel", "tabla-doctores", [0, 1, 2, 3]);
  const tbody = panel.querySelector("#tabla-doctores");
  doctores.forEach(d => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.nombre} ${d.apellidos}</td>
      <td>${d.email}</td>
      <td>${d.telefono || "-"}</td>
      <td>${d.dni || "-"}</td>
      <td>
        <button class="btn-tabla editar" data-id="${d.id_persona}">
          <span class="material-symbols-outlined">edit</span> Editar
        </button>
        <button class="btn-tabla borrar" data-id="${d.id_persona}" style="margin-left:0.3rem;">
          <span class="material-symbols-outlined">delete</span> Borrar
        </button>
      </td>
    `;
    tr.querySelector(".editar").addEventListener("click", () => editarUsuario(d));
    tr.querySelector(".borrar").addEventListener("click", () => borrarUsuario(d.id_persona));
    tbody.appendChild(tr);
  });

  panel.querySelector("#btn-nuevo-doctor").addEventListener("click", () => {
    abrirModalAdmin("Nuevo doctor", `
      <div class="form-grid">
        <div class="form-group"><label>Nombre</label><input type="text" id="u-nombre" required></div>
        <div class="form-group"><label>Apellidos</label><input type="text" id="u-apellidos" required></div>
        <div class="form-group"><label>Email</label><input type="email" id="u-email" required></div>
        <div class="form-group"><label>Contraseña</label><input type="password" id="u-password" required></div>
        <div class="form-group"><label>Teléfono</label><input type="tel" id="u-telefono"></div>
        <div class="form-group"><label>DNI</label><input type="text" id="u-dni"></div>
      </div>
    `, async () => {
      const datos = {
        nombre:    document.querySelector("#u-nombre").value,
        apellidos: document.querySelector("#u-apellidos").value,
        email:     document.querySelector("#u-email").value,
        password:  document.querySelector("#u-password").value,
        telefono:  document.querySelector("#u-telefono").value,
        dni:       document.querySelector("#u-dni").value,
        rol:       "doctor",
      };
      const res = await fetch(URL_ADMIN_USUARIOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });
      const data = await res.json();
      if (data.success) { mostrarMsgAdmin(data.mensaje); adminDoctores(); return true; }
      else { mostrarMsgAdmin(data.mensaje, "error"); return false; }
    });
  });
}

// ===== PACIENTES =====
async function adminPacientes() {
  const panel = document.querySelector("#admin-panel");
  const res = await fetch(URL_ADMIN_USUARIOS);
  const { success, datos } = await res.json();
  if (!success) return;

  const pacientes = datos.filter(u => u.rol === "paciente");

  panel.innerHTML = `
    <div class="admin-panel-titulo">Pacientes</div>
    <div class="admin-tabla-wrapper">
      <table class="admin-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>DNI</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tabla-pacientes"></tbody>
      </table>
    </div>
  `;

  añadirBuscador("admin-panel", "tabla-pacientes", [0, 1, 2, 3]);
  const tbody = panel.querySelector("#tabla-pacientes");
  pacientes.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.nombre} ${p.apellidos}</td>
      <td>${p.email}</td>
      <td>${p.telefono || "-"}</td>
      <td>${p.dni || "-"}</td>
      <td>
        <button class="btn-tabla editar">
          <span class="material-symbols-outlined">edit</span> Editar
        </button>
        <button class="btn-tabla borrar" style="margin-left:0.3rem;">
          <span class="material-symbols-outlined">delete</span> Borrar
        </button>
      </td>
    `;
    tr.querySelector(".editar").addEventListener("click", () => editarUsuario(p));
    tr.querySelector(".borrar").addEventListener("click", () => borrarUsuario(p.id_persona));
    tbody.appendChild(tr);
  });
}

// ===== CITAS =====
async function adminCitas() {
  const panel = document.querySelector("#admin-panel");
  const res = await fetch(URL_ADMIN_CITAS);
  const { success, datos } = await res.json();
  if (!success) return;

  panel.innerHTML = `
    <div class="admin-panel-titulo">Citas</div>
    <div class="admin-tabla-wrapper">
      <table class="admin-tabla">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Doctor</th>
            <th>Fecha</th>
            <th>Motivo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tabla-citas"></tbody>
      </table>
    </div>
  `;
  añadirBuscador("admin-panel", "tabla-citas", [0, 1, 2, 3, 4]);
  const tbody = panel.querySelector("#tabla-citas");
  datos.forEach(c => {
    const fecha = new Date(c.fecha_hora).toLocaleString("es-ES", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.nombre_paciente}</td>
      <td>${c.nombre_doctor}</td>
      <td>${fecha}</td>
      <td>${c.motivo}</td>
      <td><span class="badge-estado ${c.estado}">${c.estado}</span></td>
      <td>
        <button class="btn-tabla editar">
          <span class="material-symbols-outlined">edit</span> Editar
        </button>
        <button class="btn-tabla borrar" style="margin-left:0.3rem;">
          <span class="material-symbols-outlined">delete</span> Borrar
        </button>
      </td>
    `;

    tr.querySelector(".editar").addEventListener("click", () => {
      const fechaActual = new Date(c.fecha_hora);
      const fechaStr = fechaActual.toISOString().slice(0, 10);
      const horaStr  = fechaActual.toTimeString().slice(0, 5);

      abrirModalAdmin("Editar cita", `
        <div class="form-grid">
          <div class="form-group">
            <label>Fecha</label>
            <input type="date" id="cita-edit-fecha" value="${fechaStr}">
          </div>
          <div class="form-group">
            <label>Hora</label>
            <input type="time" id="cita-edit-hora" value="${horaStr}" step="1800">
          </div>
          <div class="form-group" style="grid-column:1/-1;">
            <label>Motivo</label>
            <textarea id="cita-edit-motivo" rows="3">${c.motivo}</textarea>
          </div>
          <div class="form-group">
            <label>Estado</label>
            <select id="cita-estado">
              <option value="pendiente"  ${c.estado==="pendiente" ?"selected":""}>Pendiente</option>
              <option value="confirmada" ${c.estado==="confirmada"?"selected":""}>Confirmada</option>
              <option value="cancelada"  ${c.estado==="cancelada" ?"selected":""}>Cancelada</option>
              <option value="completada" ${c.estado==="completada"?"selected":""}>Completada</option>
            </select>
          </div>
        </div>
      `, async () => {
        const fecha    = document.querySelector("#cita-edit-fecha").value;
        const hora     = document.querySelector("#cita-edit-hora").value;
        const motivo   = document.querySelector("#cita-edit-motivo").value;
        const estado   = document.querySelector("#cita-estado").value;

        if (!fecha || !hora || !motivo) {
          mostrarMsgAdmin("Rellena todos los campos", "error");
          return false;
        }

        const fecha_hora = `${fecha} ${hora}:00`;

        const res = await fetch(URL_ADMIN_CITAS, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_cita: c.id_cita, fecha_hora, motivo, estado })
        });
        const data = await res.json();
        if (data.success) { mostrarMsgAdmin(data.mensaje); adminCitas(); return true; }
        else { mostrarMsgAdmin(data.mensaje, "error"); return false; }
      });
    });

    tr.querySelector(".borrar").addEventListener("click", async () => {
      if (!confirm("¿Seguro que quieres eliminar esta cita?")) return;
      const res = await fetch(URL_ADMIN_CITAS, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_cita: c.id_cita })
      });
      const data = await res.json();
      if (data.success) { mostrarMsgAdmin(data.mensaje); adminCitas(); }
      else mostrarMsgAdmin(data.mensaje, "error");
    });

    tbody.appendChild(tr);
  });
}

// ===== TRATAMIENTOS =====
async function adminTratamientos() {
  const panel = document.querySelector("#admin-panel");
  const res = await fetch(URL_ADMIN_TRATAMIENTOS);
  const { success, datos } = await res.json();
  if (!success) return;

  panel.innerHTML = `
    <div class="admin-panel-titulo">
      Tratamientos
      <button class="buttons btn-tabla" id="btn-nuevo-tratamiento" style="font-size:0.85rem; padding:0.5rem 1rem;">
        <span class="material-symbols-outlined">add</span> Nuevo
      </button>
    </div>
    <div class="admin-tabla-wrapper">
      <table class="admin-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Duración</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tabla-tratamientos"></tbody>
      </table>
    </div>
  `;
  añadirBuscador("admin-panel", "tabla-tratamientos", [0, 1, 2]);
  const tbody = panel.querySelector("#tabla-tratamientos");
  datos.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.nombre_tratamiento}</td>
      <td>${t.duracion} min</td>
      <td>${t.precio}€</td>
      <td>
        <button class="btn-tabla editar">
          <span class="material-symbols-outlined">edit</span> Editar
        </button>
        <button class="btn-tabla borrar" style="margin-left:0.3rem;">
          <span class="material-symbols-outlined">delete</span> Borrar
        </button>
      </td>
    `;

    tr.querySelector(".editar").addEventListener("click", () => formTratamiento(t));
    tr.querySelector(".borrar").addEventListener("click", async () => {
      if (!confirm("¿Seguro que quieres eliminar este tratamiento?")) return;
      const res = await fetch(URL_ADMIN_TRATAMIENTOS, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_tratamiento: t.id_tratamiento })
      });
      const data = await res.json();
      if (data.success) { mostrarMsgAdmin(data.mensaje); adminTratamientos(); }
      else mostrarMsgAdmin(data.mensaje, "error");
    });

    tbody.appendChild(tr);
  });

  panel.querySelector("#btn-nuevo-tratamiento").addEventListener("click", () => formTratamiento());
}

function formTratamiento(t = null) {
  abrirModalAdmin(t ? "Editar tratamiento" : "Nuevo tratamiento", `
    <div class="form-grid">
      <div class="form-group" style="grid-column:1/-1;">
        <label>Nombre</label>
        <input type="text" id="t-nombre" value="${t ? t.nombre_tratamiento : ""}" required>
      </div>
      <div class="form-group" style="grid-column:1/-1;">
        <label>Descripción</label>
        <textarea id="t-descripcion" rows="3">${t ? t.descripcion : ""}</textarea>
      </div>
      <div class="form-group">
        <label>Duración (min)</label>
        <input type="number" id="t-duracion" value="${t ? t.duracion : ""}">
      </div>
      <div class="form-group">
        <label>Precio (€)</label>
        <input type="number" step="0.01" id="t-precio" value="${t ? t.precio : ""}">
      </div>
    </div>
  `, async () => {
    const datos = {
      nombre_tratamiento: document.querySelector("#t-nombre").value,
      descripcion:        document.querySelector("#t-descripcion").value,
      duracion:           document.querySelector("#t-duracion").value,
      precio:             document.querySelector("#t-precio").value,
    };
    if (t) datos.id_tratamiento = t.id_tratamiento;

    const res = await fetch(URL_ADMIN_TRATAMIENTOS, {
      method: t ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });
    const data = await res.json();
    if (data.success) { mostrarMsgAdmin(data.mensaje); adminTratamientos(); return true; }
    else { mostrarMsgAdmin(data.mensaje, "error"); return false; }
  });
}

// ===== MAQUINARIA =====
async function adminMaquinaria() {
  const panel = document.querySelector("#admin-panel");
  const res = await fetch(URL_ADMIN_MAQUINARIA);
  const { success, datos } = await res.json();
  if (!success) return;

  panel.innerHTML = `
    <div class="admin-panel-titulo">
      Maquinaria
      <button class="buttons btn-tabla" id="btn-nueva-maquinaria" style="font-size:0.85rem; padding:0.5rem 1rem;">
        <span class="material-symbols-outlined">add</span> Nueva
      </button>
    </div>
    <div class="admin-tabla-wrapper">
      <table class="admin-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Modelo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tabla-maquinaria"></tbody>
      </table>
    </div>
  `;

  añadirBuscador("admin-panel", "tabla-maquinaria", [0, 1, 2, 3]);

  const tbody = panel.querySelector("#tabla-maquinaria");
  datos.forEach(m => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.nombre}</td>
      <td>${m.tipo}</td>
      <td>${m.modelo || "-"}</td>
      <td><span class="badge-estado ${m.estado}">${m.estado}</span></td>
      <td>
        <button class="btn-tabla editar">
          <span class="material-symbols-outlined">edit</span> Editar
        </button>
        <button class="btn-tabla borrar" style="margin-left:0.3rem;">
          <span class="material-symbols-outlined">delete</span> Borrar
        </button>
      </td>
    `;

    tr.querySelector(".editar").addEventListener("click", () => formMaquinaria(m));
    tr.querySelector(".borrar").addEventListener("click", async () => {
      if (!confirm("¿Seguro que quieres eliminar esta maquinaria?")) return;
      const res = await fetch(URL_ADMIN_MAQUINARIA, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_maquinaria: m.id_maquinaria })
      });
      const data = await res.json();
      if (data.success) { mostrarMsgAdmin(data.mensaje); adminMaquinaria(); }
      else mostrarMsgAdmin(data.mensaje, "error");
    });

    tbody.appendChild(tr);
  });

  panel.querySelector("#btn-nueva-maquinaria").addEventListener("click", () => formMaquinaria());
}

function formMaquinaria(m = null) {
  abrirModalAdmin(m ? "Editar maquinaria" : "Nueva maquinaria", `
    <div class="form-grid">
      <div class="form-group">
        <label>Nombre</label>
        <input type="text" id="m-nombre" value="${m ? m.nombre : ""}" required>
      </div>
      <div class="form-group">
        <label>Tipo</label>
        <input type="text" id="m-tipo" value="${m ? m.tipo : ""}" required>
      </div>
      <div class="form-group">
        <label>Modelo</label>
        <input type="text" id="m-modelo" value="${m ? m.modelo || "" : ""}">
      </div>
      <div class="form-group">
        <label>Estado</label>
        <select id="m-estado">
          <option value="disponible" ${m?.estado==="disponible"?"selected":""}>Disponible</option>
          <option value="en uso" ${m?.estado==="en uso"?"selected":""}>En uso</option>
          <option value="mantenimiento" ${m?.estado==="mantenimiento"?"selected":""}>Mantenimiento</option>
        </select>
      </div>
      <div class="form-group">
        <label>Fecha adquisición</label>
        <input type="date" id="m-fecha" value="${m ? m.fecha_adquisicion || "" : ""}">
      </div>
      <div class="form-group" style="grid-column:1/-1;">
        <label>Descripción</label>
        <textarea id="m-descripcion" rows="3">${m ? m.descripcion || "" : ""}</textarea>
      </div>
    </div>
  `, async () => {
    const datos = {
      nombre:           document.querySelector("#m-nombre").value,
      tipo:             document.querySelector("#m-tipo").value,
      modelo:           document.querySelector("#m-modelo").value,
      estado:           document.querySelector("#m-estado").value,
      fecha_adquisicion: document.querySelector("#m-fecha").value,
      descripcion:      document.querySelector("#m-descripcion").value,
    };
    if (m) datos.id_maquinaria = m.id_maquinaria;

    const res = await fetch(URL_ADMIN_MAQUINARIA, {
      method: m ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });
    const data = await res.json();
    if (data.success) { mostrarMsgAdmin(data.mensaje); adminMaquinaria(); return true; }
    else { mostrarMsgAdmin(data.mensaje, "error"); return false; }
  });
}

// ===== PRODUCTOS =====
async function adminProductos() {
  const panel = document.querySelector("#admin-panel");
  const res = await fetch(URL_ADMIN_PRODUCTOS);
  const { success, datos } = await res.json();
  if (!success) return;

  panel.innerHTML = `
    <div class="admin-panel-titulo">
      Productos Clínicos
      <button class="buttons btn-tabla" id="btn-nuevo-producto" style="font-size:0.85rem; padding:0.5rem 1rem;">
        <span class="material-symbols-outlined">add</span> Nuevo
      </button>
    </div>
    <div class="admin-tabla-wrapper">
      <table class="admin-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Stock</th>
            <th>Proveedor</th>
            <th>Fecha compra</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tabla-productos"></tbody>
      </table>
    </div>
  `;
  añadirBuscador("admin-panel", "tabla-productos", [0, 1, 2]);
  const tbody = panel.querySelector("#tabla-productos");
  datos.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.nombre}</td>
      <td>${p.stock}</td>
      <td>${p.proveedor || "-"}</td>
      <td>${p.fecha_compra || "-"}</td>
      <td>
        <button class="btn-tabla editar">
          <span class="material-symbols-outlined">edit</span> Editar
        </button>
        <button class="btn-tabla borrar" style="margin-left:0.3rem;">
          <span class="material-symbols-outlined">delete</span> Borrar
        </button>
      </td>
    `;

    tr.querySelector(".editar").addEventListener("click", () => formProducto(p));
    tr.querySelector(".borrar").addEventListener("click", async () => {
      if (!confirm("¿Seguro que quieres eliminar este producto?")) return;
      const res = await fetch(URL_ADMIN_PRODUCTOS, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_producto: p.id_producto })
      });
      const data = await res.json();
      if (data.success) { mostrarMsgAdmin(data.mensaje); adminProductos(); }
      else mostrarMsgAdmin(data.mensaje, "error");
    });

    tbody.appendChild(tr);
  });

  panel.querySelector("#btn-nuevo-producto").addEventListener("click", () => formProducto());
}

function formProducto(p = null) {
  abrirModalAdmin(p ? "Editar producto" : "Nuevo producto", `
    <div class="form-grid">
      <div class="form-group" style="grid-column:1/-1;">
        <label>Nombre</label>
        <input type="text" id="p-nombre" value="${p ? p.nombre : ""}" required>
      </div>
      <div class="form-group" style="grid-column:1/-1;">
        <label>Descripción</label>
        <textarea id="p-descripcion" rows="2">${p ? p.descripcion || "" : ""}</textarea>
      </div>
      <div class="form-group">
        <label>Stock</label>
        <input type="number" id="p-stock" value="${p ? p.stock : 0}">
      </div>
      <div class="form-group">
        <label>Proveedor</label>
        <input type="text" id="p-proveedor" value="${p ? p.proveedor || "" : ""}">
      </div>
      <div class="form-group">
        <label>Fecha compra</label>
        <input type="date" id="p-fecha" value="${p ? p.fecha_compra || "" : ""}">
      </div>
    </div>
  `, async () => {
    const datos = {
      nombre:      document.querySelector("#p-nombre").value,
      descripcion: document.querySelector("#p-descripcion").value,
      stock:       document.querySelector("#p-stock").value,
      proveedor:   document.querySelector("#p-proveedor").value,
      fecha_compra: document.querySelector("#p-fecha").value,
    };
    if (p) datos.id_producto = p.id_producto;

    const res = await fetch(URL_ADMIN_PRODUCTOS, {
      method: p ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });
    const data = await res.json();
    if (data.success) { mostrarMsgAdmin(data.mensaje); adminProductos(); return true; }
    else { mostrarMsgAdmin(data.mensaje, "error"); return false; }
  });
}


function añadirBuscador(contenedorId, tbodyId, columnas) {
  const wrapper = document.querySelector(`#${contenedorId}`);
  if (!wrapper) return;

  const tablaWrapper = wrapper.querySelector(".admin-tabla-wrapper");
  if (!tablaWrapper) return;

  // evitar duplicados
  if (wrapper.querySelector(".admin-buscador")) return;

  const buscador = document.createElement("div");
  buscador.className = "admin-buscador";
  buscador.innerHTML = `
    <div class="input-buscador">
      <span class="material-symbols-outlined">search</span>
      <input type="text" placeholder="Buscar..." id="input-buscar-${tbodyId}">
    </div>
  `;

  wrapper.insertBefore(buscador, tablaWrapper);

  document.querySelector(`#input-buscar-${tbodyId}`).addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase();
    const filas = document.querySelectorAll(`#${tbodyId} tr`);

    filas.forEach(fila => {
      const contenido = Array.from(fila.querySelectorAll("td"))
        .filter((_, i) => columnas.includes(i))
        .map(td => td.textContent.toLowerCase())
        .join(" ");

      fila.style.display = contenido.includes(texto) ? "" : "none";
    });
  });
}


// ===== HORARIOS =====
async function adminHorarios() {
  const panel = document.querySelector("#admin-panel");

  // Cargar doctores para el selector
  const res = await fetch(URL_ADMIN_USUARIOS);
  const { success, datos } = await res.json();
  if (!success) return;

  const doctores = datos.filter(u => u.rol == "doctor");

  panel.innerHTML = `
    <div class="admin-panel-titulo">
      Horarios por Doctor
    </div>
    <div class="form-grid" style="margin-bottom:1.5rem;">
      <div class="form-group">
        <label>Doctor</label>
        <select id="filtro-doctor-horario">
          <option value="">-- Selecciona un doctor --</option>
          ${doctores.map(d => `<option value="${d.id_persona}">Dr. ${d.nombre} ${d.apellidos}</option>`).join("")}
        </select>
      </div>
    </div>
    <div id="horarios-contenido"></div>
  `;

  document.querySelector("#filtro-doctor-horario").addEventListener("change", async (e) => {
    const id_doctor = e.target.value;
    if (!id_doctor) return;
    await cargarTablaHorarios(id_doctor);
  });
}

async function cargarTablaHorarios(id_doctor) {
  const contenido = document.querySelector("#horarios-contenido");
  contenido.innerHTML = '<p class="cargando">Cargando horarios...</p>';

  const res = await fetch(`${URL_ADMIN_HORARIOS}?id_doctor=${id_doctor}`);
  const { success, datos } = await res.json();
  if (!success) return;

  contenido.innerHTML = `
    <div class="admin-panel-titulo" style="font-size:1rem;">
      Horarios
      <button class="buttons btn-tabla" id="btn-nuevo-horario" style="font-size:0.85rem; padding:0.5rem 1rem;">
        <span class="material-symbols-outlined">add</span> Nuevo
      </button>
    </div>
    <div class="admin-tabla-wrapper">
      <table class="admin-tabla">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Slot (min)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tabla-horarios"></tbody>
      </table>
    </div>
  `;

  const tbody = contenido.querySelector("#tabla-horarios");

  if (datos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay horarios registrados</td></tr>';
  }

  datos.forEach(h => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${h.fecha}</td>
      <td>${h.hora_inicio}</td>
      <td>${h.hora_fin}</td>
      <td>${h.duracion_slot}</td>
      <td>
        <button class="btn-tabla editar">
          <span class="material-symbols-outlined">edit</span> Editar
        </button>
        <button class="btn-tabla borrar" style="margin-left:0.3rem;">
          <span class="material-symbols-outlined">delete</span> Borrar
        </button>
      </td>
    `;

    tr.querySelector(".editar").addEventListener("click", () => formHorario(id_doctor, h));
    tr.querySelector(".borrar").addEventListener("click", async () => {
      if (!confirm("¿Seguro que quieres eliminar este horario?")) return;
      const res = await fetch(URL_ADMIN_HORARIOS, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_horario: h.id_horario })
      });
      const data = await res.json();
      if (data.success) { mostrarMsgAdmin(data.mensaje); cargarTablaHorarios(id_doctor); }
      else mostrarMsgAdmin(data.mensaje, "error");
    });

    tbody.appendChild(tr);
  });

  contenido.querySelector("#btn-nuevo-horario").addEventListener("click", () => formHorario(id_doctor));
}

function formHorario(id_doctor, h = null) {
  abrirModalAdmin(h ? "Editar horario" : "Nuevo horario", `
    <div class="form-grid">
      <div class="form-group">
        <label>Fecha</label>
        <input type="date" id="h-fecha" value="${h ? h.fecha : ""}" min="${new Date().toISOString().slice(0,10)}">
      </div>
      <div class="form-group">
        <label>Hora inicio</label>
        <input type="time" id="h-inicio" value="${h ? h.hora_inicio.slice(0,5) : "09:00"}">
      </div>
      <div class="form-group">
        <label>Hora fin</label>
        <input type="time" id="h-fin" value="${h ? h.hora_fin.slice(0,5) : "14:00"}">
      </div>
      <div class="form-group">
        <label>Slot (minutos)</label>
        <select id="h-slot">
          <option value="30" ${(!h || h.duracion_slot==30)?"selected":""}>30 min</option>
          <option value="60" ${h?.duracion_slot==60?"selected":""}>60 min</option>
        </select>
      </div>
    </div>
  `, async () => {
    const fecha   = document.querySelector("#h-fecha").value;
    const inicio  = document.querySelector("#h-inicio").value;
    const fin     = document.querySelector("#h-fin").value;
    const slot    = document.querySelector("#h-slot").value;

    if (!fecha || !inicio || !fin) {
      mostrarMsgAdmin("Rellena todos los campos", "error");
      return false;
    }

    const datos = { id_doctor, fecha, hora_inicio: inicio, hora_fin: fin, duracion_slot: slot };
    if (h) datos.id_horario = h.id_horario;

    const res = await fetch(URL_ADMIN_HORARIOS, {
      method: h ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });
    const data = await res.json();
    if (data.success) { mostrarMsgAdmin(data.mensaje); cargarTablaHorarios(id_doctor); return true; }
    else { mostrarMsgAdmin(data.mensaje, "error"); return false; }
  });
}

// ============================================================
//  contacto.js — Validación y envío del formulario de contacto
// ============================================================

function iniciarContacto() {
  const form = document.querySelector("#form-contacto");
  if (!form) return;

  const btnEnviar = document.querySelector("#btn-contacto");
  const msgGlobal = document.querySelector("#contacto-msg");

  const campos = {
    nombre:   document.querySelector("#contacto-nombre"),
    email:    document.querySelector("#contacto-email"),
    telefono: document.querySelector("#contacto-telefono"),
    mensaje:  document.querySelector("#contacto-mensaje"),
  };

  const errores = {
    nombre:   document.querySelector("#err-nombre"),
    email:    document.querySelector("#err-email"),
    telefono: document.querySelector("#err-telefono"),
    mensaje:  document.querySelector("#err-mensaje"),
  };

  // ── Contador de caracteres ──
  campos.mensaje.addEventListener("input", () => {
    document.querySelector("#contador-mensaje").textContent =
      `${campos.mensaje.value.length} / 1000`;
  });

  // ── Validación por campo ──
  function validarCampo(nombre) {
    const input = campos[nombre];
    const error = errores[nombre];
    const val   = input.value.trim();
    let msg     = "";

    switch (nombre) {
      case "nombre":
        if (!val)              msg = "El nombre es obligatorio.";
        else if (val.length < 2) msg = "Mínimo 2 caracteres.";
        break;
      case "email":
        if (!val)              msg = "El email es obligatorio.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = "Introduce un email válido.";
        break;
      case "telefono":
        if (val && !/^[+\d\s\-()]{7,20}$/.test(val)) msg = "Formato de teléfono no válido.";
        break;
      case "mensaje":
        if (!val)               msg = "El mensaje es obligatorio.";
        else if (val.length < 10) msg = "Mínimo 10 caracteres.";
        break;
    }

    error.textContent = msg;
    input.classList.toggle("invalido", !!msg);
    input.classList.toggle("valido",   !msg && !!val);
    return !msg;
  }

  // Validar al salir del campo y mientras se escribe si ya hay error
  Object.keys(campos).forEach(nombre => {
    campos[nombre].addEventListener("blur",  () => validarCampo(nombre));
    campos[nombre].addEventListener("input", () => {
      if (campos[nombre].classList.contains("invalido")) validarCampo(nombre);
    });
  });

  // ── Envío ──
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const todoOk = ["nombre", "email", "telefono", "mensaje"]
      .map(validarCampo)
      .every(Boolean);

    if (!todoOk) return;

    btnEnviar.disabled = true;
    btnEnviar.innerHTML = `
      <span class="material-symbols-outlined">hourglass_empty</span>
      <span>Enviando...</span>
    `;
    msgGlobal.style.display = "none";

    try {
      const res  = await fetch("api/contacto.php", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre:   campos.nombre.value.trim(),
          email:    campos.email.value.trim(),
          telefono: campos.telefono.value.trim(),
          mensaje:  campos.mensaje.value.trim(),
        })
      });

      const data = await res.json();
      msgGlobal.style.display = "block";

      if (data.success) {
        msgGlobal.className   = "auth-mensaje exito";
        msgGlobal.textContent = "✅ Mensaje enviado correctamente. Te responderemos pronto.";

        form.reset();
        Object.values(campos).forEach(c => c.classList.remove("valido", "invalido"));
        document.querySelector("#contador-mensaje").textContent = "0 / 1000";

        btnEnviar.innerHTML = `
          <span class="material-symbols-outlined">check_circle</span>
          <span>¡Enviado!</span>
        `;
        setTimeout(() => {
          btnEnviar.disabled  = false;
          btnEnviar.innerHTML = `
            <span class="material-symbols-outlined">send</span>
            <span>Enviar Solicitud</span>
          `;
          msgGlobal.style.display = "none";
        }, 4000);

      } else {
        msgGlobal.className   = "auth-mensaje error";
        msgGlobal.textContent = "❌ " + data.mensaje;
        btnEnviar.disabled    = false;
        btnEnviar.innerHTML   = `
          <span class="material-symbols-outlined">send</span>
          <span>Enviar Solicitud</span>
        `;
      }

    } catch (err) {
      console.error(err);
      msgGlobal.style.display = "block";
      msgGlobal.className     = "auth-mensaje error";
      msgGlobal.textContent   = "❌ Error de conexión. Inténtalo de nuevo.";
      btnEnviar.disabled      = false;
      btnEnviar.innerHTML     = `
        <span class="material-symbols-outlined">send</span>
        <span>Enviar Solicitud</span>
      `;
    }
  });
}


// ***** CARGA INICIAL *****
const paginaInicial = location.hash.slice(1);
comprobarSesion().then(() => {
  actualizarBotonSesion();
  const pagina = rutas[paginaInicial] ? paginaInicial : "home";
  // Si intenta ir a perfil sin sesión, redirigir a login
  if (pagina == "perfil" && !usuarioActual) {
    cargarVista("login");
  } else {
    cargarVista(pagina);
  }
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-reservar");
  if (!btn) return;

  e.preventDefault();
  e.stopPropagation();

  if (!usuarioActual) {
    cargarVista("login");
  } else {
    cargarVista("perfil");

    setTimeout(() => {
      const btnCitas = document.querySelector(
        '.perfil-nav-btn[data-seccion="citas"]'
      );
      if (btnCitas) btnCitas.click();
    }, 200);
  }
});

