// ============================================================
//  CITAS.JS — Citas de paciente y doctor
// ============================================================

// *** CITAS PACIENTE ***
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

  clon.querySelector(".cita-estado").style.color       = badge.color;
  clon.querySelector(".cita-estado-icono").textContent  = badge.icono;
  clon.querySelector(".cita-estado-texto").textContent  = cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1);
  clon.querySelector(".cita-fecha-texto").textContent   = fecha;
  clon.querySelector(".cita-doctor").textContent        = "Dr. " + cita.nombre_doctor;
  clon.querySelector(".cita-motivo").textContent        = cita.motivo;

  if (cita.estado == "pendiente" || cita.estado == "confirmada") {
    const footer = clon.querySelector(".cita-footer-cancelar");
    footer.style.display = "flex";
    footer.querySelector(".btn-cancelar-cita").addEventListener("click", async () => {
      if (!confirm("¿Seguro que quieres cancelar esta cita?")) return;
      const res  = await fetch(URL_API_CITAS, {
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

  const clon        = document.querySelector("#template-form-nueva-cita").content.cloneNode(true);
  const selectDoctor = clon.querySelector("#cita-doctor");
  datos.forEach(d => {
    const option    = document.createElement("option");
    option.value    = d.id_persona;
    option.textContent = `Dr. ${d.nombre} ${d.apellidos}`;
    selectDoctor.appendChild(option);
  });

  const fechaInput = clon.querySelector("#cita-fecha");
  fechaInput.min   = new Date().toISOString().slice(0, 10);

  form.innerHTML = "";
  form.appendChild(clon);

  // Cargar slots cuando cambie doctor o fecha
  async function cargarSlots() {
    const id_doctor  = form.querySelector("#cita-doctor").value;
    const fecha      = form.querySelector("#cita-fecha").value;
    const horaSelect = form.querySelector("#cita-hora");

    if (!id_doctor || !fecha) return;

    const dia = new Date(fecha + "T00:00:00").getDay();
    if (dia === 0 || dia === 6) {
      horaSelect.innerHTML = '<option value="">Solo días laborables (L-V)</option>';
      horaSelect.disabled  = true;
      return;
    }

    horaSelect.innerHTML = '<option value="">Cargando horarios...</option>';
    horaSelect.disabled  = true;

    const res  = await fetch(`api/horarios_disponibles.php?id_doctor=${id_doctor}&fecha=${fecha}`);
    const data = await res.json();

    if (!data.slots || data.slots.length === 0) {
      horaSelect.innerHTML = '<option value="">El doctor no trabaja ese día</option>';
      return;
    }

    horaSelect.innerHTML = '<option value="">-- Elige hora --</option>';
    data.slots.forEach(slot => {
      const opt       = document.createElement("option");
      opt.value       = slot.hora;
      opt.textContent = slot.disponible ? slot.hora : `${slot.hora} (ocupado)`;
      opt.disabled    = !slot.disponible;
      horaSelect.appendChild(opt);
    });

    horaSelect.disabled = false;
  }

  form.querySelector("#cita-doctor").addEventListener("change", cargarSlots);
  form.querySelector("#cita-fecha").addEventListener("change", cargarSlots);

  // Enviar cita
  form.querySelector("#btn-enviar-cita").addEventListener("click", async () => {
    const id_doctor = form.querySelector("#cita-doctor").value;
    const fecha     = form.querySelector("#cita-fecha").value;
    const hora      = form.querySelector("#cita-hora").value;
    const motivo    = form.querySelector("#cita-motivo").value;
    const msg       = form.querySelector("#cita-msg");
    const btn       = form.querySelector("#btn-enviar-cita");

    if (!id_doctor || !fecha || !hora || !motivo) {
      msg.className   = "auth-mensaje error";
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
      msg.className   = "auth-mensaje exito";
      msg.textContent = "¡Cita solicitada correctamente!";
      iniciarCitasPaciente();
      setTimeout(() => modal.classList.remove("visible"), 1500);
    } else {
      msg.className   = "auth-mensaje error";
      msg.textContent = data.mensaje;
      btn.disabled    = false;
    }
  });
}

// *** CITAS DOCTOR ***
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

  clon.querySelector(".cita-estado").style.color      = badge.color;
  clon.querySelector(".cita-estado-icono").textContent = badge.icono;
  clon.querySelector(".cita-estado-texto").textContent = cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1);
  clon.querySelector(".cita-fecha-texto").textContent  = fecha;
  clon.querySelector(".cita-paciente").textContent     = cita.nombre_paciente;
  clon.querySelector(".cita-motivo").textContent       = cita.motivo;

  const footer      = clon.querySelector(".cita-card-footer");
  const btnConfirmar = clon.querySelector(".btn-accion.confirmar");
  const btnCompletar = clon.querySelector(".btn-accion.completar");
  const btnCancelar  = clon.querySelector(".btn-accion.cancelar");

  if (cita.estado == "pendiente") {
    footer.style.display      = "flex";
    btnConfirmar.style.display = "flex";
    btnCancelar.style.display  = "flex";
  } else if (cita.estado == "confirmada") {
    footer.style.display      = "flex";
    btnCompletar.style.display = "flex";
    btnCancelar.style.display  = "flex";
  }

  [btnConfirmar, btnCompletar, btnCancelar].forEach(btn => {
    btn.addEventListener("click", async () => {
      const estado = btn.classList.contains("confirmar") ? "confirmada"
                   : btn.classList.contains("completar") ? "completada"
                   : "cancelada";
      const res  = await fetch(URL_API_CITAS, {
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

// *** CREAR CITA DESDE DOCTOR ***
async function mostrarFormCrearCitaDoctor(paciente) {
  const modal = document.querySelector("#modal-cita-doctor");
  modal.querySelector(".cita-doctor-titulo").textContent = `Nueva cita para ${paciente.nombre} ${paciente.apellidos}`;

  const fechaInput = modal.querySelector("#cita-doctor-fecha");
  const horaSelect = modal.querySelector("#cita-doctor-hora");
  fechaInput.min   = new Date().toISOString().slice(0, 10);
  fechaInput.value = "";
  horaSelect.innerHTML = '<option value="">-- Elige primero una fecha --</option>';
  horaSelect.disabled  = true;
  modal.querySelector("#cita-doctor-motivo").value   = "";
  modal.querySelector("#cita-doctor-msg").style.display = "none";
  modal.querySelector("#btn-enviar-cita-doctor").disabled = false;

  modal.classList.add("visible");

  modal.querySelector("#btn-cerrar-cita-doctor").onclick = () => modal.classList.remove("visible");
  modal.onclick = e => { if (e.target === modal) modal.classList.remove("visible"); };

  async function cargarSlotsDoctor() {
    const fecha = fechaInput.value;
    if (!fecha) return;

    const dia = new Date(fecha + "T00:00:00").getDay();
    if (dia === 0 || dia === 6) {
      horaSelect.innerHTML = '<option value="">Solo días laborables (L-V)</option>';
      horaSelect.disabled  = true;
      return;
    }

    horaSelect.innerHTML = '<option value="">Cargando horarios...</option>';
    horaSelect.disabled  = true;

    const res  = await fetch(`api/horarios_disponibles.php?id_doctor=${usuarioActual.id}&fecha=${fecha}&id_paciente=${paciente.id_paciente}`);
    const data = await res.json();

    if (!data.slots || data.slots.length === 0) {
      horaSelect.innerHTML = '<option value="">No hay horarios disponibles</option>';
      return;
    }

    horaSelect.innerHTML = '<option value="">-- Elige hora --</option>';
    data.slots.forEach(slot => {
      const opt       = document.createElement("option");
      opt.value       = slot.hora;
      opt.textContent = slot.disponible ? slot.hora : `${slot.hora} (ocupado)`;
      opt.disabled    = !slot.disponible;
      horaSelect.appendChild(opt);
    });

    horaSelect.disabled = false;
  }

  fechaInput.addEventListener("change", cargarSlotsDoctor);

  modal.querySelector("#btn-enviar-cita-doctor").onclick = async () => {
    const fecha  = fechaInput.value;
    const hora   = horaSelect.value;
    const motivo = modal.querySelector("#cita-doctor-motivo").value;
    const msg    = modal.querySelector("#cita-doctor-msg");
    const btn    = modal.querySelector("#btn-enviar-cita-doctor");

    if (!fecha || !hora || !motivo) {
      msg.className   = "auth-mensaje error";
      msg.textContent = "Rellena todos los campos";
      msg.style.display = "block";
      return;
    }

    const fecha_hora = `${fecha} ${hora}:00`;

    btn.disabled = true;
    const res = await fetch(URL_API_CITA_DOCTOR, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_paciente: paciente.id_paciente, fecha_hora, motivo })
    });

    const data = await res.json();
    msg.style.display = "block";
    if (data.success) {
      msg.className   = "auth-mensaje exito";
      msg.textContent = "¡Cita creada correctamente!";
      setTimeout(() => modal.classList.remove("visible"), 1500);
    } else {
      msg.className   = "auth-mensaje error";
      msg.textContent = data.mensaje;
      btn.disabled    = false;
    }
  };
}
