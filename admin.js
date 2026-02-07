
// Admin Panel JavaScript - CSP FIXED

document.addEventListener('DOMContentLoaded', function() {
    initAdminPanel();
});

function initAdminPanel() {
    checkLogin();
    setupLogin();
    setupAdminTabs();
    setupModals();
    
    // Load dashboard if logged in
    if (sessionStorage.getItem('cys_admin_logged_in') === 'true') {
        loadDashboard();
    }
}

// Check if user is logged in
function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('cys_admin_logged_in') === 'true';
    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');
    
    if (isLoggedIn) {
        if (loginScreen) loginScreen.style.display = 'none';
        if (adminDashboard) adminDashboard.style.display = 'flex';
    } else {
        if (loginScreen) loginScreen.style.display = 'flex';
        if (adminDashboard) adminDashboard.style.display = 'none';
    }
}

// Setup login
function setupLogin() {
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // Default admin credentials
    const defaultUsername = 'admin';
    const defaultPassword = 'admin123';
    
    if (username === defaultUsername && password === defaultPassword) {
        sessionStorage.setItem('cys_admin_logged_in', 'true');
        checkLogin();
        showNotification('تم تسجيل الدخول بنجاح', 'success');
    } else {
        showNotification('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
        
        // Shake animation
        const loginForm = document.getElementById('loginForm');
        loginForm.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            loginForm.style.animation = '';
        }, 500);
    }
}

function handleLogout() {
    sessionStorage.removeItem('cys_admin_logged_in');
    checkLogin();
    showNotification('تم تسجيل الخروج بنجاح', 'success');
}

// Setup admin tabs
function setupAdminTabs() {
    const tabLinks = document.querySelectorAll('.sidebar-nav a');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active tab
            tabLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected tab
            const tabId = this.getAttribute('data-tab');
            showTab(tabId);
        });
    });
}

function showTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    const tabElement = document.getElementById(`${tabId}Tab`);
    if (tabElement) {
        tabElement.classList.add('active');
        
        // Load tab content
        switch (tabId) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'products':
                loadProductsList();
                break;
            case 'orders':
                loadOrdersList();
                break;
            case 'coupons':
                loadCouponsList();
                break;
            case 'banner':
                loadBannerImages();
                break;
            case 'settings':
                loadSettings();
                break;
        }
    }
}

// Setup modals
function setupModals() {
    // Product modal
    const productModal = document.getElementById('productModal');
    if (productModal) {
        const closeBtn = productModal.querySelector('.close-modal');
        const cancelBtn = document.getElementById('cancelProductBtn');
        const productForm = document.getElementById('productForm');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                productModal.classList.remove('active');
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                productModal.classList.remove('active');
            });
        }
        
        productModal.addEventListener('click', function(e) {
            if (e.target === productModal) {
                productModal.classList.remove('active');
            }
        });
        
        if (productForm) {
            productForm.addEventListener('submit', handleProductSubmit);
        }
    }
    
    // Coupon modal
    const couponModal = document.getElementById('couponModal');
    if (couponModal) {
        const closeBtn = couponModal.querySelector('.close-modal');
        const cancelBtn = document.getElementById('cancelCouponBtn');
        const couponForm = document.getElementById('couponForm');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                couponModal.classList.remove('active');
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                couponModal.classList.remove('active');
            });
        }
        
        couponModal.addEventListener('click', function(e) {
            if (e.target === couponModal) {
                couponModal.classList.remove('active');
            }
        });
        
        if (couponForm) {
            couponForm.addEventListener('submit', handleCouponSubmit);
        }
    }
    
    // Order details modal
    const orderModal = document.getElementById('orderDetailsModal');
    if (orderModal) {
        const closeBtn = orderModal.querySelector('.close-modal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                orderModal.classList.remove('active');
            });
        }
        
        orderModal.addEventListener('click', function(e) {
            if (e.target === orderModal) {
                orderModal.classList.remove('active');
            }
        });
    }
    
    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            openProductModal();
        });
    }
    
    // Add coupon button
    const addCouponBtn = document.getElementById('addCouponBtn');
    if (addCouponBtn) {
        addCouponBtn.addEventListener('click', function() {
            openCouponModal();
        });
    }
    
    // Add banner image button
    const addBannerImageBtn = document.getElementById('addBannerImageBtn');
    if (addBannerImageBtn) {
        addBannerImageBtn.addEventListener('click', function() {
            document.getElementById('bannerForm').reset();
        });
    }
    
    // Banner form
    const bannerForm = document.getElementById('bannerForm');
    if (bannerForm) {
        bannerForm.addEventListener('submit', handleBannerSubmit);
    }
    
    // Settings form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsSubmit);
    }
    
    // Order status filter
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', loadOrdersList);
    }
}

// Dashboard
function loadDashboard() {
    const stats = storage.getStats();
    
    // Update stats
    const totalProductsEl = document.getElementById('totalProducts');
    const totalOrdersEl = document.getElementById('totalOrders');
    const totalCouponsEl = document.getElementById('totalCoupons');
    const totalRevenueEl = document.getElementById('totalRevenue');
    
    if (totalProductsEl) totalProductsEl.textContent = stats.totalProducts;
    if (totalOrdersEl) totalOrdersEl.textContent = stats.totalOrders;
    if (totalCouponsEl) totalCouponsEl.textContent = stats.totalCoupons;
    
    // التأكد من عرض الإيرادات بعد الخصم
    if (totalRevenueEl) totalRevenueEl.textContent = storage.formatPrice(stats.totalRevenue);
    
    // Update orders badge
    const newOrders = stats.recentOrders.filter(order => order.status === 'new').length;
    const ordersBadge = document.getElementById('ordersBadge');
    if (ordersBadge) {
        ordersBadge.textContent = newOrders;
        ordersBadge.style.display = newOrders > 0 ? 'inline-block' : 'none';
    }
    
    // Load recent orders
    loadRecentOrders(stats.recentOrders);
}

function loadRecentOrders(orders) {
    const container = document.getElementById('recentOrders');
    if (!container) return;
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-shopping-cart"></i>
                <p>لا توجد طلبات بعد</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = orders.map(order => {
        const statusText = getStatusText(order.status);
        const statusClass = `status-${order.status}`;
        
        return `
            <div class="order-item">
                <div class="order-info">
                    <div class="order-id">طلب #${order.orderNumber}</div>
                    <div class="order-customer">${order.customerName} - ${order.customerPhone}</div>
                    <div class="order-date">${formatDate(order.date)}</div>
                </div>
                <div class="order-total">${storage.formatPrice(order.finalPrice || order.total)}</div>
                <div class="order-status ${statusClass}">${statusText}</div>
                <button class="btn-edit view-order-btn" data-order-id="${order.id}">
                    <i class="fas fa-eye"></i> عرض
                </button>
            </div>
        `;
    }).join('');
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = parseInt(this.getAttribute('data-order-id'));
            showOrderDetails(orderId);
        });
    });
}

// Products Management
function loadProductsList() {
    const container = document.getElementById('adminProductsList');
    if (!container) return;
    
    const products = storage.getProducts();
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <i class="fas fa-box-open"></i>
                <h3>لا توجد منتجات</h3>
                <p>ابدأ بإضافة منتجات جديدة</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => {
        const categoryName = getCategoryName(product.category);
        
        // Stock status
        let stockClass = 'stock-available';
        let stockText = `الكمية: ${product.stock}`;
        if (product.stock > 10) {
            stockClass = 'stock-available';
        } else if (product.stock > 0) {
            stockClass = 'stock-low';
        } else {
            stockClass = 'stock-out';
        }
        
        // Product details
        let detailsHtml = '';
        if (product.details && product.details.length > 0) {
            detailsHtml = `
                <div class="product-features">
                    ${product.details.map(detail => `
                        <span class="feature-tag">${detail}</span>
                    `).join('')}
                </div>
            `;
        }
        
        return `
            <div class="admin-product-card">
                <div class="product-card-header">
                    <div>
                        <h4 class="product-name">${product.name}</h4>
                        <span class="product-category">${categoryName}</span>
                    </div>
                    <div class="product-price">${storage.formatPrice(product.price)}</div>
                </div>
                
                <p class="product-details">${product.description}</p>
                
                <div class="product-stock ${stockClass}">
                    <i class="fas fa-box"></i>
                    ${stockText}
                </div>
                
                ${detailsHtml}
                
                <div class="product-actions">
                    <button class="btn-edit edit-product-btn" data-product-id="${product.id}">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button class="btn-delete delete-product-btn" data-product-id="${product.id}">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Add event listeners
    document.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            editProduct(productId);
        });
    });
    
    document.querySelectorAll('.delete-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            deleteProduct(productId);
        });
    });
}

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('productModalTitle');
    const productForm = document.getElementById('productForm');
    
    if (!modal || !productForm) return;
    
    // Reset form
    productForm.reset();
    document.getElementById('editProductId').value = '';
    
    if (productId) {
        // Edit mode
        const product = storage.getProduct(productId);
        if (!product) return;
        
        modalTitle.textContent = 'تعديل المنتج';
        document.getElementById('editProductId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productDetails').value = product.details ? product.details.join('\n') : '';
        document.getElementById('productImage').value = product.image || '';
        document.getElementById('productFeatured').checked = product.featured || false;
    } else {
        // Add mode
        modalTitle.textContent = 'إضافة منتج جديد';
    }
    
    modal.classList.add('active');
}

function editProduct(productId) {
    openProductModal(productId);
}

async function handleProductSubmit(e) {
    e.preventDefault();
    
    const productId = document.getElementById('editProductId').value;
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const stock = parseInt(document.getElementById('productStock').value);
    const description = document.getElementById('productDescription').value.trim();
    const details = document.getElementById('productDetails').value
        .split('\n')
        .map(d => d.trim())
        .filter(d => d);
    const image = document.getElementById('productImage').value.trim();
    const featured = document.getElementById('productFeatured').checked;
    
    const productData = {
        name,
        price,
        category,
        stock,
        description,
        details,
        image: image || null,
        featured
    };
    
    if (productId) {
        // Update existing product
        storage.updateProduct(parseInt(productId), productData);
        showNotification('تم تحديث المنتج بنجاح', 'success');
    } else {
        // Add new product
        storage.addProduct(productData);
        showNotification('تم إضافة المنتج بنجاح', 'success');
    }
    
    // Close modal
    document.getElementById('productModal').classList.remove('active');
    
    // Reload products list
    loadProductsList();
    loadDashboard();
}

async function deleteProduct(productId) {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    
    storage.deleteProduct(productId);
    showNotification('تم حذف المنتج بنجاح', 'success');
    
    // Reload products list
    loadProductsList();
    loadDashboard();
}

// Orders Management
function loadOrdersList() {
    const container = document.getElementById('adminOrdersList');
    const statusFilter = document.getElementById('orderStatusFilter');
    
    if (!container) return;
    
    let orders = storage.getOrders();
    
    // Filter by status
    const status = statusFilter ? statusFilter.value : 'all';
    if (status !== 'all') {
        orders = orders.filter(order => order.status === status);
    }
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-shopping-cart"></i>
                <h3>لا توجد طلبات</h3>
                <p>لا توجد طلبات ${status !== 'all' ? `بحالة ${getStatusText(status)}` : ''}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = orders.map(order => {
        const statusText = getStatusText(order.status);
        const statusClass = `status-${order.status}`;
        
        // Check if this is a bulk order
        const isBulkOrder = order.bulk || order.orderType === 'bulk';
        const productName = isBulkOrder ? 
            `طلب متعدد (${order.items ? order.items.length : 0} منتجات)` : 
            order.productName;
        
        return `
            <div class="order-item ${isBulkOrder ? 'bulk-order' : ''}">
                <div class="order-info">
                    <div class="order-id">طلب #${order.orderNumber} ${isBulkOrder ? '<span class="bulk-badge">متعدد</span>' : ''}</div>
                    <div class="order-customer">${order.customerName}</div>
                    <div class="order-details">
                        <span><i class="fas fa-phone"></i> ${order.customerPhone}</span>
                        <span><i class="fas fa-box"></i> ${productName}</span>
                    </div>
                    <div class="order-date">${formatDate(order.date)}</div>
                </div>
                <div class="order-total">${storage.formatPrice(order.finalPrice || order.total)}</div>
                <div class="order-status ${statusClass}">${statusText}</div>
                <div class="order-actions">
                    <button class="btn-edit view-order-btn" data-order-id="${order.id}">
                        <i class="fas fa-eye"></i> تفاصيل
                    </button>
                    <button class="btn-status ${statusClass}" data-order-id="${order.id}" data-current-status="${order.status}">
                        <i class="fas fa-sync"></i> تغيير
                    </button>
                    <button class="btn-delete delete-order-btn" data-order-id="${order.id}">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Add event listeners
    document.querySelectorAll('.view-order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = parseInt(this.getAttribute('data-order-id'));
            showOrderDetails(orderId);
        });
    });
    
    document.querySelectorAll('.btn-status').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = parseInt(this.getAttribute('data-order-id'));
            const currentStatus = this.getAttribute('data-current-status');
            updateOrderStatus(orderId, currentStatus);
        });
    });
    
    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = parseInt(this.getAttribute('data-order-id'));
            deleteOrder(orderId);
        });
    });
}

function showOrderDetails(orderId) {
    const modal = document.getElementById('orderDetailsModal');
    const order = storage.getOrder(orderId);
    
    if (!modal || !order) return;
    
    document.getElementById('orderId').textContent = order.orderNumber;
    
    const content = document.getElementById('orderDetailsContent');
    const statusText = getStatusText(order.status);
    const statusClass = `status-${order.status}`;
    
    // Check if this is a bulk order
    const isBulkOrder = order.bulk || order.orderType === 'bulk';
    
    // Build order details HTML based on order type
    let orderItemsHtml = '';
    
    if (isBulkOrder && order.items && order.items.length > 0) {
        // Display all items in bulk order
        orderItemsHtml = `
            <div class="order-info-section">
                <h4><i class="fas fa-boxes"></i> المنتجات المطلوبة</h4>
                <div class="bulk-items-list">
                    ${order.items.map(item => `
                        <div class="bulk-item">
                            <div class="bulk-item-name">
                                <i class="fas fa-cube"></i>
                                ${item.productName}
                            </div>
                            <div class="bulk-item-details">
                                <span>السعر: ${storage.formatPrice(item.productPrice)}</span>
                                <span>الكمية: ${item.quantity}</span>
                                <span>المجموع: ${storage.formatPrice(item.total || item.productPrice * item.quantity)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        // Display single product order
        orderItemsHtml = `
            <div class="order-info-section">
                <h4><i class="fas fa-box"></i> معلومات المنتج</h4>
                <div class="order-detail">
                    <span>المنتج:</span>
                    <span>${order.productName}</span>
                </div>
                <div class="order-detail">
                    <span>الكمية:</span>
                    <span>${order.quantity}</span>
                </div>
                <div class="order-detail">
                    <span>السعر:</span>
                    <span>${storage.formatPrice(order.productPrice)}</span>
                </div>
            </div>
        `;
    }
    
    content.innerHTML = `
        <div class="order-info-section">
            <h4><i class="fas fa-user"></i> معلومات العميل</h4>
            <div class="order-detail">
                <span>الاسم:</span>
                <span>${order.customerName}</span>
            </div>
            <div class="order-detail">
                <span>رقم الهاتف:</span>
                <span>${order.customerPhone}</span>
            </div>
            <div class="order-detail">
                <span>البريد الإلكتروني:</span>
                <span>${order.customerEmail}</span>
            </div>
            <div class="order-detail">
                <span>حساب الانستجرام:</span>
                <span>${order.instagramUser}</span>
            </div>
        </div>
        
        ${orderItemsHtml}
        
        <div class="order-info-section">
            <h4><i class="fas fa-receipt"></i> معلومات الدفع</h4>
            <div class="order-detail">
                <span>نوع الطلب:</span>
                <span>${isBulkOrder ? 'طلب متعدد' : 'طلب عادي'}</span>
            </div>
            <div class="order-detail">
                <span>عدد المنتجات:</span>
                <span>${isBulkOrder ? order.items.length : 1}</span>
            </div>
            <div class="order-detail">
                <span>إجمالي الكمية:</span>
                <span>${order.quantity}</span>
            </div>
            <div class="order-detail">
                <span>كود الخصم:</span>
                <span>${order.couponCode}</span>
            </div>
            <div class="order-detail">
                <span>نسبة الخصم:</span>
                <span>${order.discount}%</span>
            </div>
            <div class="order-detail">
                <span>قيمة الخصم:</span>
                <span>${storage.formatPrice(order.discountAmount || 0)}</span>
            </div>
            <div class="order-detail">
                <span>المبلغ الإجمالي:</span>
                <span>${storage.formatPrice(order.finalPrice || order.total)}</span>
            </div>
            <div class="order-detail">
                <span>تاريخ الطلب:</span>
                <span>${formatDate(order.date)}</span>
            </div>
            <div class="order-detail">
                <span>حالة الطلب:</span>
                <span class="${statusClass}">${statusText}</span>
            </div>
        </div>
        
        <div class="order-status-controls">
            <button class="btn-status btn-status-new" data-order-id="${order.id}" data-status="new">
                <i class="fas fa-clock"></i> جديد
            </button>
            <button class="btn-status btn-status-processing" data-order-id="${order.id}" data-status="processing">
                <i class="fas fa-cog"></i> قيد المعالجة
            </button>
            <button class="btn-status btn-status-completed" data-order-id="${order.id}" data-status="completed">
                <i class="fas fa-check"></i> مكتمل
            </button>
            <button class="btn-status btn-status-cancelled" data-order-id="${order.id}" data-status="cancelled">
                <i class="fas fa-times"></i> ملغي
            </button>
        </div>
        
        <div class="order-danger-zone">
            <button class="btn-danger delete-order-full-btn" data-order-id="${order.id}">
                <i class="fas fa-trash"></i> حذف الطلب نهائياً
            </button>
            <small class="text-danger">تحذير: هذا الإجراء لا يمكن التراجع عنه</small>
        </div>
    `;
    
    // Add event listeners to status buttons
    content.querySelectorAll('.btn-status').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = parseInt(this.getAttribute('data-order-id'));
            const status = this.getAttribute('data-status');
            updateOrderStatus(orderId, status);
        });
    });
    
    // Add event listener for delete button in order details
    content.querySelectorAll('.delete-order-full-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = parseInt(this.getAttribute('data-order-id'));
            const modal = document.getElementById('orderDetailsModal');
            modal.classList.remove('active');
            deleteOrder(orderId);
        });
    });
    
    modal.classList.add('active');
}

function updateOrderStatus(orderId, status) {
    storage.updateOrderStatus(orderId, status);
    showNotification(`تم تحديث حالة الطلب إلى "${getStatusText(status)}"`, 'success');
    
    // Reload orders list
    loadOrdersList();
    loadDashboard();
    
    // Close order details modal if open
    const orderModal = document.getElementById('orderDetailsModal');
    if (orderModal && orderModal.classList.contains('active')) {
        orderModal.classList.remove('active');
    }
}

// دالة حذف الطلب
async function deleteOrder(orderId) {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟ هذا الإجراء لا يمكن التراجع عنه.')) {
        return;
    }
    
    // يمكنك إضافة تحقق إضافي هنا إذا أردت
    const order = storage.getOrder(orderId);
    if (!order) {
        showNotification('الطلب غير موجود', 'error');
        return;
    }
    
    // تأكيد إضافي إذا كان الطلب مكتملاً
    if (order.status === 'completed') {
        if (!confirm('هذا الطلب مكتمل. هل تريد حذفه رغم ذلك؟')) {
            return;
        }
    }
    
    try {
        storage.deleteOrder(orderId);
        showNotification('تم حذف الطلب بنجاح', 'success');
        
        // إعادة تحميل قائمة الطلبات
        loadOrdersList();
        loadDashboard(); // لتحديث الإحصائيات
    } catch (error) {
        console.error('Error deleting order:', error);
        showNotification('حدث خطأ أثناء حذف الطلب', 'error');
    }
}

// Coupons Management
function loadCouponsList() {
    const container = document.getElementById('couponsList');
    if (!container) return;
    
    const coupons = storage.getCoupons();
    
    if (coupons.length === 0) {
        container.innerHTML = `
            <div class="no-coupons">
                <i class="fas fa-tag"></i>
                <h3>لا توجد كوبونات</h3>
                <p>ابدأ بإضافة كوبونات جديدة</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = coupons.map(coupon => {
        const isActive = coupon.active ? 'نشط' : 'غير نشط';
        const activeClass = coupon.active ? 'text-success' : 'text-danger';
        
        let dateRange = 'بدون تاريخ محدد';
        if (coupon.startDate || coupon.endDate) {
            const start = coupon.startDate ? formatDate(coupon.startDate, true) : 'بدون تاريخ بدء';
            const end = coupon.endDate ? formatDate(coupon.endDate, true) : 'بدون تاريخ نهاية';
            dateRange = `${start} - ${end}`;
        }
        
        return `
            <div class="coupon-card">
                <div class="coupon-code">${coupon.code}</div>
                <div class="coupon-discount">${coupon.discount}%</div>
                
                <div class="coupon-details">
                    <div class="coupon-detail">
                        <span>الاستخدامات:</span>
                        <span>${coupon.used}/${coupon.uses || '∞'}</span>
                    </div>
                    ${coupon.minAmount > 0 ? `
                        <div class="coupon-detail">
                            <span>أقل مبلغ:</span>
                            <span>${storage.formatPrice(coupon.minAmount)}</span>
                        </div>
                    ` : ''}
                    <div class="coupon-detail">
                        <span>الفترة:</span>
                        <span>${dateRange}</span>
                    </div>
                    <div class="coupon-detail">
                        <span>الحالة:</span>
                        <span class="${activeClass}">
                            ${isActive}
                        </span>
                    </div>
                </div>
                
                <div class="coupon-uses">
                    <i class="fas fa-info-circle"></i>
                    ${coupon.active ? 'جاهز للاستخدام' : 'منتهي الصلاحية أو غير نشط'}
                </div>
                
                <div class="coupon-actions">
                    <button class="btn-edit edit-coupon-btn" data-coupon-id="${coupon.id}">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button class="btn-delete delete-coupon-btn" data-coupon-id="${coupon.id}">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Add event listeners
    document.querySelectorAll('.edit-coupon-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const couponId = parseInt(this.getAttribute('data-coupon-id'));
            editCoupon(couponId);
        });
    });
    
    document.querySelectorAll('.delete-coupon-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const couponId = parseInt(this.getAttribute('data-coupon-id'));
            deleteCoupon(couponId);
        });
    });
}

function openCouponModal(couponId = null) {
    const modal = document.getElementById('couponModal');
    const modalTitle = document.getElementById('couponModalTitle');
    const couponForm = document.getElementById('couponForm');
    
    if (!modal || !couponForm) return;
    
    // Reset form
    couponForm.reset();
    document.getElementById('editCouponId').value = '';
    
    if (couponId) {
        // Edit mode
        const coupon = storage.getCoupons().find(c => c.id === couponId);
        if (!coupon) return;
        
        modalTitle.textContent = 'تعديل الكوبون';
        document.getElementById('editCouponId').value = coupon.id;
        document.getElementById('couponCode').value = coupon.code;
        document.getElementById('couponDiscount').value = coupon.discount;
        document.getElementById('couponUses').value = coupon.uses || '';
        document.getElementById('couponMinAmount').value = coupon.minAmount || '';
        
        if (coupon.startDate) {
            document.getElementById('couponStartDate').value = coupon.startDate.split('T')[0];
        }
        if (coupon.endDate) {
            document.getElementById('couponEndDate').value = coupon.endDate.split('T')[0];
        }
    } else {
        // Add mode
        modalTitle.textContent = 'إضافة كوبون جديد';
    }
    
    modal.classList.add('active');
}

function editCoupon(couponId) {
    openCouponModal(couponId);
}

async function handleCouponSubmit(e) {
    e.preventDefault();
    
    const couponId = document.getElementById('editCouponId').value;
    const code = document.getElementById('couponCode').value.trim().toUpperCase();
    const discount = parseInt(document.getElementById('couponDiscount').value);
    const uses = parseInt(document.getElementById('couponUses').value) || 0;
    const minAmount = parseFloat(document.getElementById('couponMinAmount').value) || 0;
    const startDate = document.getElementById('couponStartDate').value || null;
    const endDate = document.getElementById('couponEndDate').value || null;
    
    const couponData = {
        code,
        discount,
        uses,
        minAmount,
        startDate,
        endDate,
        active: true
    };
    
    if (couponId) {
        // Update existing coupon
        storage.updateCoupon(parseInt(couponId), couponData);
        showNotification('تم تحديث الكوبون بنجاح', 'success');
    } else {
        // Add new coupon
        storage.addCoupon(couponData);
        showNotification('تم إضافة الكوبون بنجاح', 'success');
    }
    
    // Close modal
    document.getElementById('couponModal').classList.remove('active');
    
    // Reload coupons list
    loadCouponsList();
    loadDashboard();
}

async function deleteCoupon(couponId) {
    if (!confirm('هل أنت متأكد من حذف هذا الكوبون؟')) return;
    
    storage.deleteCoupon(couponId);
    showNotification('تم حذف الكوبون بنجاح', 'success');
    
    // Reload coupons list
    loadCouponsList();
    loadDashboard();
}

// Banner Images Management
function loadBannerImages() {
    const container = document.getElementById('bannerImages');
    if (!container) return;
    
    const images = storage.getBannerImages();
    
    if (images.length === 0) {
        container.innerHTML = `
            <div class="no-images">
                <i class="fas fa-images"></i>
                <p>لا توجد صور في الشريط</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = images.map(image => {
        return `
            <div class="banner-image-item">
                <img src="${image.imageUrl}" alt="${image.title}" 
                     onerror="this.src='https://cdn-icons-png.flaticon.com/512/3588/3588658.png'">
                <div class="banner-image-overlay">
                    <button class="remove-banner-btn" data-image-id="${image.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="banner-image-title">${image.title}</div>
            </div>
        `;
    }).join('');
    
    // Add event listeners
    document.querySelectorAll('.remove-banner-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const imageId = parseInt(this.getAttribute('data-image-id'));
            deleteBannerImage(imageId);
        });
    });
}

async function handleBannerSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('bannerTitle').value.trim();
    const imageUrl = document.getElementById('bannerImageUrl').value.trim();
    
    if (!title || !imageUrl) {
        showNotification('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    const bannerData = {
        title,
        imageUrl,
        link: '#'
    };
    
    storage.addBannerImage(bannerData);
    showNotification('تم إضافة الصورة إلى الشريط بنجاح', 'success');
    
    // Reset form
    document.getElementById('bannerForm').reset();
    
    // Reload banner images
    loadBannerImages();
}

async function deleteBannerImage(imageId) {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;
    
    storage.deleteBannerImage(imageId);
    showNotification('تم حذف الصورة بنجاح', 'success');
    
    // Reload banner images
    loadBannerImages();
}

// Settings Management
function loadSettings() {
    const settings = storage.getSettings();
    
    document.getElementById('storeName').value = settings.storeName || 'CYS Store';
    document.getElementById('storeCurrency').value = settings.currency || 'دينار';
    document.getElementById('maintenanceMode').checked = settings.maintenanceMode || false;
}

async function handleSettingsSubmit(e) {
    e.preventDefault();
    
    const storeName = document.getElementById('storeName').value;
    const newPassword = document.getElementById('newAdminPassword').value;
    const currency = document.getElementById('storeCurrency').value;
    const maintenanceMode = document.getElementById('maintenanceMode').checked;
    
    // Update settings
    storage.updateSettings({
        storeName,
        currency,
        maintenanceMode
    });
    
    // Update admin password if provided
    if (newPassword) {
        storage.updateAdminPassword(newPassword);
        document.getElementById('newAdminPassword').value = '';
    }
    
    showNotification('تم حفظ الإعدادات بنجاح', 'success');
}

// Helper functions
function getStatusText(status) {
    const statuses = {
        'new': 'جديد',
        'processing': 'قيد المعالجة',
        'completed': 'مكتمل',
        'cancelled': 'ملغي'
    };
    return statuses[status] || status;
}

function formatDate(dateString, dateOnly = false) {
    const date = new Date(dateString);
    if (dateOnly) {
        return date.toLocaleDateString('ar-SA');
    }
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

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

// Add shake animation for login
if (!document.querySelector('#shake-animation')) {
    const style = document.createElement('style');
    style.id = 'shake-animation';
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}

// Make functions available globally
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.showOrderDetails = showOrderDetails;
window.updateOrderStatus = updateOrderStatus;
window.editCoupon = editCoupon;
window.deleteCoupon = deleteCoupon;
window.deleteBannerImage = deleteBannerImage;
window.deleteOrder = deleteOrder;
