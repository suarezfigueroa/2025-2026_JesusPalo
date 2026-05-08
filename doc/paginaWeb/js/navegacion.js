// ============================================================
//  NAVEGACION.JS — Router, carga de vistas, header y menú
// ============================================================

// nav y toggle declarados aquí para que todo el código los pueda usar
const nav    = document.querySelector("nav");
const toggle = document.querySelector(".menu-toggle");

// *** NAVEGACIÓN POR CLICKS ***
nav.addEventListener("click", (e) => {
  if (e.target.classList.contains("nav-link")) {
    location.hash = e.target.dataset.link;
    nav.classList.remove("open");
  }
});

// *** NAVEGACIÓN CON FLECHAS ATRÁS/ADELANTE ***
window.addEventListener("hashchange", () => {
  const pagina = location.hash.slice(1);
  paginaActual = null;
  cargarVista(rutas[pagina] ? pagina : "paginaNoEncontrada");
  console.log("HASHCHANGE:", location.hash);
});

// *** LOGO LLEVA A HOME ***
document.querySelector(".logo").addEventListener("click", () => {
  location.hash = "home";
});

// *** TOGGLE MENÚ MÓVIL ***
toggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

// *** SCROLL HEADER ***
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// *** CARGA DE VISTAS ***
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

    if (nombre == "sobreNosotros") pintarDoctores();
    if (nombre == "tratamientos")  pintarTratamientos();
    if (nombre == "home")          pintarTratamientosHome();
    if (nombre == "clinica")       iniciarCarrusel();
    if (nombre == "login")         iniciarLogin();
    if (nombre == "registro")      iniciarRegistro();
    if (nombre == "perfil")        iniciarPerfil();
    if (nombre == "admin")         iniciarAdmin();
    if (nombre == "contacto")      iniciarContacto(); 

  } catch {
    contenido.innerHTML = '<p class="error-vista">No se pudo cargar la sección.</p>';
  }
}

// *** BOTÓN "RESERVAR" GLOBAL ***
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
      const btnCitas = document.querySelector('.perfil-nav-btn[data-seccion="citas"]');
      if (btnCitas) btnCitas.click();
    }, 200);
  }
});
