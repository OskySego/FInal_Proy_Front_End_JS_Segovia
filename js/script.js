// js/script.js - Proyecto Final Talento Tech - Osky Diseños
// Todo funcional: API + localStorage + animación + carrito persistente

document.addEventListener('DOMContentLoaded', () => {
    // === Menú móvil ===
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    if (toggle && nav) {
        toggle.addEventListener('click', () => nav.classList.toggle('open'));
    }

    // === CARRITO CON localStorage (PERSISTENTE) ===
    let cart = JSON.parse(localStorage.getItem('oskyCart')) || [];

    const saveCart = () => {
        localStorage.setItem('oskyCart', JSON.stringify(cart));
        updateCartBadge();
        renderCart();
    };

    const updateCartBadge = () => {
        const badge = document.getElementById('cart-quantity');
        if (badge) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
        }
    };

    const renderCart = () => {
        const container = document.getElementById('cart-items');
        const totalElement = document.getElementById('cart-total');
        if (!container) return;

        container.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            container.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío</p>';
        } else {
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <div>
                        <strong>${item.title}</strong><br>
                        <small>Cantidad: ${item.quantity}</small>
                    </div>
                    <div>
                        <span class="cart-item-price">$${itemTotal.toLocaleString('es-AR')}</span><br>
                        <button class="remove-from-cart-btn" data-index="${index}">Remover</button>
                    </div>
                `;
                container.appendChild(div);
            });
        }

        if (totalElement) totalElement.textContent = total.toLocaleString('es-AR');

        // Botones remover
        document.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
            btn.onclick = () => {
                const i = parseInt(btn.dataset.index);
                cart.splice(i, 1);
                saveCart();
            };
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
        alert(`"${title}" agregado al carrito`);
    };

    // === Abrir / Cerrar Carrito ===
    document.getElementById('cart-icon')?.addEventListener('click', () => {
        document.getElementById('cart-modal').classList.add('show');
        renderCart();
    });

    document.getElementById('close-cart-btn')?.addEventListener('click', () => {
        document.getElementById('cart-modal').classList.remove('show');
    });

    document.getElementById('cart-modal')?.addEventListener('click', (e) => {
        if (e.target === document.getElementById('cart-modal')) {
            document.getElementById('cart-modal').classList.remove('show');
        }
    });

    // Vaciar carrito
    document.getElementById('clear-cart-btn')?.addEventListener('click', () => {
        if (confirm('¿Vaciar todo el carrito?')) {
            cart = [];
            saveCart();
        }
    });

    // Finalizar compra
    document.getElementById('checkout-btn')?.addEventListener('click', () => {
        if (cart.length === 0) return alert('El carrito está vacío');
        alert('¡Gracias por tu compra! Te contacto en menos de 24hs por WhatsApp');
        cart = [];
        saveCart();
        document.getElementById('cart-modal').classList.remove('show');
    });

    // === CARGAR PRODUCTOS DESDE API (solo en productos.html) ===
    if (document.getElementById('products-container')) {
        fetch('https://fakestoreapi.com/products?limit=10')
            .then(res => res.json())
            .then(products => {
                const container = document.getElementById('products-container');
                container.innerHTML = '';
                products.forEach(p => {
                    const priceARS = Math.round(p.price * 1400);
                    container.innerHTML += `
                        <div class="card-product">
                            <img src="${p.image}" alt="${p.title}" class="product-img">
                            <h4>${p.title}</h4>
                            <p>${p.description.substring(0, 90)}...</p>
                            <span class="product-price">$${priceARS.toLocaleString('es-AR')}</span>
                            <button class="add-to-cart-btn" onclick="addToCart(${p.id}, '${p.title.substring(0, 40)}...', ${priceARS})">
                                Añadir al Carrito
                            </button>
                        </div>
                    `;
                });
            });
    }

    // Inicializar todo
    updateCartBadge();
});