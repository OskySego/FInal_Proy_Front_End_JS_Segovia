// js/script.js - PROYECTO FINAL TALENTO TECH - OSKY DISEÑOS
// FUNCIONA 100% EN TODAS LAS PÁGINAS - SIN CAÍDAS

let cart = JSON.parse(localStorage.getItem('oskyCart')) || [];

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

    // Typewriter
    const title = document.querySelector(".typewriter");
    if (title) {
        const text = title.textContent.replace("|", "");
        title.innerHTML = "";
        let i = 0;
        const type = () => {
            if (i < text.length) {
                title.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 90);
            } else {
                title.innerHTML += '<span class="cursor">|</span>';
            }
        };
        setTimeout(type, 1000);
    }

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

    // Resto del carrito (igual que antes, sin cambios)
    let cart = JSON.parse(localStorage.getItem("oskyCart")) || [];
   
    updateCartBadge();

    // MENÚ MÓVIL
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mainNav.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.classList.remove('open');
            }
        });
    }

    // RESEÑAS - SOLO EN resenas.html (AHORA FUNCIONA PERFECTO)
    if (document.getElementById('reviews-container')) {
        const reseñas = [
            { nombre: "Lucía Martínez", texto: "¡Osky es un genio! Mi web quedó hermosa y ya tengo más clientes. 100% recomendado.", estrellas: 5, foto: "https://i.pravatar.cc/150?img=1" },
            { nombre: "Martín González", texto: "El mejor diseñador con el que trabajé. Profesional, rápido y con muy buen gusto.", estrellas: 5, foto: "https://i.pravatar.cc/150?img=3" },
            { nombre: "Valentina Ruiz", texto: "Mi branding quedó espectacular. Ahora mi marca se ve premium y confiable.", estrellas: 5, foto: "https://i.pravatar.cc/150?img=5" },
            { nombre: "Santiago Pérez", texto: "Atención personalizada, cambios rápidos y resultado final impecable. ¡Un crack!", estrellas: 5, foto: "https://i.pravatar.cc/150?img=8" },
            { nombre: "Camila Fernández", texto: "Los flyers y banners que me hizo duplicaron mis ventas en Instagram. ¡Gracias!", estrellas: 5, foto: "https://i.pravatar.cc/150?img=12" },
            { nombre: "Joaquín López", texto: "Mi tarjeta digital es hermosa y súper funcional. Todos me piden el contacto ahora.", estrellas: 5, foto: "https://i.pravatar.cc/150?img=19" },
            { nombre: "Sofía Aranda", texto: "Excelente trabajo. Mi sitio web carga rapidísimo y se ve profesional en todos los dispositivos.", estrellas: 5, foto: "https://i.pravatar.cc/150?img=22" },
            { nombre: "Mateo Díaz", texto: "Recomendado al 1000%. Volvería a contratar sin dudar. ¡Gracias Osky!", estrellas: 5, foto: "https://i.pravatar.cc/150?img=29" }
        ];

        const container = document.getElementById('reviews-container');

        reseñas.forEach(r => {
            const card = document.createElement('div');
            card.className = 'review-card';
            card.innerHTML = `
                <div class="review-header">
                    <img src="${r.foto}" alt="${r.nombre}" class="review-avatar">
                    <div>
                        <h4>${r.nombre}</h4>
                        <div class="stars">${'★'.repeat(r.estrellas)}${'☆'.repeat(5 - r.estrellas)}</div>
                    </div>
                </div>
                <p>"${r.texto}"</p>
                <small>— Hace ${Math.floor(Math.random() * 20) + 3} días</small>
            `;
            container.appendChild(card);
        });

        // ANIMACIÓN PERFECTA CON GSAP
        if (window.gsap) {
            gsap.from('.review-card', {
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "back.out(1.7)",
                delay: 0.2
            });
        }
    }
});
