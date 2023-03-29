"use strict";

let juegos;
let titulos;
let fechas;
let textos;
let imagenes;
let lista = document.querySelector(".timeline-container ul");
let eventosParaFechas;

function crearFormulario() {
  // Crear el div con id="popup"
  const popupDiv = document.createElement("div");
  popupDiv.id = "popup";
  popupDiv.classList.add("oculto");

  // Crear el formulario
  const form = document.createElement("form");
  form.classList.add("formulario");

  // Crear el título del formulario
  const titulo = document.createElement("h2");
  titulo.textContent = "Agregar Nuevo Juego";
  form.appendChild(titulo);

  // Crear la lista de elementos del formulario
  const lista = document.createElement("ul");

  // Crear el elemento "Año"
  const li1 = document.createElement("li");
  const label1 = document.createElement("label");
  label1.textContent = "Año:";
  const input1 = document.createElement("input");
  input1.type = "text";
  input1.id = "date";
  input1.name = "date";
  li1.appendChild(label1);
  li1.appendChild(input1);
  lista.appendChild(li1);

  // Crear el elemento "Título"
  const li2 = document.createElement("li");
  const label2 = document.createElement("label");
  label2.textContent = "Título:";
  const input2 = document.createElement("input");
  input2.type = "text";
  input2.id = "title";
  input2.name = "title";
  li2.appendChild(label2);
  li2.appendChild(input2);
  lista.appendChild(li2);

  // Crear el elemento "Url de la Imagen"
  const li3 = document.createElement("li");
  const label3 = document.createElement("label");
  label3.textContent = "Url de la Imagen:";
  const input3 = document.createElement("input");
  input3.type = "url";
  input3.id = "image";
  input3.name = "image";
  li3.appendChild(label3);
  li3.appendChild(input3);
  lista.appendChild(li3);

  // Crear el elemento "Texto"
  const li4 = document.createElement("li");
  const label4 = document.createElement("label");
  label4.textContent = "Texto:";
  const textarea = document.createElement("textarea");
  textarea.id = "text";
  textarea.name = "text";
  textarea.rows = "5";
  li4.appendChild(label4);
  li4.appendChild(textarea);
  lista.appendChild(li4);

  // Agregar la lista al formulario
  form.appendChild(lista);

  // Crear el botón "Añadir"
  const boton = document.createElement("button");
  boton.textContent = "Añadir";
  form.appendChild(boton);

  // Agregar el formulario al div con id="popup"
  popupDiv.appendChild(form);

  // Crear el botón de cerrar
  const cerrar = document.createElement("div");
  cerrar.classList.add("cerrar");
  cerrar.textContent = "X";
  cerrar.onclick = ocultarPopup;
  popupDiv.appendChild(cerrar);

  // Crear el botón para mostrar el popup
  const botonPopup = document.createElement("button");
  botonPopup.id = "boton-popup";
  botonPopup.textContent = "+";
  botonPopup.onclick = mostrarPopup;

  // Agregar el botón al documento
  document.body.appendChild(botonPopup);

  // Agregar el div con id="popup" al documento
  document.body.appendChild(popupDiv);
}

function mostrarPopup() {
  document.querySelector("#popup").classList.remove("oculto");
}

function ocultarPopup() {
  document.querySelector("#popup").classList.add("oculto");
}

async function getData(url) {
  try {
    let res = await fetch(url);

    let data = await res.json();

    return data;

    //lo mismo en una linea
    /* return await (await fetch(url)).json(); */
  } catch (e) {
    throw new Error("Problema con el fetch", { cause: e });
  }
}

async function mostrarJuegos() {
  try {
    juegos = await getData(
      "https://gist.githubusercontent.com/bertez/8e62741154903c35edb3bfb825a7f052/raw/b5cd5137fd168116cc71740f1fbb75819d0fa82e/zelda-timeline.json"
    );
    juegos.sort(function (a, b) {
      return a.date - b.date;
    });
    // Aqui tenemos ya los juegos ordenados por salida y mas abajo están los mapas de todo.
    titulos = juegos.map((titulo) => titulo.title);
    fechas = juegos.map((fecha) => fecha.date);
    textos = juegos.map((texto) => texto.text);
    imagenes = juegos.map((imagenes) => imagenes.image);
  } catch (e) {
    console.error("Hubo un error:", e.message);
  }
}

async function crearLista() {
  await mostrarJuegos();

  for (let i = 0; i < fechas.length; i++) {
    const fecha = fechas[i];
    const item = document.createElement("li");
    const texto = document.createTextNode(fecha);
    const span = document.createElement("span");
    span.classList.add("cambia");
    span.appendChild(texto);
    item.appendChild(span);
    lista.appendChild(item);
  }

  lista.insertBefore(nuevoElemento, lista.firstChild);
}

async function crearEventosenlista(e) {
  await mostrarJuegos();
  console.log(lista);
  let eventosParaFechas = lista.querySelectorAll(".cambia");
  eventosParaFechas.forEach((elemento, indice) => {
    elemento.addEventListener("click", function () {
      document.getElementById("titulo").innerHTML = titulos[indice];
      document.getElementById("imagen").src = imagenes[indice];
      document.getElementById("parrafo").innerHTML = textos[indice];
    });
  });
}

export {
  juegos,
  titulos,
  fechas,
  textos,
  imagenes,
  lista,
  crearLista,
  eventosParaFechas,
  crearEventosenlista,
  crearFormulario,
  mostrarPopup,
  ocultarPopup,
  getData,
  mostrarJuegos,
};
