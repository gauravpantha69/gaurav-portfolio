
document.addEventListener("DOMContentLoaded", () => {
  setYear();
    
  initThemeToggle();
  initMobileNav();
  initTerminalTyping();
  initScrollReveal();
  initActiveNav();
  initCopyEmail();
});


function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
    
}


function initThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
    
  const root = document.documentElement;

  
    
  if (!toggle) return;

  let storedTheme = null;

  try {
    storedTheme = localStorage.getItem("gp-theme");
  } catch (error) {
    storedTheme = null;
  }

  const prefersLight = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches;
    

  const initialTheme =
    storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : prefersLight
        ? "light"
        : "dark";

  applyTheme(initialTheme);

  toggle.addEventListener("click", () => {
    const currentTheme =
      root.getAttribute("data-theme") === "light"
        ? "light"
        : "dark";

    const nextTheme =
      currentTheme === "light"
        ? "dark"
        : "light";

    applyTheme(nextTheme);

    try {
      localStorage.setItem("gp-theme", nextTheme);
    } catch (error) {

        
    }
      
  });
    

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");

      toggle.setAttribute("aria-pressed", "true");
      toggle.setAttribute(
        "aria-label",
        "Switch to dark theme"
      );
      toggle.setAttribute(
        "title",
        "Switch to dark theme"
      );
        
    } else {
      root.removeAttribute("data-theme");

      toggle.setAttribute("aria-pressed", "false");
      toggle.setAttribute(
        "aria-label",
        "Switch to light theme"
      );
      toggle.setAttribute(
        "title",
        "Switch to light theme"
      );
    }

      
  }

    
}



function initMobileNav() {
  const burger = document.getElementById("nav-burger");
  const links = document.getElementById("nav-links");

  if (!burger || !links) return;

  burger.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");

    burger.classList.toggle("is-open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
    burger.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      burger.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Open menu");
    });
  });
}



function initTerminalTyping() {
  const textEl = document.getElementById("terminal-text");
  const cursorEl = document.getElementById("terminal-cursor");

  if (!textEl) return;

  const message = "whoami";
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    textEl.textContent = message;
    return;
  }

  let i = 0;
  const speed = 90;

  function typeNext() {
    if (i < message.length) {
      textEl.textContent += message[i];
      i += 1;
      setTimeout(typeNext, speed);
    } else if (cursorEl) {
      cursorEl.style.marginLeft = "3px";
    }
  }

  setTimeout(typeNext, 500);
}

function initScrollReveal() {
  const targets = document.querySelectorAll(
    ".section__title, .about__content, .skills-grid, .projects-grid, .empty-state, .contact-grid"
  );

  targets.forEach((el) => {
    el.setAttribute("data-reveal", "");
  });

  if (
    !("IntersectionObserver" in window) ||
    targets.length === 0
  ) {
    targets.forEach((el) => {
      el.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  targets.forEach((el) => observer.observe(el));
}


function initActiveNav() {
  const sections = document.querySelectorAll(
    "main .section, .hero"
  );

  const navLinks =
    document.querySelectorAll("[data-nav-link]");

  if (!sections.length || !navLinks.length) return;

  const linkFor = (id) =>
    document.querySelector(
      `.nav__link[href="#${id}"]`
    );

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkFor(entry.target.id);

        if (!link) return;

        if (entry.isIntersecting) {
          navLinks.forEach((l) =>
            l.classList.remove("is-active")
          );

          link.classList.add("is-active");
        }
      });
    },
    {
      rootMargin: "-45% 0px -50% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => {
    if (section.id) {
      observer.observe(section);
    }
  });
}

function initCopyEmail() {
  const button =
    document.getElementById("copy-email-btn");

  const label =
    document.getElementById("copy-btn-text");

  const emailLink =
    document.getElementById("email-link");

  if (!button || !label || !emailLink) return;

  button.addEventListener("click", async () => {
    const email = emailLink.textContent.trim();

    try {
      await navigator.clipboard.writeText(email);
      showCopied();
    } catch (error) {
      const range = document.createRange();

      range.selectNode(emailLink);

      const selection = window.getSelection();

      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }

      showCopied("Select + Ctrl/Cmd+C");
    }
  });

  function showCopied(text = "Copied") {
    const original = label.textContent;

    label.textContent = text;
    button.disabled = true;

    setTimeout(() => {
      label.textContent = original;
      button.disabled = false;
    }, 1800);
  }
}
