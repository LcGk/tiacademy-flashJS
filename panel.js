import { clientes } from "./data/clientes.js";

let currentClient = 0;

let forms = {};
class PanelForm {
    constructor(formId, activatorId) {
        const form = document.getElementById(formId);
        const activator = document.getElementById(activatorId);

        this.formId = formId;
        this.formElement = form;
        this.activator = activator;
        this.visible = false;

        this.activator.onclick = () => {
            if (this.visible)
                this.hide();
            else
                this.show();
        }

        forms[`${formId}`] = this;
    }

    hide() {
        if (!this.visible)
            return;

        this.formElement.style.display = "none";
        this.activator.setAttribute("data-active", "false");

        this.visible = false;
    }

    show() {
        if (this.visible)
            return;

        for (let form in forms) {
            form = forms[form];

            if (form.formId == this.formId) {
                this.formElement.style.display = "flex";
                this.activator.setAttribute("data-active", "true");

                this.visible = true;
            } else {
                form.hide();
            }
        }
    }
}

window.onload = () => {
    new PanelForm("form-clients", "clients-activator");
    new PanelForm("form-products", "products-activator");
    new PanelForm("form-orders", "orders-activator");

    // handle close forms
    document.querySelectorAll(".close-form").forEach((btn) => {
        btn.onclick = () => {
            for (let form in forms) {
                forms[form].hide();
            }
        }
    })

    // load first client
    updateClient();

    document.getElementById("form-clients__client-prev").onclick = handlePrevClient;
    document.getElementById("form-clients__client-next").onclick = handleNextClient;
    document.getElementById("form-clients__client-new").onclick = handleNewClient;
    document.getElementById("form-clients__client-save").onclick = handleSaveClient;
    
}

function updateClient() {
    document.getElementById("form-clients__client-code").value = clientes[currentClient].codCliente;
    document.getElementById("form-clients__client-name").value = clientes[currentClient].nomeCliente;
    document.getElementById("form-clients__client-date").value = clientes[currentClient].dataCadCli;
}

function handlePrevClient() {
    if (--currentClient < 0) {
        alert("Você chegou ao início da lista de clientes!");
        currentClient = 0;
    }

    updateClient();
}

function handleNextClient() {
    if (++currentClient >= clientes.length) {
        alert("Você chegou ao fim da lista de clientes!");
        currentClient = clientes.length - 1;
    }

    updateClient();    
}

function handleNewClient() {
    currentClient = clientes.length;

    document.getElementById("form-clients__client-code").value = currentClient + 1;
    document.getElementById("form-clients__client-name").value = "";
    document.getElementById("form-clients__client-date").value = (new Date(Date.now())).toLocaleString("pt-BR").split(" ")[0];
}

function handleSaveClient() {
    if (clientes[currentClient] == undefined) {
        clientes[currentClient] = {};
    }

    clientes[currentClient].codCliente = parseInt(document.getElementById("form-clients__client-code").value);
    clientes[currentClient].nomeCliente = document.getElementById("form-clients__client-name").value;
    clientes[currentClient].dataCadCli = document.getElementById("form-clients__client-date").value; 

    console.log(clientes);
}