document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        init();
    }
});

const init = async () => {
    const navList = document.querySelector('#navList');
    const log_sign = document.createElement('li');
    log_sign.className = 'nav-item';

    const log_sign_href = document.createElement('a');
    log_sign_href.className = 'nav-link';
    log_sign_href.href = '/login';
    log_sign_href.textContent = 'login';

    log_sign.appendChild(log_sign_href);
    navList.appendChild(log_sign);
};