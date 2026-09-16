document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        init();
    }
});

const init = async () => {
    const form = document.querySelector('#login');
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        const result = await fetch('/login', {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        });

        if (result.ok) {
            window.location.replace('/index');
        } else {
            const r = await result.json();

            const check_error_div = document.querySelector('.error-div');
            if (check_error_div !== null) {
                check_error_div.remove();
            }

            const senha_camp = document.querySelector('#senha-div');
            const error_div = document.createElement('div');
            error_div.className = 'col-12 error-div';

            const error_msg = document.createElement('p');
            const error_accent = document.createElement('b');

            switch (r.erro) {
                case "ParamsError":
                    error_accent.textContent = 'Todos os parâmetros são obrigatórios.';
                    break;
                case "NoUser":
                    error_accent.textContent = 'Usuario inexistente. Crie uma conta.';
                    break;
                case "NoAuth":
                    error_accent.textContent = 'Email ou Senha estão errados.';
                    break;
                default:
                    error_accent.textContent = 'Server error, Login não efetuado.'
                    break;
            }

            error_msg.appendChild(error_accent);
            error_div.appendChild(error_msg);

            senha_camp.insertAdjacentElement("afterend", error_div);
        }
    });
};