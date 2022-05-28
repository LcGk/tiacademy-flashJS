let users;

window.onload = async () => {
    const request = await fetch("./data/usuario.json");
    if (request.status !== 200) {
        alert("Lista de usuários não encontrada!");
        return;
    }

    users = (await request.json()).users;

    document.getElementById("login-form").onsubmit = handleFormSubmit;
}

function validateUser(username, password) {
    let valid = false;

    let found_user = false;
    users.forEach((user) => {
        if (valid) return;

        if (user.user === username) {
            found_user = true;
            if (user.pws === password) {
                valid = true;
            }
        }
    })

    if (!valid && found_user)
        alert("Senha incorreta!");
    else if (!found_user)
        alert("Usuário não encontrado!");

    return valid;
}

function handleFormSubmit(e) {
    e.preventDefault(); // prevent form submit

    const username = document.getElementById("user").value;
    const password = document.getElementById("password").value;

    if (validateUser(username, password)) {
        window.location = "./panel.html";
    }
}