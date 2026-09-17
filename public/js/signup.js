document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        init();
    }
});

const init = async () => {
    const form = document.querySelector('#signup');
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        const result = await fetch('/register', {
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

            const email_camp = document.querySelector('#email-div');
            const senha_camp = document.querySelector('#senha-div');
            const error_div = document.createElement('div');
            error_div.className = 'col-12 error-div';

            const error_msg = document.createElement('p');

            let pos_decider;

            switch (r.erro) {
                case "ParamsError":
                    error_msg.textContent = 'Todos os parâmetros são obrigatórios.';
                    break;
                case "ExistsUser":
                    error_msg.textContent = 'Já existe um usuário com esse Email.';
                    pos_decider = 1; //um é para colocar abaixo do email
                    break;
                default:
                    error_msg.textContent = 'Server error, Login não efetuado.'
                    break;
            }

            error_div.appendChild(error_msg);

            switch (pos_decider) {
                case 1:
                    email_camp.insertAdjacentElement("afterend", error_div);
                    break;
                default:
                    senha_camp.insertAdjacentElement("afterend", error_div);
                    break;
            }
        }
    });
};