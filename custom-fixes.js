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

    function initNoLinkActivityFix() {
        document.querySelectorAll('.no-link-activity').forEach(function (el) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
        });
    }

    function lerp(start, end, t) {
        return start + (end - start) * t;
    }

    function shouldSkipGalleryImage(src) {
        var value = String(src || '').toLowerCase();
        var skip = [
            'adi-logo',
            'favicon',
            'loading-img',
            'gradien',
            'gradiend',
            'logo-light',
            'logo-1.png',
            'catchyleads-logo',
            'admin-150',
            '.svg',
            'data:image'
        ];
        return skip.some(function (token) {
            return value.indexOf(token) !== -1;
        });
    }

    function toSitePath(src) {
        try {
            var url = new URL(src, window.location.href);
            var path = url.pathname.replace(/\\/g, '/');
            var marker = '/theme-assets/';
            var idx = path.lastIndexOf(marker);
            if (idx !== -1) {
                return '.' + path.slice(idx);
            }
            var devfolio = path.lastIndexOf('/devfolio/');
            if (devfolio !== -1) {
                return '.' + path.slice(devfolio);
            }
            return src;
        } catch (err) {
            return src;
        }
    }

    function collectSiteImages() {
        var curated = [
            './theme-assets/portfolio1-580x580.webp',
            './theme-assets/portfolio2-580x580.webp',
            './theme-assets/portfolio3-580x580.webp',
            './theme-assets/portfolio4-580x580.webp',
            './theme-assets/portfolio5-580x580.webp',
            './theme-assets/portfolio6-580x580.webp',
            './theme-assets/service1.webp',
            './theme-assets/service2.webp',
            './theme-assets/service3.webp',
            './theme-assets/service4.webp',
            './theme-assets/service5.webp',
            './theme-assets/service6.webp',
            './theme-assets/84f89a5abe3a18d4d3c5c672f00e76ce2943f0ca-1440x835.png',
            './theme-assets/01601e135211833.61e428ba06f23.png',
            './theme-assets/a27815258b737ebbf6d42e0156029940.png',
            './theme-assets/idygrnqd2yu9f12toa8w.jpg',
            './theme-assets/blog1h4.webp',
            './theme-assets/blog2h4.webp',
            './theme-assets/blog3h4.webp',
            './theme-assets/blog4h4.webp',
            './theme-assets/img-gr1.webp',
            './theme-assets/img-gr2-1.webp',
            './theme-assets/img-gr3.webp',
            './theme-assets/img-gr4.webp',
            './theme-assets/sde.webp',
            './theme-assets/myimg2.webp',
            './theme-assets/01_Digital_Marketing-1.webp',
            './theme-assets/02_SEO-1.webp',
            './theme-assets/03_Branding_Agency-1.webp',
            './theme-assets/04_SEO_Marketing-1.webp'
        ];

        var seen = {};
        var images = [];

        function add(src) {
            if (!src || shouldSkipGalleryImage(src)) return;
            var path = toSitePath(src);
            if (seen[path]) return;
            seen[path] = true;
            images.push(path);
        }

        curated.forEach(add);
        document.querySelectorAll('img').forEach(function (img) {
            add(img.getAttribute('src') || img.currentSrc || img.src);
        });

        return images;
    }

    function splitImages(images) {
        var third = Math.ceil(images.length / 3) || 1;
        return [
            images.slice(0, third),
            images.slice(third, third * 2),
            images.slice(third * 2)
        ];
    }

    function renderColumn(images, variant) {
        return images.map(function (src, idx) {
            return (
                '<div class="adi-parallax-card" data-parallax-variant="' + variant + '">' +
                    '<img alt="ADI portfolio visual ' + (idx + 1) + '" height="400" src="' + src + '" width="400"/>' +
                '</div>'
            );
        }).join('');
    }

    function initParallaxScrollGallery() {
        if (document.querySelector('.adi-parallax-section')) return;

        var mount = document.getElementById('adi-parallax-mount');
        var portfolio = document.getElementById('portfolio');
        var target = mount || portfolio;
        if (!target) return;

        var images = collectSiteImages();
        if (!images.length) return;

        var columns = splitImages(images);
        var section = document.createElement('section');
        section.className = 'adi-parallax-section';
        section.id = 'visual-works';
        section.innerHTML =
            '<div class="adi-parallax-header">' +
                '<span class="adi-parallax-kicker">Explore My —</span>' +
                '<h2>Latest <span>Works.</span></h2>' +
                '<p>Scroll inside the gallery. Side columns shift and rotate like Aceternity Parallax Scroll 2, using this site’s own case-study, product, and brand images.</p>' +
            '</div>' +
            '<div class="adi-parallax-scroll" data-lenis-prevent>' +
                '<div class="adi-parallax-grid">' +
                    '<div class="adi-parallax-col">' + renderColumn(columns[0], 'first') + '</div>' +
                    '<div class="adi-parallax-col">' + renderColumn(columns[1], 'second') + '</div>' +
                    '<div class="adi-parallax-col">' + renderColumn(columns[2], 'third') + '</div>' +
                '</div>' +
            '</div>';

        if (mount) {
            mount.appendChild(section);
        } else {
            target.insertAdjacentElement('afterend', section);
        }

        var scroller = section.querySelector('.adi-parallax-scroll');
        var firstCards = section.querySelectorAll('[data-parallax-variant="first"]');
        var thirdCards = section.querySelectorAll('[data-parallax-variant="third"]');
        if (!scroller) return;

        function updateParallax() {
            var max = scroller.scrollHeight - scroller.clientHeight;
            var progress = max > 0 ? scroller.scrollTop / max : 0;
            var y = lerp(0, -200, progress);
            var xFirst = lerp(0, -200, progress);
            var rotFirst = lerp(0, -20, progress);
            var xThird = lerp(0, 200, progress);
            var rotThird = lerp(0, 20, progress);

            firstCards.forEach(function (card) {
                card.style.transform = 'translate3d(' + xFirst + 'px,' + y + 'px,0) rotate(' + rotFirst + 'deg)';
            });
            thirdCards.forEach(function (card) {
                card.style.transform = 'translate3d(' + xThird + 'px,' + y + 'px,0) rotate(' + rotThird + 'deg)';
            });
        }

        scroller.addEventListener('scroll', updateParallax, { passive: true });
        updateParallax();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initPreloader();
            initStickyHeader();
            initOffcanvasScrollFix();
            initNoLinkActivityFix();
            initParallaxScrollGallery();
        });
    } else {
        initPreloader();
        initStickyHeader();
        initOffcanvasScrollFix();
        initNoLinkActivityFix();
        initParallaxScrollGallery();
    }
})();
