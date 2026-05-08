// ============================================================
//  contacto.js — Validación y envío del formulario de contacto
// ============================================================

function iniciarContacto() {
  const form      = document.querySelector("#form-contacto");
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