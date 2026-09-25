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

        const bothSpan = document.createElement('span');
        bothSpan.className  ="d-flex justify-content-around";

        const containerEp = document.createElement('div');
        containerEp.className = 'col-3';
        containerEp.id = 'Ep';

        const titleEp = document.createElement('label');
        titleEp.htmlFor = 'Ep';
        titleEp.className = 'form-label';
        titleEp.textContent = 'Episodio:';

        const inputEp = document.createElement('input');
        inputEp.type = 'number';
        inputEp.className = 'form-control field';
        inputEp.name = 'Ep';
        inputEp.placeholder = 'Ep';

        containerEp.appendChild(titleEp);
        containerEp.appendChild(inputEp);
        bothSpan.appendChild(containerEp);

        const containerTemp = document.createElement('div');
        containerTemp.className = 'col-4';
        containerTemp.id = 'temp';

        const titleTemp = document.createElement('label');
        titleTemp.htmlFor = 'temp';
        titleTemp.className = 'form-label';
        titleTemp.textContent = 'Temporada:';

        const inputTemp = document.createElement('input');
        inputTemp.type = 'number';
        inputTemp.className = 'form-control field';
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
            midiaSelectorFetch(slc.value);
        });
    })

    const midias_group = document.querySelector('#midias');
    midias_group.addEventListener('change', async (event) => {
        const option = midias_group.options[midias_group.selectedIndex];
        const type = document.querySelector("input[type=radio]:checked")?.value;
        
        const selectedMidia = await fetch(`/api/${type}/${option.value}`);
        if (selectedMidia.ok) {
            const midiaData = await selectedMidia.json();
            const titulo = document.querySelector('#titulo');
            titulo.value = midiaData[0].nome;
        } else {
            console.log(option);
            console.log(type);
        }
    })
    // const opts = midias_group.querySelectorAll('option');
    // console.log(opts);
    // opts.forEach(opt => {
    //     opt.addEventListener('change', async (event) => {
    //         if (opt.selected) {
    //             console.log(opt.value);
    //         }
    //         console.log("nahhh");
    //     })
    // })
}