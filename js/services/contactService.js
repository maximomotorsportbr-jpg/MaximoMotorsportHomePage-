const WHATSAPP_NUMBER = "5511966230194";
const INSTAGRAM_URL = "https://www.instagram.com/maximomotorsportbr/";
const EMAIL = "maximomotorsportbr@gmail.com";

export function initializeContact() {

    const whatsappButtons =
        document.querySelectorAll(".whatsapp-button");

    whatsappButtons.forEach((button) => {
        button.addEventListener("click", openWhatsApp);
    });


    const instagramButtons =
        document.querySelectorAll(".instagram-button");

    instagramButtons.forEach((button) => {
        button.addEventListener("click", openInstagram);
    });


    const emailButtons =
        document.querySelectorAll(".email-button");

    emailButtons.forEach((button) => {
        button.addEventListener("click", openEmail);
    });
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


function openInstagram() {
    window.open(INSTAGRAM_URL, "_blank");
}


function openEmail() {


    const url =
        `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;

    window.open(url, "_blank");
}