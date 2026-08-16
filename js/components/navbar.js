export function initializeNavbar() {

    const menuButton =
        document.querySelector("#menu-button");

    const navbarLinks =
        document.querySelector("#navbar-links");

    if (!menuButton || !navbarLinks) {
        return;
    }

    menuButton.addEventListener("click", () => {

        navbarLinks.classList.toggle(
            "navbar__links--active"
        );

    });
}