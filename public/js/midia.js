document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        init();
    }
});

const init = async () => {
    //params
    const urlQuery = window.location.search;
    const params = new URLSearchParams(urlQuery);
    const tipo = params.get('tipo');
    const id = params.get('id');

    //midia Part
    const url = `http://localhost:8080/api/${tipo}/${id}`;
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
    }


    Snota_text.textContent = `${data.nota}/5`;
    review_text.textContent = data.comentario;
}