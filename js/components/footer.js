export function renderFooter() {

    const footer = document.querySelector("#footer");

    footer.innerHTML = `
        <div class="footer">

            <div class="container footer__content">

                <div>
                    <h2>Máximo Motorsport</h2>

                    <p>
                        Qualidade e confiança.
                    </p>
                </div>

                <div>
                    <h3>Contato</h3>

                    <p>
                         +55 (11) 96623-0194
                    </p>
                    <p>
                         maximomotorsportbr@gmail.com
                    </p>
                </div>

            </div>

            <div class="footer__copyright">
                © 2026 Máximo Motorsport
            </div>

        </div>
    `;
}