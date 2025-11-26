// js/script.js - PROYECTO FINAL TALENTO TECH - OSKY DISEÑOS
// === GUARDAR Y ACTUALIZAR CARRITO ===
const saveCart = () => {
    localStorage.setItem('oskyCart', JSON.stringify(cart));
    updateCartBadge();
    if (document.getElementById('cart-modal')?.classList.contains('show')) {
        renderCart();
    }
};

const updateCartBadge = () => {
    const badge = document.getElementById('cart-quantity');
    if (!badge) return;
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? 'inline-flex' : 'none';
};

// === RENDER CARRITO ===
const renderCart = () => {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!container || !totalEl) return;

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-message">El carrito está vacío. ¡Añade algunos diseños!</p>';
        totalEl.textContent = '0';
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <strong>${item.name}</strong><br>
            <small>Cantidad: ${item.quantity} × $${item.price.toLocaleString('es-AR')}</small>
            <div class="quantity-controls">
                <button class="quantity-btn" data-index="${index}" data-delta="-1">−</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" data-index="${index}" data-delta="1">+</button>
            </div>
            <strong>$${itemTotal.toLocaleString('es-AR')}</strong>
            <button class="remove-from-cart-btn" data-index="${index}">×</button>
        `;
        container.appendChild(div);
    });

    totalEl.textContent = total.toLocaleString('es-AR');
};
let cart = JSON.parse(localStorage.getItem("oskyCart")) || [];

// === AÑADIR AL CARRITO ===
window.addToCart = (id, name, price) => {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    saveCart();
    alert(`${name} añadido al carrito`);
};

// === CAMBIAR CANTIDAD / ELIMINAR ===
window.changeQuantity = (index, delta) => {
    cart[index].quantity = Math.max(1, cart[index].quantity + delta);
    saveCart();
};

document.addEventListener('click', (e) => {
    if (e.target.matches('.remove-from-cart-btn')) {
        const index = e.target.dataset.index;
        cart.splice(index, 1);
        saveCart();
    }
});

// === TODO LO QUE NECESITA DOM ESTÁ AQUÍ DENTRO ===
document.addEventListener('DOMContentLoaded', () => {
    // ====== PRODUCTOS CENTRADOS + HEADER FUNCIONA 100% ======
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then(products => {
                // Limpiar y centrar
                productsContainer.innerHTML = '<div class="products-wrapper">' + 
                    products.map(p => `
                        <div class="product-card">
                            <img src="${p.image}" alt="${p.title}" loading="lazy">
                            <div class="product-info">
                                <h3>${p.title.substring(0, 60)}${p.title.length > 60 ? '...' : ''}</h3>
                                <p class="price">$${p.price.toFixed(2)}</p>
                                <button class="add-btn" data-id="${p.id}" data-title="${p.title}" data-price="${p.price}">
                                Agregar al carrito
                                </button>
                            </div>
                        </div>
                    `).join('') + '</div>';

                // Animación
                gsap.from(".product-card", { y: 60, opacity: 0, stagger: 0.15, duration: 0.8, ease: "back.out(1.7)" });

                // Botones SIN ROMPER NADA (usando data-attributes)
                document.querySelectorAll('.add-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.dataset.id;
                        const title = btn.dataset.title;
                        const price = parseFloat(btn.dataset.price);
                        addToCart(id, title, price);
                });
            });
        });
    }

    // ANIMACIÓN DEL LOGO CON GIRO, ESCALA Y GLOW
    gsap.fromTo(".animated-logo", 
        { scale: 0, rotation: -360, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 1.6, ease: "elastic.out(1, 0.4)", delay: 0.3 }
    );
    gsap.to(".animated-logo", { 
        boxShadow: "0 0 30px rgba(255,199,44,0.6)", 
        repeat: -1, yoyo: true, duration: 2, ease: "sine.inOut" 
    });

    // CREAR 35 ESTRELLAS DORADAS FLOTANTES
    const starsContainer = document.getElementById("stars-container");
    if (window.innerWidth > 768 && starsContainer) {
        for (let i = 0; i < 35; i++) {
            const star = document.createElement("div");
            star.classList.add("star");
            star.style.left = Math.random() * 100 + "%";
            star.style.top = Math.random() * 100 + "%";
            star.style.animationDelay = Math.random() * 10 + "s";
            star.style.animationDuration = 15 + Math.random() * 20 + "s";
            starsContainer.appendChild(star);
        }
    }

    // ====== TYPEWRITER UNIVERSAL – FUNCIONA EN INDEX Y PRODUCTOS ======
    const typewriters = document.querySelectorAll('.typewriter');
    
    typewriters.forEach((title) => {
        const text = title.textContent.trim();
        title.innerHTML = '';
        
        let i = 0;
        const type = () => {
            if (i < text.length) {
                title.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 90);
            } else {
                title.innerHTML += '<span class="cursor"></span>';
            }
        };
        setTimeout(type, 500);
    });

    // ANIMACIÓN PREMIUM DE LA IMAGEN PRINCIPAL
    gsap.fromTo(".hero-main-image",
        { x: 300, opacity: 0, rotation: -15 },
        { x: 0, opacity: 1, rotation: 0, duration: 1.8, ease: "back.out(1.2)", delay: 1.2 }
    );

    // Parallax suave de la imagen al hacer scroll
    gsap.to(".hero-main-image", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            scrub: 1.5
        }
    });

    // Glow pulsante dorado
    gsap.to(".hero-main-image", {
        boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 40px rgba(255,199,44,0.5)",
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: "sine.inOut"
    });

    

    // Fade-ins
    gsap.timeline({defaults: {ease: "power2.out"}})
        .from(".subtitle", {opacity:0, y:40, duration:1}, "+=1.5")
        .from(".hero-buttons .cta", {opacity:0, y:30, stagger:0.2, duration:0.8}, "-=0.5");

    // Parallax
    gsap.to(".hero", {
        backgroundPositionY: "40%",
        ease: "none",
        scrollTrigger: {trigger: ".hero", scrub: 1}
    });


    // Animación de entrada con dirección correcta
    gsap.timeline({defaults: {ease: "power3.out"}})
    .from(".hero-text-content > *", {
        opacity: 0,
        x: 100,  // entra desde la derecha
        stagger: 0.2,
        duration: 1,
        delay: 1.5
    })
    .from(".hero-main-image", {
        x: -200,
        opacity: 0,
        rotation: 15,
        duration: 1.8,
        ease: "back.out(1.4)"
    }, "-=1.4");

   
   // === EVENTO PARA BOTONES DE CANTIDAD ===
    document.addEventListener('click', (e) => {
        if (e.target.matches('.quantity-btn')) {
            const index = parseInt(e.target.dataset.index);
            const delta = parseInt(e.target.dataset.delta);
            cart[index].quantity = Math.max(1, cart[index].quantity + delta);
            saveCart();
        }
    });

    updateCartBadge();

    // MENÚ MÓVIL
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('open');
        });

        // Cerrar al hacer click en un enlace
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('open');
            });
        });

        // Cerrar al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('open');
            }
        });
    }

          // ====== RESEÑAS LILA OSCURO - 100% FUNCIONA (TALENTO TECH) ======
    const reviewsContainer = document.getElementById('reviews-container');
    if (reviewsContainer) {
        reviewsContainer.innerHTML = '';

        const reseñas = [
            { nombre: "Lucía Martínez", texto: "¡Osky es un genio! Mi web quedó hermosa y ya tengo más clientes." },
            { nombre: "Martín González", texto: "El mejor diseñador con el que trabajé. Profesional y rápido." },
            { nombre: "Valentina Ruiz", texto: "Mi branding quedó espectacular. Ahora mi marca se ve premium." },
            { nombre: "Santiago Pérez", texto: "Atención personalizada y resultado impecable. ¡Un crack!" },
            { nombre: "Camila Fernández", texto: "Los flyers duplicaron mis ventas en Instagram. ¡Gracias!" },
            { nombre: "Joaquín López", texto: "Mi tarjeta digital es hermosa y súper funcional." }
        ];

        reseñas.forEach((r, i) => {
            reviewsContainer.innerHTML += `
                <div class="review-card">
                    <img src="https://i.pravatar.cc/150?img=${i + 5}" alt="${r.nombre}" loading="lazy">
                    <div class="review-content">
                        <h4>${r.nombre}</h4>
                        <div class="stars">★★★★★</div>
                        <p>"${r.texto}"</p>
                        <small>— Hace ${3 + i} días</small>
                    </div>
                </div>
            `;
        });

        gsap.from('.review-card', {
            y: 80, opacity: 0, duration: 1, stagger: 0.2, ease: "back.out(1.7)"
        });
    }
});
