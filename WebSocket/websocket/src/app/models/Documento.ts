export default class Documento {
    id: number;
    nome: string;
    valor: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(docJson: any) {
        this.id = docJson.id;
        this.nome = docJson.nome;
        this.valor = docJson.valor;
        this.createdAt = new Date(docJson.createdAt);
        this.updatedAt = new Date(docJson.updatedAt);
    }
}