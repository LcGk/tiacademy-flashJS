import { clientes } from "./data/clientes.js";
import { produtos } from "./data/produtos.js";

let currentClient = 0;
let currentProduct = 0;

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

            if (form.formId != this.formId)
                form.hide();
        }
        this.formElement.style.display = "flex";
        this.activator.setAttribute("data-active", "true");
        this.visible = true;
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

    // load first product
    updateProduct();

    document.getElementById("form-products__product-prev").onclick = handlePrevProduct;
    document.getElementById("form-products__product-next").onclick = handleNextProduct;
    document.getElementById("form-products__product-new").onclick = handleNewProduct;
    document.getElementById("form-products__product-save").onclick = handleSaveProduct;

    // register callback to find client when input is changed/unfocused
    document.getElementById("form-orders__client-code").onchange = handleFindClient;
    // register callback to find product when input is changed/unfocused
    document.getElementById("form-orders__product-code").onchange = handleFindProduct;
    // register callback to create order when create-order button is pressed
    document.getElementById("form-orders__create-order").onclick = handleCreateOrder;
}

const removeChilds = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};

function fixPrice(price) {
    price = price.replace("R$ ", "").replace(",", ".");
    return parseFloat(price);
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
    let newClient = false;

    if (clientes[currentClient] == undefined) {
        clientes[currentClient] = {};
        newClient = true;
    }

    clientes[currentClient].codCliente = parseInt(document.getElementById("form-clients__client-code").value);
    clientes[currentClient].nomeCliente = document.getElementById("form-clients__client-name").value;
    clientes[currentClient].dataCadCli = document.getElementById("form-clients__client-date").value;

    updateClient();

    if (newClient)
        alert("Cadastro criado com sucesso!");
    else
        alert("Cadastro atualizado com sucesso!");
}

function updateProduct() {
    document.getElementById("form-products__product-code").value = produtos[currentProduct].codProduto;
    document.getElementById("form-products__product-desc").value = produtos[currentProduct].descProduto;
    document.getElementById("form-products__product-price").value = new Intl.NumberFormat(
        "pt-BR", {
        currency: "BRL",
        style: "currency",
    }
    ).format(produtos[currentProduct].precoProduto);
    document.getElementById("form-products__product-quantity").value = produtos[currentProduct].qtdEstoqueProd;
}

function handlePrevProduct() {
    if (--currentProduct < 0) {
        alert("Você chegou ao início da lista de produtos!");
        currentProduct = 0;
    }

    updateProduct();
}

function handleNextProduct() {
    if (++currentProduct >= produtos.length) {
        alert("Você chegou ao fim da lista de produtos!");
        currentProduct = produtos.length - 1;
    }

    updateProduct();
}

function handleNewProduct() {
    currentProduct = produtos.length;

    document.getElementById("form-products__product-code").value = currentProduct + 1;
    document.getElementById("form-products__product-desc").value = "";
    document.getElementById("form-products__product-price").value = "";
    document.getElementById("form-products__product-quantity").value = "";
}

function handleSaveProduct() {
    let newProduct = false;
    if (produtos[currentProduct] == undefined) {
        produtos[currentProduct] = {};
        newProduct = true;
    }

    produtos[currentProduct].codProduto = parseInt(document.getElementById("form-products__product-code").value);
    produtos[currentProduct].descProduto = document.getElementById("form-products__product-desc").value;
    produtos[currentProduct].precoProduto = fixPrice(document.getElementById("form-products__product-price").value);
    produtos[currentProduct].qtdEstoqueProd = parseInt(document.getElementById("form-products__product-quantity").value);
    updateProduct();

    if (newProduct)
        alert("Produto cadastrado com sucesso!");
    else
        alert("Dados do produto atualizados com sucesso!");
}


/************/
let currentOrder = {
    "clientCode": -1,
    "productCode": -1,
};

function handleFindClient() {
    const clientCodeElement = document.getElementById("form-orders__client-code");
    if (clientCodeElement.value.length <= 0) {
        currentOrder.clientCode = -1;
        return;
    }

    const clientCode = parseInt(
        clientCodeElement.value.replace(/\D/g, '')
    ) - 1; // -1 because the client code starts at index 1 but the array starts at 0 

    if (clientCode == undefined || clientCode === NaN) {
        currentOrder.clientCode = -1;
        return;
    }


    const clientNameElement = document.getElementById("form-orders__client-name");

    if (clientes[clientCode] == undefined) {
        clientNameElement.value = "Cliente não encontrado!";
        currentOrder.clientCode = -1;
        return;
    }

    clientNameElement.value = clientes[clientCode].nomeCliente;
    currentOrder.clientCode = clientCode;

    updateOrders();
}

function handleFindProduct() {
    const prodCodeElement = document.getElementById("form-orders__product-code");
    if (prodCodeElement.value.length <= 0) {
        currentOrder.productCode = -1;
        return;
    }

    const productCode = parseInt(
        prodCodeElement.value.replace(/\D/g, '')
    ) - 1; // -1 because the product code starts at index 1 but the array starts at 0 

    if (productCode == undefined || productCode === NaN) {
        currentOrder.productCode = -1;
        return;
    }

    const productDescElement = document.getElementById("form-orders__product-desc");
    const productPriceElement = document.getElementById("form-orders__product-price");

    const product = produtos[productCode];

    if (product == undefined) {
        productDescElement.value = "Produto não encontrado!";
        productPriceElement.value = "";
        currentOrder.productCode = -1;
        return;
    }

    productDescElement.value = product.descProduto;
    productPriceElement.value = new Intl.NumberFormat(
        "pt-BR", {
        currency: "BRL",
        style: "currency",
    }
    ).format(product.precoProduto);

    currentOrder.productCode = productCode;
}

function handleCreateOrder() {
    if (currentOrder.clientCode == -1 || currentOrder.productCode == -1)
        return;

    const client = clientes[currentOrder.clientCode];
    if (client == undefined)
        return;
    
    const product = produtos[currentOrder.productCode];
    if (product == undefined)
        return;

    const productQuantity = parseInt(
        document.getElementById("form-orders__product-quantity").value.replace(/\D/g, '')
    );
    if (productQuantity == undefined || productQuantity == NaN)
        return;
    if (productQuantity <= 0)
        return;

    if (productQuantity > product.qtdEstoqueProd) {
        alert(`Você tentou adicionar ${productQuantity} ${product.descProduto} ao pedido, mas apenas ${product.qtdEstoqueProd} estão em estoque!`);
        return;
    }

    const newOrder = {
        "codProduto": currentOrder.productCode,
        "qtdProduto": productQuantity,
    }

    if (clientes[currentOrder.clientCode].pedidosCliente == undefined)
        clientes[currentOrder.clientCode].pedidosCliente = [];
    else {
        let alreadyInOrder = false;
        for(let order in clientes[currentOrder.clientCode].pedidosCliente) {
            order = clientes[currentOrder.clientCode].pedidosCliente[order];

            if (order.codProduto == currentOrder.productCode) {
                alreadyInOrder = true;
                break;
            }
        }
        if (alreadyInOrder) {
            alert("Este produto já foi cadastrado!");
            return;
        }
    }

    clientes[currentOrder.clientCode].pedidosCliente = [
        ...clientes[currentOrder.clientCode].pedidosCliente,
        newOrder,
    ];

    produtos[currentOrder.productCode].qtdEstoqueProd -= productQuantity;

    updateOrders();
}

function updateOrders() {
    removeChilds(document.getElementById("order-contents"));

    if (currentOrder.clientCode == -1)
        return;

    const client = clientes[currentOrder.clientCode];
    if (client == undefined)
        return;

    let orderTotal = 0;
        
    if (client.pedidosCliente != undefined) {
        for(let order in client.pedidosCliente) {
            order = client.pedidosCliente[order];
    
            const item = order.codProduto + 1;
            const desc = produtos[order.codProduto].descProduto;
            let price = produtos[order.codProduto].precoProduto;
            const qtd = order.qtdProduto;
    
            let subTotal = price * qtd;
            orderTotal += subTotal;
            
            price = new Intl.NumberFormat(
                "pt-BR", {
                currency: "BRL",
                style: "currency",
            }
            ).format(price);
    
            subTotal = new Intl.NumberFormat(
                "pt-BR", {
                currency: "BRL",
                style: "currency",
            }
            ).format(subTotal);
    
            const thItem = document.createElement("th");
            thItem.textContent = item;
    
            const tdDesc = document.createElement("td");
            tdDesc.textContent = desc;
    
            const tdPrice = document.createElement("td");
            tdPrice.textContent = price;
    
            const tdQtd = document.createElement("td");
            tdQtd.textContent = qtd;
    
            const tdSubTotal = document.createElement("td");
            tdSubTotal.textContent = subTotal;
    
            const tr = document.createElement("tr");
            tr.appendChild(thItem);
            tr.appendChild(tdDesc);
            tr.appendChild(tdPrice);
            tr.appendChild(tdQtd);
            tr.appendChild(tdSubTotal);
            
            document.getElementById("order-contents").appendChild(tr);
        }
    }
    
    orderTotal = new Intl.NumberFormat(
        "pt-BR", {
        currency: "BRL",
        style: "currency",
    }
    ).format(orderTotal);

    document.getElementById("order-total").textContent = `TOTAL: ${orderTotal}`;
}