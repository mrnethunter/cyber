// fix-all.js - إصلاح شامل لكل المشاكل

// إصلاح 1: دالة openPurchaseModal
function openPurchaseModal(productId) {
    console.log('openPurchaseModal called with productId:', productId);
    
    // البحث عن المودال
    let modal = document.getElementById('purchaseModal');
    
    // إذا لم يوجد المودال، إنشاؤه
    if (!modal) {
        createPurchaseModal();
        modal = document.getElementById('purchaseModal');
    }
    
    const product = storage.getProduct(productId);
    
    if (!modal || !product) {
        console.error('Modal or product not found');
        return;
    }
    
    // إعادة تعيين النموذج
    const form = document.getElementById('purchaseForm');
    if (form) form.reset();
    
    // تعيين بيانات المنتج
    const productIdInput = document.getElementById('productId');
    if (productIdInput) productIdInput.value = productId;
    
    // تحديث السعر
    updatePriceDisplay(product.price, 0);
    
    // إظهار المودال
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// إنشاء المودال إذا لم يكن موجوداً
function createPurchaseModal() {
    const modalHTML = `
        <div class="modal-overlay" id="purchaseModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>إكمال عملية الشراء</h3>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <form id="purchaseForm" class="purchase-form">
                    <input type="hidden" id="productId">
                    
                    <div class="form-group">
                        <label for="customerName"><i class="fas fa-user"></i> الاسم الكامل *</label>
                        <input type="text" id="customerName" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="customerPhone"><i class="fas fa-phone"></i> رقم الهاتف *</label>
                        <input type="tel" id="customerPhone" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="customerEmail"><i class="fas fa-envelope"></i> البريد الإلكتروني *</label>
                        <input type="email" id="customerEmail" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="instagramUser"><i class="fab fa-instagram"></i> حساب الانستجرام (اختياري)</label>
                        <input type="text" id="instagramUser" placeholder="@username">
                    </div>
                    
                    <div class="form-group">
                        <label for="couponCode"><i class="fas fa-tag"></i> كود الخصم</label>
                        <div class="coupon-input">
                            <input type="text" id="couponCode" placeholder="أدخل كود الخصم">
                            <button type="button" id="applyCoupon" class="btn-coupon">تطبيق</button>
                        </div>
                        <div class="coupon-feedback" id="couponFeedback"></div>
                    </div>
                    
                    <div class="order-summary">
                        <div class="summary-item">
                            <span>السعر الأصلي:</span>
                            <span id="originalPrice">0 دينار</span>
                        </div>
                        <div class="summary-item">
                            <span>الخصم:</span>
                            <span id="discountAmount">0 دينار</span>
                        </div>
                        <div class="summary-item total">
                            <span>المجموع:</span>
                            <span id="finalPrice">0 دينار</span>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block">
                        <i class="fas fa-shopping-cart"></i> تأكيد الطلب
                    </button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // إضافة الأحداث
    const modal = document.getElementById('purchaseModal');
    const closeBtn = modal.querySelector('.close-modal');
    const form = document.getElementById('purchaseForm');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    form.addEventListener('submit', handlePurchase);
    
    // إضافة حدث للكوبون
    const applyCouponBtn = document.getElementById('applyCoupon');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', applyCoupon);
    }
}

// دالة تحديث السعر
function updatePriceDisplay(originalPrice, discountAmount) {
    const finalPrice = originalPrice - discountAmount;
    
    const originalPriceEl = document.getElementById('originalPrice');
    const discountAmountEl = document.getElementById('discountAmount');
    const finalPriceEl = document.getElementById('finalPrice');
    
    if (originalPriceEl) originalPriceEl.textContent = `${originalPrice} دينار`;
    if (discountAmountEl) discountAmountEl.textContent = `${discountAmount} دينار`;
    if (finalPriceEl) finalPriceEl.textContent = `${finalPrice} دينار`;
}

// دالة تطبيق الكوبون
function applyCoupon() {
    const couponCode = document.getElementById('couponCode').value;
    const productId = document.getElementById('productId').value;
    
    if (!couponCode || !productId) return;
    
    const product = storage.getProduct(parseInt(productId));
    const coupon = storage.validateCoupon(couponCode, product.price);
    const feedback = document.getElementById('couponFeedback');
    
    if (coupon) {
        const discountAmount = (product.price * coupon.discount) / 100;
        updatePriceDisplay(product.price, discountAmount);
        feedback.textContent = `✅ تم تطبيق خصم ${coupon.discount}%`;
        feedback.className = 'coupon-feedback success';
    } else {
        updatePriceDisplay(product.price, 0);
        feedback.textContent = '❌ كود الخصم غير صالح';
        feedback.className = 'coupon-feedback error';
    }
}

// دالة معالجة الشراء
function handlePurchase(e) {
    e.preventDefault();
    
    const productId = parseInt(document.getElementById('productId').value);
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const instagramUser = document.getElementById('instagramUser').value;
    const couponCode = document.getElementById('couponCode').value;
    
    const product = storage.getProduct(productId);
    
    if (!product) {
        alert('المنتج غير موجود');
        return;
    }
    
    // حساب الخصم
    let discount = 0;
    if (couponCode) {
        const coupon = storage.validateCoupon(couponCode, product.price);
        if (coupon) discount = coupon.discount;
    }
    
    const finalPrice = product.price - (product.price * discount / 100);
    
    // إنشاء الطلب
    const order = {
        productId: productId,
        productName: product.name,
        productPrice: product.price,
        customerName,
        customerPhone,
        customerEmail,
        instagramUser,
        couponCode,
        discount,
        finalPrice,
        quantity: 1
    };
    
    // حفظ الطلب
    storage.addOrder(order);
    
    // تحديث المخزون
    storage.updateProduct(productId, {
        stock: product.stock - 1
    });
    
    // إغلاق المودال
    document.getElementById('purchaseModal').classList.remove('active');
    document.body.style.overflow = '';
    
    // رسالة النجاح
    alert(`✅ تم تأكيد طلبك بنجاح!\nسيتم التواصل معك قريباً.`);
    
    // إعادة تعيين النموذج
    document.getElementById('purchaseForm').reset();
}

// إضافة CSS للمودال
const modalCSS = `
<style>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
}

.modal-overlay.active {
    opacity: 1;
    visibility: visible;
}

.modal-content {
    background: #1a1a1a;
    border-radius: 15px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    transform: translateY(20px);
    transition: transform 0.3s;
}

.modal-overlay.active .modal-content {
    transform: translateY(0);
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    color: white;
}

.close-modal {
    background: none;
    border: none;
    color: #aaa;
    font-size: 1.5rem;
    cursor: pointer;
}

.purchase-form {
    padding: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: white;
}

.form-group input {
    width: 100%;
    padding: 12px;
    background: #2d2d2d;
    border: 1px solid #444;
    border-radius: 8px;
    color: white;
    font-size: 1rem;
}

.coupon-input {
    display: flex;
    gap: 10px;
}

.btn-coupon {
    background: #9216A8;
    color: white;
    border: none;
    padding: 0 20px;
    border-radius: 8px;
    cursor: pointer;
}

.coupon-feedback {
    margin-top: 10px;
    padding: 10px;
    border-radius: 5px;
}

.coupon-feedback.success {
    background: rgba(76, 175, 80, 0.1);
    color: #4CAF50;
    border: 1px solid #4CAF50;
}

.coupon-feedback.error {
    background: rgba(244, 67, 54, 0.1);
    color: #F44336;
    border: 1px solid #F44336;
}

.order-summary {
    background: #2d2d2d;
    padding: 20px;
    border-radius: 10px;
    margin: 20px 0;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.summary-item.total {
    font-weight: bold;
    font-size: 1.2rem;
    color: #9216A8;
    border-top: 1px solid #444;
    padding-top: 10px;
    margin-top: 10px;
}

.btn {
    display: inline-block;
    background: linear-gradient(45deg, #9216A8, #b145cc);
    color: white;
    padding: 15px 30px;
    border-radius: 30px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;
    width: 100%;
}

.btn-block {
    display: block;
    width: 100%;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', modalCSS);

// جعل الدوال متاحة عالمياً
window.openPurchaseModal = openPurchaseModal;
window.applyCoupon = applyCoupon;
window.handlePurchase = handlePurchase;

console.log('✅ جميع الإصلاحات تم تحميلها بنجاح');