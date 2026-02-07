// =========================================
// THREE.JS 3D Hero Scene - Subtle Data Pulse
// =========================================
function initHero3D() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 100;

    // Mouse Parallax for Portrait Image
    const portrait = document.querySelector('.hero-portrait');
    const heroContent = document.querySelector('.hero-content');

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5);
        mouseY = (e.clientY / window.innerHeight - 0.5);
    });

    // --- SUBTLE FLOATING PARTICLES (LIME GREEN) ---
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 400;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: 0xf97316, // Orange
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // Apply mouse parallax to elements
        if (portrait) {
            portrait.style.transform = `translate(${targetX * 20}px, ${targetY * 20}px) scale(1.05)`;
        }
        if (heroContent) {
            heroContent.style.transform = `translate(${targetX * -10}px, ${targetY * -10}px)`;
        }

        // Rotate particles
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initialize 3D on load
window.addEventListener('load', initHero3D);

// =========================================
// Navigation
// =========================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

// Scroll-based navbar styling
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
    });
});

// =========================================
// Smooth Scroll
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// =========================================
// Intersection Observer for Animations
// =========================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.legacy-card, .course-card, .feature-item, .testimonial-card, .contact-item, .section-header').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.4s ease-out ${i * 0.03}s, transform 0.4s cubic-bezier(0.2, 0.65, 0.3, 0.9) ${i * 0.03}s`; // Faster, snappier animations
    animateOnScroll.observe(el);
});

// Add animation class styles
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    </style>
`);

// =========================================
// Form Handling
// =========================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<span>Sending...</span>';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<span>Message Sent! ✓</span>';
            btn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';

            contactForm.reset();

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

// =========================================
// Button Ripple Effect
// =========================================
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
document.head.insertAdjacentHTML('beforeend', `
    <style>
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    </style>
`);

// =========================================
// Initialize
// =========================================
// Force scroll to top on refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0); // Jump to top immediately
    document.body.classList.add('loaded');
    console.log('🚀 D Soft Computer - Premium Website Initialized');

    // --- GOOGLE REVIEWS MARQUEE ---
    const track = document.getElementById('reviews-track');
    if (track) {
        // Clone cards for infinite effect
        const cards = Array.from(track.children);
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            track.appendChild(clone);
        });
    }
});

// =========================================
// Global Auth & Profile System
// =========================================
let isLoggedIn = localStorage.getItem('dsoft_isLoggedIn') === 'true';
let currentUser = JSON.parse(localStorage.getItem('dsoft_user')) || null;

function updateGlobalNavControls() {
    const trigger = document.getElementById('global-auth-trigger');
    const icon = document.getElementById('trigger-icon');
    if (!trigger) return;

    if (isLoggedIn && currentUser) {
        if (icon) icon.textContent = currentUser.email.charAt(0).toUpperCase();
        trigger.onclick = () => toggleProfilePanel(true);
    } else {
        if (icon) icon.textContent = '';
        trigger.onclick = () => toggleAuthModal(true);
    }
}

function toggleAuthModal(show) {
    const authOverlay = document.getElementById('auth-overlay');
    if (authOverlay) authOverlay.style.display = show ? 'block' : 'none';
}

function toggleProfilePanel(show) {
    const profilePanel = document.getElementById('profile-panel');
    if (profilePanel) {
        profilePanel.classList.toggle('active', show);
        if (show) updateProfileUI();
    }
}

function updateProfileUI() {
    if (!currentUser) return;
    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    const avatarEl = document.getElementById('profile-avatar');
    const historyContainer = document.getElementById('purchase-history');

    if (nameEl) nameEl.textContent = currentUser.email.split('@')[0];
    if (emailEl) emailEl.textContent = currentUser.email;
    if (avatarEl) avatarEl.textContent = currentUser.email.charAt(0).toUpperCase();

    if (historyContainer) {
        const history = currentUser.history || [];
        if (history.length === 0) {
            historyContainer.innerHTML = '<p style="opacity:0.3; text-align:center; margin-top:40px;">No purchases yet.</p>';
        } else {
            historyContainer.innerHTML = history.map(item => `
                <div class="purchase-history-item">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <strong style="color:var(--color-orange); font-size: 0.8rem;">${item.id}</strong>
                        <span style="font-size:0.7rem; opacity:0.5;">${item.date}</span>
                    </div>
                    <div style="font-size:0.8rem; opacity: 0.8;">${item.items.join(', ')}</div>
                    <div style="font-weight:800; margin-top:5px; color: white;">₹${item.total}</div>
                </div>
            `).join('');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateGlobalNavControls();

    const closeAuthBtn = document.getElementById('close-auth');
    if (closeAuthBtn) closeAuthBtn.onclick = () => toggleAuthModal(false);

    const closeProfileBtn = document.getElementById('close-profile');
    if (closeProfileBtn) closeProfileBtn.onclick = () => toggleProfilePanel(false);

    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    if (tabLogin && tabSignup) {
        tabLogin.onclick = () => setAuthMode('login');
        tabSignup.onclick = () => setAuthMode('signup');
    }

    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.onsubmit = (e) => {
            e.preventDefault();
            const email = document.getElementById('auth-email').value;
            if (!email || !email.includes('@')) return alert('Please enter a valid email.');

            isLoggedIn = true;
            currentUser = { email, history: [] };
            localStorage.setItem('dsoft_isLoggedIn', 'true');
            localStorage.setItem('dsoft_user', JSON.stringify(currentUser));

            toggleAuthModal(false);
            updateGlobalNavControls();
            updateProfileUI();
        };
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            isLoggedIn = false;
            currentUser = null;
            localStorage.removeItem('dsoft_isLoggedIn');
            localStorage.removeItem('dsoft_user');
            updateGlobalNavControls();
            toggleProfilePanel(false);
        };
    }
});

function setAuthMode(mode) {
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const authTitle = document.getElementById('auth-title');
    const authSubmitBtn = document.getElementById('auth-submit-btn');

    if (tabLogin) tabLogin.classList.toggle('active', mode === 'login');
    if (tabSignup) tabSignup.classList.toggle('active', mode === 'signup');
    if (authTitle) authTitle.textContent = mode === 'login' ? 'Welcome Back' : 'Join D\'Soft';
    if (authSubmitBtn) authSubmitBtn.textContent = mode === 'login' ? 'Login ' : 'Sign Up ';
}

// =========================================
// Course Filtering & Mixing System
// =========================================
function initCourseFilters() {
    const tabs = document.querySelectorAll('#course-tabs .tab-btn');
    const cards = Array.from(document.querySelectorAll('.course-card-clone:not(.view-all-card)'));
    const container = document.getElementById('courses-container');
    const viewAllBtn = document.getElementById('view-all-course-btn');

    if (!tabs.length || !cards.length || !container) return;

    function filterCourses(category) {
        // Reset all cards
        cards.forEach(card => {
            card.style.display = 'none';
        });

        if (category === 'all') {
            // Randomly shuffle cards
            const shuffled = [...cards].sort(() => 0.5 - Math.random());
            
            // Show first 5
            shuffled.slice(0, 5).forEach(card => {
                card.style.display = 'block';
            });

            // Show 'View All' card at 6th position
            if (viewAllBtn) {
                viewAllBtn.style.display = 'block';
                // Ensure it's inside the container
                container.appendChild(viewAllBtn);
            }
        } else {
            // Show all cards in this specific category
            cards.forEach(card => {
                if (card.dataset.category === category) {
                    card.style.display = 'block';
                }
            });

            // Hide 'View All' box for specific categories
            if (viewAllBtn) viewAllBtn.style.display = 'none';
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterCourses(tab.dataset.filter);
        });
    });

    // Handle 'View All' box click
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            window.location.href = 'courses.html'; 
        });
    }

    // Initial load: show random mix
    filterCourses('all');
}

document.addEventListener('DOMContentLoaded', () => {
    initCourseFilters();
});

