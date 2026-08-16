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