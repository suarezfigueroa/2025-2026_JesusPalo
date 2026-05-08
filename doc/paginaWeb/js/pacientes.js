// ============================================================
//  PACIENTES.JS — Pacientes del doctor, historial y tratamientos
// ============================================================

// *** PACIENTES DOCTOR ***
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
      clon.querySelector(".paciente-foto").src           = rutaFoto(paciente.Foto);
      clon.querySelector(".paciente-nombre").textContent  = paciente.nombre + " " + paciente.apellidos;
      clon.querySelector(".paciente-email").textContent   = paciente.email;
      clon.querySelector(".paciente-telefono").textContent = paciente.telefono || "No disponible";
      clon.querySelector(".paciente-dni").textContent     = paciente.dni || "No disponible";
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

// *** ASIGNAR TRATAMIENTO ***
async function mostrarFormAsignarTratamiento(paciente) {
  const modal      = document.querySelector("#modal-tratamiento");
  const titulo     = modal.querySelector(".asignar-titulo");
  const select     = modal.querySelector("#select-tratamiento");
  const fechaInicio = modal.querySelector("#fecha-inicio-trat");
  const fechaFin   = modal.querySelector("#fecha-fin-trat");
  const msg        = modal.querySelector("#asignar-msg");

  select.innerHTML  = "<option value=''>Selecciona un tratamiento</option>";
  fechaInicio.value = "";
  fechaFin.value    = "";
  msg.style.display = "none";

  titulo.textContent = `Asignar tratamiento a ${paciente.nombre} ${paciente.apellidos}`;

  modal.classList.add("visible");

  modal.onclick = (e) => { if (e.target === modal) modal.classList.remove("visible"); };
  modal.querySelector("#btn-cerrar-tratamiento").onclick  = () => modal.classList.remove("visible");
  modal.querySelector("#btn-cancelar-asignar").onclick    = () => modal.classList.remove("visible");

  const resTrat = await fetch(URL_API_TRATAMIENTOS);
  const { success, datos } = await resTrat.json();
  if (!success) return;

  datos.forEach(t => {
    const option       = document.createElement("option");
    option.value       = t.id_tratamiento;
    option.textContent = t.nombre_tratamiento;
    select.appendChild(option);
  });

  fechaInicio.min = new Date().toISOString().slice(0, 10);

  modal.querySelector("#btn-asignar").onclick = async () => {
    const id_tratamiento = select.value;
    const fi = fechaInicio.value;
    const ff = fechaFin.value;

    if (!id_tratamiento || !fi || !ff) {
      msg.className   = "auth-mensaje error";
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
      msg.className   = "auth-mensaje exito";
      msg.textContent = "Tratamiento asignado correctamente";
      setTimeout(() => modal.classList.remove("visible"), 1500);
    } else {
      msg.className   = "auth-mensaje error";
      msg.textContent = data.mensaje;
    }
  };
}

// *** HISTORIAL PACIENTE ***
async function mostrarHistorialPaciente(paciente) {
  const res = await fetch(`${URL_API_HISTORIAL}?id_paciente=${paciente.id_paciente}`);
  const { success, citas, tratamientos } = await res.json();
  if (!success) return;

  const modal  = document.querySelector("#modal-historial");
  const titulo = document.querySelector("#historial-titulo");

  titulo.textContent = `Historial de ${paciente.nombre} ${paciente.apellidos}`;

  modal.classList.add("visible");

  modal.onclick = (e) => { if (e.target == modal) modal.classList.remove("visible"); };
  document.querySelector("#btn-cerrar-historial").onclick = () => modal.classList.remove("visible");

  // CITAS del historial
  const contCitas = document.querySelector("#historial-citas");
  contCitas.innerHTML = "";

  if (citas.length == 0) {
    contCitas.innerHTML = '<p class="sin-datos">No hay citas registradas.</p>';
  } else {
    citas.forEach(cita => {
      const clon  = document.querySelector("#template-historial-cita").content.cloneNode(true);
      const badge = estadoBadges[cita.estado] || { color: "#6b7280", icono: "help" };
      const fecha = new Date(cita.fecha_hora).toLocaleString("es-ES", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      });

      clon.querySelector(".cita-estado").style.color = badge.color;
      clon.querySelector(".hist-icono").textContent   = badge.icono;
      clon.querySelector(".hist-estado").textContent  = cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1);
      clon.querySelector(".hist-fecha").textContent   = fecha;
      clon.querySelector(".hist-motivo").textContent  = cita.motivo;

      contCitas.appendChild(clon);
    });
  }

  // TRATAMIENTOS del historial
  const contTrat = document.querySelector("#historial-tratamientos");
  contTrat.innerHTML = "";

  if (tratamientos.length == 0) {
    contTrat.innerHTML = '<p class="sin-datos">No hay tratamientos asignados.</p>';
  } else {
    tratamientos.forEach(t => {
      const clon = document.querySelector("#template-historial-tratamiento").content.cloneNode(true);
      clon.querySelector(".hist-trat-img").src              = rutaFoto(t.foto, "");
      clon.querySelector(".hist-trat-nombre").textContent    = t.nombre_tratamiento;
      clon.querySelector(".hist-trat-fechas").textContent    = `${t.fecha_inicio} → ${t.fecha_fin}`;
      clon.querySelector(".hist-trat-descripcion").textContent = t.descripcion;
      contTrat.appendChild(clon);
    });
  }
}

// *** TRATAMIENTOS PACIENTE ***
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
      clon.querySelector(".trat-img").src             = rutaFoto(t.foto, "");
      clon.querySelector(".trat-nombre").textContent   = t.nombre_tratamiento;
      clon.querySelector(".trat-descripcion").textContent = t.descripcion;
      clon.querySelector(".trat-fechas").textContent   = `${t.fecha_inicio} → ${t.fecha_fin}`;
      clon.querySelector(".trat-precio").textContent   = `${t.precio}€`;

      const estadoPago = clon.querySelector(".trat-pago-estado");
      if (t.pago === "pagado") {
        estadoPago.textContent = `Pagado con ${t.metodo_pago} el ${new Date(t.fecha_pago).toLocaleDateString("es-ES")}`;
        estadoPago.style.color = "var(--green-500, #22c55e)";
      } else {
        estadoPago.textContent = "Pendiente de pago";
        estadoPago.style.color = "var(--orange-500, #f59e0b)";

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

  const confirmar = confirm(`¿Seguro que quieres pagar el tratamiento "${t.nombre_tratamiento}" por ${t.precio}€?`);
  if (!confirmar) return;

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
