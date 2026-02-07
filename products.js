// Products Page JavaScript - CSP FIXED

document.addEventListener('DOMContentLoaded', function() {
    initProductsPage();
    setupProductEvents();
});

function initProductsPage() {
    loadProducts();
    setupFilters();
    setupPurchaseModal();
}

// Load products
function loadProducts() {
    const productsContainer = document.getElementById('productsContainer');
    const noProductsElement = document.getElementById('noProducts');
    
    if (!productsContainer) return;
    
    const products = storage.getProducts();
    
    if (products.length === 0) {
        productsContainer.innerHTML = '';
        if (noProductsElement) {
            noProductsElement.style.display = 'block';
        } else {
            productsContainer.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-box-open"></i>
                    <h3>لا توجد منتجات حالياً</h3>
                    <p>سيتم إضافة منتجات جديدة قريباً</p>
                </div>
            `;
        }
        return;
    }
    
    if (noProductsElement) {
        noProductsElement.style.display = 'none';
    }
    
    productsContainer.innerHTML = products.map(product => {
        const categoryName = getCategoryName(product.category);
        const imageUrl = product.image || 'https://cdn-icons-png.flaticon.com/512/3588/3588658.png';
        
        // Stock status
        let stockClass = 'stock-available';
        let stockText = `المتوفر: ${product.stock}`;
        if (product.stock <= 0) {
            stockClass = 'stock-out';
            stockText = 'نفذت الكمية';
        } else if (product.stock <= 5) {
            stockClass = 'stock-low';
        }
        
        // Product details
        let detailsHtml = '';
        if (product.details && product.details.length > 0) {
            detailsHtml = `
                <div class="product-details">
                    ${product.details.slice(0, 3).map(detail => `
                        <div class="detail-item">${detail}</div>
                    `).join('')}
                </div>
            `;
        }
        
        // Buttons state
        const isOutOfStock = product.stock <= 0;
        const buyBtnDisabled = isOutOfStock ? 'disabled' : '';
        const buyBtnText = isOutOfStock ? 'نفذت الكمية' : 'شراء الآن';
        const addBtnDisabled = isOutOfStock ? 'disabled' : '';
        
        return `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${imageUrl}" 
                         alt="${product.name}"
                         onerror="this.src='https://cdn-icons-png.flaticon.com/512/3588/3588658.png'">
                </div>
                <div class="product-info">
                    <span class="product-category">${categoryName}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    
                    ${detailsHtml}
                    
                    <div class="product-stock ${stockClass}">
                        <i class="fas fa-box"></i>
                        ${stockText}
                    </div>
                    
                    <div class="product-price">${storage.formatPrice(product.price)}</div>
                    
                    <div class="product-actions">
                        <button class="btn-buy buy-now-btn" data-product-id="${product.id}" ${buyBtnDisabled}>
                            <i class="fas fa-shopping-cart"></i>
                            ${buyBtnText}
                        </button>
                        <button class="btn-buy btn-secondary add-to-cart-btn" data-product-id="${product.id}" ${addBtnDisabled}>
                            <i class="fas fa-cart-plus"></i> أضف للسلة
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Setup filters
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortFilter').value;
    
    const products = storage.getProducts();
    let filteredProducts = [...products];
    
    // Filter by search
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            (product.details && product.details.some(detail => 
                detail.toLowerCase().includes(searchTerm)
            ))
        );
    }
    
    // Filter by category
    if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(product =>
            product.category === category
        );
    }
    
    // Sort products
    filteredProducts.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name':
                return a.name.localeCompare(b.name);
            case 'newest':
            default:
                return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });
    
    updateProductsDisplay(filteredProducts);
}

function updateProductsDisplay(products) {
    const productsContainer = document.getElementById('productsContainer');
    const noProductsElement = document.getElementById('noProducts');
    
    if (!productsContainer) return;
    
    if (products.length === 0) {
        productsContainer.innerHTML = '';
        if (noProductsElement) {
            noProductsElement.style.display = 'block';
        } else {
            productsContainer.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-box-open"></i>
                    <h3>لا توجد منتجات</h3>
                    <p>لم يتم العثور على منتجات تطابق معايير البحث</p>
                </div>
            `;
        }
        return;
    }
    
    if (noProductsElement) {
        noProductsElement.style.display = 'none';
    }
    
    productsContainer.innerHTML = products.map(product => {
        const categoryName = getCategoryName(product.category);
        const imageUrl = product.image || 'https://cdn-icons-png.flaticon.com/512/3588/3588658.png';
        
        // Stock status
        let stockClass = 'stock-available';
        let stockText = `المتوفر: ${product.stock}`;
        if (product.stock <= 0) {
            stockClass = 'stock-out';
            stockText = 'نفذت الكمية';
        } else if (product.stock <= 5) {
            stockClass = 'stock-low';
        }
        
        // Product details
        let detailsHtml = '';
        if (product.details && product.details.length > 0) {
            detailsHtml = `
                <div class="product-details">
                    ${product.details.slice(0, 3).map(detail => `
                        <div class="detail-item">${detail}</div>
                    `).join('')}
                </div>
            `;
        }
        
        // Buttons state
        const isOutOfStock = product.stock <= 0;
        const buyBtnDisabled = isOutOfStock ? 'disabled' : '';
        const buyBtnText = isOutOfStock ? 'نفذت الكمية' : 'شراء الآن';
        const addBtnDisabled = isOutOfStock ? 'disabled' : '';
        
        return `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${imageUrl}" 
                         alt="${product.name}"
                         onerror="this.src='https://cdn-icons-png.flaticon.com/512/3588/3588658.png'">
                </div>
                <div class="product-info">
                    <span class="product-category">${categoryName}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    
                    ${detailsHtml}
                    
                    <div class="product-stock ${stockClass}">
                        <i class="fas fa-box"></i>
                        ${stockText}
                    </div>
                    
                    <div class="product-price">${storage.formatPrice(product.price)}</div>
                    
                    <div class="product-actions">
                        <button class="btn-buy buy-now-btn" data-product-id="${product.id}" ${buyBtnDisabled}>
                            <i class="fas fa-shopping-cart"></i>
                            ${buyBtnText}
                        </button>
                        <button class="btn-buy btn-secondary add-to-cart-btn" data-product-id="${product.id}" ${addBtnDisabled}>
                            <i class="fas fa-cart-plus"></i> أضف للسلة
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Setup product events
function setupProductEvents() {
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.closest('.add-to-cart-btn');
            const productId = btn.getAttribute('data-product-id');
            if (productId && !btn.disabled) {
                addToCart(parseInt(productId));
            }
        }
        
        if (e.target.closest('.buy-now-btn')) {
            const btn = e.target.closest('.buy-now-btn');
            const productId = btn.getAttribute('data-product-id');
            if (productId && !btn.disabled) {
                openPurchaseModal(parseInt(productId));
            }
        }
    });
}

// Purchase Modal
function setupPurchaseModal() {
    const modal = document.getElementById('purchaseModal');
    if (!modal) return;
    
    const closeModalBtn = modal.querySelector('.close-modal');
    const applyCouponBtn = document.getElementById('applyCoupon');
    const purchaseForm = document.getElementById('purchaseForm');
    
    // Close modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Apply coupon
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', applyCoupon);
    }
    
    // Submit form
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', handlePurchase);
    }
}

// Apply coupon function
function applyCoupon() {
    const couponCode = document.getElementById('couponCode').value.trim();
    const productId = document.getElementById('productId').value;
    const product = storage.getProduct(parseInt(productId));
    const feedback = document.getElementById('couponFeedback');
    
    if (!couponCode || !product) return;
    
    const coupon = storage.validateCoupon(couponCode, product.price);
    
    if (coupon) {
        const discountAmount = (product.price * coupon.discount) / 100;
        updatePriceDisplay(product.price, discountAmount);
        
        if (feedback) {
            feedback.textContent = `تم تطبيق خصم ${coupon.discount}% بنجاح!`;
            feedback.className = 'coupon-feedback success';
        }
    } else {
        updatePriceDisplay(product.price, 0);
        if (feedback) {
            feedback.textContent = 'كود الخصم غير صالح أو منتهي الصلاحية';
            feedback.className = 'coupon-feedback error';
        }
    }
}

// Update price display function
function updatePriceDisplay(originalPrice, discountAmount) {
    const finalPrice = originalPrice - discountAmount;
    
    const originalPriceEl = document.getElementById('originalPrice');
    const discountAmountEl = document.getElementById('discountAmount');
    const finalPriceEl = document.getElementById('finalPrice');
    
    if (originalPriceEl) originalPriceEl.textContent = storage.formatPrice(originalPrice);
    if (discountAmountEl) discountAmountEl.textContent = storage.formatPrice(discountAmount);
    if (finalPriceEl) finalPriceEl.textContent = storage.formatPrice(finalPrice);
}

// Handle purchase function
async function handlePurchase(e) {
    e.preventDefault();
    
    const productId = parseInt(document.getElementById('productId').value);
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const customerEmail = document.getElementById('customerEmail').value.trim();
    const instagramUser = document.getElementById('instagramUser').value.trim();
    const couponCode = document.getElementById('couponCode').value.trim();
    
    const product = storage.getProduct(productId);
    
    if (!product) {
        showNotification('المنتج غير موجود', 'error');
        return;
    }
    
    if (product.stock <= 0) {
        showNotification('نفذت كمية هذا المنتج', 'error');
        return;
    }
    
    // Validate coupon
    let discount = 0;
    let finalPrice = product.price;
    
    if (couponCode) {
        const coupon = storage.validateCoupon(couponCode, product.price);
        if (coupon) {
            discount = coupon.discount;
            finalPrice = product.price - (product.price * discount / 100);
            storage.useCoupon(couponCode);
        }
    }
    
    // Create order
    const order = {
        productId: productId,
        productName: product.name,
        productPrice: product.price,
        customerName,
        customerPhone,
        customerEmail,
        instagramUser: instagramUser || 'لم يتم تحديد',
        couponCode: couponCode || 'لا يوجد',
        discount,
        finalPrice,
        quantity: 1
    };
    
    // Add order to storage
    const newOrder = storage.addOrder(order);
    
    // Update product stock
    storage.updateProduct(productId, {
        stock: product.stock - 1
    });
    
    // Close modal
    const modal = document.getElementById('purchaseModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Show success message
    showNotification(`تم تأكيد طلبك بنجاح! رقم الطلب: ${newOrder.orderNumber}`, 'success');
    
    // Reset form
    const form = document.getElementById('purchaseForm');
    if (form) form.reset();
    
    // Reload products to update stock
    loadProducts();
}

// Helper function to get category name
function getCategoryName(category) {
    const categories = {
        'instagram': 'انستجرام',
        'facebook': 'فيسبوك',
        'twitter': 'تويتر',
        'tiktok': 'تيك توك',
        'youtube': 'يوتيوب',
        'snapchat': 'سناب شات',
        'other': 'أخرى'
    };
    return categories[category] || category;
}

// Make functions globally available
window.openPurchaseModal = openPurchaseModal;
window.applyCoupon = applyCoupon;
window.updatePriceDisplay = updatePriceDisplay;
window.getCategoryName = getCategoryName;