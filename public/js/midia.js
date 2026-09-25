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
    //params
    const urlQuery = window.location.search;
    const params = new URLSearchParams(urlQuery);
    const tipo = params.get('tipo');
    const id = params.get('id');

    let nav_control = 3;

    //checando para autorização e autenticação
    const refreshRes = await fetch('/refresh', {method: 'POST'});

    if (refreshRes.ok) {
        const data = await refreshRes.json();

        const token = data.accessToken;
        const userData = decodificarJWT(token);
        
        if (userData.role === "admin") {
            nav_control = 1;
        } else {
            nav_control = 2;
        }
    }   

    const navList = document.querySelector('#navList');
    
    if (nav_control === 1) {
        
        const log_sign = document.createElement('li');
        log_sign.className = 'nav-item';

        const log_sign_href = document.createElement('a');
        log_sign_href.className = 'nav-link';

        log_sign_href.href = '/registro';
        log_sign_href.textContent = 'Registro';

        log_sign.appendChild(log_sign_href);
        navList.appendChild(log_sign);
    }
    
    
    if (nav_control === 1 || nav_control === 2) {
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
    } else {
        const log_sign = document.createElement('li');
        log_sign.className = 'nav-item';

        const log_sign_href = document.createElement('a');
        log_sign_href.className = 'nav-link';

        log_sign_href.href = '/login';
        log_sign_href.textContent = 'Login';

        log_sign.appendChild(log_sign_href);
        navList.appendChild(log_sign);
    }

    //midia Part
    const url = `/api/${tipo}/${id}`;
    const response = await fetch(url);
    const fulldata = await response.json();
    const data = fulldata[0];

    //dom part
    const back_link = document.querySelector('#back-link');
    const type_bread = document.querySelector('#type-breadcrumb');
    const isCurr = document.querySelector('#isCurr');

    const title = document.querySelector('#big-title');
    const Bnota = document.querySelector('#big-nota');
    const Bnota_small = document.createElement('small');
    Bnota_small.textContent = "/5";

    const poster = document.querySelector('#poster');
    const badge = document.querySelector('#badge')

    const cat_lister = document.querySelector('#category-lister');

    const ficha = document.querySelector('.ficha');

    const card_title = document.querySelector('#small-title');
    const type_text = document.querySelector('#type');
    const date_text = document.querySelector('#date');
    const Snota_text = document.querySelector('#small-nota');
    const review_text = document.querySelector('#review_text');

    back_link.textContent = `← Voltar para ${tipo}`;
    back_link.href = `categoria.html?tipo=${tipo}`;
    type_bread.textContent = tipo;
    type_bread.href = `categoria.html?tipo=${tipo}`;
    isCurr.textContent = data.nome;

    title.textContent = data.nome;
    Bnota.textContent = data.nota;

    data.generos.forEach(gen => {
        const newTag = document.createElement('li');
        newTag.className = 'tag';
        newTag.textContent = gen;

        cat_lister.appendChild(newTag);
    });

    poster.style.backgroundImage = `url('${data.poster}')`;
    badge.className = `media-badge badge-type--${tipo}`;
    badge.textContent = tipo;

    Bnota.appendChild(Bnota_small);
    card_title.textContent = data.nome;
    type_text.textContent = tipo.slice(0, -1);
    date_text.textContent = data.data_assistido.slice(0, 10);
    if ((tipo === "series" || tipo === "cartoons") && !data.concluido) {
        const temp_dt = document.createElement('dt');
        const temp_dd = document.createElement('dd');

        temp_dt.textContent = 'Assistindo Temporada:';
        temp_dd.textContent = data.p_temp;

        const ep_dt = document.createElement('dt');
        const ep_dd = document.createElement('dd');

        ep_dt.textContent = 'Ultimo EP assistido:';
        ep_dd.textContent = data.p_ep;

        ficha.appendChild(temp_dt);
        ficha.appendChild(temp_dd);

        ficha.appendChild(ep_dt);
        ficha.appendChild(ep_dd);
    } else if ((tipo === "series" || tipo === "cartoons") && data.concluido) {
        const conc_dt = document.createElement('dt');
        const conc_dd = document.createElement('dd');

        conc_dt.textContent = 'Concluido:';
        conc_dd.textContent = 'sim';

        ficha.appendChild(conc_dt);
        ficha.appendChild(conc_dd);
    }


    Snota_text.textContent = `${data.nota}/5`;
    review_text.textContent = data.comentario;
}