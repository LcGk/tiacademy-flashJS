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
                this.formElement.style.display = "block";
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
}