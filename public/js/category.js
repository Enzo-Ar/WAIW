document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        init();
    }
});

const init = () => {
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

}