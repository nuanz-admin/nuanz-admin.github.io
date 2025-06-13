// Navigation JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
});

function initNavigation() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize navbar scroll behavior
    initNavbarScroll();
    
    // Initialize active link highlighting
    initActiveLinkHighlighting();
    
    // Initialize external link handling
    initExternalLinks();
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const navbar = document.getElementById('navbar');
    
    if (mobileMenuBtn && mobileNav) {
        let isMenuOpen = false;
        
        mobileMenuBtn.addEventListener('click', function() {
            toggleMobileMenu();
        });
        
        // Close menu when clicking on a link
        const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (isMenuOpen && !navbar.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMobileMenu();
                mobileMenuBtn.focus();
            }
        });
        
        function toggleMobileMenu() {
            isMenuOpen = !isMenuOpen;
            updateMobileMenuState();
        }
        
        function closeMobileMenu() {
            isMenuOpen = false;
            updateMobileMenuState();
        }
        
        function updateMobileMenuState() {
            mobileNav.classList.toggle('active', isMenuOpen);
            mobileMenuBtn.classList.toggle('active', isMenuOpen);
            mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen);
            
            // Animate hamburger lines
            const lines = mobileMenuBtn.querySelectorAll('.hamburger-line');
            if (isMenuOpen) {
                lines[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                lines[1].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.transform = 'none';
            }
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isMenuOpen ? 'hidden' : '';
            
            // Announce to screen readers
            if (window.NuanzApp) {
                const message = isMenuOpen ? 'Mobile menu opened' : 'Mobile menu closed';
                window.NuanzApp.announceToScreenReader(message);
            }
        }
    }
}

// Navbar Scroll Behavior
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    let isScrollingDown = false;
    
    const handleScroll = window.NuanzApp ? 
        window.NuanzApp.throttle(updateNavbarOnScroll, 16) : 
        updateNavbarOnScroll;
    
    window.addEventListener('scroll', handleScroll);
    
    function updateNavbarOnScroll() {
        const currentScrollY = window.scrollY;
        isScrollingDown = currentScrollY > lastScrollY;
        
        // Add/remove scrolled class for styling
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on mobile when scrolling
        if (window.innerWidth <= 809) {
            if (isScrollingDown && currentScrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
    }
}

// Active Link Highlighting
function initActiveLinkHighlighting() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    if (sections.length === 0) return;
    
    const handleScroll = window.NuanzApp ? 
        window.NuanzApp.throttle(updateActiveLink, 100) : 
        updateActiveLink;
    
    window.addEventListener('scroll', handleScroll);
    
    // Set initial active link
    updateActiveLink();
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 150; // Offset for navbar
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update nav links
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === `#${currentSection}` || 
                           (href === './' && currentSection === '');
            
            link.classList.toggle('active', isActive);
            
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }
}

// External Links
function initExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');
    
    links.forEach(link => {
        // Add external link indicators
        if (!link.hostname.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            
            // Add screen reader text
            const srText = document.createElement('span');
            srText.className = 'sr-only';
            srText.textContent = ' (opens in new tab)';
            link.appendChild(srText);
            
            // Add visual indicator
            link.classList.add('external-link');
        }
    });
}

// Handle special link behaviors from original Framer code
function initFramerLinkBehaviors() {
    // Handle nested links (from original code)
    document.querySelectorAll('[data-nested-link]').forEach(link => {
        if (!(link instanceof HTMLElement)) return;
        
        link.addEventListener('click', handleNestedLinkClick);
        link.addEventListener('auxclick', handleNestedLinkAuxClick);
        link.addEventListener('keydown', handleNestedLinkKeydown);
    });
    
    function handleNestedLinkClick(event) {
        if (this.dataset.hydrated) {
            this.removeEventListener('click', handleNestedLinkClick);
            return;
        }
        
        event.preventDefault();
        event.stopPropagation();
        
        const href = this.getAttribute('href');
        if (!href) return;
        
        // Handle Ctrl/Cmd + click for new tab
        const isMetaClick = /Mac|iPod|iPhone|iPad/u.test(navigator.userAgent) ? 
            event.metaKey : event.ctrlKey;
        
        if (isMetaClick) {
            openInNewTab(href);
            return;
        }
        
        const rel = this.getAttribute('rel') ?? '';
        const target = this.getAttribute('target') ?? '';
        
        openLink(href, rel, target);
    }
    
    function handleNestedLinkAuxClick(event) {
        if (this.dataset.hydrated) {
            this.removeEventListener('auxclick', handleNestedLinkAuxClick);
            return;
        }
        
        event.preventDefault();
        event.stopPropagation();
        
        const href = this.getAttribute('href');
        if (href) {
            openInNewTab(href);
        }
    }
    
    function handleNestedLinkKeydown(event) {
        if (this.dataset.hydrated) {
            this.removeEventListener('keydown', handleNestedLinkKeydown);
            return;
        }
        
        if (event.key !== 'Enter') return;
        
        event.preventDefault();
        event.stopPropagation();
        
        const href = this.getAttribute('href');
        if (!href) return;
        
        const rel = this.getAttribute('rel') ?? '';
        const target = this.getAttribute('target') ?? '';
        
        openLink(href, rel, target);
    }
    
    function openLink(href, rel, target) {
        const link = document.createElement('a');
        link.href = href;
        link.target = target;
        link.rel = rel;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
    
    function openInNewTab(href) {
        openLink(href, '', '_blank');
    }
}

// URL parameter preservation (from original Framer code)
function initURLParameterPreservation() {
    const currentSearch = window.location.search;
    if (!currentSearch) return;
    
    // Skip for bots
    if (/bot|-google|google-|yandex|ia_archiver|crawl|spider/iu.test(navigator.userAgent)) {
        return;
    }
    
    const internalLinkSelector = 'a[href^="#"], a[href^="/"], a[href^="."]';
    const preserveParamsSelector = 'a[data-framer-preserve-params]';
    
    // Determine which links to update
    const shouldPreserveForAll = document.currentScript?.hasAttribute('data-preserve-internal-params');
    const selector = shouldPreserveForAll ? 
        `${internalLinkSelector}, ${preserveParamsSelector}` : 
        preserveParamsSelector;
    
    const links = document.querySelectorAll(selector);
    
    links.forEach(link => {
        const newHref = combineURLParams(currentSearch, link.href);
        link.setAttribute('href', newHref);
    });
    
    function combineURLParams(searchParams, originalURL) {
        const hashIndex = originalURL.indexOf('#');
        const baseURL = hashIndex === -1 ? originalURL : originalURL.substring(0, hashIndex);
        const hash = hashIndex === -1 ? '' : originalURL.substring(hashIndex);
        
        const queryIndex = baseURL.indexOf('?');
        
        if (queryIndex === -1) {
            return baseURL + searchParams + hash;
        }
        
        const newParams = new URLSearchParams(searchParams);
        const existingParams = baseURL.substring(queryIndex + 1);
        const existingURLParams = new URLSearchParams(existingParams);
        
        // Add new params that don't already exist
        for (const [key, value] of newParams) {
            if (!existingURLParams.has(key)) {
                existingURLParams.append(key, value);
            }
        }
        
        return baseURL.substring(0, queryIndex + 1) + existingURLParams.toString() + hash;
    }
}

// Breadcrumb navigation
function initBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('.breadcrumbs');
    if (!breadcrumbContainer) return;
    
    const pathSegments = window.location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [{ name: 'Home', path: '/' }];
    
    let currentPath = '';
    pathSegments.forEach(segment => {
        currentPath += `/${segment}`;
        const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        breadcrumbs.push({ name, path: currentPath });
    });
    
    // Generate breadcrumb HTML
    const breadcrumbHTML = breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        if (isLast) {
            return `<span class="breadcrumb-current" aria-current="page">${crumb.name}</span>`;
        } else {
            return `<a href="${crumb.path}" class="breadcrumb-link">${crumb.name}</a>`;
        }
    }).join('<span class="breadcrumb-separator" aria-hidden="true">/</span>');
    
    breadcrumbContainer.innerHTML = `
        <nav aria-label="Breadcrumb">
            <ol class="breadcrumb-list">
                <li class="breadcrumb-item">${breadcrumbHTML}</li>
            </ol>
        </nav>
    `;
}

// Initialize all navigation features
document.addEventListener('DOMContentLoaded', function() {
    initFramerLinkBehaviors();
    initURLParameterPreservation();
    initBreadcrumbs();
});