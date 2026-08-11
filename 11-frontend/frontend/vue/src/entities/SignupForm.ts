import Observable from "@/infra/observer/Observable";

export default class SignupForm extends Observable {
    step = 1;
    name = "";
    email = "";
    document = "";
    password = "";
    confirmPassword = "";
    success = "";
    error = "";

    next () {
        this.error = "";
        if (!this.name) {
            this.error = "Preencha o nome";
            return;
        }
        if (!this.email) {
            this.error = "Preencha o email";
            return;
        }
        if (!this.document) {
            this.error = "Preencha o documento";
            return;
        }
        this.step++;
    }

    previous () {
        this.step--;
    }

    async confirm () {
        this.error = "";
        if (!this.password) {
            this.error = "Preencha a senha";
            return;
        }
        if (!this.confirmPassword) {
            this.error = "Preencha a confirmação da senha";
            return;
        }
        if (this.password !== this.confirmPassword) {
            this.error = "A senha e a confirmação da senha devem ser iguais";
            return;
        }
        const formConfirmed = {
            name: this.name,
            email: this.email,
            document: this.document,
            password: this.password
        }
        this.notifyAll("formConfirmed", formConfirmed);
    }

    getProgress () {
        let progress = 0;
        if (this.name) {
            progress += 25;
        }
        if (this.email) {
            progress += 25;
        }
        if (this.document) {
            progress += 25;
        }
        if (this.password && this.confirmPassword && this.password === this.confirmPassword) {
        progress += 25;
        }
        return progress;
    }
}
