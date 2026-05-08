// ============================================================
//  MAIN.JS — Punto de entrada y carga inicial
// ============================================================

const paginaInicial = location.hash.slice(1);

comprobarSesion().then(() => {
  actualizarBotonSesion();
  const pagina = rutas[paginaInicial] ? paginaInicial : "home";
  if (pagina == "perfil" && !usuarioActual) {
    cargarVista("login");
  } else {
    cargarVista(pagina);
  }
});
