// js/script.js - Osky Diseños - Proyecto Final Talento Tech 2025

let cart = JSON.parse(localStorage.getItem('oskyCart')) || [];

// Guardar carrito
const saveCart = () => {
    localStorage.setItem('oskyCart', JSON.stringify(cart));
    updateCartBadge();
    if (document.getElementById('cart-modal')?.classList.contains('show')) {
        renderCart();
    }
};

// Badge carrito
const updateCartBadge = () => {
    const badge = document.getElementById('cart-quantity');
    if (!badge) return;
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? 'inline-flex' : 'none';
};

// Render carrito
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
                <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">−</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
            </div>
            <div>
                <span class="cart-item-price">$${itemTotal.toLocaleString('es-AR')}</span><br>
                <button class="remove-from-cart-btn" data-index="${index}">Remover</button>
            </div>
        `;
        container.appendChild(div);
    });

    if (totalEl) totalEl.textContent = total.toLocaleString('es-AR');

    // Animación GSAP para ítems
    gsap.from(".cart-item", {
        x: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
    });

    // Remover con animación
    document.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            gsap.to(container.children[index], {
                x: -100,
                opacity: 0,
                scale: 0.8,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => {
                    cart.splice(index, 1);
                    saveCart();
                }
            });
        });
    });
};

// Cambiar cantidad
window.changeQuantity = (index, change) => {
    cart[index].quantity = Math.max(1, cart[index].quantity + change);
    saveCart();
};

// Agregar al carrito
window.addToCart = (id, name, price) => {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    saveCart();
    alert(`"${name}" añadido al carrito!`);
};

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    // Cargar productos con imágenes de diseños web/gráficos
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        productsContainer.innerHTML = '<p class="loading">Cargando diseños...</p>';
        // Imágenes de la búsqueda (integradas como mock API para diseños)
        const designProducts = [
            {
                id: 1,
                name: "Official Business Flyer Design",
                price: 60000,
                image: "https://graphicsfamily.com/wp-content/uploads/edd/2021/07/Official-Business-Flyer-Design-Free-PSD-1180x664.jpg"
            },
            {
                id: 2,
                name: "Graphic Design Agency DL Card",
                price: 40000,
                image: "https://brandpacks.com/wp-content/uploads/edd/2018/10/graphic-designer-dl-card-template-2.jpg"
            },
            {
                id: 3,
                name: "Professional Business Flyer Template",
                price: 135000,
                image: "https://static.vecteezy.com/system/resources/previews/027/430/297/non_2x/professional-business-flyer-design-template-vector.jpg"
            },
            {
                id: 4,
                name: "Business Poster Design Template",
                price: 65000,
                image: "https://cdn.dribbble.com/userupload/9025946/file/original-28758d12f19fdc350ed917fbd3507189.jpg?format=webp&resize=400x300&vertical=center"
            },
            {
                id: 5,
                name: "Multipurpose Flyer Template",
                price: 87000,
                image: "https://graphicsfamily.com/wp-content/uploads/edd/2024/12/Multipurpose-Flyer-Template-01-870x489.jpg"
            }
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

        // Animación GSAP para cards
        gsap.from(".card-product", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)"
        });
    }

    // Modal carrito
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');
    if (cartIcon && cartModal && closeCartBtn) {
        cartIcon.addEventListener('click', () => {
            cartModal.classList.add('show');
            renderCart();
            gsap.fromTo(".cart-modal-content", 
                { x: '100%', opacity: 0, scale: 0.9 }, 
                { x: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
            );
        });
        closeCartBtn.addEventListener('click', () => {
            gsap.to(".cart-modal-content", {
                x: '100%',
                opacity: 0,
                scale: 0.9,
                duration: 0.4,
                ease: "back.in(1.7)",
                onComplete: () => cartModal.classList.remove('show')
            });
        });
    }

    // Checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return alert('Carrito vacío');
        alert('¡Gracias! Te contacto por WhatsApp.');
        cart = [];
        saveCart();
    });

    updateCartBadge();
});
// Animación de typing letra por letra con GSAP (para precisión con fonts variables)
document.addEventListener('DOMContentLoaded', () => {
    const greeting = document.getElementById('greeting-text');
    if (greeting) {
        const text = greeting.textContent.trim();
        greeting.innerHTML = ''; // Limpiamos el texto original

        // Dividimos el texto en spans individuales
        text.split('').forEach((char) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char; // Manejamos espacios
            span.style.opacity = 0; // Inicialmente invisible
            span.style.transform = 'translateY(20px)'; // Inicial translate para efecto
            greeting.appendChild(span);
        });

        // Animamos cada letra con GSAP
        gsap.to(greeting.querySelectorAll('span'), {
            opacity: 1,
            y: 0,
            duration: 0.1,  // Rápido por letra
            stagger: 0.1,   // Delay secuencial para typing
            ease: "power2.out",
            delay: 0.5,     // Delay para que empiece después de cargar
            onComplete: () => {
                gsap.to('.cursor', { opacity: 0, duration: 0.8, repeat: -1, yoyo: true }); // Blink cursor
            }
        });
    }

    // Resto de tu JS (carrito, fetch, etc.) queda igual
});
// GSAP Letter-by-Letter Typing Animation for Hero Title (to handle variable fonts and 'ñ')
if (document.getElementById('greeting-text')) {
    const greeting = document.getElementById('greeting-text');
    const text = greeting.textContent;
    greeting.innerHTML = ''; // Clear original text

    // Split text into spans for each letter
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char; // Handle spaces
        span.style.opacity = 0; // Initial hidden
        greeting.appendChild(span);
    });

    // Animate each letter with GSAP
    gsap.to(greeting.querySelectorAll('span'), {
        opacity: 1,
        duration: 0.1, // Fast per letter
        stagger: 0.1, // Sequential typing effect
        ease: "power2.out",
        delay: 0.5, // Start after load
        onComplete: () => {
            gsap.to('.cursor', { opacity: 0, duration: 0.8, repeat: -1, yoyo: true }); // Blink infinite
        }
    });
}