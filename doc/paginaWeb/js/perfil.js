// ============================================================
//  PERFIL.JS — Perfil de usuario, foto y navegación interna
// ============================================================

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
        const res  = await fetch("api/subir_foto.php", { method: "POST", body: formData });
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
        const res  = await fetch("api/borrar_foto.php", { method: "POST" });
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

      // Mostrar botones según rol
      const rol = datos.rol;
      document.querySelectorAll(".perfil-nav-btn[data-seccion]").forEach(btn => {
        const esDeRol      = btn.className.includes("rol-");
        const esDeEsteRol  = btn.classList.contains(`rol-${rol}`);
        if (!esDeRol || esDeEsteRol) {
          btn.style.display = "";
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
        if (usuarioActual.rol == "doctor")   iniciarCitasDoctor();
      }
      if (seccion == "pacientes")    iniciarPacientesDoctor();
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
      msg.className   = "auth-mensaje exito";
      msg.textContent = "Datos actualizados correctamente";
      usuarioActual.nombre = document.querySelector("#perfil-nombre").value;
      actualizarBotonSesion();
    } else {
      msg.className   = "auth-mensaje error";
      msg.textContent = data.mensaje;
    }

    btn.disabled = false;
    setTimeout(() => msg.style.display = "none", 3000);
  });
}
