const API = 'http://localhost:3000';
let vinilosDelGenero = [];
let generoActual = '';

// ========================
// CARGo los generos
// ========================
document.getElementById('btnGeneros').addEventListener('click', async () => {
  try {
    const res = await fetch(`${API}/generos`);
    const generos = await res.json();
    const cont = document.getElementById('listaGeneros');
    cont.innerHTML = '';
    generos.forEach(g => {
      const btn = document.createElement('button');
      btn.textContent = g.nombre;
      btn.onclick = () => cargarVinilosPorGenero(g.nombre);
      cont.appendChild(btn);
    });
  } catch (error) {
    console.error('Error al cargar géneros:', error);
  }
});

// ========================
// argo los vinilos por generos
// ========================
async function cargarVinilosPorGenero(genero) {
  generoActual = genero;
  try {
    const res = await fetch(`${API}/vinilos`);
    const todos = await res.json();

    const bandasRes = await fetch(`${API}/bandas?genero=${genero}`);
    const bandas = await bandasRes.json();
    const idsBandas = bandas.map(b => b.id);

    vinilosDelGenero = todos.filter(v => idsBandas.includes(v.banda_id));
    renderizarTarjetas(vinilosDelGenero);

    const cont = document.getElementById('listaBandas');
    cont.innerHTML = '';
    bandas.forEach(b => {
      const btn = document.createElement('button');
      btn.textContent = b.nombre;
      btn.onclick = () => destacarVinilosDeBanda(b.nombre);
      cont.appendChild(btn);
    });
  } catch (error) {
    console.error('Error al cargar vinilos por género:', error);
  }
}

// ========================
// dstaco los tres vinilos de las bandas
// ========================
function destacarVinilosDeBanda(banda) {
  const destacados = vinilosDelGenero.filter(v => v.banda === banda);
  renderizarTarjetas(vinilosDelGenero, destacados);
}

// ========================
// busco 
// ========================
document.getElementById('buscar').addEventListener('input', (e) => {
  const texto = e.target.value.trim().toLowerCase();
  const cont = document.getElementById('tarjetas');

  if (texto === '') {
    renderizarTarjetas(vinilosDelGenero);
    return;
  }

  const filtrados = vinilosDelGenero.filter(v =>
    v.banda.toLowerCase().startsWith(texto)
  );

  if (filtrados.length === 0) {
    cont.innerHTML = '<p>No se encontraron vinilos</p>';
  } else {
    renderizarTarjetas(filtrados);
  }
});

// ========================
// formateolos nombres
// ========================
function formatearNombre(nombre) {
  return nombre
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[.'"]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// ========================
// tarjetss
// ========================
function renderizarTarjetas(vinilos, destacados = []) {
  const cont = document.getElementById('tarjetas');
  cont.innerHTML = '';

  if (destacados.length > 0) {
    const tituloDestacados = document.createElement('h3');
    tituloDestacados.textContent = `🎤 Vinilos de ${destacados[0].banda}`;
    cont.appendChild(tituloDestacados);

    const separador = document.createElement('hr');
    cont.appendChild(separador);

    destacados.forEach(v => cont.appendChild(crearTarjeta(v)));
  }

  const otros = vinilos.filter(v => !destacados.includes(v));
  if (otros.length > 0) {
    const tituloOtros = document.createElement('h3');
    tituloOtros.textContent = `🎧 Otros vinilos de ${generoActual}`;
    cont.appendChild(tituloOtros);

    const separador = document.createElement('hr');
    cont.appendChild(separador);

    otros.forEach(v => cont.appendChild(crearTarjeta(v)));
  }
}

// ========================
// las creo
// ========================
function crearTarjeta(v) {
  const card = document.createElement('div');
  card.className = 'tarjeta';

  const img = document.createElement('img');
  img.src = `img/${formatearNombre(v.nombre)}.jpg`;
  img.onerror = () => {
    img.src = 'img/generica.jpg';
  };

  const h3 = document.createElement('h3');
  h3.textContent = v.nombre;

  const p = document.createElement('p');
  p.textContent = `$${v.precio}`;

  const btn = document.createElement('button');
  btn.textContent = 'COMPRAR';
  btn.onclick = () => agregarAlCarrito(v);

  card.appendChild(img);
  card.appendChild(h3);
  card.appendChild(p);
  card.appendChild(btn);
  return card;
}

// ========================
// el localstorage del carrito
// ========================
function agregarAlCarrito(vinilo) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push(vinilo);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
  alert("Vinilo agregado al carrito!");
}

function actualizarContadorCarrito() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contador = document.getElementById("contadorCarrito");
  if (contador) {
    contador.textContent = carrito.length;
  }
}

// ========================
// contador
// ========================
document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);
