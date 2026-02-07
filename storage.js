// Storage Management for CYS Store

class StorageManager {
    constructor() {
        this.initStorage();
    }

    initStorage() {
        // Initialize default data if not exists
        if (!localStorage.getItem('cys_store_initialized')) {
            this.resetToDefault();
        }
        
        // Initialize admin password if not exists
        if (!localStorage.getItem('cys_admin_password')) {
            localStorage.setItem('cys_admin_password', 'admin123');
        }
    }

    resetToDefault() {
        const defaultData = {
            // Default products
            products: [
                {
                    id: 1,
                    name: 'حساب انستجرام مميز',
                    price: 150,
                    category: 'instagram',
                    description: 'حساب انستجرام مع متابعين حقيقيين',
                    details: ['المتابعين: 10,000', 'المشاركات: 50', 'عمر الحساب: 1 سنة'],
                    stock: 5,
                    image: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
                    featured: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'حساب تويتر نشط',
                    price: 200,
                    category: 'twitter',
                    description: 'حساب تويتر مع تفاعل عالي',
                    details: ['المتابعين: 5,000', 'التغريدات: 1,000', 'عمر الحساب: 6 أشهر'],
                    stock: 3,
                    image: 'https://cdn-icons-png.flaticon.com/512/733/733579.png',
                    featured: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: 'حساب فيسبوك شخصي',
                    price: 100,
                    category: 'facebook',
                    description: 'حساب فيسبوك شخصي قديم',
                    details: ['الأصدقاء: 500', 'عمر الحساب: 3 سنوات'],
                    stock: 8,
                    image: 'https://cdn-icons-png.flaticon.com/512/733/733547.png',
                    featured: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 4,
                    name: 'حساب تيك توك نشط',
                    price: 180,
                    category: 'tiktok',
                    description: 'حساب تيك توك مع متابعين ومحتوى مميز',
                    details: ['المتابعين: 15,000', 'الفيديوهات: 30', 'عمر الحساب: 8 أشهر'],
                    stock: 4,
                    image: 'https://cdn-icons-png.flaticon.com/512/3046/3046126.png',
                    featured: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 5,
                    name: 'حساب يوتيوب مميز',
                    price: 300,
                    category: 'youtube',
                    description: 'حساب يوتيوب مع مشتركين ومحتوى احترافي',
                    details: ['المشتركين: 8,000', 'الفيديوهات: 25', 'عمر الحساب: 2 سنوات'],
                    stock: 2,
                    image: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
                    featured: true,
                    createdAt: new Date().toISOString()
                }
            ],

            // Default orders
            orders: [],

            // Default coupons
            coupons: [
                {
                    id: 1,
                    code: 'WELCOME10',
                    discount: 10,
                    uses: 50,
                    used: 0,
                    minAmount: 0,
                    startDate: null,
                    endDate: null,
                    active: true
                },
                {
                    id: 2,
                    code: 'SUMMER20',
                    discount: 20,
                    uses: 30,
                    used: 5,
                    minAmount: 200,
                    startDate: null,
                    endDate: null,
                    active: true
                }
            ],

            // Default banner images
            bannerImages: [
                {
                    id: 1,
                    title: 'Instagram',
                    imageUrl: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
                    link: '#'
                },
                {
                    id: 2,
                    title: 'Twitter',
                    imageUrl: 'https://cdn-icons-png.flaticon.com/512/733/733579.png',
                    link: '#'
                },
                {
                    id: 3,
                    title: 'Facebook',
                    imageUrl: 'https://cdn-icons-png.flaticon.com/512/733/733547.png',
                    link: '#'
                },
                {
                    id: 4,
                    title: 'TikTok',
                    imageUrl: 'https://cdn-icons-png.flaticon.com/512/3046/3046126.png',
                    link: '#'
                },
                {
                    id: 5,
                    title: 'YouTube',
                    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
                    link: '#'
                },
                {
                    id: 6,
                    title: 'Snapchat',
                    imageUrl: 'https://cdn-icons-png.flaticon.com/512/2111/2111543.png',
                    link: '#'
                }
            ],

            // Store settings
            settings: {
                storeName: 'CYS Store',
                currency: 'دينار',
                maintenanceMode: false
            },

            // Cart items
            cart: []
        };

        // Save to localStorage
        Object.keys(defaultData).forEach(key => {
            localStorage.setItem(`cys_${key}`, JSON.stringify(defaultData[key]));
        });

        localStorage.setItem('cys_store_initialized', 'true');
    }

    // Products
    getProducts() {
        return JSON.parse(localStorage.getItem('cys_products') || '[]');
    }

    saveProducts(products) {
        localStorage.setItem('cys_products', JSON.stringify(products));
    }

    addProduct(product) {
        const products = this.getProducts();
        const newProduct = {
            ...product,
            id: this.generateId(products),
            createdAt: new Date().toISOString()
        };
        products.push(newProduct);
        this.saveProducts(products);
        return newProduct;
    }

    updateProduct(id, updates) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updates };
            this.saveProducts(products);
            return products[index];
        }
        return null;
    }

    deleteProduct(id) {
        const products = this.getProducts();
        const filteredProducts = products.filter(p => p.id !== id);
        this.saveProducts(filteredProducts);
        return filteredProducts;
    }

    getProduct(id) {
        const products = this.getProducts();
        return products.find(p => p.id === id);
    }

    // Orders
    getOrders() {
        return JSON.parse(localStorage.getItem('cys_orders') || '[]');
    }

    saveOrders(orders) {
        localStorage.setItem('cys_orders', JSON.stringify(orders));
    }

    getOrder(id) {
        const orders = this.getOrders();
        return orders.find(o => o.id === id);
    }

    addOrder(order) {
        const orders = this.getOrders();
        const newOrder = {
            ...order,
            id: this.generateId(orders),
            orderNumber: 'CYS-' + Date.now(),
            date: new Date().toISOString(),
            status: 'new'
        };
        orders.unshift(newOrder);
        this.saveOrders(orders);
        return newOrder;
    }

    updateOrderStatus(id, status) {
        const orders = this.getOrders();
        const index = orders.findIndex(o => o.id === id);
        if (index !== -1) {
            orders[index].status = status;
            this.saveOrders(orders);
            return orders[index];
        }
        return null;
    }

    deleteOrder(id) {
        const orders = this.getOrders();
        const filteredOrders = orders.filter(o => o.id !== id);
        this.saveOrders(filteredOrders);
        return filteredOrders;
    }

    // Coupons
    getCoupons() {
        return JSON.parse(localStorage.getItem('cys_coupons') || '[]');
    }

    saveCoupons(coupons) {
        localStorage.setItem('cys_coupons', JSON.stringify(coupons));
    }

    addCoupon(coupon) {
        const coupons = this.getCoupons();
        const newCoupon = {
            ...coupon,
            id: this.generateId(coupons),
            used: 0,
            active: true
        };
        coupons.push(newCoupon);
        this.saveCoupons(coupons);
        return newCoupon;
    }

    updateCoupon(id, updates) {
        const coupons = this.getCoupons();
        const index = coupons.findIndex(c => c.id === id);
        if (index !== -1) {
            coupons[index] = { ...coupons[index], ...updates };
            this.saveCoupons(coupons);
            return coupons[index];
        }
        return null;
    }

    deleteCoupon(id) {
        const coupons = this.getCoupons();
        const filteredCoupons = coupons.filter(c => c.id !== id);
        this.saveCoupons(filteredCoupons);
        return filteredCoupons;
    }

    validateCoupon(code, amount = 0) {
        const coupons = this.getCoupons();
        const coupon = coupons.find(c => 
            c.code === code.toUpperCase() && 
            c.active && 
            (c.uses === 0 || c.used < c.uses) &&
            (!c.minAmount || amount >= c.minAmount)
        );

        if (!coupon) return null;

        // Check date validity
        const now = new Date();
        if (coupon.startDate && new Date(coupon.startDate) > now) return null;
        if (coupon.endDate && new Date(coupon.endDate) < now) return null;

        return coupon;
    }

    useCoupon(code) {
        const coupons = this.getCoupons();
        const index = coupons.findIndex(c => c.code === code);
        if (index !== -1) {
            coupons[index].used += 1;
            if (coupons[index].uses > 0 && coupons[index].used >= coupons[index].uses) {
                coupons[index].active = false;
            }
            this.saveCoupons(coupons);
            return true;
        }
        return false;
    }

    // Banner Images
    getBannerImages() {
        return JSON.parse(localStorage.getItem('cys_bannerImages') || '[]');
    }

    saveBannerImages(images) {
        localStorage.setItem('cys_bannerImages', JSON.stringify(images));
    }

    addBannerImage(image) {
        const images = this.getBannerImages();
        const newImage = {
            ...image,
            id: this.generateId(images)
        };
        images.push(newImage);
        this.saveBannerImages(images);
        return newImage;
    }

    deleteBannerImage(id) {
        const images = this.getBannerImages();
        const filteredImages = images.filter(img => img.id !== id);
        this.saveBannerImages(filteredImages);
        return filteredImages;
    }

    // Cart
    getCart() {
        return JSON.parse(localStorage.getItem('cys_cart') || '[]');
    }

    saveCart(cart) {
        localStorage.setItem('cys_cart', JSON.stringify(cart));
    }

    addToCart(productId) {
        const cart = this.getCart();
        const product = this.getProduct(productId);
        
        if (!product) return cart;
        
        if (product.stock <= 0) {
            alert('نفذت كمية هذا المنتج');
            return cart;
        }
        
        const existingItem = cart.find(item => item.productId === productId);
        
        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                alert('لا يمكن إضافة كمية أكثر من المتاح');
                return cart;
            }
            existingItem.quantity += 1;
        } else {
            cart.push({
                productId: productId,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart(cart);
        return cart;
    }

    updateCartItem(productId, quantity) {
        const cart = this.getCart();
        const index = cart.findIndex(item => item.productId === productId);
        const product = this.getProduct(productId);
        
        if (index !== -1) {
            if (quantity <= 0) {
                cart.splice(index, 1);
            } else if (product && quantity > product.stock) {
                alert('لا يمكن إضافة كمية أكثر من المتاح');
                quantity = product.stock;
                cart[index].quantity = quantity;
            } else {
                cart[index].quantity = quantity;
            }
        }
        
        this.saveCart(cart);
        return cart;
    }

    removeFromCart(productId) {
        const cart = this.getCart();
        const filteredCart = cart.filter(item => item.productId !== productId);
        this.saveCart(filteredCart);
        return filteredCart;
    }

    clearCart() {
        localStorage.removeItem('cys_cart');
        return [];
    }

    // Settings
    getSettings() {
        return JSON.parse(localStorage.getItem('cys_settings') || '{}');
    }

    saveSettings(settings) {
        localStorage.setItem('cys_settings', JSON.stringify(settings));
    }

    updateSettings(updates) {
        const settings = this.getSettings();
        const updatedSettings = { ...settings, ...updates };
        this.saveSettings(updatedSettings);
        return updatedSettings;
    }

    // Admin
    validateAdmin(password) {
        const storedPassword = localStorage.getItem('cys_admin_password');
        // Simple comparison - in production, use proper password hashing
        return storedPassword === password;
    }

    updateAdminPassword(password) {
        localStorage.setItem('cys_admin_password', password);
        return true;
    }

    // Helper methods
    generateId(array) {
        if (array.length === 0) return 1;
        return Math.max(...array.map(item => item.id)) + 1;
    }

    // تأكد من أن دالة formatPrice تعمل بشكل صحيح
    formatPrice(price) {
        // تحقق من أن price رقم صالح
        const numPrice = parseFloat(price);
        if (isNaN(numPrice)) {
            console.warn('السعر غير صالح:', price);
            return '0 دينار';
        }
        
        // تنسيق السعر مع فواصل الآلاف
        return numPrice.toLocaleString('ar-SA') + ' دينار';
    }

    getCartTotal(couponCode = null) {
        const cart = this.getCart();
        const products = this.getProducts();
        
        let subtotal = 0;
        let items = [];
        
        cart.forEach(cartItem => {
            const product = products.find(p => p.id === cartItem.productId);
            if (product) {
                const itemTotal = product.price * cartItem.quantity;
                subtotal += itemTotal;
                items.push({
                    ...cartItem,
                    product: product,
                    total: itemTotal
                });
            }
        });

        let discount = 0;
        let discountAmount = 0;
        
        if (couponCode) {
            const coupon = this.validateCoupon(couponCode, subtotal);
            if (coupon) {
                discount = coupon.discount;
                discountAmount = (subtotal * discount) / 100;
            }
        }

        const total = subtotal - discountAmount;

        return {
            items,
            subtotal,
            discount,
            discountAmount,
            total,
            couponCode: discount > 0 ? couponCode : null
        };
    }

    getStats() {
        const products = this.getProducts();
        const orders = this.getOrders();
        const coupons = this.getCoupons();

        const totalRevenue = orders
            .filter(o => o.status === 'completed')
            .reduce((sum, order) => sum + (order.total || order.finalPrice || 0), 0);

        const recentOrders = orders.slice(0, 5);

        return {
            totalProducts: products.length,
            totalOrders: orders.length,
            totalCoupons: coupons.length,
            totalRevenue,
            recentOrders
        };
    }
}

// Create global storage instance
const storage = new StorageManager();

// اجعله متاحاً عالمياً بطرق مختلفة
window.storage = storage;
globalThis.storage = storage;

// أضف هذا أيضاً للتأكد
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageManager, storage };
}
