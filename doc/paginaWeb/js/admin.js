// ============================================================
//  ADMIN.JS — Panel de administración completo
// ============================================================

// *** INICIAR ADMIN ***
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
    case "usuarios":     adminUsuarios();     break;
    case "doctores":     adminDoctores();     break;
    case "pacientes":    adminPacientes();    break;
    case "citas":        adminCitas();        break;
    case "tratamientos": adminTratamientos(); break;
    case "maquinaria":   adminMaquinaria();   break;
    case "productos":    adminProductos();    break;
    case "horarios":     adminHorarios();     break;
  }
}

// *** UTILIDADES ADMIN ***
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
  modal.querySelector(".modal-admin-body").innerHTML     = htmlContenido;
  modal.classList.add("visible");

  modal.querySelector(".btn-cerrar-modal-admin").onclick = () => modal.classList.remove("visible");
  modal.querySelector("#btn-cancelar-admin").onclick     = () => modal.classList.remove("visible");
  modal.onclick = e => { if (e.target === modal) modal.classList.remove("visible"); };
  modal.querySelector("#btn-guardar-admin").onclick = async () => {
    const resultado = await onGuardar();
    if (resultado) modal.classList.remove("visible");
  };
}

function mostrarMsgAdmin(msg, tipo = "exito") {
  const panel = document.querySelector("#admin-panel");
  const div   = document.createElement("div");
  div.className   = `auth-mensaje ${tipo}`;
  div.textContent = msg;
  div.style.marginBottom = "1rem";
  panel.insertBefore(div, panel.firstChild);
  setTimeout(() => div.remove(), 3000);
}

// *** USUARIOS ***
async function adminUsuarios() {
  const panel = document.querySelector("#admin-panel");
  const res   = await fetch(URL_ADMIN_USUARIOS);
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
            <th>Nombre</th><th>Email</th><th>Teléfono</th><th>DNI</th><th>Rol</th><th>Acciones</th>
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
    const res  = await fetch(URL_ADMIN_USUARIOS, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) });
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
          <option value="doctor"   ${u.rol==="doctor"  ?"selected":""}>Doctor</option>
          <option value="admin"    ${u.rol==="admin"   ?"selected":""}>Admin</option>
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
    const res  = await fetch(URL_ADMIN_USUARIOS, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) });
    const data = await res.json();
    if (data.success) { mostrarMsgAdmin(data.mensaje); adminUsuarios(); return true; }
    else { mostrarMsgAdmin(data.mensaje, "error"); return false; }
  });
}

async function borrarUsuario(id) {
  if (!confirm("¿Seguro que quieres eliminar este usuario? Esta acción no se puede deshacer.")) return;
  const res  = await fetch(URL_ADMIN_USUARIOS, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id_persona: id }) });
  const data = await res.json();
  if (data.success) { mostrarMsgAdmin(data.mensaje); adminUsuarios(); }
  else mostrarMsgAdmin(data.mensaje, "error");
}

// *** DOCTORES ***
async function adminDoctores() {
  const panel = document.querySelector("#admin-panel");
  const res   = await fetch(URL_ADMIN_USUARIOS);
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
          <tr><th>Nombre</th><th>Email</th><th>Teléfono</th><th>DNI</th><th>Acciones</th></tr>
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
        <button class="btn-tabla editar"><span class="material-symbols-outlined">edit</span> Editar</button>
        <button class="btn-tabla borrar" style="margin-left:0.3rem;"><span class="material-symbols-outlined">delete</span> Borrar</button>
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
      const res  = await fetch(URL_ADMIN_USUARIOS, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) });
      const data = await res.json();
      if (data.success) { mostrarMsgAdmin(data.mensaje); adminDoctores(); return true; }
      else { mostrarMsgAdmin(data.mensaje, "error"); return false; }
    });
  });
}

// *** PACIENTES ***
async function adminPacientes() {
  const panel = document.querySelector("#admin-panel");
  const res   = await fetch(URL_ADMIN_USUARIOS);
  const { success, datos } = await res.json();
  if (!success) return;

  const pacientes = datos.filter(u => u.rol === "paciente");

  panel.innerHTML = `
    <div class="admin-panel-titulo">Pacientes</div>
    <div class="admin-tabla-wrapper">
      <table class="admin-tabla">
        <thead>
          <tr><th>Nombre</th><th>Email</th><th>Teléfono</th><th>DNI</th><th>Acciones</th></tr>
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
        <button class="btn-tabla editar"><span class="material-symbols-outlined">edit</span> Editar</button>
        <button class="btn-tabla borrar" style="margin-left:0.3rem;"><span class="material-symbols-outlined">delete</span> Borrar</button>
      </td>
    `;
    tr.querySelector(".editar").addEventListener("click", () => editarUsuario(p));
    tr.querySelector(".borrar").addEventListener("click", () => borrarUsuario(p.id_persona));
    tbody.appendChild(tr);
  });
}

// *** CITAS ADMIN ***
async function adminCitas() {
  const panel = document.querySelector("#admin-panel");
  const res   = await fetch(URL_ADMIN_CITAS);
  const { success, datos } = await res.json();
  if (!success) return;

  panel.innerHTML = `
    <div class="admin-panel-titulo">Citas</div>
    <div class="admin-tabla-wrapper">
      <table class="admin-tabla">
        <thead>
          <tr><th>Paciente</th><th>Doctor</th><th>Fecha</th><th>Motivo</th><th>Estado</th><th>Acciones</th></tr>
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
        <button class="btn-tabla editar"><span class="material-symbols-outlined">edit</span> Editar</button>
        <button class="btn-tabla borrar" style="margin-left:0.3rem;"><span class="material-symbols-outlined">delete</span> Borrar</button>
      </td>
    `;

    tr.querySelector(".editar").addEventListener("click", () => {
      const fechaActual = new Date(c.fecha_hora);
      const fechaStr    = fechaActual.toISOString().slice(0, 10);
      const horaStr     = fechaActual.toTimeString().slice(0, 5);

      abrirModalAdmin("Editar cita", `
        <div class="form-grid">
          <div class="form-group"><label>Fecha</label><input type="date" id="cita-edit-fecha" value="${fechaStr}"></div>
          <div class="form-group"><label>Hora</label><input type="time" id="cita-edit-hora" value="${horaStr}" step="1800"></div>
          <div class="form-group" style="grid-column:1/-1;"><label>Motivo</label><textarea id="cita-edit-motivo" rows="3">${c.motivo}</textarea></div>
          <div class="form-group"><label>Estado</label>
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

        if (!fecha || !hora || !motivo) { mostrarMsgAdmin("Rellena todos los campos", "error"); return false; }

        const fecha_hora = `${fecha} ${hora}:00`;
        const res  = await fetch(URL_ADMIN_CITAS, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id_cita: c.id_cita, fecha_hora, motivo, estado }) });
        const data = await res.json();
        if (data.success) { mostrarMsgAdmin(data.mensaje); adminCitas(); return true; }
        else { mostrarMsgAdmin(data.mensaje, "error"); return false; }
      });
    });

    tr.querySelector(".borrar").addEventListener("click", async () => {
      if (!confirm("¿Seguro que quieres eliminar esta cita?")) return;
      const res  = await fetch(URL_ADMIN_CITAS, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id_cita: c.id_cita }) });
      const data = await res.json();
      if (data.success) { mostrarMsgAdmin(data.mensaje); adminCitas(); }
      else mostrarMsgAdmin(data.mensaje, "error");
    });

    tbody.appendChild(tr);
  });
}

// *** TRATAMIENTOS ADMIN ***
async function adminTratamientos() {
  const panel = document.querySelector("#admin-panel");
  const res   = await fetch(URL_ADMIN_TRATAMIENTOS);
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
          <tr><th>Nombre</th><th>Duración</th><th>Precio</th><th>Acciones</th></tr>
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
        <button class="btn-tabla editar"><span class="material-symbols-outlined">edit</span> Editar</button>
        <button class="btn-tabla borrar" style="margin-left:0.3rem;"><span class="material-symbols-outlined">delete</span> Borrar</button>
      </td>
    `;
    tr.querySelector(".editar").addEventListener("click", () => formTratamiento(t));
    tr.querySelector(".borrar").addEventListener("click", async () => {
      if (!confirm("¿Seguro que quieres eliminar este tratamiento?")) return;
      const res  = await fetch(URL_ADMIN_TRATAMIENTOS, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id_tratamiento: t.id_tratamiento }) });
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
      <div class="form-group" style="grid-column:1/-1;"><label>Nombre</label><input type="text" id="t-nombre" value="${t ? t.nombre_tratamiento : ""}" required></div>
      <div class="form-group" style="grid-column:1/-1;"><label>Descripción</label><textarea id="t-descripcion" rows="3">${t ? t.descripcion : ""}</textarea></div>
      <div class="form-group"><label>Duración (min)</label><input type="number" id="t-duracion" value="${t ? t.duracion : ""}"></div>
      <div class="form-group"><label>Precio (€)</label><input type="number" step="0.01" id="t-precio" value="${t ? t.precio : ""}"></div>
    </div>
  `, async () => {
    const datos = {
      nombre_tratamiento: document.querySelector("#t-nombre").value,
      descripcion:        document.querySelector("#t-descripcion").value,
      duracion:           document.querySelector("#t-duracion").value,
      precio:             document.querySelector("#t-precio").value,
    };
    if (t) datos.id_tratamiento = t.id_tratamiento;
    const res  = await fetch(URL_ADMIN_TRATAMIENTOS, { method: t ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) });
    const data = await res.json();
    if (data.success) { mostrarMsgAdmin(data.mensaje); adminTratamientos(); return true; }
    else { mostrarMsgAdmin(data.mensaje, "error"); return false; }
  });
}

// *** MAQUINARIA ***
async function adminMaquinaria() {
  const panel = document.querySelector("#admin-panel");
  const res   = await fetch(URL_ADMIN_MAQUINARIA);
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
          <tr><th>Nombre</th><th>Tipo</th><th>Modelo</th><th>Estado</th><th>Acciones</th></tr>
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
        <button class="btn-tabla editar"><span class="material-symbols-outlined">edit</span> Editar</button>
        <button class="btn-tabla borrar" style="margin-left:0.3rem;"><span class="material-symbols-outlined">delete</span> Borrar</button>
      </td>
    `;
    tr.querySelector(".editar").addEventListener("click", () => formMaquinaria(m));
    tr.querySelector(".borrar").addEventListener("click", async () => {
      if (!confirm("¿Seguro que quieres eliminar esta maquinaria?")) return;
      const res  = await fetch(URL_ADMIN_MAQUINARIA, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id_maquinaria: m.id_maquinaria }) });
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
      <div class="form-group"><label>Nombre</label><input type="text" id="m-nombre" value="${m ? m.nombre : ""}" required></div>
      <div class="form-group"><label>Tipo</label><input type="text" id="m-tipo" value="${m ? m.tipo : ""}" required></div>
      <div class="form-group"><label>Modelo</label><input type="text" id="m-modelo" value="${m ? m.modelo || "" : ""}"></div>
      <div class="form-group"><label>Estado</label>
        <select id="m-estado">
          <option value="disponible"   ${m?.estado==="disponible"   ?"selected":""}>Disponible</option>
          <option value="en uso"       ${m?.estado==="en uso"       ?"selected":""}>En uso</option>
          <option value="mantenimiento"${m?.estado==="mantenimiento"?"selected":""}>Mantenimiento</option>
        </select>
      </div>
      <div class="form-group"><label>Fecha adquisición</label><input type="date" id="m-fecha" value="${m ? m.fecha_adquisicion || "" : ""}"></div>
      <div class="form-group" style="grid-column:1/-1;"><label>Descripción</label><textarea id="m-descripcion" rows="3">${m ? m.descripcion || "" : ""}</textarea></div>
    </div>
  `, async () => {
    const datos = {
      nombre:            document.querySelector("#m-nombre").value,
      tipo:              document.querySelector("#m-tipo").value,
      modelo:            document.querySelector("#m-modelo").value,
      estado:            document.querySelector("#m-estado").value,
      fecha_adquisicion: document.querySelector("#m-fecha").value,
      descripcion:       document.querySelector("#m-descripcion").value,
    };
    if (m) datos.id_maquinaria = m.id_maquinaria;
    const res  = await fetch(URL_ADMIN_MAQUINARIA, { method: m ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) });
    const data = await res.json();
    if (data.success) { mostrarMsgAdmin(data.mensaje); adminMaquinaria(); return true; }
    else { mostrarMsgAdmin(data.mensaje, "error"); return false; }
  });
}

// *** PRODUCTOS ***
async function adminProductos() {
  const panel = document.querySelector("#admin-panel");
  const res   = await fetch(URL_ADMIN_PRODUCTOS);
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
          <tr><th>Nombre</th><th>Stock</th><th>Proveedor</th><th>Fecha compra</th><th>Acciones</th></tr>
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
        <button class="btn-tabla editar"><span class="material-symbols-outlined">edit</span> Editar</button>
        <button class="btn-tabla borrar" style="margin-left:0.3rem;"><span class="material-symbols-outlined">delete</span> Borrar</button>
      </td>
    `;
    tr.querySelector(".editar").addEventListener("click", () => formProducto(p));
    tr.querySelector(".borrar").addEventListener("click", async () => {
      if (!confirm("¿Seguro que quieres eliminar este producto?")) return;
      const res  = await fetch(URL_ADMIN_PRODUCTOS, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id_producto: p.id_producto }) });
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
      <div class="form-group" style="grid-column:1/-1;"><label>Nombre</label><input type="text" id="p-nombre" value="${p ? p.nombre : ""}" required></div>
      <div class="form-group" style="grid-column:1/-1;"><label>Descripción</label><textarea id="p-descripcion" rows="2">${p ? p.descripcion || "" : ""}</textarea></div>
      <div class="form-group"><label>Stock</label><input type="number" id="p-stock" value="${p ? p.stock : 0}"></div>
      <div class="form-group"><label>Proveedor</label><input type="text" id="p-proveedor" value="${p ? p.proveedor || "" : ""}"></div>
      <div class="form-group"><label>Fecha compra</label><input type="date" id="p-fecha" value="${p ? p.fecha_compra || "" : ""}"></div>
    </div>
  `, async () => {
    const datos = {
      nombre:       document.querySelector("#p-nombre").value,
      descripcion:  document.querySelector("#p-descripcion").value,
      stock:        document.querySelector("#p-stock").value,
      proveedor:    document.querySelector("#p-proveedor").value,
      fecha_compra: document.querySelector("#p-fecha").value,
    };
    if (p) datos.id_producto = p.id_producto;
    const res  = await fetch(URL_ADMIN_PRODUCTOS, { method: p ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) });
    const data = await res.json();
    if (data.success) { mostrarMsgAdmin(data.mensaje); adminProductos(); return true; }
    else { mostrarMsgAdmin(data.mensaje, "error"); return false; }
  });
}

// *** HORARIOS ***
async function adminHorarios() {
  const panel = document.querySelector("#admin-panel");
  const res   = await fetch(URL_ADMIN_USUARIOS);
  const { success, datos } = await res.json();
  if (!success) return;

  const doctores = datos.filter(u => u.rol == "doctor");

  panel.innerHTML = `
    <div class="admin-panel-titulo">Horarios por Doctor</div>
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
          <tr><th>Fecha</th><th>Inicio</th><th>Fin</th><th>Slot (min)</th><th>Acciones</th></tr>
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
        <button class="btn-tabla editar"><span class="material-symbols-outlined">edit</span> Editar</button>
        <button class="btn-tabla borrar" style="margin-left:0.3rem;"><span class="material-symbols-outlined">delete</span> Borrar</button>
      </td>
    `;
    tr.querySelector(".editar").addEventListener("click", () => formHorario(id_doctor, h));
    tr.querySelector(".borrar").addEventListener("click", async () => {
      if (!confirm("¿Seguro que quieres eliminar este horario?")) return;
      const res  = await fetch(URL_ADMIN_HORARIOS, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id_horario: h.id_horario }) });
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
      <div class="form-group"><label>Fecha</label><input type="date" id="h-fecha" value="${h ? h.fecha : ""}" min="${new Date().toISOString().slice(0,10)}"></div>
      <div class="form-group"><label>Hora inicio</label><input type="time" id="h-inicio" value="${h ? h.hora_inicio.slice(0,5) : "09:00"}"></div>
      <div class="form-group"><label>Hora fin</label><input type="time" id="h-fin" value="${h ? h.hora_fin.slice(0,5) : "14:00"}"></div>
      <div class="form-group"><label>Slot (minutos)</label>
        <select id="h-slot">
          <option value="30" ${(!h || h.duracion_slot==30)?"selected":""}>30 min</option>
          <option value="60" ${h?.duracion_slot==60?"selected":""}>60 min</option>
        </select>
      </div>
    </div>
  `, async () => {
    const fecha  = document.querySelector("#h-fecha").value;
    const inicio = document.querySelector("#h-inicio").value;
    const fin    = document.querySelector("#h-fin").value;
    const slot   = document.querySelector("#h-slot").value;

    if (!fecha || !inicio || !fin) { mostrarMsgAdmin("Rellena todos los campos", "error"); return false; }

    const datos = { id_doctor, fecha, hora_inicio: inicio, hora_fin: fin, duracion_slot: slot };
    if (h) datos.id_horario = h.id_horario;

    const res  = await fetch(URL_ADMIN_HORARIOS, { method: h ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) });
    const data = await res.json();
    if (data.success) { mostrarMsgAdmin(data.mensaje); cargarTablaHorarios(id_doctor); return true; }
    else { mostrarMsgAdmin(data.mensaje, "error"); return false; }
  });
}
