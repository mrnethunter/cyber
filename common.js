// common.js - الدوال المشتركة بين جميع الصفحات - الإصدار النهائي

// متغير لتتبع حالة التهيئة
let isStorageReady = false;

// وظيفة تهيئة التخزين المؤكدة
function ensureStorage() {
    if (isStorageReady) return true;
    
    // الطريقة 1: تحقق من window.storage
    if (typeof window.storage !== 'undefined' && window.storage) {
        isStorageReady = true;
        return true;
    }
    
    // الطريقة 2: حاول إنشاء StorageManager
    if (typeof StorageManager !== 'undefined') {
        window.storage = new StorageManager();
        isStorageReady = true;
        return true;
    }
    
    // الطريقة 3: انتظر قليلاً وحاول مرة أخرى
    setTimeout(() => {
        if (typeof StorageManager !== 'undefined') {
            window.storage = new StorageManager();
            isStorageReady = true;
            console.log('Storage initialized after timeout');
        }
    }, 100);
    
    return false;
}

// دالة addToCart المحسنة
function addToCart(productId) {
    // التأكد من وجود التخزين
    if (!ensureStorage()) {
        console.error('Storage not ready yet');
        setTimeout(() => addToCart(productId), 200);
        return;
    }
    
    try {
        const product = window.storage.getProduct(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        
        if (product.stock <= 0) {
            showNotification('نفذت كمية هذا المنتج', 'error');
            return;
        }
        
        const cart = window.storage.addToCart(productId);
        
        // تحديث العداد
        updateCartCount();
        
        // إظهار الإشعار
        showNotification(`تم إضافة "${product.name}" إلى السلة`, 'success');
        
        // تحديث المخزون
        updateProductStockDisplay(productId);
        
        return cart;
    } catch (error) {
        console.error('Error in addToCart:', error);
        showNotification('حدث خطأ أثناء إضافة المنتج', 'error');
    }
}

// تحديث عداد السلة
function updateCartCount() {
    if (!ensureStorage()) return;
    
    try {
        const cart = window.storage.getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        document.querySelectorAll('.cart-count').forEach(element => {
            element.textContent = totalItems;
        });
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// باقي الدوال (نفسها مع تعديل لاستخدام window.storage)
function updateProductStockDisplay(productId) {
    if (!ensureStorage()) return;
    
    try {
        const product = window.storage.getProduct(productId);
        if (!product) return;
        
        const stockElements = document.querySelectorAll(`[data-product-id="${productId}"] .product-stock`);
        stockElements.forEach(element => {
            element.textContent = `المخزون: ${product.stock}`;
            element.className = `product-stock ${product.stock > 5 ? 'stock-available' : product.stock > 0 ? 'stock-low' : 'stock-out'}`;
        });
    } catch (error) {
        console.error('Error updating stock display:', error);
    }
}

// دالة عرض الإشعارات (نفسها)
function showNotification(message, type = 'info') {
    // ... (نفس كود showNotification الحالي)
}

// دالة المساعدة للأيقونة
function getNotificationIcon(type) {
    // ... (نفس الكود الحالي)
}

// دالة المساعدة للون
function getNotificationColor(type) {
    // ... (نفس الكود الحالي)
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('Common.js: DOM loaded');
    
    // محاولة تهيئة التخزين
    ensureStorage();
    
    // تحديث عداد السلة مع تأخير للتأكد من تحميل كل شيء
    setTimeout(() => {
        updateCartCount();
    }, 300);
    
    // إضافة الأنماط
    addCommonStyles();
});

function addCommonStyles() {
    if (!document.querySelector('#common-styles')) {
        const style = document.createElement('style');
        style.id = 'common-styles';
        style.textContent = `
            /* الأنماط الحالية مع إضافة */
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .common-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                max-width: 400px;
            }
            .notification-success { background: #10b981; color: white; }
            .notification-error { background: #ef4444; color: white; }
            .notification-warning { background: #f59e0b; color: white; }
            .notification-info { background: #3b82f6; color: white; }
            .product-stock {
                display: inline-block;
                padding: 3px 10px;
                border-radius: 15px;
                font-size: 0.8rem;
                margin-bottom: 10px;
            }
            .stock-available { background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid #10b981; }
            .stock-low { background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid #f59e0b; }
            .stock-out { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid #ef4444; }
        `;
        document.head.appendChild(style);
    }
}

// جعل الدوال متاحة عالمياً مع حماية
try {
    window.addToCart = addToCart;
    window.updateCartCount = updateCartCount;
    window.showNotification = showNotification;
    window.ensureStorage = ensureStorage;
    console.log('Common.js: Functions exposed to window');
} catch (error) {
    console.error('Common.js: Error exposing functions:', error);
}

// التصدير للمنظومات التي تدعم ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addToCart,
        updateCartCount,
        showNotification,
        ensureStorage
    };
}