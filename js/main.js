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

document.addEventListener(
    "DOMContentLoaded",
    initializeApplication
);

    function abrirImagem(imagem) {
        const modal = document.getElementById("modalImagem");
        const imagemAmpliada = document.getElementById("imagemAmpliada");

        imagemAmpliada.src = imagem.src;

        modal.style.display = "flex";
    }

    function fecharImagem() {
        document.getElementById("modalImagem").style.display = "none";
    }
