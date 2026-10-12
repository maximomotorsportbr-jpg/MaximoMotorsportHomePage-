import { translations, SUPPORTED_LANGS, DEFAULT_LANG } from "./translations.js";
import { createDropdown } from "./dropdown.js";

/* =========================================================
   CONFIGURAÇÃO — edite aqui os dados de contato
   ========================================================= */

const CONFIG = {
  instagramUrl: "https://www.instagram.com/maximomotorsportbr/",
  instagramHandle: "",
  whatsappNumber: "5511966230194",
  email: "maximomotorsportbr@gmail.com",
};


const STORAGE = { theme: "mm-theme", lang: "mm-lang" };
const THEMES = ["dark", "light"];
const THEME_COLORS = { dark: "#0d0d0d", light: "#f5f5f5" };

const NAV_LINKS = [
  { href: "#hero", key: "nav.home" },
  { href: "#sobre", key: "nav.about" },
  { href: "#galeria-utv", key: "nav.gallery" },
  { href: "#servicos", key: "nav.services" },
  { href: "#contato", key: "nav.contact" },
];

const ICON_GLOBE =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
const ICON_CONTRAST =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>';


/* =========================================================
   ESTADO + ARMAZENAMENTO (com try/catch: pode estar bloqueado)
   ========================================================= */


const store = {
  get(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch { /* ignora */ }
  },
};

const state = {
  theme: THEMES.includes(store.get(STORAGE.theme)) ? store.get(STORAGE.theme) : "dark",
  lang: SUPPORTED_LANGS.includes(store.get(STORAGE.lang)) ? store.get(STORAGE.lang) : DEFAULT_LANG,
};

let themeDropdown = null;
let langDropdown = null;



/* =========================================================
   TRADUÇÃO
   ========================================================= */
   
function t(key, vars = {}) {
  const text = translations[state.lang]?.[key] ?? translations[DEFAULT_LANG][key] ?? key;
  return text.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "");
}

const ATTRIBUTE_BINDINGS = {
  "data-i18n-alt": "alt",
  "data-i18n-aria-label": "aria-label",
  "data-i18n-content": "content",
};

function applyTranslations(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n, el.dataset);
  });

  for (const [attr, target] of Object.entries(ATTRIBUTE_BINDINGS)) {
    root.querySelectorAll(`[${attr}]`).forEach((el) => {
      el.setAttribute(target, t(el.getAttribute(attr), el.dataset));
    });
  }

  document.documentElement.lang = state.lang === "pt" ? "pt-BR" : "en";
  document.title = t("meta.title");

  const locale = document.querySelector('meta[property="og:locale"]');
  if (locale) locale.setAttribute("content", state.lang === "pt" ? "pt_BR" : "en_US");
}

function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  state.lang = lang;
  store.set(STORAGE.lang, lang);
  applyTranslations();
  setupContactLinks();
  langDropdown?.setValue(lang);
}


/* =========================================================
   TEMA
   ========================================================= */

function setTheme(theme) {
  if (!THEMES.includes(theme)) return;
  state.theme = theme;
  store.set(STORAGE.theme, theme);
  document.documentElement.setAttribute("data-theme", theme);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLORS[theme]);

  themeDropdown?.setValue(theme);
}


/* =========================================================
   HEADER
   ========================================================= */

function buildHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  header.classList.add("header");
  header.innerHTML = `
    <div class="container">
      <nav class="navbar" data-i18n-aria-label="ui.mainMenu">
        <a class="navbar__logo" href="#hero">
          <img src="assets/img/logo-simples.svg" alt="" width="48" height="48" decoding="async" />
          <span class="navbar__logo-text">Máximo Motorsport</span>
        </a>

        <ul class="navbar__links">
          ${NAV_LINKS.map(
            (l) => `<li><a href="${l.href}" data-i18n="${l.key}"></a></li>`
          ).join("")}
        </ul>

        <div class="navbar__controls"></div>
      </nav>
    </div>`;

  themeDropdown = createDropdown({
    name: "theme",
    labelKey: "ui.theme",
    icon: ICON_CONTRAST,
    value: state.theme,
    options: [
      { value: "dark", label: "Dark" },
      { value: "light", label: "White" },
    ],
    onChange: setTheme,
  });

  langDropdown = createDropdown({
    name: "lang",
    labelKey: "ui.language",
    icon: ICON_GLOBE,
    value: state.lang,
    options: [
      { value: "pt", label: "Português", short: "PT" },
      { value: "en", label: "English", short: "EN" },
    ],
    onChange: setLang,
  });

  const controls = header.querySelector(".navbar__controls");
  controls.append(langDropdown.root, themeDropdown.root);
}

/** Mantém --header-height igual à altura real do header (âncoras e hero dependem disso). */
function trackHeaderHeight() {
  const header = document.getElementById("header");
  if (!header) return;

  const update = () => {
    document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
  };
  update();

  if ("ResizeObserver" in window) new ResizeObserver(update).observe(header);
  else window.addEventListener("resize", update);
}

/** Marca no menu a seção que está na tela. */
function trackActiveSection() {
  if (!("IntersectionObserver" in window)) return;

  const sectionToLink = { "galeria-veiculos": "galeria-utv" };
  const links = new Map(
    [...document.querySelectorAll(".navbar__links a")].map((a) => [a.getAttribute("href").slice(1), a])
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = sectionToLink[entry.target.id] ?? entry.target.id;
        links.forEach((a, key) => {
          if (key === id) a.setAttribute("aria-current", "location");
          else a.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  document
    .querySelectorAll("#hero, #sobre, #galeria-utv, #galeria-veiculos, #servicos, #diferenciais, #contato")
    .forEach((s) => observer.observe(s));
}

/* =========================================================
   FOOTER
   ========================================================= */

function buildFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return;

  footer.classList.add("footer");

  const contactItems = [
    `<li><a href="#" data-social="instagram" target="_blank" rel="noopener noreferrer">Instagram ${CONFIG.instagramHandle}</a></li>`,
  ];
  if (CONFIG.whatsappNumber) {
    contactItems.push(
      `<li><a href="#" data-social="whatsapp" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>`
    );
  }
  if (CONFIG.email) {
    contactItems.push(`<li><a href="#" data-social="email">${CONFIG.email}</a></li>`);
  }

  footer.innerHTML = `
    <div class="container">
      <div class="footer__content">
        <div class="footer__brand">
          <img src="assets/img/logo.svg" width="120" height="120" loading="lazy" decoding="async"
               data-i18n-alt="ui.logoAlt" alt="" />
          <p data-i18n="footer.tagline"></p>
        </div>

        <nav class="footer__column" aria-labelledby="footer-nav-title">
          <h3 id="footer-nav-title" data-i18n="footer.navTitle"></h3>
          <ul class="footer__list">
            ${NAV_LINKS.map((l) => `<li><a href="${l.href}" data-i18n="${l.key}"></a></li>`).join("")}
          </ul>
        </nav>

        <div class="footer__column">
          <h3 data-i18n="footer.contactTitle"></h3>
          <ul class="footer__list">${contactItems.join("")}</ul>
        </div>
      </div>

      <p class="footer__copyright">
        © ${new Date().getFullYear()} Máximo Motorsport <span data-i18n="footer.rights"></span>
         <a
           href="https://www.linkedin.com/in/gabriel-sampaio0122/"
            target="_blank"
            rel="noopener noreferrer">
              <span data-i18n="footer.dev">
          </a>
      </p>
      
    </div>`;
}

/* =========================================================
   LINKS DE CONTATO (Instagram / WhatsApp / e-mail)
   ========================================================= */

function disableLink(a) {
  a.setAttribute("aria-disabled", "true");
  a.removeAttribute("target");
  if (!a.dataset.blocked) {
    a.dataset.blocked = "1";
    a.addEventListener("click", (e) => {
      if (a.getAttribute("aria-disabled") === "true") e.preventDefault();
    });
  }
}

function setupContactLinks() {
  document
    .querySelectorAll(".instagram-button, [data-social='instagram']")
    .forEach((a) => (a.href = CONFIG.instagramUrl));

  const whatsapp = document.querySelectorAll(".whatsapp-button, [data-social='whatsapp']");
  if (CONFIG.whatsappNumber) {
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(t("contact.whatsappMessage"))}`;
    whatsapp.forEach((a) => {
      a.href = url;
      a.removeAttribute("aria-disabled");
      a.target = "_blank";
    });
  } else {
    whatsapp.forEach(disableLink);
    if (!setupContactLinks.warned) {
      console.warn("[Máximo Motorsport] Defina CONFIG.whatsappNumber em js/main.js para ativar o WhatsApp.");
      setupContactLinks.warned = true;
    }
  }

  if (CONFIG.email) {
    document
      .querySelectorAll(".email-button, [data-social='email']")
      .forEach((a) => (a.href = `mailto:${CONFIG.email}`));
  }
}

/* =========================================================
   CARROSSEL — duplica o grupo para o loop infinito
   (assim o HTML não precisa repetir os cards)
   ========================================================= */

function setupCarousels() {
  document.querySelectorAll(".carousel").forEach((carousel) => {
    const groups = carousel.querySelectorAll(".group");
    if (groups.length !== 1) return;

    const clone = groups[0].cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("a, button, [tabindex]").forEach((el) => el.setAttribute("tabindex", "-1"));
    carousel.append(clone);
  });
}

/* =========================================================
   MODAL DE IMAGEM
   ========================================================= */

function setupImageModal() {
  const modal = document.getElementById("modalImagem");
  const modalImg = document.getElementById("imagemAmpliada");
  const closeBtn = document.getElementById("fecharModal");
  if (!modal || !modalImg || !closeBtn) return;

  let lastFocused = null;
  const isOpen = () => modal.style.display === "flex";

  function open(img) {
    lastFocused = img;
    modalImg.src = img.currentSrc || img.src;
    modalImg.alt = img.alt || t("modal.alt");
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    modal.style.display = "none";
    modalImg.removeAttribute("src");
    document.body.style.overflow = "";
    lastFocused?.focus?.();
  }

  document.querySelectorAll(".galeria-grid img").forEach((img) => {
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.addEventListener("click", () => open(img));
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(img);
      }
    });
  });

  closeBtn.addEventListener("click", close);
  closeBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      close();
    }
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener("keydown", (e) => {
    if (!isOpen()) return;
    if (e.key === "Escape") close();
    // mantém o foco dentro do modal
    if (e.key === "Tab") {
      e.preventDefault();
      closeBtn.focus();
    }
  });
}

/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function init() {
  setTheme(state.theme);

  buildHeader();
  buildFooter();
  setupCarousels();
  setupImageModal();

  applyTranslations();
  setupContactLinks();

  trackHeaderHeight();
  trackActiveSection();
}

init();
