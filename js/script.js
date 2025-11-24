// js/script.js - Osky Diseños - Versión estable y consolidada

/* --- Estado del carrito --- */
let cart = JSON.parse(localStorage.getItem('oskyCart')) || [];

/* --- Helper: guardar y actualizar UI --- */
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

/* --- Render del carrito --- */
const renderCart = () => {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-message">El carrito está vacío. ¡Añade algunos diseños!</p>';
        if (totalEl) totalEl.textContent = '0.00';
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                <small>Cantidad: ${item.quantity}</small>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" data-index="${index}" data-delta="-1">−</button>
                <span class="quantity-label">${item.quantity}</span>
                <button class="quantity-btn" data-index="${index}" data-delta="1">+</button>
            </div>
            <div>
                <span class="cart-item-price">$${itemTotal.toLocaleString('es-AR')}</span><br>
                <button class="remove-from-cart-btn" data-index="${index}">Remover</button>
            </div>
        `;
        container.appendChild(div);
    });

    if (totalEl) totalEl.textContent = total.toLocaleString('es-AR');

    // Animación GSAP (si está disponible)
    if (window.gsap) {
        try {
            gsap.from(".cart-item", {
                x: 50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "back.out(1.7)"
            });
        } catch (e) {
            console.warn('GSAP falló en animación de cart-items:', e);
        }
    }

    // Delegación de eventos para botones de cantidad y remover
    // (usamos delegación para evitar problemas con listeners duplicados)
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.dataset.index);
            const delta = parseInt(e.currentTarget.dataset.delta);
            changeQuantity(idx, delta);
        });
    });

    document.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.dataset.index);
            // animación de salida si gsap existe
            if (window.gsap) {
                const el = container.children[idx];
                gsap.to(el, {
                    x: -100,
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.35,
                    ease: "power2.in",
                    onComplete: () => {
                        cart.splice(idx, 1);
                        saveCart();
                    }
                });
            } else {
                cart.splice(idx, 1);
                saveCart();
            }
        });
    });
};

/* --- Cambiar cantidad --- */
window.changeQuantity = (index, change) => {
    if (!cart[index]) return;
    cart[index].quantity = Math.max(1, cart[index].quantity + change);
    saveCart();
};

/* --- Agregar al carrito --- */
window.addToCart = (id, name, price) => {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    saveCart();

    // Notificación (alert como fallback)
    if (window.Toastify) {
        // Si usás una librería de toasts, la podés integrar acá.
    } else {
        // Mensaje simple
        alert(`"${name}" añadido al carrito!`);
    }
};

/* --- MODAL DE IMAGENES (open/close) --- */
window.openModal = (imgSrc) => {
    const modal = document.getElementById('image-modal');
    const img = document.getElementById('modal-image');
    if (!modal || !img) return;

    img.src = imgSrc;
    modal.classList.add('show');

    if (window.gsap) {
        gsap.fromTo(img, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" });
    }
};

window.closeModal = () => {
    const modal = document.getElementById('image-modal');
    if (!modal) return;
    modal.classList.remove('show');
};

/* --- DOMContentLoaded: inicializaciones seguras --- */
document.addEventListener('DOMContentLoaded', () => {

    /* --- 1) Cargar productos dinámicos SI existe el contenedor (soporte para 'products-container' y 'productos-container') --- */
    const productsContainerEnglish = document.getElementById('products-container');
    const productsContainerSpanish = document.getElementById('productos-container');
    const productsContainer = productsContainerEnglish || productsContainerSpanish;

    if (productsContainer) {
        // Si tu HTML ya tiene productos estáticos (como en productos.html) este bloque no hará nada.
        // Datos mock (si querés usar carga dinámica en otra página)
        const designProducts = [
            { id: 1, name: "Official Business Flyer Design", price: 60000, image: "https://graphicsfamily.com/wp-content/uploads/edd/2021/07/Official-Business-Flyer-Design-Free-PSD-1180x664.jpg" },
            { id: 2, name: "Graphic Design Agency DL Card", price: 40000, image: "https://brandpacks.com/wp-content/uploads/edd/2018/10/graphic-designer-dl-card-template-2.jpg" },
            { id: 3, name: "Professional Business Flyer Template", price: 135000, image: "https://static.vecteezy.com/system/resources/previews/027/430/297/non_2x/professional-business-flyer-design-template-vector.jpg" },
            { id: 4, name: "Business Poster Design Template", price: 65000, image: "https://cdn.dribbble.com/userupload/9025946/file/original-28758d12f19fdc350ed917fbd3507189.jpg?format=webp&resize=400x300&vertical=center" },
            { id: 5, name: "Multipurpose Flyer Template", price: 87000, image: "https://graphicsfamily.com/wp-content/uploads/edd/2024/12/Multipurpose-Flyer-Template-01-870x489.jpg" }
        ];

        productsContainer.innerHTML = '';
        designProducts.forEach(p => {
            const card = document.createElement('div');
            card.className = 'card-product';
            card.innerHTML = `
                <img src="${p.image}" alt="${p.name}" class="product-img">
                <h4>${p.name}</h4>
                <p>Diseño profesional de alta calidad para web y gráfico.</p>
                <span class="product-price">$${p.price.toLocaleString('es-AR')}</span>
                <button class="add-to-cart-btn" onclick="addToCart(${p.id}, '${p.name}', ${p.price})">Añadir al Carrito</button>
            `;
            productsContainer.appendChild(card);
        });

        if (window.gsap) {
            gsap.from(".card-product", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "back.out(1.7)"
            });
        }
    }

    /* --- 2) Modal carrito: abrir/cerrar --- */
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');

    if (cartIcon && cartModal && closeCartBtn) {
        cartIcon.addEventListener('click', () => {
            cartModal.classList.add('show');
            renderCart();
            if (window.gsap) {
                gsap.fromTo(".cart-modal-content", { x: '100%', opacity: 0, scale: 0.95 }, { x: 0, opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.7)" });
            }
        });

        closeCartBtn.addEventListener('click', () => {
            if (window.gsap) {
                gsap.to(".cart-modal-content", {
                    x: '100%',
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.35,
                    ease: "power2.in",
                    onComplete: () => cartModal.classList.remove('show')
                });
            } else {
                cartModal.classList.remove('show');
            }
        });
    }

    /* --- 3) Checkout --- */
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return alert('Carrito vacío');
            alert('¡Gracias! Te contacto por WhatsApp.');
            cart = [];
            saveCart();
        });
    }

    /* --- 4) Animación tipo "typing" (solo una vez si existe el elemento) --- */
    const greeting = document.getElementById('greeting-text');
    if (greeting && window.gsap) {
        // Protegemos contra ejecuciones repetidas
        if (!greeting.dataset.animated) {
            greeting.dataset.animated = 'true';
            const text = greeting.textContent.trim();
            greeting.innerHTML = '';
            text.split('').forEach(char => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.opacity = 0;
                greeting.appendChild(span);
            });

            gsap.to(greeting.querySelectorAll('span'), {
                opacity: 1,
                y: 0,
                duration: 0.09,
                stagger: 0.06,
                ease: "power2.out",
                delay: 0.45,
                onComplete: () => {
                    // cursor blink si existe
                    const cursor = document.querySelector('.cursor');
                    if (cursor) gsap.to(cursor, { opacity: 0, duration: 0.8, repeat: -1, yoyo: true });
                }
            });
        }
    }

    /* --- 5) Inicial UI --- */
    updateCartBadge();
});
// Menú móvil - FUNCIONA PERFECTO
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            body.classList.toggle('menu-open');
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.classList.remove('open');
                body.classList.remove('menu-open');
            }
        });
    }
});