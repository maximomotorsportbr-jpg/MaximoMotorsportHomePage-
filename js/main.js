import { renderHeader } from "./components/header.js";
import { renderFooter } from "./components/footer.js";
import { initializeNavbar } from "./components/navbar.js";
import { initializeContact } from "./services/contactService.js";

function initializeApplication() {
  renderHeader();
  renderFooter();

  initializeNavbar();
  initializeContact();
}

document.addEventListener("DOMContentLoaded", initializeApplication);

const imagens = document.querySelectorAll("section img");

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
