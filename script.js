(() => {
  const EMAIL = "contacto@xpertasesores.com.mx";
  const READING = 5000;
  const EXIT_MS = 600;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const slides = [
    {
      id: "alianzas",
      kicker: "XP Asesores",
      headline: "ALIANZAS QUE",
      accent: "IMPULSAN VALOR",
      body: "Crear relaciones de largo plazo a través de soluciones financieras integrales y una red estratégica.",
      cta: "Habla con un especialista",
      href: "#contacto",
      secondary: "Nuestra Historia",
      secondaryHref: "#evolucion",
      image: "images/hero.jpg",
      video: "images/hero.mp4",
    },
    {
      id: "identidad",
      kicker: "Identidad XP",
      headline: "ÉXITO DEL",
      accent: "CLIENTE",
      body: "Soluciones financieras con un enfoque en el éxito del cliente.",
      cta: "Conoce nuestra identidad",
      href: "#identidad",
      secondary: "Habla con un especialista",
      secondaryHref: "#contacto",
      image: "images/paisaje-reforma.jpg",
      video: null,
    },
    {
      id: "soluciones",
      kicker: "Portafolio de soluciones",
      headline: "HERRAMIENTAS",
      accent: "INTEGRALES",
      body: "Herramientas integrales para el crecimiento empresarial.",
      cta: "Conoce el portafolio",
      href: "#soluciones",
      secondary: "Habla con un especialista",
      secondaryHref: "#contacto",
      image: "images/paisaje-santafe.jpg",
      video: null,
    },
  ];

  const headerBar = document.querySelector(".nav-bar");
  const onScroll = () => headerBar?.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const menuBtn = document.querySelector(".menu-toggle");
  const sheet = document.querySelector(".mobile-sheet");
  const closeMenu = () => {
    sheet?.classList.remove("is-open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  menuBtn?.addEventListener("click", () => {
    const open = !sheet?.classList.contains("is-open");
    sheet?.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });
  sheet?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  const mega = document.querySelector(".mega");
  const megaBtn = document.querySelector(".mega-btn");
  const megaPanel = document.querySelector(".mega-panel");
  const setMega = (on) => {
    megaPanel?.classList.toggle("is-off", !on);
    megaBtn?.setAttribute("aria-expanded", String(on));
  };
  megaBtn?.addEventListener("click", () => setMega(megaPanel?.classList.contains("is-off")));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setMega(false);
      closeMenu();
    }
  });

  const hero = document.querySelector(".hero");
  const stage = document.querySelector(".hero-stage");
  const kickerEl = document.querySelector("[data-kicker]");
  const titleEl = document.querySelector("[data-title]");
  const accentEl = document.querySelector("[data-accent]");
  const bodyEl = document.querySelector("[data-body]");
  const ctaEl = document.querySelector("[data-cta]");
  const secondaryEl = document.querySelector("[data-secondary]");
  const numEl = document.querySelector("[data-num]");
  const dots = document.querySelector(".hero-dots");
  const video = document.querySelector(".hero-video");

  let index = 0;
  let paused = false;
  let remain = READING;
  let exitTimer = 0;
  let nextTimer = 0;

  const pad = (n) => String(n).padStart(2, "0");

  function paintDots() {
    if (!dots) return;
    dots.innerHTML = slides
      .map((_, i) => {
        const fill =
          i === index
            ? `<b class="hero-progress${paused ? " is-paused" : ""}" style="animation-duration:${READING}ms"></b>`
            : i < index
              ? `<b class="hero-progress is-done"></b>`
              : "";
        return `<button class="hero-dot" type="button" aria-label="Ir al slide ${i + 1}" data-go="${i}"><i>${fill}</i></button>`;
      })
      .join("");
    dots.querySelectorAll("[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => go(Number(btn.getAttribute("data-go"))));
    });
  }

  function applySlide(i, withCurtain) {
    const s = slides[i];
    document.querySelectorAll(".hero-media").forEach((el, n) => {
      el.classList.toggle("is-active", n === i);
    });
    if (kickerEl) kickerEl.textContent = s.kicker;
    if (titleEl) titleEl.textContent = s.headline;
    if (accentEl) accentEl.textContent = s.accent;
    if (bodyEl) bodyEl.textContent = s.body;
    if (ctaEl) {
      ctaEl.textContent = s.cta;
      ctaEl.closest("a")?.setAttribute("href", s.href);
    }
    if (secondaryEl) {
      secondaryEl.textContent = s.secondary;
      secondaryEl.setAttribute("href", s.secondaryHref);
    }
    if (numEl) numEl.innerHTML = `${pad(i + 1)}<span>/</span>${pad(slides.length)}`;
    if (video) {
      if (i === 0) video.play().catch(() => {});
      else video.pause();
    }
    document.querySelectorAll(".hero-still").forEach((img) => {
      img.style.animation = "none";
      void img.offsetWidth;
      img.style.animation = "";
    });
    const oldCurtain = document.querySelector(".hero-curtain");
    if (withCurtain && oldCurtain) {
      oldCurtain.replaceWith(oldCurtain.cloneNode(true));
    }
    paintDots();
    if (stage) {
      stage.classList.remove("is-exiting");
      stage.querySelectorAll(".hero-anim").forEach((el) => {
        el.style.animation = "none";
        void el.offsetWidth;
        el.style.animation = "";
      });
    }
  }

  function clearTimers() {
    window.clearTimeout(exitTimer);
    window.clearTimeout(nextTimer);
  }

  function armTimers() {
    clearTimers();
    if (paused || reduce) return;
    const budget = remain;
    exitTimer = window.setTimeout(() => stage?.classList.add("is-exiting"), Math.max(0, budget - EXIT_MS));
    nextTimer = window.setTimeout(() => go(index + 1), budget);
    remain = READING;
  }

  function go(next) {
    remain = READING;
    index = (next + slides.length) % slides.length;
    applySlide(index, true);
    armTimers();
  }

  applySlide(0, false);
  armTimers();

  document.querySelector("[data-prev]")?.addEventListener("click", () => go(index - 1));
  document.querySelector("[data-next]")?.addEventListener("click", () => go(index + 1));

  let touchX = null;
  hero?.addEventListener("touchstart", (e) => { touchX = e.changedTouches[0]?.clientX ?? null; }, { passive: true });
  hero?.addEventListener("touchend", (e) => {
    if (touchX == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchX) - touchX;
    if (dx < -48) go(index + 1);
    if (dx > 48) go(index - 1);
    touchX = null;
  }, { passive: true });

  const reveals = document.querySelectorAll(".reveal");
  if (reduce) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = Number(entry.target.getAttribute("data-delay") || 0);
          window.setTimeout(() => entry.target.classList.add("is-in"), delay);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -10% 0px" });
    reveals.forEach((el) => obs.observe(el));
  }

  const stats = document.querySelector("#cifras");
  if (stats) {
    let ran = false;
    const cObs = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting || ran) return;
      ran = true;
      document.querySelectorAll("[data-count]").forEach((el) => {
        const target = Number(el.getAttribute("data-count"));
        const suffix = el.getAttribute("data-suffix") || "";
        if (reduce) {
          el.textContent = `${target}${suffix}`;
          return;
        }
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / 1100);
          const eased = 1 - (1 - t) ** 3;
          el.textContent = `${Math.round(target * eased)}${suffix}`;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.2 });
    cObs.observe(stats);
  }

  document.querySelectorAll(".faq-item").forEach((item) => {
    item.querySelector("button")?.addEventListener("click", () => {
      const open = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item").forEach((other) => other.classList.remove("is-open"));
      if (!open) item.classList.add("is-open");
    });
  });

  const form = document.querySelector("#contacto-form");
  const thanks = document.querySelector(".thanks");
  const fields = document.querySelector(".fields-block");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nombre = String(data.get("nombre") || "");
    const empresa = String(data.get("empresa") || "");
    const correo = String(data.get("correo") || "");
    const telefono = String(data.get("telefono") || "");
    const interes = String(data.get("interes") || "");
    const mensaje = String(data.get("mensaje") || "");
    const body = [
      `Nombre: ${nombre}`,
      `Empresa: ${empresa}`,
      `Correo: ${correo}`,
      `Teléfono: ${telefono}`,
      `Interés: ${interes}`,
      "",
      mensaje,
    ].join("\n");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      `Solicitud de asesoría — ${empresa || nombre}`,
    )}&body=${encodeURIComponent(body)}`;
    form.classList.add("is-sent");
    fields?.setAttribute("hidden", "");
    thanks?.classList.add("is-on");
  });
  document.querySelector("[data-reset-form]")?.addEventListener("click", () => {
    form?.classList.remove("is-sent");
    form?.reset();
    fields?.removeAttribute("hidden");
    thanks?.classList.remove("is-on");
  });
})();
