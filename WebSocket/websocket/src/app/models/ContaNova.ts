export default class ContaNova {
    nome: string;
    email: string;
    password: string;

    constructor(nome:string, email:string, password:string) {
        this.nome = nome;
        this.email = email;
        this.password = password;
    }
}