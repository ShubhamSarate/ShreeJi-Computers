// Preloader
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  setTimeout(() => pre.classList.add('hide'), 300);
});

// Current year
document.getElementById('year').textContent = new Date().getFullYear();

// Sticky header shadow
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
  document.getElementById('scrollTop').classList.toggle('show', window.scrollY > 500);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  navToggle.classList.toggle('active');
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.main-nav a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// Animated counters
const counters = document.querySelectorAll('.counter');
let countersStarted = false;
function animateCounters() {
  counters.forEach(counter => {
    const target = +counter.dataset.target;
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else counter.textContent = target;
    }
    requestAnimationFrame(tick);
  });
}
const statsSection = document.querySelector('.stats');
if (statsSection) {
  const statsIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        animateCounters();
        statsIO.disconnect();
      }
    });
  }, { threshold: 0.3 });
  statsIO.observe(statsSection);
}

// Service card tilt effect (movable cards)
document.querySelectorAll('.service-card, .process-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -8;
    const rotateY = ((x - rect.width / 2) / rect.width) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Testimonial carousel
const track = document.getElementById('testiTrack');
const dotsWrap = document.getElementById('testiDots');
const cards = track ? track.children.length : 0;
let perView = window.innerWidth <= 640 ? 1 : window.innerWidth <= 860 ? 2 : 3;
let maxIndex = Math.max(0, cards - perView);
let currentIndex = 0;
let autoTimer;

function buildDots() {
  dotsWrap.innerHTML = '';
  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement('span');
    if (i === currentIndex) dot.classList.add('active');
    dot.addEventListener('click', () => { currentIndex = i; updateTrack(); resetAuto(); });
    dotsWrap.appendChild(dot);
  }
}

function updateTrack() {
  if (!track) return;
  const cardWidth = track.children[0].getBoundingClientRect().width;
  const gap = 28;
  track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
  [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === currentIndex));
}

function nextSlide() {
  currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
  updateTrack();
}

function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(nextSlide, 4500);
}

if (track) {
  buildDots();
  updateTrack();
  resetAuto();

  window.addEventListener('resize', () => {
    perView = window.innerWidth <= 640 ? 1 : window.innerWidth <= 860 ? 2 : 3;
    maxIndex = Math.max(0, cards - perView);
    currentIndex = Math.min(currentIndex, maxIndex);
    buildDots();
    updateTrack();
  });
}

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('serviceType').value;
    const note = document.getElementById('formNote');

    if (!name || !phone || !service) {
      note.style.color = '#d14343';
      note.textContent = 'Please fill in all required fields.';
      return;
    }

    note.style.color = 'var(--blue-700)';
    note.textContent = `Thank you, ${name}! We'll contact you shortly at ${phone} regarding "${service}".`;
    contactForm.reset();
  });
}

// Scroll to top
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
