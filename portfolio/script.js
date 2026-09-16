/* =========================================================
   MAIN SITE SCRIPT
   - Navbar scroll effect
   - Mobile menu
   - Typewriter
   - Scroll reveal
   - Background particles
   - Contact form (Web3Forms)
   ========================================================= */

(function() {
  // ---------- NAVBAR SCROLL EFFECT ----------
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  // ---------- MOBILE MENU ----------
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const icon = hamburger.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const icon = hamburger.querySelector('i');
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-times');
    });
  });

  // ---------- TYPEWRITER ----------
  const roles = ["Web Designer", "App Maker", "AI Master", "AI Automator", "Excel Expert"];
  const typeEl = document.getElementById('typewriter');
  let roleIndex = 0, charIndex = 0, isDeleting = false;

  function typeRole() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typeEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typeEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(typeRole, 1800);
      return;
    }
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeRole, 350);
      return;
    }
    setTimeout(typeRole, isDeleting ? 50 : 100);
  }
  setTimeout(typeRole, 500);

  // ---------- SCROLL REVEAL ----------
  const reveals = document.querySelectorAll('.reveal');
  function checkReveal() {
    const windowHeight = window.innerHeight;
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top < windowHeight - 100) {
        el.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', checkReveal);
  window.addEventListener('load', checkReveal);
  checkReveal();

  // ---------- BACKGROUND PARTICLES ----------
  const bg = document.getElementById('particleBg');
  for (let i = 0; i < 18; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 300 + 80;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 12 + 's';
    particle.style.animationDuration = (Math.random() * 8 + 8) + 's';
    const colors = ['#a855f7', '#ec4899', '#3b82f6'];
    const col = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = `radial-gradient(circle, ${col} 0%, transparent 70%)`;
    particle.style.opacity = Math.random() * 0.2 + 0.1;
    bg.appendChild(particle);
  }

  // ---------- SMOOTH SCROLL FOR HIRE ME ----------
  document.querySelector('.btn-hire').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  });

  // ---------- WEB3FORMS CONTACT FORM ----------
  document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    const status = document.getElementById('form-status');
    const data = new FormData(form);

    status.textContent = 'Sending...';
    status.style.color = '#a855f7';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        status.textContent = "Message sent! I'll reply soon.";
        status.style.color = '#22c55e';
        form.reset();
      } else {
        status.textContent = 'Something went wrong. Try emailing me directly.';
        status.style.color = '#ec4899';
      }
    })
    .catch(() => {
      status.textContent = 'Something went wrong. Try emailing me directly.';
      status.style.color = '#ec4899';
    });
  });
})();