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

function tempAndEp(slc, putDown, putUp) {
    if (slc.value === 'series' || slc.value === 'cartoons') {
        const checkEP = document.querySelector('#Ep');
        if (checkEP !== null) {
            checkEP.remove();
        }

        const checkTemp = document.querySelector('#temp');
        if (checkTemp !== null) {
            checkTemp.remove();
        }

        const checkConc = document.querySelector('#conc');
        if (checkConc !== null) {
            checkConc.remove();
        }

        const containerEp = document.createElement('div');
        containerEp.className = 'col-10 col-md-5';
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
        putDown.insertAdjacentElement('afterend', containerEp);

        const containerTemp = document.createElement('div');
        containerTemp.className = 'col-10 col-md-5';
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
        putDown.insertAdjacentElement('afterend', containerTemp); 

        const concluidoCheck = document.createElement('div');
        concluidoCheck.className = 'col-3 col-md-2 d-flex flex-column align-items-center justify-content-end';
        concluidoCheck.id = 'conc';

        const labelCheck = document.createElement('label');
        labelCheck.htmlFor = 'concluido';
        labelCheck.textContent = 'concluido?';
        labelCheck.className = 'form-label';

        const inputCheck = document.createElement('input');
        inputCheck.type = 'checkbox';
        inputCheck.className = 'form-check field mb-3';
        inputCheck.name = 'concluido';
        inputCheck.value = 'concluido';

        concluidoCheck.appendChild(labelCheck);
        concluidoCheck.appendChild(inputCheck);
        putUp.insertAdjacentElement('beforebegin', concluidoCheck);
    } else {
        const checkEP = document.querySelector('#Ep');
        const checkTemp = document.querySelector('#temp');
        const checkConc = document.querySelector('#conc');

        checkEP.remove();
        checkTemp.remove();
        checkConc.remove();
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

    //INSERT - parte do registro de novas midias
    //--------------------------------------------------------------------------------------------------------------------

    const CatSelect = document.querySelector('#categorias')
    const genResult = await fetch('/catalogue/categorias');
    const generos = await genResult.json();
    generos.forEach(genero => {
        const newOption = document.createElement('option');
        newOption.value = genero.id;
        newOption.textContent = genero.nome_gen;

        CatSelect.appendChild(newOption);
    })

    const slcs = document.querySelectorAll('input[type=radio]');
    const categoria = document.querySelector('#categoria');
    const comentario = document.querySelector('#comentario');

    slcs.forEach(slc => {
        slc.addEventListener('change', (event) => {
            tempAndEp(slc, categoria, comentario);
        });
    })

    const regForm = document.querySelector('#regForm');
    regForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        const titulo = formData.get('titulo');
        const tipo = formData.get('tipo');
        const nota = formData.get('nota');
        const data = formData.get('data');
        const temp  = formData.get('temp');
        const ep = formData.get('Ep');
        const concluido = formData.get('concluido');
        const categorias = formData.getAll('categorias');
        const comentario = formData.get('comentario');
        const poster = formData.get('poster');

        const objForm = {
            titulo: titulo,
            tipo: tipo,
            nota: nota,
            data: data,
            temp: temp,
            ep: ep,
            concluido: concluido,
            categorias: categorias,
            comentario: comentario,
            poster: poster
        };

        const result = await fetch('/catalogue/insert', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(objForm)
        });

        if (!result.ok) {
            const r = await result.json();

            const check_error_div = document.querySelector('.error-div');
            if (check_error_div !== null) {
                check_error_div.remove();
            }

            const poster_text = document.querySelector('#poster-text');
            const error_div = document.createElement('div');
            error_div.className = 'col-12 error-div';

            const error_msg = document.createElement('p');

            switch (r.erro) {
                case "ParamsError":
                    error_msg.textContent = 'Todos os parâmetros são obrigatórios.';
                    break;
                case "AlreadyExists":
                    error_msg.textContent = 'Já está inserido no banco de dados';
                    break;
                case "NotIncludedRight":
                    error_msg.textContent = 'Não foi corretamente incluido';
                    break;
                default:
                    error_msg.textContent = 'Server error, insert não efetuado.'
                    break;
            }

            error_div.appendChild(error_msg);

            poster_text.insertAdjacentElement("afterend", error_div);
        }
    })
}