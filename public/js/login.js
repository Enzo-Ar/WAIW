document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        init();
    }
});

const init = async () => {
    const form = document.querySelector('#login');
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        const result = await fetch('/api/loginUser', {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        });

        if (result.ok) {
            window.location.replace("../../views/index");
        } else {
            const r = await result.json();
            // if (r.erro === "ExistsUser") {
            //     console.log("yipeeee");
            // }
            //handle the errors here
        }
    });
};