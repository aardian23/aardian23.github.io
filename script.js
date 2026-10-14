/**
 * PORTFOLIO ARDIAN RAHMAN
 * Interactive Scripts: 3D Hanging ID Card Physics, Transparent Navbar,
 * Animated Hamburger, Hybrid Light/Dark Mode, and Dynamic Modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ==========================================================================
     1. HYBRID THEME SWITCHER (Light: iPhone 14 Blue / Dark: Sophisticated Monochrome)
     ========================================================================== */
  const htmlRoot = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');

  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    });
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (window.lucide) {
      setTimeout(() => window.lucide.createIcons(), 50);
    }
  }

  /* ==========================================================================
     2. TRANSPARENT NAVBAR & ACTIVE LINK TRACKING
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
  const sections = document.querySelectorAll('section[id]');

  function handleNavbarScroll() {
    if (window.scrollY > 25) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // ScrollSpy using IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('data-nav') === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  /* ==========================================================================
     3. ANIMATED HAMBURGER MENU & MOBILE DRAWER
     ========================================================================== */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileBackdrop = document.getElementById('mobile-backdrop');

  function openMobileMenu() {
    hamburgerBtn.classList.add('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = hamburgerBtn.classList.contains('is-active');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu when clicking navigation links
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close with Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  /* ==========================================================================
     4. HANGING ID CARD PHYSICS & 3D INTERACTION
     ========================================================================== */
  const cardWrapper = document.getElementById('card-3d-wrapper');
  const idCard = document.getElementById('id-card');
  const cardGlare = document.getElementById('card-glare');
  const flipBtn = document.getElementById('flip-card-btn');
  const hardware = document.getElementById('lanyard-hardware');
  const leftStrap = document.getElementById('lanyard-left-strap');
  const rightStrap = document.getElementById('lanyard-right-strap');
  const strapStitch = document.getElementById('lanyard-stitch');

  let isFlipped = false;
  let isDragging = false;
  let startX = 0, startY = 0;
  let currentX = 0, currentY = 0;
  let targetX = 0, targetY = 0;
  let velocityX = 0, velocityY = 0;
  let animFrameId = null;

  // Lanyard ribbon anchor constants (viewBox 0 0 400 320)
  const ANCHOR_LEFT_X = 175;
  const ANCHOR_RIGHT_X = 225;
  const ANCHOR_Y = 0;
  const REST_CLIP_X = 200;
  const REST_CLIP_Y = 190;

  // Flip button toggle
  if (flipBtn && idCard) {
    flipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isFlipped = !isFlipped;
      if (isFlipped) {
        idCard.classList.add('flipped');
        flipBtn.querySelector('span').textContent = 'Lihat Depan';
      } else {
        idCard.classList.remove('flipped');
        flipBtn.querySelector('span').textContent = 'Balik Kartu';
      }
    });
  }

  // Update dynamic SVG Lanyard curve according to displacement
  function updateLanyardSVG(clipDisplacementX, clipDisplacementY) {
    if (!leftStrap || !rightStrap) return;

    const clipX = REST_CLIP_X + (clipDisplacementX * 0.4);
    const clipY = REST_CLIP_Y + (clipDisplacementY * 0.2);

    // Natural curved bezier control points
    const ctrlLeftX = (ANCHOR_LEFT_X + clipX) / 2 + (clipDisplacementX * 0.15);
    const ctrlLeftY = (ANCHOR_Y + clipY) / 2 + 10;

    const ctrlRightX = (ANCHOR_RIGHT_X + clipX) / 2 + (clipDisplacementX * 0.15);
    const ctrlRightY = (ANCHOR_Y + clipY) / 2 + 10;

    const leftPath = `M ${ANCHOR_LEFT_X} ${ANCHOR_Y} Q ${ctrlLeftX} ${ctrlLeftY}, ${clipX - 4} ${clipY}`;
    const rightPath = `M ${ANCHOR_RIGHT_X} ${ANCHOR_Y} Q ${ctrlRightX} ${ctrlRightY}, ${clipX + 4} ${clipY}`;
    const stitchPath = `M ${(ANCHOR_LEFT_X + ANCHOR_RIGHT_X) / 2} ${ANCHOR_Y} Q ${(ctrlLeftX + ctrlRightX) / 2} ${(ctrlLeftY + ctrlRightY) / 2}, ${clipX} ${clipY}`;

    leftStrap.setAttribute('d', leftPath);
    rightStrap.setAttribute('d', rightPath);
    if (strapStitch) {
      strapStitch.setAttribute('d', stitchPath);
    }

    // Hardware clip slight rotation and translation
    if (hardware) {
      const hardwareRot = clipDisplacementX * 0.15;
      hardware.style.transform = `translateX(${clipDisplacementX * 0.4}px) translateY(${clipDisplacementY * 0.2}px) rotate(${hardwareRot}deg)`;
    }
  }

  // Spring physics loop for natural pendulum swing
  function springPhysicsStep() {
    if (!isDragging) {
      // Damped harmonic oscillator constants
      const stiffness = 0.08;
      const damping = 0.88;

      const forceX = -stiffness * currentX;
      const forceY = -stiffness * currentY;

      velocityX = (velocityX + forceX) * damping;
      velocityY = (velocityY + forceY) * damping;

      currentX += velocityX;
      currentY += velocityY;

      // Idle gentle breeze sway when stopped
      if (Math.abs(velocityX) < 0.05 && Math.abs(currentX) < 0.1) {
        const time = Date.now() * 0.0018;
        currentX = Math.sin(time) * 4;
        currentY = Math.cos(time * 2) * 1.5;
      }
    } else {
      // Follow cursor with smooth lag
      currentX += (targetX - currentX) * 0.35;
      currentY += (targetY - currentY) * 0.35;
    }

    // Apply rotation and transform to ID card
    // RotateZ follows horizontal drag (pendulum sway)
    const rotateZ = (currentX / 260) * 28;
    const rotateX = Math.max(-18, Math.min(18, -(currentY / 200) * 22));
    const rotateY = isFlipped ? 180 + (currentX / 260) * 20 : (currentX / 260) * 20;

    if (idCard) {
      idCard.style.transform = `
        translateX(${currentX * 0.75}px)
        translateY(${currentY * 0.55}px)
        rotateZ(${rotateZ}deg)
        rotateY(${rotateY}deg)
        rotateX(${rotateX}deg)
      `;
    }

    // Update Holographic Glare Position
    if (cardGlare) {
      const glareX = 50 + (currentX * 0.2);
      const glareY = 50 + (currentY * 0.2);
      cardGlare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 65%)`;
    }

    // Update lanyard SVG
    updateLanyardSVG(currentX, currentY);

    animFrameId = requestAnimationFrame(springPhysicsStep);
  }

  // Pointer Drag & Interaction Handlers
  if (cardWrapper) {
    // Mouse Down / Touch Start
    function onPointerDown(e) {
      // Don't drag if clicking buttons
      if (e.target.closest('button') || e.target.closest('a')) return;

      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      startX = clientX - currentX;
      startY = clientY - currentY;

      cardWrapper.style.cursor = 'grabbing';
    }

    // Mouse Move / Touch Move
    function onPointerMove(e) {
      if (!isDragging) {
        // Subtle hover 3D tilt when hovering without drag
        const rect = cardWrapper.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;

        if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
          const xOffset = clientX - (rect.left + rect.width / 2);
          const yOffset = clientY - (rect.top + rect.height / 2);
          targetX = xOffset * 0.25;
          targetY = yOffset * 0.15;
        }
        return;
      }

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      targetX = Math.max(-140, Math.min(140, clientX - startX));
      targetY = Math.max(-40, Math.min(100, clientY - startY));
    }

    // Pointer Up / End
    function onPointerUp() {
      if (isDragging) {
        isDragging = false;
        // Impart swing release momentum
        velocityX = (targetX - currentX) * 0.8;
        velocityY = (targetY - currentY) * 0.8;
        cardWrapper.style.cursor = 'grab';
      }
    }

    // Event Listeners
    cardWrapper.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);

    cardWrapper.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Start physics simulation loop
    springPhysicsStep();
  }

  /* ==========================================================================
     5. TECHNOLOGY FILTER TABS
     ========================================================================== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const techPills = document.querySelectorAll('.tech-pill');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filterValue = tab.getAttribute('data-filter');

      techPills.forEach(pill => {
        const category = pill.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          pill.style.display = 'flex';
          pill.style.opacity = '0';
          pill.style.transform = 'translateY(10px)';
          setTimeout(() => {
            pill.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
            pill.style.opacity = '1';
            pill.style.transform = 'translateY(0)';
          }, 40);
        } else {
          pill.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     6. CERTIFICATION MODAL LIGHTBOX
     ========================================================================== */
  const certModal = document.getElementById('cert-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalOrg = document.getElementById('modal-org');
  const modalDate = document.getElementById('modal-date');
  const modalId = document.getElementById('modal-id');
  const modalDesc = document.getElementById('modal-desc');
  const modalLink = document.getElementById('modal-link');

  const certButtons = document.querySelectorAll('.btn-cert-view');

  certButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const org = btn.getAttribute('data-org');
      const date = btn.getAttribute('data-date');
      const id = btn.getAttribute('data-id');
      const desc = btn.getAttribute('data-desc');
      const link = btn.getAttribute('data-link');

      modalTitle.textContent = title;
      modalOrg.textContent = org;
      modalDate.textContent = date;
      modalId.textContent = id;
      modalDesc.textContent = desc;
      modalLink.setAttribute('href', link);

      certModal.classList.add('open');
      certModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (window.lucide) {
        window.lucide.createIcons();
      }
    });
  });

  function closeCertModal() {
    if (!certModal) return;
    certModal.classList.remove('open');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeCertModal);
  }

  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) {
        closeCertModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('open')) {
      closeCertModal();
    }
  });

  /* ==========================================================================
     7. COPY EMAIL TO CLIPBOARD WITH TOAST NOTIFICATION
     ========================================================================== */
  const copyBtn = document.getElementById('copy-email-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const toast = document.getElementById('toast-notify');
  let toastTimer = null;

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = copyBtn.getAttribute('data-email');
      
      navigator.clipboard.writeText(email).then(() => {
        // Show Toast
        if (toast) {
          toast.classList.add('show');
          clearTimeout(toastTimer);
          toastTimer = setTimeout(() => {
            toast.classList.remove('show');
          }, 3200);
        }

        // Temporary button text feedback
        const originalText = copyBtnText.textContent;
        copyBtnText.textContent = 'Tersalin ke Clipboard!';
        setTimeout(() => {
          copyBtnText.textContent = originalText;
        }, 2500);
      }).catch(err => {
        console.error('Failed to copy email:', err);
      });
    });
  }

  /* ==========================================================================
     8. SMOOTH SCROLLING FOR ALL ANCHOR LINKS
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

});
