const WHATSAPP_NUMBER = "5519997780846";

export function initializeContact() {

    const button =
        document.querySelector("#whatsapp-button");

    if (!button) {
        return;
    }

    button.addEventListener("click", openWhatsApp);
}

function openWhatsApp() {

    const message =
        encodeURIComponent(
            "Olá! Gostaria de conhecer os serviços."
        );

    const url =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    window.open(url, "_blank");
}