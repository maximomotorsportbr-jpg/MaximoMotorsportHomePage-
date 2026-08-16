export function renderFooter() {

    const footer = document.querySelector("#footer");

    footer.innerHTML = `
        <div class="footer">

            <div class="container footer__content">

                <div>
                    <h2>Nome do negócio</h2>

                    <p>
                        Qualidade e confiança.
                    </p>
                </div>

                <div>
                    <h3>Contato</h3>

                    <p>
                        (19) 99778
                        0846
                    </p>
                </div>

            </div>

            <div class="footer__copyright">
                © 2026 Nome do negócio
            </div>

        </div>
    `;
}