// ============================================================
//  VISTAS.JS — Doctores, tratamientos, carrusel, modal y buscadores
// ============================================================

// *** DOCTORES ***
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

// *** TRATAMIENTOS ***
async function pintarTratamientos() {
  const contenedorTratamientos = document.querySelector("#contenedor-tratamientos");
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

// *** TRATAMIENTOS HOME (3 aleatorios) ***
async function pintarTratamientosHome() {
  const contenedor = document.querySelector("#contenedor-tratamientos-home");
  if (!contenedor) return;

  try {
    const response = await fetch(URL_API_TRATAMIENTOS);
    const { success, datos } = await response.json();

    if (success) {
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

// *** TEMPLATES ***
function crearCardDoctor(doctor) {
  const clon = document.querySelector("#template-doctores").content.cloneNode(true);
  clon.querySelector(".card-img").src           = doctor.foto;
  clon.querySelector(".card-nombre").textContent = doctor.nombre + " " + doctor.apellidos;
  clon.querySelector(".card-descripcion").textContent = doctor.datosExtras;
  return clon;
}

function crearCardTratamiento(tratamiento) {
  const template = document.querySelector("#template-tratamientos");

  if (template) {
    const clon = template.content.cloneNode(true);
    clon.querySelector(".card-img").src                 = tratamiento.foto;
    clon.querySelector(".card-nombre").textContent       = tratamiento.nombre_tratamiento;
    clon.querySelector(".card-descripcion").textContent  = tratamiento.descripcion;
    const card = clon.querySelector(".card");
    card.addEventListener("click", () => abrirModal(tratamiento));
    return clon;
  } else {
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

// *** MODAL TRATAMIENTO ***
function abrirModal(tratamiento) {
  const modal = document.querySelector("#modal");
  modal.classList.add("visible");
  modal.querySelector("img").src                        = tratamiento.foto;
  modal.querySelector("#modal-nombre").textContent      = tratamiento.nombre_tratamiento;
  modal.querySelector("#modal-descripcion").textContent = tratamiento.des_completa;

  modal.querySelector("#modal-cerrar").onclick = () => modal.classList.remove("visible");
  modal.onclick = (e) => { if (e.target == modal) modal.classList.remove("visible"); };
}

// *** CARRUSEL ***
function iniciarCarrusel() {
  const carrusel = document.querySelector(".carrusel");
  if (!carrusel) return;

  const track = carrusel.querySelector(".carrusel-track");
  const dots  = carrusel.querySelectorAll(".dot");
  const total = track.children.length;
  let actual  = 0;
  let intervalo;

  function irA(index) {
    actual = (index + total) % total;
    track.style.transform = `translateX(-${actual * 100}%)`;
    dots.forEach((d) => d.classList.remove("active"));
    dots[actual].classList.add("active");
  }

  carrusel.querySelector(".carrusel-prev").addEventListener("click", () => { irA(actual - 1); reiniciarIntervalo(); });
  carrusel.querySelector(".carrusel-next").addEventListener("click", () => { irA(actual + 1); reiniciarIntervalo(); });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => { irA(i); reiniciarIntervalo(); });
  });

  function reiniciarIntervalo() {
    clearInterval(intervalo);
    intervalo = setInterval(() => irA(actual + 1), 4000);
  }

  intervalo = setInterval(() => irA(actual + 1), 4000);
}

// *** BUSCADOR CARDS ***
function añadirBuscadorCards(contenedorId, claseCard, camposBusqueda) {
  const contenedor = document.querySelector(`#${contenedorId}`);
  if (!contenedor) return;

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

// *** BUSCADOR TABLA (admin) ***
function añadirBuscador(contenedorId, tbodyId, columnas) {
  const wrapper = document.querySelector(`#${contenedorId}`);
  if (!wrapper) return;

  const tablaWrapper = wrapper.querySelector(".admin-tabla-wrapper");
  if (!tablaWrapper) return;

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
