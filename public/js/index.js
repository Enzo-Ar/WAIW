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
    let nav_control = 3;

    //checando para autorização e autenticação
    const response = await fetch('/refresh', {method: 'POST'});

    if (response.ok) {
        const data = await response.json();

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

        log_sign_href.href = '/registro?method=novo';
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
            location.reload()
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
};