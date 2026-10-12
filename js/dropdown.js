/**
 * Dropdown acessível (padrão "select-only combobox" simplificado).
 *
 * - O botão mostra SOMENTE a opção selecionada.
 * - Ao clicar, abre a lista com todas as opções.
 * - Ao escolher, a lista fecha e o botão passa a mostrar a nova opção.
 * - Teclado: Enter/Espaço/↓/↑ abrem; ↑ ↓ Home End navegam; Enter/Espaço escolhem;
 *   Esc fecha; Tab fecha. Clique fora também fecha.
 */

let uid = 0;
const openDropdowns = new Set();

// Um único listener global fecha qualquer dropdown aberto ao clicar fora.
document.addEventListener("pointerdown", (event) => {
  openDropdowns.forEach((dd) => {
    if (!dd.root.contains(event.target)) dd.close();
  });
});

/**
 * @param {Object}   cfg
 * @param {string}   cfg.name       identificador (vira classe dropdown--{name})
 * @param {string}   cfg.labelKey   chave i18n do rótulo (aria-label)
 * @param {Array<{value:string,label:string,short?:string,icon?:string}>} cfg.options
 * @param {string}   cfg.value      valor inicial
 * @param {(value:string)=>void} cfg.onChange
 * @param {string}   [cfg.icon]     SVG (string) exibido antes do texto no botão
 */
export function createDropdown({ name, labelKey, options, value, onChange, icon = "" }) {
  const id = `dd-${name}-${++uid}`;

  const root = document.createElement("div");
  root.className = `dropdown dropdown--${name}`;

  root.innerHTML = `
    <button type="button" class="dropdown__button" id="${id}-button"
            aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}-list"
            data-i18n-aria-label="${labelKey}">
      ${icon ? `<span class="dropdown__icon" aria-hidden="true">${icon}</span>` : ""}
      <span class="dropdown__value"></span>
      <span class="dropdown__chevron" aria-hidden="true"></span>
    </button>
    <ul class="dropdown__menu" id="${id}-list" role="listbox" tabindex="-1"
        aria-labelledby="${id}-button" hidden>
      ${options
        .map(
          (o, i) => `
        <li class="dropdown__option" role="option" id="${id}-opt-${i}"
            data-value="${o.value}" aria-selected="false">
          <span class="dropdown__option-label">${o.label}</span>
          <span class="dropdown__check" aria-hidden="true">✓</span>
        </li>`
        )
        .join("")}
    </ul>`;

  const button = root.querySelector(".dropdown__button");
  const valueEl = root.querySelector(".dropdown__value");
  const menu = root.querySelector(".dropdown__menu");
  const optionEls = [...root.querySelectorAll(".dropdown__option")];

  let current = value;
  let activeIndex = 0;

  const api = { root, open, close, setValue };

  function indexOfValue(v) {
    const i = options.findIndex((o) => o.value === v);
    return i === -1 ? 0 : i;
  }

  function setActive(index) {
    activeIndex = (index + options.length) % options.length;
    optionEls.forEach((el, i) => el.classList.toggle("is-active", i === activeIndex));
    menu.setAttribute("aria-activedescendant", optionEls[activeIndex].id);
    optionEls[activeIndex].scrollIntoView({ block: "nearest" });
  }

  function render() {
    const selected = options[indexOfValue(current)];
    valueEl.textContent = selected.short ?? selected.label;
    optionEls.forEach((el) => {
      el.setAttribute("aria-selected", String(el.dataset.value === current));
    });
  }

  function open() {
    if (!menu.hidden) return;
    // fecha os outros para nunca haver dois menus abertos
    openDropdowns.forEach((dd) => dd !== api && dd.close());
    menu.hidden = false;
    button.setAttribute("aria-expanded", "true");
    root.classList.add("is-open");
    openDropdowns.add(api);
    setActive(indexOfValue(current));
    menu.focus({ preventScroll: true });
  }

  function close({ returnFocus = false } = {}) {
    if (menu.hidden) return;
    menu.hidden = true;
    button.setAttribute("aria-expanded", "false");
    root.classList.remove("is-open");
    openDropdowns.delete(api);
    if (returnFocus) button.focus();
  }

  function choose(index) {
    const next = options[index].value;
    close({ returnFocus: true });
    if (next !== current) {
      current = next;
      render();
      onChange(next);
    }
  }

  function setValue(next) {
    current = next;
    render();
  }

  button.addEventListener("click", () => (menu.hidden ? open() : close()));

  button.addEventListener("keydown", (e) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      open();
    }
  });

  menu.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); setActive(activeIndex + 1); break;
      case "ArrowUp":   e.preventDefault(); setActive(activeIndex - 1); break;
      case "Home":      e.preventDefault(); setActive(0); break;
      case "End":       e.preventDefault(); setActive(options.length - 1); break;
      case "Enter":
      case " ":         e.preventDefault(); choose(activeIndex); break;
      case "Escape":    e.preventDefault(); close({ returnFocus: true }); break;
      case "Tab":       close(); break;
    }
  });

  optionEls.forEach((el, i) => {
    el.addEventListener("click", () => choose(i));
    el.addEventListener("pointermove", () => setActive(i));
  });

  render();
  return api;
}
