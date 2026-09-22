(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const site = window.SITE || {};

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const loader = $("#loader");
  const hideLoader = () => loader && loader.classList.add("hide");
  window.addEventListener("load", () => {
    window.setTimeout(hideLoader, prefersReduced ? 0 : 280);
  });
  window.setTimeout(hideLoader, prefersReduced ? 200 : 1200);

  const nav = $("#nav");
  const menuBtn = $("#menu-btn");
  const mobileMenu = $("#mobile-menu");

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const closeMenu = () => {
    if (!menuBtn || !mobileMenu) return;
    menuBtn.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
    mobileMenu.classList.remove("open");
    mobileMenu.hidden = true;
  };

  const openMenu = () => {
    menuBtn.classList.add("open");
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Close menu");
    mobileMenu.hidden = false;
    mobileMenu.classList.add("open");
  };

  menuBtn?.addEventListener("click", () => {
    mobileMenu.classList.contains("open") ? closeMenu() : openMenu();
  });

  mobileMenu?.addEventListener("click", (e) => {
    if (e.target.tagName === "A") closeMenu();
  });

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      history.pushState(null, "", id);
    });
  });

  const toast = $("#toast");
  let toastTimer;
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 1800);
  };

  const copyDiscord = async (message) => {
    const value = site.discordUsername || "popcorn_party1";
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    showToast(message || "Discord username copied!");
  };

  $$("[data-copy-discord]").forEach((btn) => {
    btn.addEventListener("click", () => copyDiscord(btn.dataset.copyMessage));
  });

  const communityGrid = $("#community-grid");
  if (communityGrid && Array.isArray(site.communities)) {
    communityGrid.innerHTML = site.communities
      .map(
        (item) => `
        <article class="glow-card community-card border-run reveal">
          <div class="card-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M8 15c-2.5 0-4-1.6-4-3.6C4 8.7 6.2 7 9 7c1.6 0 2.8.6 3.6 1.5C13.6 7.6 15.2 7 16.8 7 19.4 7 21 8.8 21 11.4c0 2-1.4 3.6-4 3.6h-9Z" stroke="currentColor" stroke-width="1.6"/></svg>
          </div>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <a class="btn btn-primary" href="${item.url}" target="_blank" rel="noopener noreferrer">${item.button}</a>
        </article>`
      )
      .join("");
  }

  const bindSocial = (linkId, url, unsetLabel) => {
    const link = document.getElementById(linkId);
    if (!link) return;
    const ready = url && !String(url).startsWith("PASTE_");
    if (ready) {
      link.href = url;
      link.target = "_blank";
      link.removeAttribute("aria-disabled");
    } else {
      link.href = "#contact";
      link.setAttribute("aria-disabled", "true");
      link.textContent = unsetLabel;
    }
  };
  bindSocial("youtube-link", site.youtubeUrl, "Add YouTube URL in config.js");
  bindSocial("instagram-link", site.instagramUrl, "Add Instagram URL in config.js");

  const visitEl = $("#visit-count");
  const visitNote = $("#visit-note");
  const localKey = "pp-local-visits";
  const sessionKey = "pp-visit-counted";

  const animateCount = (el, value) => {
    if (!el) return;
    const end = Number(value) || 0;
    if (prefersReduced) {
      el.textContent = end.toLocaleString();
      el.classList.add("ready");
      return;
    }
    const start = Math.max(0, end - Math.min(end, 28));
    const duration = 900;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(start + (end - start) * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
      else el.classList.add("ready");
    };
    requestAnimationFrame(tick);
  };

  const showLocalVisits = (reason) => {
    const current = Number(localStorage.getItem(localKey) || 0) + 1;
    localStorage.setItem(localKey, String(current));
    animateCount(visitEl, current);
    if (visitNote) {
      visitNote.textContent = `${reason} Showing visits on this device only.`;
    }
  };

  const loadVisits = async () => {
    const key = site.visitCounterKey || "popcornparty-portfolio-visits-v1";
    const already = sessionStorage.getItem(sessionKey) === "1";
    const endpoint = already
      ? `https://countapi.mileshilliard.com/api/v1/get/${encodeURIComponent(key)}`
      : `https://countapi.mileshilliard.com/api/v1/hit/${encodeURIComponent(key)}`;

    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) throw new Error("counter unavailable");
      const data = await res.json();
      const value = Number(data.value ?? data.count);
      if (!Number.isFinite(value)) throw new Error("bad payload");
      sessionStorage.setItem(sessionKey, "1");
      animateCount(visitEl, value);
      if (visitNote) {
        visitNote.textContent = already
          ? "Global visit count. This tab already counted once."
          : "Global visit count from a keyless public counter.";
      }
    } catch {
      showLocalVisits("Live counter could not be reached.");
    }
  };
  loadVisits();

  const reveals = $$(".reveal");
  if (prefersReduced) {
    reveals.forEach((el) => el.classList.add("in"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  const canvas = $("#particles");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let dots = [];
    let raf = 0;
    let visible = true;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 28000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.3,
        s: Math.random() * 0.25 + 0.05,
        a: Math.random() * 0.35 + 0.08,
      }));
    };

    const draw = () => {
      if (!visible) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((d) => {
        d.y -= d.s;
        if (d.y < -4) d.y = canvas.height + 4;
        ctx.beginPath();
        ctx.fillStyle = `rgba(180, 160, 255, ${d.a})`;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", () => {
      visible = document.visibilityState === "visible";
      if (visible) draw();
      else cancelAnimationFrame(raf);
    });
  }

  const glow = $("#cursor-glow");
  if (glow && !isTouch && !prefersReduced) {
    glow.style.opacity = "1";
    window.addEventListener(
      "pointermove",
      (e) => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      },
      { passive: true }
    );
  }

  if (!isTouch && !prefersReduced) {
    $$(".magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.16}px)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }

  const logo = $("#logo");
  const eggLayer = $("#egg-layer");
  let logoClicks = 0;
  let logoTimer;

  const burst = () => {
    if (!eggLayer || prefersReduced) return;
    for (let i = 0; i < 18; i += 1) {
      const k = document.createElement("span");
      k.className = "kernel";
      const dx = `${(Math.random() - 0.5) * 240}px`;
      const dy = `${-80 - Math.random() * 180}px`;
      k.style.setProperty("--dx", dx);
      k.style.setProperty("--dy", dy);
      k.style.left = "48px";
      k.style.top = "28px";
      eggLayer.appendChild(k);
      window.setTimeout(() => k.remove(), 900);
    }
  };

  logo?.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey) return;
    logoClicks += 1;
    window.clearTimeout(logoTimer);
    logoTimer = window.setTimeout(() => {
      logoClicks = 0;
    }, 1400);
    if (logoClicks >= 7) {
      logoClicks = 0;
      burst();
      showToast("pop.");
    }
  });

  let buffer = "";
  window.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key.length !== 1) return;
    buffer = (buffer + e.key.toLowerCase()).slice(-7);
    if (buffer === "popcorn") {
      const existing = $(".hidden-term");
      if (existing) existing.remove();
      const term = document.createElement("div");
      term.className = "hidden-term";
      term.textContent = "> systems online. keep building.";
      document.body.appendChild(term);
      window.setTimeout(() => term.remove(), 3200);
    }
  });

  console.log("%cPP", "color:#a855f7;font-size:28px;font-weight:700;");
  console.log("Popcorn Party — if you can read this, you already found one of the quieter rooms.");
})();
