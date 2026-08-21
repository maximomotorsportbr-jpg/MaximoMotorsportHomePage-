export function renderHeader() {
  const header = document.querySelector("#header");

  header.innerHTML = `
        <nav class="navbar">

            <div class="container navbar__content">

                <ul class="navbar__links" id="navbar-links">

                    <li>
                        <a href="#sobre">Sobre</a>
                    </li>

                    <li>
                        <a href="#servicos">Serviços</a>
                    </li>

                    <li>
                        <a href="#contato">Contato</a>
                    </li>

                    <li>
                        <div class="theme-toggle" id="theme-toggle">

                            <button class="theme-option" data-theme="dark">
                                ☾ Dark
                            </button>

                            <button class="theme-option" data-theme="light">
                                ☀ White
                            </button>

                            <span class="theme-slider"></span>

                        </div>
                    </li>

                </ul>

            </div>

        </nav>
    `;
}
