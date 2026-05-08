// ============================================================
//  SESION.JS — Login, logout, registro y control de sesión
// ============================================================

let usuarioActual = null;

// *** COMPROBAR SESIÓN AL CARGAR ***
async function comprobarSesion() {
  try {
    const res = await fetch(URL_API_SESION);
    const { success, usuario } = await res.json();
    if (success) {
      usuarioActual = usuario;
      localStorage.setItem('usuario', JSON.stringify(usuario));
      actualizarBotonSesion();
    } else {
      localStorage.removeItem('usuario');
    }
  } catch (err) {
    console.error(err);
  }
}

// *** ACTUALIZAR BOTÓN SEGÚN SESIÓN ***
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

// *** LOGIN ***
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
      cargarVista("perfil");
    }
    return data;
  } catch (err) {
    console.error(err);
    return { success: false, mensaje: "Error de conexión" };
  }
}

// *** LOGOUT ***
async function logout() {
  await fetch(URL_API_LOGOUT);
  usuarioActual = null;
  actualizarBotonSesion();
  cargarVista("home");
}

// *** REGISTRO ***
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

// *** INICIAR FORMULARIO LOGIN ***
function iniciarLogin() {
  document.querySelector("#form-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email    = document.querySelector("#login-email").value;
    const password = document.querySelector("#login-password").value;
    const error    = document.querySelector("#auth-error");
    const btn      = document.querySelector(".auth-btn");

    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span><span>Entrando...</span>';

    const data = await login(email, password);

    if (!data.success) {
      error.textContent = data.mensaje;
      error.style.display = "block";
      btn.disabled = false;
      btn.innerHTML = '<span class="material-symbols-outlined">login</span><span>Iniciar Sesión</span>';
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

// *** INICIAR FORMULARIO REGISTRO ***
function iniciarRegistro() {
  document.querySelector("#form-registro").addEventListener("submit", async (e) => {
    e.preventDefault();
    const error  = document.querySelector("#registro-error");
    const exito  = document.querySelector("#registro-exito");
    const btn    = document.querySelector(".auth-btn");

    error.style.display = "none";
    exito.style.display = "none";

    const password  = document.querySelector("#reg-password").value;
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
    btn.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span><span>Registrando...</span>';

    const datosRegistro = {
      nombre:    document.querySelector("#reg-nombre").value,
      apellidos: document.querySelector("#reg-apellidos").value,
      email:     document.querySelector("#reg-email").value,
      password:  password,
      telefono:  document.querySelector("#reg-telefono").value,
      dni:       document.querySelector("#reg-dni").value,
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
      btn.innerHTML = '<span class="material-symbols-outlined">person_add</span><span>Crear Cuenta</span>';
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
