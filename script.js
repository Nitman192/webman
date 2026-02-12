/*
  =====================================================
  SMART LEARNING HUB - JAVASCRIPT (DETAILED EXPLANATION)
  =====================================================
  JavaScript ka role: static HTML/CSS ko interactive banana.
  Hum yahan events, state, DOM updates, animation, accessibility cover karenge.
*/

/*
  APP STATE OBJECT
  ----------------
  State = app ki current condition ka data.
  Why object? Ek single source of truth milta hai.
*/
const state = {
  darkMode: true,
  animations: true,
  threeD: true,
  glass: true,
  particles: true,
};

/*
  FEATURE TOGGLE (CODE LEVEL) EXAMPLES
  ------------------------------------
  Aap permanent defaults yahin set kar sakte ho:
  - darkMode: false => page light mode se start hoga.
  - particles: false => background canvas particles start nahi honge.
*/

const body = document.body;
const navLinks = document.querySelector('.nav-links');
const menuToggleBtn = document.querySelector('.menu-toggle');
const allToggleInputs = document.querySelectorAll('[data-toggle]');
const skillBars = document.querySelectorAll('.skill-fill');
const surpriseHintBtn = document.getElementById('surpriseHintBtn');
const easterEgg = document.getElementById('easterEgg');
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

/*
  FUNCTION: applyStateToUI
  ------------------------
  Why: State change hone ke baad alag-alag classes/properties update karni hoti hain.
  Better pattern: saara visual sync ek function mein.
*/
function applyStateToUI() {
  body.classList.toggle('light', !state.darkMode);
  body.classList.toggle('three-d-enabled', state.threeD);

  // Animation master class toggles (optional for CSS expansion)
  body.classList.toggle('animations-off', !state.animations);

  // Glass panels on/off
  document.querySelectorAll('.glass-panel').forEach((panel) => {
    panel.style.backdropFilter = state.glass ? 'blur(15px)' : 'none';
    panel.style.webkitBackdropFilter = state.glass ? 'blur(15px)' : 'none';
    panel.style.background = state.glass ? 'var(--surface)' : 'rgba(30, 41, 59, 0.85)';
  });

  // Animations off => transitions remove for quick static mode.
  document.documentElement.style.setProperty('--anim-duration', state.animations ? '0.55s' : '0s');
}

/*
  EVENT LISTENER SETUP FOR TOGGLES
  --------------------------------
  Event Listener: user action (e.g., click/change) ko sunne wala mechanism.
*/
allToggleInputs.forEach((input) => {
  const key = input.dataset.toggle;
  input.checked = Boolean(state[key]);

  input.addEventListener('change', () => {
    state[key] = input.checked;
    applyStateToUI();

    if (key === 'particles') {
      if (state.particles) startParticles();
      else stopParticles();
    }
  });
});

/*
  RESPONSIVE NAVIGATION
  ---------------------
  Mobile pe menu button click se nav open/close.
*/
menuToggleBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

/*
  SKILL BAR ANIMATION ON VIEWPORT ENTRY
  -------------------------------------
  IntersectionObserver: efficient API jo batata hai element viewport mein आया ya nahi.
  Alternative: scroll event + boundingClientRect (less efficient for many items).
*/
const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const level = entry.target.dataset.level;
        entry.target.style.width = `${level}%`;
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

skillBars.forEach((bar) => observer.observe(bar));

/*
  EASTER EGG (SECRET KEY SEQUENCE)
  --------------------------------
  Discover method:
  1) Keyboard pe sequence type karo: "learn"
  2) Toast message appear hoga.
  Educational reason: keyboard events, string buffer logic samajhna.
*/
let typedBuffer = '';
const secretWord = 'learn';

document.addEventListener('keydown', (event) => {
  typedBuffer += event.key.toLowerCase();
  if (typedBuffer.length > secretWord.length) {
    typedBuffer = typedBuffer.slice(-secretWord.length);
  }

  if (typedBuffer === secretWord) {
    showEasterEgg();
    typedBuffer = '';
  }
});

surpriseHintBtn.addEventListener('click', () => {
  alert('Hint: Try typing a 5-letter word related to studying: L _ A _ N');
});

function showEasterEgg() {
  easterEgg.classList.add('show');
  setTimeout(() => {
    easterEgg.classList.remove('show');
  }, 2800);
}

/*
  PARTICLE BACKGROUND ANIMATION (Canvas)
  --------------------------------------
  Canvas: pixel-based drawing surface.
  Use-case: lightweight custom animations.
*/
let particles = [];
let particleFrameId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2.4 + 0.8,
    speedX: (Math.random() - 0.5) * 0.35,
    speedY: (Math.random() - 0.5) * 0.35,
    alpha: Math.random() * 0.7 + 0.2,
  };
}

function initParticles(count = 90) {
  particles = Array.from({ length: count }, createParticle);
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

    ctx.beginPath();
    ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  if (state.particles) {
    particleFrameId = requestAnimationFrame(drawParticles);
  }
}

function startParticles() {
  if (!particles.length) initParticles();
  if (!particleFrameId) drawParticles();
}

function stopParticles() {
  if (particleFrameId) {
    cancelAnimationFrame(particleFrameId);
    particleFrameId = null;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

applyStateToUI();
startParticles();
