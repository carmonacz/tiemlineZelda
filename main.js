let juegos;
let lista = document.querySelector(".timeline-container ul");
let formularioData = [];

async function getData(url) {
  try {
    return await (await fetch(url)).json();
  } catch (e) {
    throw new Error("Problema con el fetch", { cause: e });
  }
}

async function mostrarJuegos() {
  try {
    juegos = await getData(
      "https://gist.githubusercontent.com/bertez/8e62741154903c35edb3bfb825a7f052/raw/b5cd5137fd168116cc71740f1fbb75819d0fa82e/zelda-timeline.json"
    );
    if (localStorage.getItem("formularioData")) {
      formularioData = JSON.parse(localStorage.getItem("formularioData"));

      for (const datos of formularioData) {
        juegos.push(datos);
      }
    }
    juegos.sort(function (a, b) {
      return a.date - b.date;
    });
    // Aqui tenemos ya los juegos ordenados por salida y mas abajo están los mapas de todo.
  } catch (e) {
    console.error("Hubo un error:", e.message);
  }
}

async function crearLista(e) {
  await mostrarJuegos();
  for (let i = 0; i < juegos.length; i++) {
    lista.innerHTML += `<li><span class="cambia">${juegos[i].date}</span></li>`;
  }
}

async function crearEventosenlista() {
  await mostrarJuegos();
  let eventosParaFechas = lista.querySelectorAll(".cambia");
  eventosParaFechas.forEach((elemento, indice) => {
    elemento.addEventListener("click", (e) => modificarLista(e, indice));
  });
}

function modificarLista(e, indice) {
  //Este es el codigo para cambiar la clase span:
  const spanItem = e.target.closest("span");
  if (!spanItem) return; // Si no se encuentra ningún elemento "span", detener la función

  const listItem = spanItem.closest("li");
  if (!listItem) return; // Si no se encuentra ningún elemento "li", detener la función

  let elemento = document.querySelectorAll("span");
  for (var j = 0; j < elemento.length; j++) {
    elemento[j].classList.remove("cambia");
  }

  e.target.classList.add("cambia");

  listItem.style.background = "rgb(202, 1, 11)";
  const items = lista.querySelectorAll("li");
  for (const item of items) {
    if (item !== listItem) {
      item.style.background = "rgb(35, 35, 35)";
      item.style.color = "rgb(255,255,255)";
    }
  }

  //Este es el código para modificar el contenido por cada juego

  document.querySelector("#titulo").innerHTML = juegos[indice].title;
  document.querySelector("#imagen").src = juegos[indice].image;
  document.querySelector("#parrafo").innerHTML = juegos[indice].text;
  const informacion = document.querySelector("#imagen");
  informacion.classList.remove("transicion");
  setTimeout(() => {
    informacion.classList.add("transicion");
  }, 50);
}

function mostrarPopup() {
  document.querySelector("#popup").classList.remove("oculto");
}

function ocultarPopup() {
  document.querySelector("#popup").classList.add("oculto");
}

// Obtener referencia al formulario
const form = document.getElementById("gameForm");

// Obtener referencias a los elementos del formulario
const input1 = document.getElementById("year");
const input2 = document.getElementById("title");
const input3 = document.getElementById("url");
const textarea = document.getElementById("description");

// Función para mostrar los datos introducidos
function mostrarDatos(event) {
  event.preventDefault(); // Evita que se recargue la página al enviar el formulario

  // Capturar los valores introducidos por el usuario
  const fecha = input1.value;
  const titulo = input2.value;
  const imagen = input3.value;
  const texto = textarea.value;

  // Obtener referencia a la lista creada por crearLista()
  const lista = document.querySelector(".timeline-container ul");

  // Crear nuevo elemento de lista
  const nuevoItem = document.createElement("li");
  const fechaJuegoFormulario = document.createTextNode(fecha);
  const spanFormulario = document.createElement("span");
  spanFormulario.classList.add("cambia");
  spanFormulario.appendChild(fechaJuegoFormulario);
  nuevoItem.appendChild(spanFormulario);
  lista.appendChild(nuevoItem);

  //Añadir dato al localStorage

  const nuevoDato = {
    date: fecha,
    title: titulo,
    image: imagen,
    text: texto,
  };

  if (localStorage.getItem("formularioData")) {
    formularioData = JSON.parse(localStorage.getItem("formularioData"));
  }

  formularioData.push(nuevoDato);
  localStorage.setItem("formularioData", JSON.stringify(formularioData));

  ocultarPopup();
  location.reload();
}

// Agregar evento "submit" al formulario
form.addEventListener("submit", mostrarDatos);

crearLista();
crearEventosenlista();
