import { Component, OnInit, OnDestroy } from '@angular/core';
import Documento from '../models/Documento';
import { Socket } from 'ngx-socket-io';
import { FormBuilder } from '@angular/forms';
import { ModalController, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { RoutesService } from '../services/routes.service';

@Component({
  selector: 'app-documento',
  templateUrl: './documento.page.html',
  styleUrls: ['./documento.page.scss'],
})
export class DocumentoPage implements OnInit {

    constructor(private socket: Socket, public formBuilder: FormBuilder, private routerService: RoutesService) { }

    ready = false;
    documentoSelecionado!: Documento;
    usuario!: any;
    form = this.formBuilder.group({
        textArea: [""]
    })
    usuariosConectados: any[] = [];

    async ngOnInit() {
        this.ready = false;
        let doc = JSON.parse(localStorage.getItem("documento-selecionado")!);
        this.documentoSelecionado = new Documento(doc.id, doc.nome, doc.valor, doc.createdAt, doc.updatedAt);
        this.usuario = JSON.parse(localStorage.getItem("usuario")!);
        this.handleSocket();
        this.ready = true;
    }

    goBack() {
        this.socket.disconnect();
        setTimeout(() => {
            this.routerService.routeBackward("home");
        }, 50);
    }

    handleSocket() {
        this.socket.connect();
        this.conectarSalaSocket();
        this.receberUsuarios();
        this.recebeValorBancoSocket();
        this.recebeValoresSocket();
        this.socket.on("delete_doc", (valor: any) => {
            alert("O documento atual foi deletado por outro usuário, voltando para tela inicial.")
            this.goBack();
        })
    }

    deleteDoc() {
        this.socket.emit("delete_doc", this.documentoSelecionado.nome);
        this.goBack();
    }

    receberUsuarios() {
        this.socket.on("usuario_conectou", (res: any) => {
            console.log(res);
            
            this.usuariosConectados = res;
        })
    }

    conectarSalaSocket() {
        this.socket.emit("conectar_sala", {sala: this.documentoSelecionado.nome, usuario: this.usuario});
    }

    recebeValorBancoSocket() {
        this.socket.on("valores_banco", (valor: any) => {
            this.form.patchValue({textArea: valor});
        })
    }

    recebeValoresSocket() {
        this.socket.on("valor_textarea", (valor: any) => {
            this.form.patchValue({textArea: valor});
        })
    }

    sendChange(eve: any) {
        this.socket.emit("valor_textarea", {
            valor: this.form.controls.textArea.value,
            usuario: this.usuario,
            sala: this.documentoSelecionado.nome
        });
    }

}
