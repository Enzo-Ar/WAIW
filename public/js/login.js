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

            switch (r.erro) {
                case "ParamsError":
                    error_msg.textContent = 'Todos os parâmetros são obrigatórios.';
                    break;
                case "NoUser":
                    error_msg.textContent = 'Usuario inexistente. Crie uma conta.';
                    break;
                case "NoAuth":
                    error_msg.textContent = 'Email ou Senha estão errados.';
                    break;
                default:
                    error_msg.textContent = 'Server error, Login não efetuado.'
                    break;
            }

            error_div.appendChild(error_msg);

            senha_camp.insertAdjacentElement("afterend", error_div);
        }
    });
};