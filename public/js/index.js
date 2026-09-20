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
    let nav_control;

    //checando para autorização e autenticação
    const response = await fetch('/refresh', {method: 'POST'});
    const data = await response.json();
    if (response.ok) {
        const token = data.accessToken;
        const userData = decodificarJWT(token);
        
        if (userData.role === "admin") {
            nav_control = 1;
        } else {
            nav_control = 2;
        }
    } else {
        if (response.status === 401) {
            nav_control = 3;
        }
    }

    if (nav_control === 1 || nav_control === 3) {
        const navList = document.querySelector('#navList');
        const log_sign = document.createElement('li');
        log_sign.className = 'nav-item';

        const log_sign_href = document.createElement('a');
        log_sign_href.className = 'nav-link';

        switch (nav_control) {
            case 1:
                log_sign_href.href = '/registro';
                log_sign_href.textContent = 'registro';
                break;
            case 3:
                log_sign_href.href = '/login';
                log_sign_href.textContent = 'login';
            default:
                log_sign_href.href = '/login';
                log_sign_href.textContent = 'login';
                break;
        }
        log_sign.appendChild(log_sign_href);
        navList.appendChild(log_sign);
    }
};