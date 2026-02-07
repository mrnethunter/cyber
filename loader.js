// loader.js - لضمان تحميل الملفات بالترتيب الصحيح
(function() {
    console.log('Loader: Starting script loading...');
    
    // ترتيب التحميل المطلوب
    const scriptsToLoad = [
        'js/storage.js',
        'js/common.js',
        // سيتم تحميل الباقي حسب الصفحة
    ];
    
    // تحميل الملفات بالتسلسل
    function loadScriptsSequentially(scripts, index = 0) {
        if (index >= scripts.length) {
            console.log('Loader: All required scripts loaded');
            
            // تشغيل تهيئة الصفحة بعد تحميل كل شيء
            setTimeout(() => {
                if (typeof window.storage !== 'undefined') {
                    console.log('Loader: Storage is ready, initializing page');
                    // تشغيل تهيئة الصفحة حسب نوعها
                    initializePage();
                } else {
                    console.error('Loader: Storage still not available after loading');
                }
            }, 100);
            
            return;
        }
        
        const script = document.createElement('script');
        script.src = scripts[index];
        script.onload = () => {
            console.log('Loader: Loaded', scripts[index]);
            loadScriptsSequentially(scripts, index + 1);
        };
        script.onerror = () => {
            console.error('Loader: Failed to load', scripts[index]);
            loadScriptsSequentially(scripts, index + 1); // تابع مع الباقي
        };
        
        document.head.appendChild(script);
    }
    
    function initializePage() {
        // تهيئة حسب نوع الصفحة
        if (document.querySelector('.cart-page')) {
            console.log('Loader: Initializing cart page');
            // سيتم تحميل cart.js بعد ذلك
            loadCartPage();
        } else if (document.querySelector('.index-page, .hero-section')) {
            console.log('Loader: Initializing main page');
            // سيتم تحميل main.js بعد ذلك
            loadMainPage();
        }
    }
    
    function loadCartPage() {
        const script = document.createElement('script');
        script.src = 'js/cart.js';
        script.onload = () => console.log('Loader: cart.js loaded');
        script.onerror = () => console.error('Loader: Failed to load cart.js');
        document.head.appendChild(script);
    }
    
    function loadMainPage() {
        const script = document.createElement('script');
        script.src = 'js/main.js';
        script.onload = () => console.log('Loader: main.js loaded');
        script.onerror = () => console.error('Loader: Failed to load main.js');
        document.head.appendChild(script);
    }
    
    // بدء التحميل
    loadScriptsSequentially(scriptsToLoad);
})();