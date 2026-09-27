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
    const urlQuery = window.location.search;
    const params = new URLSearchParams(urlQuery);
    const tipo = params.get('tipo');

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

    const title = document.querySelector('.hero-title');
    const is_curr = document.querySelector('.is-current');
    const subtitle = document.querySelector('.hero-subtitle');
    const chip = document.querySelector('.stat-chip');

    title.textContent = tipo.toUpperCase();
    is_curr.textContent = tipo;
    if (tipo === "filmes") {
        chip.classList.add('stat-chip--alt')
        subtitle.textContent = "Filmes que assisti, não vai ter nenhum filme tipo titanic ou de terror, porque não faz o minimo sentido alguem assistir esses filme ai.";
    } else if (tipo === "series") {
        subtitle.textContent = "Series que assisti, e que provavelmente só vai ter de 2023 pra baixo, já que as recente tá tudo mei bah.";
    } else {
        subtitle.textContent = "Desenho animado é muito bom, não tem mais o que dizer.";
    }

    //A FAZER: CHECAR STATUS CODE PARA GARANTIR 200, SE NÃO, MUDAR PAGINA DE ACORDO
    const url = `/api/${tipo}`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
        const founder = document.querySelector('#founder');
        founder.textContent = data.length;

        data.forEach(wanted => {
            const wanted_lister = document.querySelector('#wanted-lister');
            const link_card = document.createElement('a');
            link_card.href = `/midia?tipo=${tipo}&id=${wanted.id}`;

            //creating wanted card
            const card = document.createElement('div');
            card.className = 'col-6 col-sm-4 col-lg-3';

            const record_card = document.createElement('article');
            record_card.className = 'record-card';

            const record_card_tape = document.createElement('span');
            record_card_tape.className = 'record-card__tape';
            record_card_tape.ariaHidden = 'true';

            const record_card_thumb = document.createElement('div');
            record_card_thumb.className = 'record-card__thumb';
            record_card_thumb.style.backgroundImage = `url('${wanted.poster}')`;

            const record_card_badge = document.createElement('span');
            record_card_badge.className = `badge-type badge-type--${tipo}`;
            record_card_badge.textContent = tipo;

            const record_card_body = document.createElement('div');
            record_card_body.className = 'record-card__body';

            const record_card_title = document.createElement('h3');
            record_card_title.className = 'record-card__title';
            record_card_title.textContent = wanted.nome;

            const record_card_meta = document.createElement('div');
            record_card_meta.className = 'record-card__meta';

            const meta_date = document.createElement('span');
            meta_date.className = 'meta-date';
            meta_date.textContent = wanted.data_assistido.toString().slice(0, 10);

            const meta_score = document.createElement('span');
            meta_score.className = 'meta-score';
            meta_score.textContent = wanted.nota;

            const small = document.createElement('small');
            small.textContent = '/5';

            const record_card_comment = document.createElement('p');
            record_card_comment.className = 'record-card__comment';
            let com
            if (wanted.comentario.length >= 55) {
                com = wanted.comentario.slice(0, 50) + "...";
            } else {
                com = wanted.comentario;
            }
            record_card_comment.textContent = com;

            //here begins the appendings from up to down
            meta_score.appendChild(small);
            record_card_meta.appendChild(meta_date);
            record_card_meta.appendChild(meta_score);

            record_card_body.appendChild(record_card_title);
            record_card_body.appendChild(record_card_meta);
            record_card_body.appendChild(record_card_comment);

            record_card_thumb.appendChild(record_card_badge);

            record_card.appendChild(record_card_tape);
            record_card.appendChild(record_card_thumb);
            record_card.appendChild(record_card_body);

            link_card.appendChild(record_card)
            card.appendChild(link_card);

            wanted_lister.appendChild(card);
        });
    } else {
        const check_error_div = document.querySelector('.error-div');
        if (check_error_div !== null) {
            check_error_div.remove();
        }

        const wanted_lister = document.querySelector('#wanted-lister');
        const error_div = document.createElement('div');
        error_div.className = 'col-12 mt-2 error-div add-right';

        const error_msg = document.createElement('p');

        switch (data.erro) {
            case "ParamsError":
                error_msg.textContent = 'Server: Todos os parâmetros são obrigatórios.';
                break;
            case "NotFoundError":
                error_msg.textContent = 'Nenhuma Midia encontrada.';
                break;
            default:
                error_msg.textContent = 'Server error, infelizmente nada foi carregado.'
                break;
        }

        error_div.appendChild(error_msg);
        wanted_lister.appendChild(error_div);
    }
    
    chip.addEventListener('mouseenter', (event) => {
        chip.classList.add('anim');
    })
    chip.addEventListener('animationend', (event) => {
        chip.classList.remove('anim');
    })
}