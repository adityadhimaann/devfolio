// Custom script to manage sticky header and safe scrolling for local static preview
(function () {
    'use strict';

    function initPreloader() {
        var preloader = document.getElementById('adi-preloader');
        if (!preloader) return;

        var statusLabel = document.getElementById('adiPreloaderStatus');
        var startTime = Date.now();
        var duration = 2600;

        var interval = setInterval(function () {
            var elapsed = Date.now() - startTime;
            var pct = Math.min(100, Math.floor((elapsed / duration) * 100));
            if (statusLabel) {
                statusLabel.textContent = pct >= 100 ? 'READY' : 'BUILDING ' + pct + '%';
            }
            if (pct >= 100) clearInterval(interval);
        }, 40);

        function dismiss() {
            clearInterval(interval);
            preloader.classList.add('fade-out');
            setTimeout(function () {
                preloader.style.display = 'none';
                // Re-calculate and refresh scroll triggers & animations once preloader clears
                                // Init Lenis if it exists
                if (typeof Lenis !== "undefined" && !window.lenisInstance) {
                    window.lenisInstance = new Lenis({
                        duration: 1.2,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                        direction: "vertical", 
                        gestureDirection: "vertical",
                        smooth: true,
                        mouseMultiplier: 1,
                        smoothTouch: false,
                        touchMultiplier: 2,
                        infinite: false,
                    });
                    
                    function raf(time) {
                        window.lenisInstance.raf(time);
                        requestAnimationFrame(raf);
                    }
                    requestAnimationFrame(raf);
                }
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
                if (typeof WOW !== 'undefined') {
                    new WOW().init();
                }
                window.dispatchEvent(new Event('resize'));
                window.dispatchEvent(new Event('scroll'));
            }, 800);
        }

        // Auto dismiss after animation finishes
        setTimeout(dismiss, 3200);

        var skipBtn = document.getElementById('adiSkipBtn');
        if (skipBtn) {
            skipBtn.addEventListener('click', dismiss);
        }
    }

    function initStickyHeader() {
        var stickyHeader = document.querySelector('#pxl-header-elementor .pxl-header-elementor-sticky');
        if (!stickyHeader) return;

        function updateHeader() {
            if (window.scrollY > 150) {
                stickyHeader.classList.add('is-scrolled');
            } else {
                stickyHeader.classList.remove('is-scrolled');
            }
        }

        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    }

    function initOffcanvasScrollFix() {
        var popup = document.getElementById('pxl-hidden-panel-popup');
        if (!popup) return;

        var content = popup.querySelector('.pxl-item--conent');
        if (!content) return;

        popup.setAttribute('data-lenis-prevent', '');
        content.setAttribute('data-lenis-prevent', '');

        // Observe class changes on popup to pause/resume Lenis
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'class') {
                    var isActive = popup.classList.contains('active');
                    if (window.lenisInstance) {
                        if (isActive) {
                            window.lenisInstance.stop();
                        } else {
                            window.lenisInstance.start();
                        }
                    }
                }
            });
        });
        observer.observe(popup, { attributes: true });

        // Wheel event direct handler to guarantee smooth scroll inside drawer
        content.addEventListener('wheel', function (e) {
            e.stopPropagation();
            content.scrollTop += e.deltaY;
            e.preventDefault();
        }, { passive: false });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initPreloader();
            initStickyHeader();
            initOffcanvasScrollFix();
        });
    } else {
        initPreloader();
        initStickyHeader();
        initOffcanvasScrollFix();
    }
})();
