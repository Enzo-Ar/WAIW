import { id } from "date-fns/locale";

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
    })

    const slc_filme = document.querySelector('#slc-filme');
    const slc_serie = document.querySelector('#slc-serie');
    const slc_cartoon = document.querySelector('#slc-cartoon');
    const categoria = document.querySelector('#categoria')

    slc_serie.addEventListener('click', (event) => {
        // <div class="col-6 col-md-3">
        //     <label for="nota" class="form-label">Nota</label>
        //     <input type="number" class="form-control field" id="nota" name="nota" placeholder="0 a 5" min="0" max="10" step="0.1">
        // </div>
        const container = document.createElement('div');
        container.className = 'col-6 col-md-3';

        const label = document.createElement('label');
        label.htmlFor = 'temp';
        label.className = 'form-label';
        label.textContent = 'Parou na temporada:';

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'form-control field';
        input.id = 'temp';
        input.name = 'temp';

        container.appendChild(label);
        container.appendChild(input);
        categoria.insertAdjacentElement('afterend', container);
    })
}