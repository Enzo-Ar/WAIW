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

function tempAndEp(slc, putDown) {
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

        const bothSpan = document.createElement('span');
        bothSpan.className  ="d-flex justify-content-around";

        const containerEp = document.createElement('div');
        containerEp.className = 'col-3';
        containerEp.id = 'div-Ep';

        const titleEp = document.createElement('label');
        titleEp.htmlFor = 'Ep';
        titleEp.className = 'form-label';
        titleEp.textContent = 'Episodio:';

        const inputEp = document.createElement('input');
        inputEp.type = 'number';
        inputEp.className = 'form-control field';
        inputEp.id = 'Ep'
        inputEp.name = 'Ep';
        inputEp.placeholder = 'Ep';

        containerEp.appendChild(titleEp);
        containerEp.appendChild(inputEp);
        bothSpan.appendChild(containerEp);

        const containerTemp = document.createElement('div');
        containerTemp.className = 'col-4';
        containerTemp.id = 'div-temp';

        const titleTemp = document.createElement('label');
        titleTemp.htmlFor = 'temp';
        titleTemp.className = 'form-label';
        titleTemp.textContent = 'Temporada:';

        const inputTemp = document.createElement('input');
        inputTemp.type = 'number';
        inputTemp.className = 'form-control field';
        inputTemp.id = 'temp'
        inputTemp.name = 'temp';
        inputTemp.placeholder = 'Temp';

        containerTemp.appendChild(titleTemp);
        containerTemp.appendChild(inputTemp);
        bothSpan.appendChild(containerTemp); 

        const concluidoCheck = document.createElement('div');
        concluidoCheck.className = 'col-3 col-md-2 d-flex flex-column align-items-center justify-content-end';
        concluidoCheck.id = 'conc';

        const labelCheck = document.createElement('label');
        labelCheck.htmlFor = 'concluido';
        labelCheck.textContent = 'concluido?';
        labelCheck.className = 'form-label';

        const inputCheck = document.createElement('input');
        inputCheck.type = 'checkbox';
        inputCheck.className = 'form-check field';
        inputCheck.id = 'concluido';
        inputCheck.name = 'concluido';
        inputCheck.value = 'concluido';

        concluidoCheck.appendChild(labelCheck);
        concluidoCheck.appendChild(inputCheck);
        bothSpan.appendChild(concluidoCheck);

        putDown.insertAdjacentElement("afterend", bothSpan);
    } else {
        const checkEP = document.querySelector('#Ep');
        const checkTemp = document.querySelector('#temp');
        const checkConc = document.querySelector('#conc');

        checkEP.remove();
        checkTemp.remove();
        checkConc.remove();
    }
}

async function midiaSelectorFetch(radioValue) {
    const midias_group = document.querySelector('#midias');
    const children = midias_group.children;

    for (let i = children.length - 1; i >= 0; i--) {
        children.item(i).remove();
    }

    //MUDAR PARA UMA ROTA QUE PODE PEGAR OU TUDO, OU SOMENTE ID E NOME PARA ECONOMIZAR TEMPO
    const url = `/api/${radioValue}`;
    const resultMidia = await fetch(url);
    const resultData = await resultMidia.json();

    if (resultMidia.ok) {
        resultData.forEach(midia => {
            const newOption = document.createElement('option');
            newOption.textContent = midia.nome;
            newOption.value = midia.id;

            midias_group.appendChild(newOption);
        })
    }
}

function limparCampos(tipo) {
    const titulo = document.querySelector('#titulo');
    const nota = document.querySelector('#nota');
    const data = document.querySelector('#data');
    const temp = document.querySelector('#temp');
    const ep = document.querySelector('#Ep');
    const concluido = document.querySelector('#concluido');
    const comentario = document.querySelector('#comentario');
    const poster = document.querySelector('#poster');
    
    titulo.value = null;
    nota.value = null;
    data.value = null;
    if (tipo === "series" || tipo === "cartoons") {
        temp.value = null;
        ep.value = null;
        concluido.checked = false;
    }
    comentario.value = null;
    poster.value = null;
}

//INIT FUNC ---------------------------------------------------------------------------------------------------
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

    //UPDATE - parte de atualizar midias existentes
    //-----------------------------------------------------------------------------------------------------------
    const slcs = document.querySelectorAll('input[type=radio]');
    const joiner = document.querySelector('#joiner');
    const line = document.querySelector('#theLine')

    const checkedRadio = document.querySelector("input[type=radio]:checked")?.value;
    midiaSelectorFetch(checkedRadio);

    slcs.forEach(slc => {
        slc.addEventListener('change', async (event) => {
            tempAndEp(slc, joiner, line);
            limparCampos(slc.value);
            midiaSelectorFetch(slc.value);
        });
    })

    const midias_group = document.querySelector('#midias');
    midias_group.addEventListener('change', async (event) => {
        const option = midias_group.options[midias_group.selectedIndex];
        const type = document.querySelector("input[type=radio]:checked")?.value;
        
        const selectedMidia = await fetch(`/api/${type}/${option.value}`);
        if (selectedMidia.ok) {
            //todos os conteudos da midia que serão incluidos
            const titulo = document.querySelector('#titulo');
            const nota = document.querySelector('#nota');
            const data = document.querySelector('#data');
            const temp = document.querySelector('#temp');
            const ep = document.querySelector('#Ep');
            const concluido = document.querySelector('#concluido');
            const comentario = document.querySelector('#comentario');
            const poster = document.querySelector('#poster');
            

            const midiaData = await selectedMidia.json();
            const m = midiaData[0];

            titulo.value = m.nome;
            nota.value = m.nota;
            data.value = m.data_assistido.slice(0, 10);
            if (type === "series" || type === "cartoons") {
                temp.value = m.p_temp;
                ep.value = m.p_ep;
                concluido.checked = m.concluido;
            }
            comentario.value = m.comentario;
            poster.value = m.poster;
        } else {
            console.log(option);
            console.log(type);
        }
    })
    
    //FORM parte
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
        const midiaID = formData.get('midias');
        const comentario = formData.get('comentario');
        const poster = formData.get('poster');

        const objForm = {
            id: midiaID,
            titulo: titulo,
            tipo: tipo,
            nota: nota,
            data: data,
            temp: temp,
            ep: ep,
            concluido: concluido,
            comentario: comentario,
            poster: poster
        };

        const result = await fetch('/catalogue/update', {
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
            error_div.className = 'col-12 mt-2 error-div';

            const error_msg = document.createElement('p');

            switch (r.erro) {
                case "ParamsError":
                    error_msg.textContent = 'Todos os parâmetros são obrigatórios.';
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