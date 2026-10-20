document.addEventListener("DOMContentLoaded", () => {
  initCanvasNetwork();
  initTypewriter();
  initSpotlightCards();
  initScrollRevealAndCounters();
  initScrollSpy();
});

// 1. Interactive HTML5 Canvas Particle Network (Cloud Nodes Effect)
function initCanvasNetwork() {
  const canvas = document.getElementById("network-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 28), 55);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.5 + 0.8
    });
  }

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(16, 185, 129, 0.45)";
      ctx.fill();

      // Connect nearby nodes
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.14 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// 2. Typewriter Role Cycling
function initTypewriter() {
  const words = [
    "Cloud-Native Platforms.",
    "Kubernetes Infrastructure.",
    "Resilient Microservices.",
    "AI-Augmented SRE Tooling."
  ];
  let i = 0, j = 0, isDeleting = false;
  const target = document.getElementById("typewriter");
  if (!target) return;

  function loop() {
    const current = words[i];
    target.textContent = current.substring(0, j);

    if (!isDeleting && j < current.length) {
      j++;
      setTimeout(loop, 70);
    } else if (isDeleting && j > 0) {
      j--;
      setTimeout(loop, 35);
    } else {
      isDeleting = !isDeleting;
      if (!isDeleting) i = (i + 1) % words.length;
      setTimeout(loop, isDeleting ? 1800 : 350);
    }
  }
  loop();
}

// 3. Mouse-Tracking Spotlight Effect
function initSpotlightCards() {
  document.querySelectorAll(".spotlight-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    });
  });
}

// 4. Scroll Reveal & Animated Metric Counters
function initScrollRevealAndCounters() {
  const revealElements = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll(".counter");
  let countersStarted = false;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          if (entry.target.id === "about" && !countersStarted) {
            countersStarted = true;
            runCounters(counters);
          }
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach(el => observer.observe(el));
}

function runCounters(counters) {
  counters.forEach(counter => {
    const target = +counter.getAttribute("data-target");
    const suffix = counter.getAttribute("data-suffix") || "";
    const duration = 1400;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target + suffix;
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current) + suffix;
      }
    }, stepTime);
  });
}

// 5. Navigation Scroll-Spy
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}
