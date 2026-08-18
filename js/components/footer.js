export function renderFooter() {
    const footer = document.querySelector("#footer");

    footer.innerHTML = `
        <div class="footer">

            <div class="container footer__content">

                <div>
                    <h3>Contato</h3>

                    <p>+55 (11) 96623-0194</p>
                    <p>maximomotorsportbr@gmail.com</p>
                    <p>Piracicaba - SP</p>
                </div>

                <div>
                    <h2>Máximo Motorsport</h2>

                    <p>
                        Qualidade e confiança.
                    </p>
                </div>

            </div>

            <div class="footer__bottom">

                <div class="footer__copyright">
                    © ${new Date().getFullYear()} Máximo Motorsport · Desenvolvido por
                    <a
                        href="https://www.linkedin.com/in/gabriel-sampaio0122/"
                        target="_blank"
                        rel="noopener noreferrer">
                        Gabriel Sampaio
                    </a>
                </div>

            </div>

        </div>
    `;
}
