"use strict";

let apiUrl =
  "https://gist.githubusercontent.com/bertez/8e62741154903c35edb3bfb825a7f052/raw/b5cd5137fd168116cc71740f1fbb75819d0fa82e/zelda-timeline.json";
let data;
let lista = document.querySelector(".timeline-container ul");

//Obtener los datos de la API

async function getData(url) {
  try {
    let res = await fetch(url);
    let data = await res.json();
    return data;
  } catch (e) {
    throw new Error("Error al conectar con el servidor", { casue: e });
  }
}

//Aqui gestionaremos los datos de la lista para insertarlos en el HTML
async function getZelda() {
  try {
    data = await getData(apiUrl);
    data.sort((a, b) => a.date - b.date);
    for (const { date, title } of data) {
      lista.innerHTML += `<li data-title="${title}"><span class="cambia" data-title="${title}">${date}</span></li>`;
    }
  } catch (e) {
    console.error("Ha habido un problema:", e.message);
  }
}

function getOtrosDatos(e) {
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
    }
  }

  const title = e.target.dataset.title;
  const details = data.find((el) => el.title === title);
  const h1 = document.querySelector("h1");
  const imagen = document.querySelector(".informacion img");
  const parrafo = document.querySelector("p");
  const fecha = document.querySelector("figcaption");
  const informacion = document.querySelector(".informacion");

  informacion.classList.remove("mostrando");
  h1.textContent = details.title;
  imagen.src = details.image;
  parrafo.textContent = details.text;
  fecha.textContent = details.date;

  setTimeout(() => {
    informacion.classList.add("mostrando");
  }, 500);

  desplazarScroll();
}

//Función para desplazarnos al principio de la página.
function desplazarScroll() {
  let start = window.pageYOffset;
  let end = 0;
  let duration = 1000; // duración en milisegundos
  let startTime = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    let progress = timestamp - startTime;
    let scrollTo = Math.easeInOutQuad(progress, start, end - start, duration);
    window.scrollTo(0, scrollTo);
    if (progress < duration) {
      window.requestAnimationFrame(animate);
    }
  }

  // Función de animación de la curva de aceleración
  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  window.requestAnimationFrame(animate);
}

getZelda();
lista.addEventListener("click", getOtrosDatos);

/* CODIGO PARA EL FORMULARIO */

function mostrarPopup() {
  document.querySelector("#popup").classList.remove("oculto");
}

function ocultarPopup() {
  document.querySelector("#popup").classList.add("oculto");
}
