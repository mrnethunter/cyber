// Cart Page JavaScript - CSP FIXED

document.addEventListener('DOMContentLoaded', function() {
    initCartPage();
    setupCartEvents();
});

function initCartPage() {
    loadCartItems();
    updateCartSummary();
}

// Load cart items
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartElement = document.getElementById('emptyCart');
    
    // استخدام window.storage بدلاً من storage
    if (typeof window.storage === 'undefined') {
        console.error('Storage not available');
        // استخدام الدالة من common.js إذا كانت متاحة
        if (typeof window.showNotification !== 'undefined') {
            window.showNotification('تعذر تحميل السلة', 'error');
        }
        return;
    }
    
    const cartSummary = window.storage.getCartTotal();
    
    if (!cartItemsContainer) return;
    
    if (cartSummary.items.length === 0) {
        cartItemsContainer.innerHTML = '';
        if (emptyCartElement) {
            emptyCartElement.style.display = 'block';
        }
        return;
    }
    
    if (emptyCartElement) {
        emptyCartElement.style.display = 'none';
    }
    
    cartItemsContainer.innerHTML = cartSummary.items.map(item => {
        const imageUrl = item.product.image || 'https://cdn-icons-png.flaticon.com/512/3588/3588658.png';
        
        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${imageUrl}" 
                         alt="${item.product.name}"
                         onerror="this.src='https://cdn-icons-png.flaticon.com/512/3588/3588658.png'">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.product.name}</h4>
                    <p class="cart-item-category">${getCategoryName(item.product.category)}</p>
                    <div class="cart-item-price">${window.storage.formatPrice(item.product.price)} × ${item.quantity}</div>
                    <div class="cart-item-total">المجموع: ${window.storage.formatPrice(item.total)}</div>
                </div>
                <div class="cart-item-quantity">
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-action="decrease" data-product-id="${item.productId}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" data-action="increase" data-product-id="${item.productId}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="cart-item-remove" data-product-id="${item.productId}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
}

// Update cart summary
function updateCartSummary(couponCode = null) {
    if (typeof window.storage === 'undefined') return;
    
    const cartSummary = window.storage.getCartTotal(couponCode);
    
    const itemsCountEl = document.getElementById('itemsCount');
    const subtotalEl = document.getElementById('subtotal');
    const cartDiscountEl = document.getElementById('cartDiscount');
    const cartTotalEl = document.getElementById('cartTotal');
    
    if (itemsCountEl) itemsCountEl.textContent = cartSummary.items.length;
    if (subtotalEl) subtotalEl.textContent = window.storage.formatPrice(cartSummary.subtotal);
    if (cartDiscountEl) cartDiscountEl.textContent = window.storage.formatPrice(cartSummary.discountAmount);
    if (cartTotalEl) cartTotalEl.textContent = window.storage.formatPrice(cartSummary.total);
    
    // Update cart count in header
    updateCartCount();
}

// Setup cart events
function setupCartEvents() {
    // Quantity controls
    document.addEventListener('click', function(e) {
        if (typeof window.storage === 'undefined') return;
        
        // Decrease quantity
        if (e.target.closest('[data-action="decrease"]')) {
            const btn = e.target.closest('[data-action="decrease"]');
            const productId = parseInt(btn.getAttribute('data-product-id'));
            const cartItem = window.storage.getCart().find(item => item.productId === productId);
            
            if (cartItem) {
                const newQuantity = cartItem.quantity - 1;
                if (newQuantity >= 1) {
                    window.storage.updateCartItem(productId, newQuantity);
                    loadCartItems();
                    updateCartSummary();
                    if (typeof window.showNotification !== 'undefined') {
                        window.showNotification('تم تحديث الكمية', 'success');
                    }
                }
            }
        }
        
        // Increase quantity
        if (e.target.closest('[data-action="increase"]')) {
            const btn = e.target.closest('[data-action="increase"]');
            const productId = parseInt(btn.getAttribute('data-product-id'));
            const cartItem = window.storage.getCart().find(item => item.productId === productId);
            const product = window.storage.getProduct(productId);
            
            if (cartItem && product) {
                if (cartItem.quantity < product.stock) {
                    const newQuantity = cartItem.quantity + 1;
                    window.storage.updateCartItem(productId, newQuantity);
                    loadCartItems();
                    updateCartSummary();
                    if (typeof window.showNotification !== 'undefined') {
                        window.showNotification('تم تحديث الكمية', 'success');
                    }
                } else {
                    if (typeof window.showNotification !== 'undefined') {
                        window.showNotification('لا يمكن إضافة المزيد، نفذت الكمية', 'error');
                    }
                }
            }
        }
        
        // Remove item
if (e.target.closest('.cart-item-remove')) {
    const btn = e.target.closest('.cart-item-remove');
    const productId = parseInt(btn.getAttribute('data-product-id'));
    const cartItem = window.storage.getCart().find(item => item.productId === productId);
    const product = window.storage.getProduct(productId);
    
    if (cartItem && product) {
        showDeleteConfirmation(product.name, productId);
    }
}
        // Apply coupon
        if (e.target.closest('#applyCartCoupon')) {
            applyCartCoupon();
        }
        
        // Checkout button
        if (e.target.closest('#checkoutBtn')) {
            handleCheckout();
        }
    });
    
    // Enter key for coupon input
    const cartCouponInput = document.getElementById('cartCoupon');
    if (cartCouponInput) {
        cartCouponInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyCartCoupon();
            }
        });
    }
}

// Apply cart coupon
function applyCartCoupon() {
    if (typeof window.storage === 'undefined') return;
    
    const couponInput = document.getElementById('cartCoupon');
    const feedback = document.getElementById('cartCouponFeedback');
    
    if (!couponInput || !feedback) return;
    
    const couponCode = couponInput.value.trim();
    
    if (!couponCode) {
        feedback.textContent = 'يرجى إدخال كود الخصم';
        feedback.className = 'coupon-feedback error';
        return;
    }
    
    const cartSummary = window.storage.getCartTotal(couponCode);
    
    if (cartSummary.discount > 0) {
        feedback.textContent = `تم تطبيق خصم ${cartSummary.discount}% بنجاح!`;
        feedback.className = 'coupon-feedback success';
        
        // Save applied coupon in session
        sessionStorage.setItem('appliedCoupon', couponCode);
        
        // Update summary
        updateCartSummary(couponCode);
        
        if (typeof window.showNotification !== 'undefined') {
            window.showNotification(`تم تطبيق كود الخصم "${couponCode}"`, 'success');
        }
    } else {
        feedback.textContent = 'كود الخصم غير صالح أو لا ينطبق على مبلغ الطلب';
        feedback.className = 'coupon-feedback error';
        sessionStorage.removeItem('appliedCoupon');
        
        // Update summary without coupon
        updateCartSummary();
        
        if (typeof window.showNotification !== 'undefined') {
            window.showNotification('كود الخصم غير صالح', 'error');
        }
    }
}

// Handle checkout
function handleCheckout() {
    if (typeof window.storage === 'undefined') return;
    
    const appliedCoupon = sessionStorage.getItem('appliedCoupon');
    const cartSummary = window.storage.getCartTotal(appliedCoupon);
    
    if (cartSummary.items.length === 0) {
        if (typeof window.showNotification !== 'undefined') {
            window.showNotification('سلة المشتريات فارغة', 'error');
        }
        return;
    }
    
    // Open purchase modal for each item or show bulk purchase modal
    if (cartSummary.items.length === 1) {
        openPurchaseModal(cartSummary.items[0].productId);
    } else {
        openBulkPurchaseModal();
    }
}
// Open purchase modal for single product
function openPurchaseModal(productId) {
    if (typeof window.storage === 'undefined') return;
    
    const product = window.storage.getProduct(productId);
    if (!product) return;
    
    const appliedCoupon = sessionStorage.getItem('appliedCoupon');
    const cartItem = window.storage.getCart().find(item => item.productId === productId);
    const quantity = cartItem ? cartItem.quantity : 1;
    
    // Calculate discount
    let discount = 0;
    let discountAmount = 0;
    
    if (appliedCoupon) {
        const cartSummary = window.storage.getCartTotal(appliedCoupon);
        discount = cartSummary.discount;
        discountAmount = (product.price * quantity * discount) / 100;
    }
    
    const originalPrice = product.price * quantity;
    const finalPrice = originalPrice - discountAmount;
    
    // Set modal values
    document.getElementById('productId').value = productId;
    document.getElementById('originalPrice').textContent = window.storage.formatPrice(originalPrice);
    document.getElementById('discountAmount').textContent = window.storage.formatPrice(discountAmount);
    document.getElementById('finalPrice').textContent = window.storage.formatPrice(finalPrice);
    
    // Pre-fill coupon code if exists
    const couponCodeInput = document.getElementById('couponCode');
    if (appliedCoupon && couponCodeInput) {
        couponCodeInput.value = appliedCoupon;
    }
    
    // Open modal
    const modal = document.getElementById('purchaseModal');
    if (modal) {
        modal.classList.add('active');
        
        // Setup modal close event
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.classList.remove('active');
            };
        }
        
        // Close modal when clicking outside
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        };
        
        // Setup coupon apply event
        const applyCouponBtn = document.getElementById('applyCoupon');
        if (applyCouponBtn) {
            applyCouponBtn.onclick = () => {
                applyModalCoupon(productId, quantity);
            };
        }
        
        // Setup form submit event
        const purchaseForm = document.getElementById('purchaseForm');
        if (purchaseForm) {
            purchaseForm.onsubmit = (e) => {
                e.preventDefault();
                submitPurchaseOrder(productId, quantity);
            };
        }
    }
}

// Apply coupon in modal
function applyModalCoupon(productId, quantity) {
    if (typeof window.storage === 'undefined') return;
    
    const product = window.storage.getProduct(productId);
    if (!product) return;
    
    const couponInput = document.getElementById('couponCode');
    const feedback = document.getElementById('couponFeedback');
    
    if (!couponInput || !feedback) return;
    
    const couponCode = couponInput.value.trim();
    
    if (!couponCode) {
        feedback.textContent = 'يرجى إدخال كود الخصم';
        feedback.className = 'coupon-feedback error';
        return;
    }
    
    // Get the original price
    const originalPrice = product.price * quantity;
    
    // Check if coupon is valid using storage function
    const cartSummary = window.storage.getCartTotal(couponCode);
    
    // Since we're checking for a single product, we need to validate differently
    // Get all coupons from storage
    const coupons = window.storage.getCoupons();
    let validCoupon = null;
    
    // Find the coupon by code
    for (const coupon of coupons) {
        if (coupon.code === couponCode.toUpperCase() || coupon.code === couponCode) {
            validCoupon = coupon;
            break;
        }
    }
    
    // Validate coupon
    if (validCoupon && validCoupon.active) {
        // Check if coupon has uses left
        if (validCoupon.uses && validCoupon.used >= validCoupon.uses) {
            feedback.textContent = 'كود الخصم قد استنفد عدد مرات الاستخدام';
            feedback.className = 'coupon-feedback error';
            return;
        }
        
        // Check minimum amount
        if (validCoupon.minAmount && originalPrice < validCoupon.minAmount) {
            feedback.textContent = `الحد الأدنى للطلب لتطبيق هذا الكوبون هو ${window.storage.formatPrice(validCoupon.minAmount)}`;
            feedback.className = 'coupon-feedback error';
            return;
        }
        
        // Check dates if they exist
        const now = new Date();
        if (validCoupon.startDate && new Date(validCoupon.startDate) > now) {
            feedback.textContent = 'كود الخصم لم يبدأ بعد';
            feedback.className = 'coupon-feedback error';
            return;
        }
        
        if (validCoupon.endDate && new Date(validCoupon.endDate) < now) {
            feedback.textContent = 'كود الخصم منتهي الصلاحية';
            feedback.className = 'coupon-feedback error';
            return;
        }
        
        // Apply discount
        const discount = validCoupon.discount;
        const discountAmount = (originalPrice * discount) / 100;
        const finalPrice = originalPrice - discountAmount;
        
        feedback.textContent = `تم تطبيق خصم ${discount}% بنجاح!`;
        feedback.className = 'coupon-feedback success';
        
        // Update prices
        document.getElementById('originalPrice').textContent = window.storage.formatPrice(originalPrice);
        document.getElementById('discountAmount').textContent = window.storage.formatPrice(discountAmount);
        document.getElementById('finalPrice').textContent = window.storage.formatPrice(finalPrice);
        
        // Save coupon in session
        sessionStorage.setItem('modalAppliedCoupon', couponCode);
        
        if (typeof window.showNotification !== 'undefined') {
            window.showNotification(`تم تطبيق كود الخصم "${couponCode}"`, 'success');
        }
    } else {
        feedback.textContent = 'كود الخصم غير صالح';
        feedback.className = 'coupon-feedback error';
        sessionStorage.removeItem('modalAppliedCoupon');
        
        if (typeof window.showNotification !== 'undefined') {
            window.showNotification('كود الخصم غير صالح', 'error');
        }
    }
}

// Submit purchase order
function submitPurchaseOrder(productId, quantity) {
    if (typeof window.storage === 'undefined') return;
    
    const product = window.storage.getProduct(productId);
    if (!product) return;
    
    // Get form values
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const customerEmail = document.getElementById('customerEmail').value.trim();
    const instagramUser = document.getElementById('instagramUser').value.trim();
    const couponCode = document.getElementById('couponCode').value.trim();
    
    if (!customerName || !customerPhone || !customerEmail) {
        if (typeof window.showNotification !== 'undefined') {
            window.showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        }
        return;
    }
    
    // Check stock
    if (product.stock < quantity) {
        if (typeof window.showNotification !== 'undefined') {
            window.showNotification('عذراً، الكمية المطلوبة غير متوفرة في المخزون', 'error');
        }
        return;
    }
    
    // Calculate final price
    const originalPrice = product.price * quantity;
    let discount = 0;
    
    // Validate coupon
    if (couponCode) {
        const coupons = window.storage.getCoupons();
        let validCoupon = null;
        
        // Find the coupon by code
        for (const coupon of coupons) {
            if (coupon.code === couponCode.toUpperCase() || coupon.code === couponCode) {
                validCoupon = coupon;
                break;
            }
        }
        
        // Validate coupon
        if (validCoupon && validCoupon.active) {
            // Check if coupon has uses left
            if (validCoupon.uses && validCoupon.used >= validCoupon.uses) {
                if (typeof window.showNotification !== 'undefined') {
                    window.showNotification('كود الخصم قد استنفد عدد مرات الاستخدام', 'error');
                }
                return;
            }
            
            // Check minimum amount
            if (validCoupon.minAmount && originalPrice < validCoupon.minAmount) {
                if (typeof window.showNotification !== 'undefined') {
                    window.showNotification(`الحد الأدنى للطلب لتطبيق هذا الكوبون هو ${window.storage.formatPrice(validCoupon.minAmount)}`, 'error');
                }
                return;
            }
            
            // Check dates if they exist
            const now = new Date();
            if (validCoupon.startDate && new Date(validCoupon.startDate) > now) {
                if (typeof window.showNotification !== 'undefined') {
                    window.showNotification('كود الخصم لم يبدأ بعد', 'error');
                }
                return;
            }
            
            if (validCoupon.endDate && new Date(validCoupon.endDate) < now) {
                if (typeof window.showNotification !== 'undefined') {
                    window.showNotification('كود الخصم منتهي الصلاحية', 'error');
                }
                return;
            }
            
            discount = validCoupon.discount;
            
            // Increment coupon usage
            if (validCoupon.uses) {
                window.storage.updateCoupon(validCoupon.id, {
                    used: validCoupon.used + 1
                });
            }
        } else {
            if (typeof window.showNotification !== 'undefined') {
                window.showNotification('كود الخصم غير صالح', 'error');
            }
            return;
        }
    }
    
    const discountAmount = (originalPrice * discount) / 100;
    const finalPrice = originalPrice - discountAmount;
    
    // Create order
    const order = {
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        customerName,
        customerPhone,
        customerEmail,
        instagramUser: instagramUser || 'لم يتم الإدخال',
        couponCode: couponCode || 'لا يوجد',
        discount,
        discountAmount,
        finalPrice,
        originalPrice: originalPrice,
        quantity,
        date: new Date().toISOString(),
        status: 'new'
    };
    
    // Add order to storage
    const newOrder = window.storage.addOrder(order);
    
    // Update product stock
    window.storage.updateProduct(productId, {
        stock: product.stock - quantity
    });
    
    // Remove from cart
    window.storage.removeFromCart(productId);
    
    // Close modal
    const modal = document.getElementById('purchaseModal');
    if (modal) {
        modal.classList.remove('active');
    }
    
    // Clear form
    document.getElementById('purchaseForm').reset();
    document.getElementById('couponFeedback').textContent = '';
    document.getElementById('couponFeedback').className = 'coupon-feedback';
    
    // Clear session coupon
    sessionStorage.removeItem('modalAppliedCoupon');
    sessionStorage.removeItem('appliedCoupon');
    
    // Show custom success message
    if (typeof window.showNotification !== 'undefined') {
        window.showNotification('تم تأكيد الطلب وسوف يتم التواصل معك عبر معلومات التواصل التي قدمتها لنا. شكراً لثقتك بـ CYS', 'success');
    } else {
        // Fallback if showNotification is not available
        alert('تم تأكيد الطلب وسوف يتم التواصل معك عبر معلومات التواصل التي قدمتها لنا. شكراً لثقتك بـ CYS');
    }
    
    // Update cart
    loadCartItems();
    updateCartSummary();
}

// Open bulk purchase modal
function openBulkPurchaseModal() {
    if (typeof window.storage === 'undefined') return;
    
    const appliedCoupon = sessionStorage.getItem('appliedCoupon');
    const cartSummary = window.storage.getCartTotal(appliedCoupon);
    const totalItems = cartSummary.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay active" id="bulkPurchaseModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3> شراء متعدد - يتم الرد خلال 24 ساعة </h3>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="purchase-form">
                    <div class="form-group">
                        <label for="bulkCustomerName"><i class="fas fa-user"></i> الاسم الكامل *</label>
                        <input type="text" id="bulkCustomerName" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="bulkCustomerPhone"><i class="fas fa-phone"></i> رقم الهاتف *</label>
                        <input type="tel" id="bulkCustomerPhone" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="bulkCustomerEmail"><i class="fas fa-envelope"></i> البريد الإلكتروني *</label>
                        <input type="email" id="bulkCustomerEmail" required>
                    </div>
                    
                    <div class="order-summary">
                        <div class="summary-item">
                            <span>عدد المنتجات:</span>
                            <span>${totalItems}</span>
                        </div>
                        <div class="summary-item">
                            <span>المجموع:</span>
                            <span id="bulkSubtotal">${window.storage.formatPrice(cartSummary.subtotal)}</span>
                        </div>
                        <div class="summary-item">
                            <span>الخصم:</span>
                            <span id="bulkDiscount">${window.storage.formatPrice(cartSummary.discountAmount)}</span>
                        </div>
                        <div class="summary-item total">
                            <span>الإجمالي:</span>
                            <span id="bulkTotal">${window.storage.formatPrice(cartSummary.total)}</span>
                        </div>
                    </div>
                    
                    <button type="button" class="btn btn-primary btn-block" id="submitBulkOrder">
                        <i class="fas fa-shopping-cart"></i> تأكيد الطلب
                    </button>
                </div>
            </div>
        </div>
        
    `;
    
    // Add modal to page
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // Setup modal events
    const modal = document.getElementById('bulkPurchaseModal');
    const closeBtn = modal.querySelector('.close-modal');
    const submitBtn = document.getElementById('submitBulkOrder');
    
    closeBtn.addEventListener('click', function() {
        modal.remove();
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    submitBtn.addEventListener('click', submitBulkOrder);
}
// Submit bulk order
function submitBulkOrder() {
    if (typeof window.storage === 'undefined') return;
    
    const customerName = document.getElementById('bulkCustomerName').value.trim();
    const customerPhone = document.getElementById('bulkCustomerPhone').value.trim();
    const customerEmail = document.getElementById('bulkCustomerEmail').value.trim();
    
    if (!customerName || !customerPhone || !customerEmail) {
        if (typeof window.showNotification !== 'undefined') {
            window.showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        }
        return;
    }
    
    const cart = window.storage.getCart();
    const appliedCoupon = sessionStorage.getItem('appliedCoupon');
    const cartSummary = window.storage.getCartTotal(appliedCoupon);
    
    // Create order for each cart item
    let orders = [];
    
    for (const cartItem of cart) {
        const product = window.storage.getProduct(cartItem.productId);
        
        if (product && product.stock >= cartItem.quantity) {
            const order = {
                productId: product.id,
                productName: product.name,
                productPrice: product.price,
                customerName,
                customerPhone,
                customerEmail,
                instagramUser: 'متعدد المنتجات',
                couponCode: appliedCoupon || 'لا يوجد',
                discount: cartSummary.discount,
                finalPrice: (product.price * cartItem.quantity) - ((product.price * cartItem.quantity * cartSummary.discount) / 100),
                quantity: cartItem.quantity
            };
            
            const newOrder = window.storage.addOrder(order);
            orders.push(newOrder);
            
            // Update product stock
            window.storage.updateProduct(product.id, {
                stock: product.stock - cartItem.quantity
            });
        }
    }
    
    // Clear cart
    window.storage.clearCart();
    
    // Remove modal
    const modal = document.getElementById('bulkPurchaseModal');
    if (modal) modal.remove();
    
    // Clear applied coupon
    sessionStorage.removeItem('appliedCoupon');
    
    // Show custom success message
    if (typeof window.showNotification !== 'undefined') {
        window.showNotification('تم تأكيد الطلب وسوف يتم التواصل معك عبر معلومات التواصل التي قدمتها لنا. شكراً لثقتك بـ CYS', 'success');
    } else {
        // Fallback if showNotification is not available
        alert('تم تأكيد الطلب وسوف يتم التواصل معك عبر معلومات التواصل التي قدمتها لنا. شكراً لثقتك بـ CYS');
    }
    
    // Reload cart
    setTimeout(() => {
        loadCartItems();
        updateCartSummary();
    }, 1000);
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

// Update cart count function
function updateCartCount() {
    if (typeof window.storage === 'undefined') return;
    
    const cart = window.storage.getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalItems;
    });
}
// Show custom delete confirmation modal
function showDeleteConfirmation(productName, productId) {
    // Create modal HTML
    const modalHTML = `
        <div class="confirm-modal-overlay active" id="deleteConfirmModal">
            <div class="confirm-modal">
                <div class="confirm-modal-header">
                    <i class="fas fa-trash-alt"></i>
                    <h3>حذف المنتج</h3>
                </div>
                <div class="confirm-modal-body">
                    <p class="confirm-message">
                        هل أنت متأكد من حذف المنتج 
                        <span class="product-highlight">${productName}</span> 
                        من سلة المشتريات؟
                    </p>
                    <div class="confirm-modal-actions">
                        <button class="confirm-btn cancel" id="cancelDelete">
                            <i class="fas fa-times"></i> إلغاء
                        </button>
                        <button class="confirm-btn delete" id="confirmDelete">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);
    
    // Setup modal events
    const modal = document.getElementById('deleteConfirmModal');
    const cancelBtn = document.getElementById('cancelDelete');
    const confirmBtn = document.getElementById('confirmDelete');
    
    // Cancel button
    cancelBtn.addEventListener('click', function() {
        modal.remove();
        if (typeof window.showNotification !== 'undefined') {
            window.showNotification('تم إلغاء عملية الحذف', 'info');
        }
    });
    
    // Confirm delete button
    confirmBtn.addEventListener('click', function() {
        window.storage.removeFromCart(productId);
        loadCartItems();
        updateCartSummary();
        
        // Remove modal
        modal.remove();
        
        // Show success message with icon
        if (typeof window.showNotification !== 'undefined') {
            window.showNotification('تم حذف المنتج من السلة بنجاح', 'success');
        }
        
        // Optional: Add a subtle animation effect
        const cartItemElement = document.querySelector(`[data-product-id="${productId}"]`)?.closest('.cart-item');
        if (cartItemElement) {
            cartItemElement.style.transition = 'all 0.5s ease';
            cartItemElement.style.opacity = '0';
            cartItemElement.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                if (cartItemElement.parentNode) {
                    cartItemElement.remove();
                }
            }, 500);
        }
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function closeModalOnEscape(e) {
        if (e.key === 'Escape' && modal) {
            modal.remove();
            document.removeEventListener('keydown', closeModalOnEscape);
        }
    });
}

// جعل الدوال متاحة عالمياً
window.showDeleteConfirmation = showDeleteConfirmation;

// جعل الدوال متاحة عالمياً
window.updateCartCount = updateCartCount;
window.getCategoryName = getCategoryName;
window.applyCartCoupon = applyCartCoupon;
window.openPurchaseModal = openPurchaseModal; // أضف هذا السطر