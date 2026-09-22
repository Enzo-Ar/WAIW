document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        init();
    }
});

function decodificarJWT(token) {
    try {
        const base64Url = token.split('.')[1]; // Pega apenas o Payload
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Token inválido ou corrompido", error);
        return null;
    }
}

const init = async () => {
    //checando para autorização e autenticação
    const refreshRes = await fetch('/refresh', {method: 'POST'});
    const data = await refreshRes.json();

    const token = data.accessToken;
    const userData = decodificarJWT(token);

    if (!refreshRes.ok || userData.role !== "admin") {
        window.location.replace('/forbidden');
    }   
    
    // if (userData.role === "admin") 

    const navList = document.querySelector('#navList');
    
    const log_out = document.createElement('li');
    log_out.className = 'nav-item';

    const log_out_href = document.createElement('a');
    log_out_href.className = 'nav-link';
    log_out_href.textContent = 'Logout';

    log_out.appendChild(log_out_href);
    navList.appendChild(log_out);

    log_out.addEventListener('click', async (event) => {
        await fetch('/logout', {method: 'POST'});
        window.location.replace('/index');
    });

    const slcs = document.querySelectorAll('input[type=radio]');
    const categoria = document.querySelector('#categoria');

    slcs.forEach(slc => {
        slc.addEventListener('change', (event) => {
            if (slc.value === 'series' || slc.value === 'cartoons') {
                const checkEP = document.querySelector('#Ep');
                if (checkEP !== null) {
                    checkEP.remove();
                }

                const checkBefore = document.querySelector('#temp');
                if (checkBefore !== null) {
                    checkBefore.remove();
                }

                const containerEp = document.createElement('div');
                containerEp.className = 'col-12 col-md-5';
                containerEp.id = 'Ep';

                const titleEp = document.createElement('label');
                titleEp.htmlFor = 'Ep';
                titleEp.className = 'form-label';
                titleEp.textContent = 'Episodio que parei:';

                const inputEp = document.createElement('input');
                inputEp.type = 'number';
                inputEp.className = 'form-control field';
                inputEp.name = 'Ep';
                inputEp.placeholder = 'Episodio aqui';

                containerEp.appendChild(titleEp);
                containerEp.appendChild(inputEp);
                categoria.insertAdjacentElement('afterend', containerEp);

                const containerTemp = document.createElement('div');
                containerTemp.className = 'col-12 col-md-7';
                containerTemp.id = 'temp';

                const titleTemp = document.createElement('label');
                titleTemp.htmlFor = 'temp';
                titleTemp.className = 'form-label';
                titleTemp.textContent = 'Temporada que parei:';

                const inputTemp = document.createElement('input');
                inputTemp.type = 'number';
                inputTemp.className = 'form-control field';
                inputTemp.name = 'temp';
                inputTemp.placeholder = 'Temporada aqui';

                containerTemp.appendChild(titleTemp);
                containerTemp.appendChild(inputTemp);
                categoria.insertAdjacentElement('afterend', containerTemp); 
            } else {
                const checkEP = document.querySelector('#Ep');
                const checkBefore = document.querySelector('#temp');

                checkEP.remove();
                checkBefore.remove();
            }
        });
    })

    const regForm = document.querySelector('#regForm');
    regForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        const result = await fetch('/catalogue/insert', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!result.ok) {
            const r = await result.json();

            const check_error_div = document.querySelector('.error-div');
            if (check_error_div !== null) {
                check_error_div.remove();
            }

            const com_camp = document.querySelector('#comentario');
            const error_div = document.createElement('div');
            error_div.className = 'col-12 error-div';

            const error_msg = document.createElement('p');

            switch (r.erro) {
                case "ParamsError":
                    error_msg.textContent = 'Todos os parâmetros são obrigatórios.';
                    break;
                case "AlreadyExist":
                    error_msg.textContent = 'Já está inserido no banco de dados';
                    break;
                default:
                    error_msg.textContent = 'Server error, insert não efetuado.'
                    break;
            }

            error_div.appendChild(error_msg);

            com_camp.insertAdjacentElement("afterend", error_div);
        }
    })
}