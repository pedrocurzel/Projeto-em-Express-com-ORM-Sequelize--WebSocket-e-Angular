export default class Documento {
    id: number;
    nome: string;
    valor: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id:number,nome:string,valor:string,createdAt:string, updatedAt:string) {
        this.id = id;
        this.nome = nome;
        this.valor = valor;
        this.createdAt = new Date(createdAt);
        this.updatedAt = new Date(updatedAt);
    }
}