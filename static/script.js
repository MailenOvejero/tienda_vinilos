let usuario_id = localStorage.getItem("usuario_id") || null;
let generoSeleccionado = "";

document.addEventListener("DOMContentLoaded", () => {
  actualizarUIUsuario();
  actualizarVisibilidadCarrusel(); // 👈 mostrar u ocultar el carrusel al cargar
  homeUpdateCarousel();
  startAutoSlide();

  document.getElementById('home-btnFiltrar')?.addEventListener('click', () => {
    actualizarVisibilidadCarrusel(); // 👈 nuevo
    filtrarVinilos();
  });

  document.getElementById('home-inputBanda')?.addEventListener('input', () => {
    actualizarVisibilidadCarrusel(); // 👈 nuevo
    filtrarVinilos();
  });

  document.querySelector('.home-carousel__button--prev')?.addEventListener('click', homePrevSlide);
  document.querySelector('.home-carousel__button--next')?.addEventListener('click', homeNextSlide);

  document.querySelectorAll('.dropdown-item').forEach(btn => {
    btn.addEventListener('click', () => {
      generoSeleccionado = btn.getAttribute('data-genero');
      document.getElementById('home-inputBanda').value = "";
      actualizarVisibilidadCarrusel(); // 👈 nuevo
      filtrarVinilos();
    });
  });

  document.getElementById('home-btnLogin')?.addEventListener('click', () => {
    window.location.href = "./static/login.html";
  });

  window.addEventListener('resize', homeUpdateCarousel);
});

// ✅ NUEVA FUNCIÓN para mostrar/ocultar carrusel
function actualizarVisibilidadCarrusel() {
  const carrusel = document.querySelector('.home-carousel');
  const bandaInput = document.getElementById('home-inputBanda');
  const banda = bandaInput?.value.trim();
  if (carrusel) {
    if (banda || generoSeleccionado) {
      carrusel.style.display = 'none';
    } else {
      carrusel.style.display = 'block';
    }
  }
}

function actualizarUIUsuario() {
  const usuario_id = localStorage.getItem("usuario_id");

  const btnLogin = document.getElementById('home-btnLogin');
  const btnCarrito = document.getElementById('home-btnCarrito');
  const btnPerfil = document.getElementById('home-btnPerfil');

  if (usuario_id) {
    if (btnLogin) btnLogin.style.display = 'none';
    if (btnCarrito) btnCarrito.style.display = 'inline-block';
    if (btnPerfil) btnPerfil.style.display = 'inline-block';
  } else {
    if (btnLogin) btnLogin.style.display = 'inline-block';
    if (btnCarrito) btnCarrito.style.display = 'none';
    if (btnPerfil) btnPerfil.style.display = 'none';
  }
  document.querySelector('.home-carousel').style.display = 'block'; // asegura visibilidad inicial

}

function filtrarVinilos() {
  const bandaInput = document.getElementById('home-inputBanda');
  const banda = bandaInput.value.trim();
  let genero = "";

  if (!banda) genero = generoSeleccionado || "";

  fetch(`/vinilos?genero=${encodeURIComponent(genero)}&banda=${encodeURIComponent(banda)}`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      const lista = document.getElementById('home-lista');
      if (!lista) return;

      lista.innerHTML = '';

      if (genero && !banda) {
        const titulo = document.createElement('h2');
        titulo.textContent = genero.toUpperCase();
        titulo.style.textAlign = "center";
        titulo.style.margin = "20px 0";
        titulo.style.color = "#333";
        lista.appendChild(titulo);

        const bandasUnicas = [...new Set(data.map(v => v.banda))].sort((a, b) => a.localeCompare(b));
        const contenedorBandas = document.createElement('div');
        contenedorBandas.style.display = "flex";
        contenedorBandas.style.flexDirection = "column";
        contenedorBandas.style.alignItems = "center";
        contenedorBandas.style.marginTop = "10px";
        contenedorBandas.style.marginBottom = "20px";
        contenedorBandas.style.gap = "10px";

        bandasUnicas.forEach(nombreBanda => {
          const btn = document.createElement('button');
          btn.textContent = nombreBanda;
          btn.style.padding = "8px 16px";
          btn.style.border = "1px solid #888";
          btn.style.borderRadius = "6px";
          btn.style.backgroundColor = "#f9f9f9";
          btn.style.cursor = "pointer";
          btn.style.width = "220px";
          btn.style.textAlign = "center";
          btn.style.fontWeight = "bold";
          btn.style.fontSize = "15px";
          btn.style.transition = "background 0.3s";

          btn.onmouseover = () => btn.style.backgroundColor = "#ebebeb";
          btn.onmouseout = () => btn.style.backgroundColor = "#f9f9f9";

          btn.onclick = () => {
            bandaInput.value = nombreBanda;
            actualizarVisibilidadCarrusel(); // 👈 nuevo
            filtrarVinilos();
          };

          contenedorBandas.appendChild(btn);
        });

        lista.appendChild(contenedorBandas);
      }

      if (banda) {
        const subtitulo = document.createElement('h2');
        subtitulo.textContent = `Resultados para: ${banda}`;
        subtitulo.style.textAlign = "center";
        subtitulo.style.margin = "20px 0";
        subtitulo.style.color = "#666";
        lista.appendChild(subtitulo);
      }

      if (!data.length) {
        lista.innerHTML += '<p style="color:#ff3366; text-align:center;">No se encontraron vinilos.</p>';
        return;
      }

      data.forEach(v => {
        const d = document.createElement('div');
        d.classList.add('vinilo');
        const imagenSrc = v.imagen_url ? `/static/img/vinilos/${v.imagen_url}` : '/static/img/vinilos/default.jpg';

        d.innerHTML = `
          <img src="${imagenSrc}" alt="${v.nombre}" class="vinilo-img"
            onerror="this.onerror=null;this.src='/static/img/vinilos/default.jpg';">
          <h3>${v.banda} - ${v.nombre}</h3>
          <p>${v.genero} | $${v.precio}</p>
          <button onclick="agregar(${v.id})">Agregar</button>
        `;
        lista.appendChild(d);
      });
    })
    .catch(err => {
      console.error("Error cargando vinilos:", err);
      const lista = document.getElementById('home-lista');
      if (lista) lista.innerHTML = "<p style='color:#ff3366; text-align:center;'>No se pudo cargar los vinilos.</p>";
    });
}

function agregar(vinilo_id) {
  if (!usuario_id) {
    alert("Por favor, inicie sesión primero");
    return;
  }

  fetch('/carrito', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario_id, vinilo_id, cantidad: 1 })
  })
    .then(() => alert("Agregado al carrito"))
    .catch(err => {
      console.error("Error al agregar al carrito:", err);
      alert("No se pudo agregar al carrito");
    });
}

const homeTrack = document.querySelector('.home-carousel__track');
const homeSlides = homeTrack ? Array.from(homeTrack.children) : [];
let homeCurrentIndex = 0;
let autoSlideInterval = null;

function homeUpdateCarousel() {
  if (!homeTrack || homeSlides.length === 0) return;
  const slideWidth = homeSlides[0].getBoundingClientRect().width;
  homeTrack.style.transform = `translateX(-${slideWidth * homeCurrentIndex}px)`;
}

function homeGoToSlide(index) {
  homeCurrentIndex = (index + homeSlides.length) % homeSlides.length;
  homeUpdateCarousel();
  resetAutoSlide();
}

function homeNextSlide() {
  homeGoToSlide(homeCurrentIndex + 1);
}

function homePrevSlide() {
  homeGoToSlide(homeCurrentIndex - 1);
}

function startAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(homeNextSlide, 4000);
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}
document.getElementById('home-btnInicio')?.addEventListener('click', () => {
  // Limpiar filtros
  document.getElementById('home-inputBanda').value = "";
  generoSeleccionado = "";

  // Mostrar carrusel
  actualizarVisibilidadCarrusel();

  // Vaciar resultados
  const lista = document.getElementById('home-lista');
  if (lista) lista.innerHTML = "";
});
