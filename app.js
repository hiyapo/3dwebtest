/* ============================================
   AETHERIA — Three.js 3D Engine + Animations
   Toon-shaded anime geometry with scroll-driven
   camera & GSAP cinematic transitions.
   ============================================ */

(function () {
  'use strict';

  // ─── THREE.JS SCENE SETUP ──────────────────────────
  const canvas = document.getElementById('three-canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 8);

  // ─── FOG ───────────────────────────────────────────
  scene.fog = new THREE.FogExp2(0x06060e, 0.035);

  // ─── LIGHTS ────────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0x2a1b4e, 0.6);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0x9d5cff, 1.8);
  mainLight.position.set(3, 5, 4);
  scene.add(mainLight);

  const accentLight = new THREE.PointLight(0xff5ca0, 1.5, 20);
  accentLight.position.set(-4, 2, 3);
  scene.add(accentLight);

  const rimLight = new THREE.PointLight(0x5ce1ff, 1.2, 18);
  rimLight.position.set(4, -2, -3);
  scene.add(rimLight);

  const heroGlow = new THREE.PointLight(0x9d5cff, 0.8, 15);
  heroGlow.position.set(0, 0, 5);
  scene.add(heroGlow);

  // ─── CUSTOM TOON SHADER MATERIAL ──────────────────
  function createToonMaterial(color, emissiveColor, emissiveIntensity = 0.15) {
    return new THREE.MeshPhysicalMaterial({
      color: color,
      emissive: emissiveColor || color,
      emissiveIntensity: emissiveIntensity,
      roughness: 0.35,
      metalness: 0.1,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      transparent: true,
      opacity: 0.92,
    });
  }

  // ─── MAIN HERO GEOMETRY — TORUS KNOT ──────────────
  const torusKnotGeo = new THREE.TorusKnotGeometry(1.6, 0.5, 128, 32, 2, 3);
  const torusKnotMat = createToonMaterial(0x9d5cff, 0x6b3fa0, 0.25);
  const torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotMat);
  torusKnot.position.set(2.5, 0, 0);
  scene.add(torusKnot);

  // ─── ORBITING ICOSAHEDRON ─────────────────────────
  const icoGeo = new THREE.IcosahedronGeometry(0.55, 1);
  const icoMat = createToonMaterial(0xff5ca0, 0xcc2d6f, 0.3);
  const icosahedron = new THREE.Mesh(icoGeo, icoMat);
  scene.add(icosahedron);

  // ─── ORBITING OCTAHEDRON ──────────────────────────
  const octGeo = new THREE.OctahedronGeometry(0.4, 0);
  const octMat = createToonMaterial(0x5ce1ff, 0x2da0cc, 0.3);
  const octahedron = new THREE.Mesh(octGeo, octMat);
  scene.add(octahedron);

  // ─── FLOATING RING ────────────────────────────────
  const ringGeo = new THREE.TorusGeometry(2.8, 0.04, 16, 100);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x9d5cff,
    transparent: true,
    opacity: 0.25,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 3;
  ring.position.set(2.5, 0, 0);
  scene.add(ring);

  // ─── SECOND RING ──────────────────────────────────
  const ring2Geo = new THREE.TorusGeometry(3.3, 0.02, 16, 100);
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: 0xff5ca0,
    transparent: true,
    opacity: 0.15,
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = -Math.PI / 4;
  ring2.rotation.z = Math.PI / 6;
  ring2.position.set(2.5, 0, 0);
  scene.add(ring2);

  // ─── PARTICLE FIELD ───────────────────────────────
  const particleCount = 600;
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 30;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x9d5cff,
    size: 0.035,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ─── SECONDARY PARTICLE FIELD (WARM) ──────────────
  const particle2Count = 300;
  const particle2Positions = new Float32Array(particle2Count * 3);

  for (let i = 0; i < particle2Count; i++) {
    particle2Positions[i * 3] = (Math.random() - 0.5) * 25;
    particle2Positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
    particle2Positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
  }

  const particle2Geo = new THREE.BufferGeometry();
  particle2Geo.setAttribute('position', new THREE.BufferAttribute(particle2Positions, 3));

  const particle2Mat = new THREE.PointsMaterial({
    color: 0xff5ca0,
    size: 0.025,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const particles2 = new THREE.Points(particle2Geo, particle2Mat);
  scene.add(particles2);

  // ─── SCROLL STATE ─────────────────────────────────
  let scrollProgress = 0;
  let targetScrollProgress = 0;
  const scrollBarEl = document.getElementById('scrollBar');
  const navEl = document.getElementById('navbar');

  function updateScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    targetScrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;

    // Navbar scroll class
    if (scrollTop > 60) {
      navEl.classList.add('scrolled');
    } else {
      navEl.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
  scrollProgress = targetScrollProgress; // Initialize current state immediately

  // ─── MOUSE TRACKING ──────────────────────────────
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // ─── ANIMATION LOOP ──────────────────────────────
  const clock = new THREE.Clock();

  let torusBaseScale = 1;
  let torusBaseEmissive = 0.2;

  function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();
    const delta = clock.getDelta();

    // Smooth scroll interpolation (Lerp) to fix jitter
    scrollProgress += (targetScrollProgress - scrollProgress) * 0.08;
    scrollBarEl.style.width = (scrollProgress * 100) + '%';

    // Smooth mouse interpolation
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;

    // ── Scroll-driven camera movement ──
    const cameraZ = 8 - scrollProgress * 3;
    const cameraX = Math.sin(scrollProgress * Math.PI * 2) * 2.5;
    const cameraY = scrollProgress * 1.5 + mouseY * 0.3;
    camera.position.set(
      cameraX + mouseX * 0.5,
      cameraY,
      cameraZ
    );
    camera.lookAt(torusKnot.position.x * 0.6, 0, 0);

    // ── Main torus knot animation ──
    torusKnot.rotation.x = elapsed * 0.15 + scrollProgress * Math.PI;
    torusKnot.rotation.y = elapsed * 0.2 + scrollProgress * Math.PI * 0.5;
    torusKnot.rotation.z = Math.sin(elapsed * 0.1) * 0.3;

    // Scale pulse
    const scalePulse = torusBaseScale + Math.sin(elapsed * 0.8) * 0.04;
    torusKnot.scale.set(scalePulse, scalePulse, scalePulse);

    // Emissive pulse
    torusKnotMat.emissiveIntensity = torusBaseEmissive + Math.sin(elapsed * 1.2) * 0.1;

    // ── Scroll-driven torus knot position ──
    torusKnot.position.x = 2.5 - scrollProgress * 5;
    torusKnot.position.y = Math.sin(scrollProgress * Math.PI) * 1.5;

    // ── Orbiting icosahedron ──
    const orbitRadius = 3.2;
    const orbitSpeed = elapsed * 0.5;
    icosahedron.position.x = torusKnot.position.x + Math.cos(orbitSpeed) * orbitRadius;
    icosahedron.position.y = torusKnot.position.y + Math.sin(orbitSpeed) * orbitRadius * 0.4;
    icosahedron.position.z = Math.sin(orbitSpeed * 0.7) * 2;
    icosahedron.rotation.x = elapsed * 0.7;
    icosahedron.rotation.y = elapsed * 0.5;

    // ── Orbiting octahedron ──
    const orbit2Speed = elapsed * 0.35 + Math.PI;
    octahedron.position.x = torusKnot.position.x + Math.cos(orbit2Speed) * (orbitRadius * 0.8);
    octahedron.position.y = torusKnot.position.y + Math.sin(orbit2Speed * 1.3) * (orbitRadius * 0.5);
    octahedron.position.z = Math.cos(orbit2Speed * 0.6) * 1.5;
    octahedron.rotation.x = elapsed * 0.9;
    octahedron.rotation.z = elapsed * 0.6;

    // ── Rings follow torus knot ──
    ring.position.x = torusKnot.position.x;
    ring.position.y = torusKnot.position.y;
    ring.rotation.z = elapsed * 0.1;
    ring.rotation.y = elapsed * 0.15;

    ring2.position.x = torusKnot.position.x;
    ring2.position.y = torusKnot.position.y;
    ring2.rotation.z = -elapsed * 0.08;
    ring2.rotation.y = -elapsed * 0.12;

    // ── Particles slow rotation ──
    particles.rotation.y = elapsed * 0.02 + scrollProgress * 0.5;
    particles.rotation.x = elapsed * 0.01;
    particles2.rotation.y = -elapsed * 0.015 + scrollProgress * 0.3;
    particles2.rotation.z = elapsed * 0.008;

    // ── Light animations ──
    accentLight.position.x = Math.sin(elapsed * 0.3) * 5;
    accentLight.position.y = Math.cos(elapsed * 0.4) * 3;
    rimLight.position.x = Math.cos(elapsed * 0.25) * 5;
    rimLight.position.z = Math.sin(elapsed * 0.35) * 4;

    // Color shifting based on scroll
    const hue1 = 0.72 + scrollProgress * 0.15;
    const hue2 = 0.92 + scrollProgress * 0.1;
    mainLight.color.setHSL(hue1, 0.8, 0.6);
    accentLight.color.setHSL(hue2, 0.9, 0.55);

    renderer.render(scene, camera);
  }

  animate();

  // ─── WINDOW RESIZE ────────────────────────────────
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    updateScroll();
  }

  window.addEventListener('resize', onResize);

  // ─── GSAP & SCROLL TRIGGER ────────────────────────
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance animation
  const heroTimeline = gsap.timeline({ delay: 0.4 });
  heroTimeline
    .to('.hero-eyebrow', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
    })
    .to(
      '.hero-title',
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
      },
      '-=0.6'
    )
    .to(
      '.hero-subtitle',
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
      },
      '-=0.6'
    )
    .to(
      '.hero-cta',
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
      },
      '-=0.6'
    )
    .to(
      '.hero-scroll-hint',
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
      },
      '-=0.5'
    );

  // Scroll-triggered fade-up animations
  const animateElements = document.querySelectorAll('[data-animate="fade-up"]');
  animateElements.forEach((el) => {
    // Skip hero elements (handled by heroTimeline)
    if (el.closest('.hero-section')) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // Feature cards stagger
  gsap.fromTo(
    '.feature-card',
    { opacity: 0, y: 60, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.features-grid',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  );

  // Stat counter animation
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    counters.forEach((counter) => {
      const target = parseInt(counter.dataset.count, 10);
      const obj = { value: 0 };

      gsap.to(obj, {
        value: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 85%',
          toggleActions: 'play none none reset',
        },
        onUpdate: () => {
          counter.textContent = Math.round(obj.value);
        },
      });
    });
  }

  animateCounters();

  // Showcase cards entrance
  gsap.fromTo(
    '.showcase-card',
    { opacity: 0, y: 80, scale: 0.92 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.showcase-grid',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  );

  // Parallax effect for showcase cards on scroll
  document.querySelectorAll('.showcase-card').forEach((card, i) => {
    gsap.to(card, {
      y: -(10 + i * 5),
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    });
  });

  // Join section entrance
  gsap.fromTo(
    '.join-content',
    { opacity: 0, y: 60, scale: 0.96 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.join-section',
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    }
  );

  // ─── HERO FLOATING PARTICLES (DOM) ────────────────
  const heroParticlesEl = document.getElementById('heroParticles');

  for (let i = 0; i < 25; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 1}px;
      height: ${Math.random() * 4 + 1}px;
      border-radius: 50%;
      background: ${['#9d5cff', '#ff5ca0', '#5ce1ff'][Math.floor(Math.random() * 3)]};
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.5 + 0.1};
      pointer-events: none;
    `;
    heroParticlesEl.appendChild(particle);

    // Animate each particle
    gsap.to(particle, {
      y: -60 - Math.random() * 80,
      x: (Math.random() - 0.5) * 60,
      opacity: 0,
      duration: 3 + Math.random() * 4,
      repeat: -1,
      delay: Math.random() * 3,
      ease: 'power1.out',
    });
  }

  // ─── BUTTON INTERACTIONS ──────────────────────────
  const heroBtn = document.getElementById('heroBtn');
  if (heroBtn) {
    heroBtn.addEventListener('click', () => {
      document.getElementById('universe').scrollIntoView({ behavior: 'smooth' });
    });
  }

  const trailerBtn = document.getElementById('trailerBtn');
  if (trailerBtn) {
    trailerBtn.addEventListener('click', () => {
      // Visual feedback
      const proxy = { scale: 1, emissive: 0.2 };
      gsap.to(proxy, {
        scale: 1.3,
        emissive: 0.8,
        duration: 0.4,
        ease: 'back.out(2)',
        yoyo: true,
        repeat: 1,
        onUpdate: () => {
          torusBaseScale = proxy.scale;
          torusBaseEmissive = proxy.emissive;
        }
      });
    });
  }

  // Join form interaction
  const joinBtn = document.getElementById('joinBtn');
  const emailInput = document.getElementById('emailInput');

  if (joinBtn && emailInput) {
    joinBtn.addEventListener('click', () => {
      const email = emailInput.value.trim();
      if (email && email.includes('@')) {
        // Success animation
        joinBtn.querySelector('span').textContent = '✓ You\'re In!';
        joinBtn.style.pointerEvents = 'none';
        emailInput.disabled = true;

        gsap.fromTo(
          joinBtn,
          { scale: 1 },
          {
            scale: 1.05,
            duration: 0.3,
            ease: 'back.out(2)',
            yoyo: true,
            repeat: 1,
          }
        );

        // Burst effect on 3D scene
        const proxy = { scale: 1 };
        gsap.to(proxy, {
          scale: 1.5,
          duration: 0.6,
          ease: 'back.out(3)',
          yoyo: true,
          repeat: 1,
          onUpdate: () => { torusBaseScale = proxy.scale; }
        });
      } else {
        // Shake animation
        gsap.to('.input-wrapper', {
          x: 8,
          duration: 0.1,
          yoyo: true,
          repeat: 5,
          ease: 'power1.inOut',
          onComplete: () => gsap.set('.input-wrapper', { x: 0 })
        });
      }
    });
  }

  // ─── SHOWCASE CARD HOVER 3D TILT ──────────────────
  document.querySelectorAll('.showcase-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
      card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px) scale(1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        card.style.transition = '';
      }, 600);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });

  // ─── PERFORMANCE: REDUCE QUALITY WHEN TAB NOT VISIBLE ──
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      renderer.setPixelRatio(1);
    } else {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  });

  console.log(
    '%c⬡ AETHERIA ENGINE INITIALIZED',
    'color: #9d5cff; font-weight: bold; font-size: 14px;'
  );
})();
