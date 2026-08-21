import { renderHeader } from "./components/header.js";
import { renderFooter } from "./components/footer.js";
import { initializeNavbar } from "./components/navbar.js";
import { initializeContact } from "./services/contactService.js";

function initializeApplication() {
  renderHeader();
  renderFooter();

  initializeTheme();

  //initializeNavbar();
  initializeContact();
}

document.addEventListener("DOMContentLoaded", initializeApplication);

// ==============================
// MODAL DE IMAGENS
// ==============================

const imagens = document.querySelectorAll("section img");
const botaoFechar = document.getElementById("fecharModal");

botaoFechar.addEventListener("click", fecharImagem);

imagens.forEach((imagem) => {
  imagem.addEventListener("click", () => {
    abrirImagem(imagem);
  });
});

function abrirImagem(imagem) {
  const modal = document.getElementById("modalImagem");
  const imagemAmpliada = document.getElementById("imagemAmpliada");

  imagemAmpliada.src = imagem.src;

  modal.style.display = "flex";
}

function fecharImagem() {
  document.getElementById("modalImagem").style.display = "none";
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    fecharImagem();
  }
});

// ==============================
// LAZY LOADING
// ==============================

document.querySelectorAll("img").forEach((img) => {
  img.loading = "lazy";
});

// ==============================
// THEME
// ==============================
function initializeTheme() {
  const themeToggle = document.querySelector("#theme-toggle");
  const themeOptions = document.querySelectorAll(".theme-option");

  themeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedTheme = option.dataset.theme;

      // Remove destaque das opções
      themeOptions.forEach((item) => {
        item.classList.remove("active");
      });

      // Destaca a opção selecionada
      option.classList.add("active");

      // Move o slider
      themeToggle.classList.toggle("light", selectedTheme === "light");

      // Altera o tema da página
      document.documentElement.dataset.theme = selectedTheme;
    });
  });
}
