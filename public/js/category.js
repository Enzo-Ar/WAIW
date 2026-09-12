document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        init();
    }
});

const init = async () => {
    const urlQuery = window.location.search;
    const params = new URLSearchParams(urlQuery);
    const tipo = params.get('tipo');

    const title = document.querySelector('.hero-title');
    const is_curr = document.querySelector('.is-current');
    const subtitle = document.querySelector('.hero-subtitle');

    title.textContent = tipo.toUpperCase();
    is_curr.textContent = tipo;
    if (tipo === "filmes") {
        subtitle.textContent = "Movies that i watched, from shit, to shittier, to perfection, to cansei de escrever como se fosse site de verdade";
    } else if (tipo === "series") {
        subtitle.textContent = "Series assistidas tirano de minecraft, o que me entristece";
    } else {
        subtitle.textContent = "Desenho animado é muito bom slk";
    }

    const url = `http://localhost:8080/api/${tipo}`;
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();

    /*
    <div class="col-12 col-sm-6 col-lg-4">
        <article class="record-card">
            <span class="record-card__tape" aria-hidden="true"></span>
            <div class="record-card__thumb">
                <span class="record-card__letter">R</span>
                <span class="badge-type badge-type--filme">Filme</span>
            </div>
            <div class="record-card__body">
                <h3 class="record-card__title">Rampa Vazia</h3>
                <div class="record-card__meta">
                    <span class="meta-date">12/03/2024</span>
                    <span class="meta-score">8.7<small>/10</small></span>
                </div>
                <p class="record-card__comment">"Um filme sobre andar de skate sozinho à noite. A trilha sonora carrega o filme inteiro."</p>
            </div>
        </article>
    </div> */

    console.log(data);

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
        record_card_comment.textContent = wanted.comentario;

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
        
        card.appendChild(record_card);

        link_card.appendChild(card);

        wanted_lister.appendChild(link_card);
    });
}