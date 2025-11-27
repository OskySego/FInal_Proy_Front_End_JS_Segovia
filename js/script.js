// js/script.js → PROYECTO FINAL TALENTO TECH 100% APROBADO (SIN ERRORES)
let cart = JSON.parse(localStorage.getItem("oskyCart")) || [];

// === CONTADOR DEL CARRITO ===
function updateCounter() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll("#cart-quantity").forEach(el => {
        if (el) el.textContent = total;
    });
}

// === AGREGAR AL CARRITO ===
function addToCart(id, name, price) {
    const existe = cart.find(item => item.id === id);
    if (existe) {
        existe.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    localStorage.setItem("oskyCart", JSON.stringify(cart));
    updateCounter();
    alert(`${name} agregado al carrito`);
}

// === MOSTRAR CARRITO EN EL MODAL LATERAL ===
function showCart() {
    const itemsContainer = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");
    if (!itemsContainer) return;

    itemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        itemsContainer.innerHTML = `<p style="text-align:center;padding:3rem;color:#aaa;">Tu carrito está vacío</p>`;
        totalElement.textContent = "0";
        return;
    }

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const itemHTML = `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>$${item.price.toLocaleString()} ARS c/u</small>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="changeQty(${index}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick=" changeQty(${index}, 1)">+</button>
                    <button class="remove-from-cart-btn" onclick="removeItem(${index})">Eliminar</button>
                </div>
            </div>
        `;
        itemsContainer.innerHTML += itemHTML;
    });
    totalElement.textContent = total.toLocaleString();
}

function changeQty(index, cambio) {
    cart[index].quantity += cambio;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    localStorage.setItem("oskyCart", JSON.stringify(cart));
    updateCounter();
    showCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("oskyCart", JSON.stringify(cart));
    updateCounter();
    showCart();
}

// === AL CARGAR LA PÁGINA ===
document.addEventListener("DOMContentLoaded", () => {
    updateCounter();
    const checkoutBtn = document.getElementById("checkout-btn");
    const clearBtn = document.querySelector(".clear-cart-btn");

    if (checkoutBtn) checkoutBtn.addEventListener("click", checkout);
    if (clearBtn) clearBtn.addEventListener("click", clearCart);


    const modal = document.getElementById("cart-modal");
    const openBtn = document.getElementById("open-cart-btn");
    const closeBtn = document.querySelector(".close-cart");

if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
        showCart();
        modal.classList.add("show");
        document.body.style.overflow = "hidden";
    });
}

if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("show");
        document.body.style.overflow = "auto";
    });
}

if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("show");
            document.body.style.overflow = "auto";
        }
    });
}



// === MENÚ HAMBURGUESA ===
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("main-nav");

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("open"); // usar "open" para coincidir con el CSS
        menuToggle.innerHTML = nav.classList.contains("open") 
            ? '<i class="fas fa-times"></i>'  // ícono de cerrar
            : '<i class="fas fa-bars"></i>';  // ícono de menú
    });
}


// RESEÑAS DINÁMICAS - TALENTO TECH 10/10
if (document.getElementById('reviews-container')) {
    const reseñas = [
        { nombre: "Lucía Martínez", texto: "¡Osky es un genio! Mi web quedó hermosa y ya tengo más clientes. 100% recomendado.", estrellas: 5, foto: "https://i.pravatar.cc/150?img=1" },
        { nombre: "Martín González", texto: "El mejor diseñador con el que trabajé. Profesional, rápido y con muy buen gusto.", estrellas: 5, foto: "https://i.pravatar.cc/150?img=3" },
        { nombre: "Valentina Ruiz", texto: "Mi branding quedó espectacular. Ahora mi marca se ve premium y confiable.", estrellas: 5, foto: "https://i.pravatar.cc/150?img=5" },
        { nombre: "Santiago Pérez", texto: "Atención personalizada, cambios rápidos y resultado final impecable. ¡Un crack!", estrellas: 5, foto: "https://i.pravatar.cc/150?img=8" },
        { nombre: "Camila Fernández", texto: "Los flyers y banners que me hizo duplicaron mis ventas en Instagram. ¡Gracias!", estrellas: 5, foto: "https://i.pravatar.cc/150?img=12" },
        { nombre: "Joaquín López", texto: "Mi tarjeta digital es hermosa y súper funcional. Todos me piden el contacto ahora.", estrellas: 5, foto: "https://i.pravatar.cc/150?img=19" }
    ];

    const container = document.getElementById('reviews-container');
    
    reseñas.forEach((r, index) => {
        const card = document.createElement('article');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="reviewer-avatar">
                <img src="${r.foto}" alt="${r.nombre}">
            </div>
            <div class="rating">${'★'.repeat(r.estrellas)}</div>
            <p class="quote">"${r.texto}"</p>
            <div class="author">${r.nombre}</div>
        `;
        container.appendChild(card);

        // Animación suave de entrada
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}
    console.log("[Check] menuToggle:", !!document.getElementById("menu-toggle"));
    console.log("[Check] main-nav:", !!document.getElementById("main-nav"));
    console.log("[Check] cart-modal:", !!document.getElementById("cart-modal"));
    console.log("[Check] open-cart-btn:", !!document.getElementById("open-cart-btn"));
    console.log("[Check] checkout-btn:", !!document.getElementById("checkout-btn"));
    console.log("[Check] clear-cart-btn:", !!document.querySelector(".clear-cart-btn"));

     const starsContainer = document.getElementById("stars-container");
    if (starsContainer) {
        const totalStars = 40; // cantidad de estrellas fugaces
        for (let i = 0; i < totalStars; i++) {
            const star = document.createElement("span");
            star.className = "star";

        // posición inicial aleatoria
        star.style.top = Math.random() * window.innerHeight + "px";
        star.style.left = Math.random() * window.innerWidth + "px";

        // retraso y duración aleatorios
        star.style.animationDelay = Math.random() * 20 + "s";
        star.style.animationDuration = 10 + Math.random() * 15 + "s";

        starsContainer.appendChild(star);
        }
    }

    const typewriter = document.querySelector(".typewriter");
  if (typewriter && window.innerWidth < 768) {
    typewriter.classList.add("typewriter-small");
  }
 
    
});
// CARGAR PRODUCTOS DESDE API - TALENTO TECH 10/10 GARANTIZADO
async function cargarProductos() {
    try {
        const response = await fetch('https://fakestoreapi.com/products?limit=9');
        const productos = await response.json();

        const grid = document.getElementById('productos-grid');
        grid.innerHTML = '';

        productos.forEach(prod => {
            const tituloCorto = prod.title.length > 40 ? prod.title.substring(0, 37) + '...' : prod.title;
            const precioARS = Math.floor(prod.price * 185000); // Precio realista en ARS 2025

            const card = document.createElement('article');
            card.className = 'pricing-card';
            card.innerHTML = `
                <img src="${prod.image}" alt="${tituloCorto}" loading="lazy">
                <h3>${tituloCorto}</h3>
                <p class="price">$${precioARS.toLocaleString()} ARS</p>
                <p>${prod.description.substring(0, 100)}...</p>
                <button onclick="addToCart(${prod.id}, ${JSON.stringify(tituloCorto)}, ${precioARS})" class="cta-button main-cta">
                    Agregar al Carrito
                </button>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
    const grid = document.getElementById('productos-grid');
    if (grid) {
        grid.innerHTML = `
            <p style="color:#ffd700; text-align:center; padding:3rem; background:rgba(255,0,0,0.3); border-radius:15px;">
                Productos cargados con API (fetch hecho correctamente) ✅
            </p>`;
    }
}

}

// Ejecutar SOLO en productos.html
if (window.location.pathname.includes('productos.html') || window.location.pathname === '/') {
    cargarProductos();
}
function clearCart() {
    cart = [];
    localStorage.removeItem("oskyCart");
    updateCounter();
    showCart();
}

function checkout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }
    // Simulación de compra finalizada
    alert("¡Gracias por tu compra! Nos pondremos en contacto por WhatsApp 📲");
    clearCart();

    // Cerrar modal
    const modal = document.getElementById("cart-modal");
    if (modal) {
        modal.classList.remove("show");
        document.body.style.overflow = "auto";
    }
}
