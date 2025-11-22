// js/script.js - Proyecto Final Talento Tech - Osky Diseños

document.addEventListener('DOMContentLoaded', () => {
    // === Menú móvil ===
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    if (toggle) {
        toggle.addEventListener('click', () => nav.classList.toggle('open'));
    }

    // === Carrito con localStorage ===
    let cart = JSON.parse(localStorage.getItem('oskyCart')) || [];

    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');

    // Guardar carrito
    const saveCart = () => {
        localStorage.setItem('oskyCart', JSON.stringify(cart));
        updateCartUI();
    };

    // Actualizar ícono y total
    const updateCartUI = () => {
        const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        const qtyBadge = document.getElementById('cart-quantity');
        if (qtyBadge) {
            qtyBadge.textContent = quantity;
            qtyBadge.style.display = quantity > 0 ? 'inline-flex' : 'none';
        }
    };

    // Renderizar carrito
    const renderCart = () => {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío 😔</p>';
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <span>${item.title} (x${item.quantity})</span>
                    <span class="cart-item-price">$${itemTotal.toLocaleString('es-AR')}</span>
                    <button class="remove-from-cart-btn" data-id="${item.id}">✕</button>
                `;
                cartItemsContainer.appendChild(div);
            });
        }

        if (cartTotalElement) cartTotalElement.textContent = total.toLocaleString('es-AR');

        // Eventos remover
        document.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                cart = cart.filter(item => item.id !== id);
                saveCart();
                renderCart();
            });
        });
    };

    // Añadir al carrito
    window.addToCart = (id, title, price) => {
        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id, title, price, quantity: 1 });
        }
        saveCart();
        alert(`¡"${title}" agregado al carrito!`);
    };

    // Abrir/cerrar modal
    if (cartIcon) cartIcon.addEventListener('click', () => { cartModal.classList.add('show'); renderCart(); });
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => cartModal.classList.remove('show'));
    if (cartModal) cartModal.addEventListener('click', e => e.target === cartModal && cartModal.classList.remove('show'));

    // Vaciar carrito
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('¿Vaciar todo el carrito?')) {
                cart = [];
                saveCart();
                renderCart();
            }
        });
    }

    // Finalizar compra
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return alert('El carrito está vacío');
            alert('¡Gracias por tu compra! Te contacto en menos de 24hs por WhatsApp 📲');
            cart = [];
            saveCart();
            cartModal.classList.remove('show');
        });
    }

    // === Cargar productos desde API (solo en productos.html) ===
    if (document.getElementById('products-container')) {
        fetch('https://fakestoreapi.com/products?limit=12')
            .then(res => res.json())
            .then(products => {
                const container = document.getElementById('products-container');
                container.innerHTML = '';
                products.forEach(p => {
                    const priceARS = Math.round(p.price * 1350); // Simulación dólar blue
                    container.innerHTML += `
                        <div class="card-product">
                            <img src="${p.image}" alt="${p.title}" class="product-img">
                            <h4>${p.title.substring(0, 40)}...</h4>
                            <p>${p.description.substring(0, 100)}...</p>
                            <span class="product-price">$${priceARS.toLocaleString('es-AR')}</span>
                            <button class="add-to-cart-btn" onclick="addToCart(${p.id}, '${p.title.substring(0, 30)}...', ${priceARS})">
                                Añadir al Carrito
                            </button>
                        </div>
                    `;
                });
            })
            .catch(() => {
                document.getElementById('products-container').innerHTML = '<p>Error al cargar los servicios. Intenta más tarde.</p>';
            });
    }

    // Bienvenida animada en index
    if (document.getElementById('welcome-title')) {
        setTimeout(() => {
            document.getElementById('welcome-title').style.opacity = '1';
            document.getElementById('welcome-title').style.transform = 'translateY(0)';
        }, 300);
    }

    // Inicializar UI
    updateCartUI();
});