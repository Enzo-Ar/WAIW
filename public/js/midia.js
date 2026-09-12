document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        init();
    }
});

const init = async () => {
    const urlQuery = window.location.search;
    const params = new URLSearchParams(urlQuery);
    const tipo = params.get('tipo');
    const id = params.get('id');

    const url = `http://localhost:8080/api/${tipo}/${id}`;
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();

    console.log(data);
}