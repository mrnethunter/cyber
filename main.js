// Main JavaScript for CYS Store

document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    initLoading();
    initMobileMenu();
    initCartCount();
    initRotatingBanner();
    initFeaturedProducts();
    initAnimations();
});

// Loading Screen
function initLoading() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    }
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-links a');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
        });
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMobileMenu);
    }

    if (overlay) {
        overlay.addEventListener('click', closeMobileMenu);
    }

    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// Cart Count
function initCartCount() {
    updateCartCount();
}

// Rotating Banner
function initRotatingBanner() {
    const bannerTrack = document.querySelector('.banner-track');
    const indicatorsContainer = document.querySelector('.banner-indicators');
    
    if (!bannerTrack) return;
    
    // استخدام window.storage بدلاً من storage
    if (typeof window.storage === 'undefined') {
        console.error('Storage not available');
        return;
    }
    
    const bannerImages = window.storage.getBannerImages();
    
    // Clear existing content
    bannerTrack.innerHTML = '';
    if (indicatorsContainer) indicatorsContainer.innerHTML = '';
    
    // Duplicate images for seamless loop
    const duplicatedImages = [...bannerImages, ...bannerImages];
    
    duplicatedImages.forEach((image, index) => {
        // Create banner item
        const bannerItem = document.createElement('div');
        bannerItem.className = 'banner-item';
        bannerItem.innerHTML = `
            <img src="${image.imageUrl}" alt="${image.title}" onerror="this.src='https://via.placeholder.com/80'">
            <span>${image.title}</span>
        `;
        
        // Add click event
        bannerItem.addEventListener('click', () => {
            if (image.link && image.link !== '#') {
                window.location.href = image.link;
            }
        });
        
        bannerTrack.appendChild(bannerItem);
        
        // Create indicator (only for original images)
        if (index < bannerImages.length && indicatorsContainer) {
            const indicator = document.createElement('div');
            indicator.className = 'banner-indicator';
            if (index === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
                const scrollPosition = (index * 100) / bannerImages.length;
                bannerTrack.style.transform = `translateX(-${scrollPosition}%)`;
                
                // Update active indicator
                document.querySelectorAll('.banner-indicator').forEach(ind => {
                    ind.classList.remove('active');
                });
                indicator.classList.add('active');
            });
            
            indicatorsContainer.appendChild(indicator);
        }
    });
    
    // Auto rotate
    let currentIndex = 0;
    const totalItems = bannerImages.length;
    
    function rotateBanner() {
        currentIndex = (currentIndex + 1) % totalItems;
        const scrollPosition = (currentIndex * 100) / totalItems;
        bannerTrack.style.transform = `translateX(-${scrollPosition}%)`;
        
        // Update active indicator
        if (indicatorsContainer) {
            document.querySelectorAll('.banner-indicator').forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
        }
    }
    
    // Start auto rotation
    setInterval(rotateBanner, 3000);
}

// Featured Products
function initFeaturedProducts() {
    const featuredProductsContainer = document.querySelector('.featured-products');
    if (!featuredProductsContainer) return;
    
    // استخدام window.storage بدلاً من storage
    if (typeof window.storage === 'undefined') {
        console.error('Storage not available');
        return;
    }
    
    const products = window.storage.getProducts();
    const featuredProducts = products.filter(product => product.featured).slice(0, 4);
    
    if (featuredProducts.length === 0) {
        featuredProductsContainer.innerHTML = `
            <div class="no-products">
                <i class="fas fa-box-open"></i>
                <h3>لا توجد منتجات مميزة حالياً</h3>
            </div>
        `;
        return;
    }
    
    featuredProductsContainer.innerHTML = featuredProducts.map(product => `
        <div class="product-card" data-aos="fade-up">
            <div class="product-image">
                <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${product.name}" 
                     onerror="this.src='https://via.placeholder.com/300'">
            </div>
            <div class="product-info">
                <span class="product-category">${getCategoryName(product.category)}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                ${product.details && product.details.length > 0 ? `
                    <div class="product-details">
                        ${product.details.slice(0, 3).map(detail => `
                            <div class="detail-item">${detail}</div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="product-price">${window.storage.formatPrice(product.price)}</div>
                <div class="product-actions">
                    <button class="btn-buy" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> للسلة
                    </button>
                    <button class="btn-view" onclick="viewProductDetails(${product.id})">
                        <i class="fas fa-eye"></i> عرض المنتج
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Animations
function initAnimations() {
    // Simple scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(element => {
        observer.observe(element);
        
        // Add animation based on data-aos attribute
        const animation = element.getAttribute('data-aos');
        const delay = element.getAttribute('data-aos-delay') || '0';
        
        element.style.animationDelay = `${delay}ms`;
        element.classList.add('aos-init');
    });
    
    // Typing effect for hero text
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const texts = [
            'احصل على أفضل الحسابات',
            'جودة عالية وأسعار منافسة',
            'تسليم فوري وضمان كامل'
        ];
        let currentTextIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentText = texts[currentTextIndex];
            
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % texts.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? 50 : 100);
            }
        }
        
        setTimeout(type, 1000);
    }
}

// Global functions
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

// دالة addToCart الرئيسية
window.addToCart = function(productId) {
    console.log('Main addToCart called:', productId);
    
    // التحقق من وجود window.storage
    if (typeof window.storage === 'undefined') {
        console.error('Storage not available');
        showNotification('خطأ في النظام، يرجى تحديث الصفحة', 'error');
        return;
    }
    
    // جلب المنتج
    const product = window.storage.getProduct(productId);
    if (!product) {
        console.error('Product not found:', productId);
        showNotification('المنتج غير موجود', 'error');
        return;
    }
    
    // التحقق من المخزون
    if (product.stock <= 0) {
        showNotification('نفذت كمية هذا المنتج', 'error');
        return;
    }
    
    // إضافة المنتج إلى السلة
    const cart = window.storage.addToCart(productId);
    
    // تحديث عداد السلة
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
    
    // إظهار إشعار النجاح
    showNotification(`تم إضافة "${product.name}" إلى السلة`, 'success');
    
    return cart;
};

// Update cart count function
window.updateCartCount = function() {
    if (typeof window.storage === 'undefined') return;
    
    const cart = window.storage.getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalItems;
    });
};

// View product details
window.viewProductDetails = function(productId) {
    if (typeof window.storage === 'undefined') {
        console.error('Storage not available');
        return;
    }
    
    const product = window.storage.getProduct(productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${product.name}</h3>
                <button class="close-modal" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div style="padding: 20px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="${product.image || 'https://cdn-icons-png.flaticon.com/512/3588/3588658.png'}" 
                         alt="${product.name}"
                         style="width: 200px; height: 200px; object-fit: contain; border-radius: 10px;"
                         onerror="this.src='https://cdn-icons-png.flaticon.com/512/3588/3588658.png'">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <span class="product-category" style="display: inline-block; background: var(--secondary-color); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem;">
                        ${getCategoryName(product.category)}
                    </span>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <h4 style="color: var(--secondary-color); margin-bottom: 10px;">الوصف:</h4>
                    <p>${product.description || 'لا يوجد وصف'}</p>
                </div>
                
                ${product.details && product.details.length > 0 ? `
                    <div style="margin-bottom: 15px;">
                        <h4 style="color: var(--secondary-color); margin-bottom: 10px;">التفاصيل:</h4>
                        ${product.details.map(detail => `
                            <div style="padding: 8px 0; border-bottom: 1px solid var(--border-color);">
                                ${detail}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div>
                        <div class="product-price" style="font-size: 1.8rem; font-weight: 700; color: var(--secondary-color);">
                            ${window.storage.formatPrice(product.price)}
                        </div>
                        <div class="product-stock" style="margin-top: 5px; color: ${product.stock > 0 ? 'var(--success-color)' : 'var(--danger-color)'}">
                            <i class="fas fa-box"></i> ${product.stock > 0 ? 'متوفر' : 'نفذت الكمية'}: ${product.stock}
                        </div>
                    </div>
                </div>
                
                <div class="product-actions" style="display: flex; gap: 10px;">
                    <button class="btn-buy" onclick="addToCart(${product.id}); this.closest('.modal-overlay').remove()" 
                            ${product.stock <= 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : 'style="flex: 1;"'}>
                        <i class="fas fa-cart-plus"></i>
                        ${product.stock <= 0 ? 'نفذت الكمية' : 'أضف للسلة'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

// Show notification function
window.showNotification = function(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
};

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// دالة openPurchaseModal
window.openPurchaseModal = function(productId) {
    // توجيه المستخدم إلى صفحة المنتجات مع معرف المنتج
    window.location.href = `products.html?product=${productId}&action=buy`;
};

// دالة لمعالجة معاملات URL في صفحة المنتجات
function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    const action = urlParams.get('action');
    
    if (productId && action === 'buy') {
        // فتح نافذة الشراء تلقائياً
        setTimeout(() => {
            if (typeof window.viewProductDetails === 'function') {
                window.viewProductDetails(parseInt(productId));
            }
        }, 500);
    }
}

// استدعاء الدالة عند تحميل صفحة المنتجات
if (window.location.pathname.includes('products.html')) {
    document.addEventListener('DOMContentLoaded', handleUrlParams);
}