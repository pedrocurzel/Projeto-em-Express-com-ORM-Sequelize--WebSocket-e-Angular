import { Component, OnInit, OnDestroy } from '@angular/core';
import Documento from '../models/Documento';
import { Socket } from 'ngx-socket-io';
import { FormBuilder } from '@angular/forms';
import { ModalController, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { RoutesService } from '../services/routes.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-documento',
  templateUrl: './documento.page.html',
  styleUrls: ['./documento.page.scss'],
})
export class DocumentoPage implements OnInit {

    constructor(private socket: Socket, public formBuilder: FormBuilder, private routerService: RoutesService, private http: HttpClient) { }

    ready = false;
    documentoSelecionado!: Documento;
    usuario!: any;
    form = this.formBuilder.group({
        textArea: [""]
    })
    usuariosConectados: any[] = [];

    async ngOnInit() {
        this.ready = false;
        let docJSON = JSON.parse(localStorage.getItem("documento_selecionado")!);
        this.documentoSelecionado = new Documento(docJSON);
        await this.getDocValue();
        this.handleSocket();
        this.socket.on("documento_deletado", (docName: any) => {
            this.goBack();
        })
        this.ready = true;
    }

    async getDocValue() {
        var res = (await this.http.get<doc>(environment.api + `/getDocumento/${this.documentoSelecionado.id}`).toPromise())!;
        this.form.patchValue({
            textArea: res.doc.valor
        })
    }

    goBack() {
        this.socket.emit("desconectar_sala", this.documentoSelecionado.nome);
        this.routerService.routeBackward("home");
    }

    handleSocket() {
        this.conectarSalaSocket();
        this.recebeValorBancoSocket();
        this.receberUsuarios();
    }

    deleteDoc() {
        this.socket.emit("delete_doc", this.documentoSelecionado.nome);
        this.goBack();
    }

    receberUsuarios() {
        this.socket.on("usuarios_conectados", (value: any) => {
            this.usuariosConectados = value;
            console.log(this.usuariosConectados);
            this.usuariosConectados.forEach(user => {
                try {
                    user.user = JSON.parse(user.user);
                } catch(error) {

                }
            })
            //     
        })
        
        
    }

    conectarSalaSocket() {
        this.socket.emit("conectar_sala", {
            usuario: localStorage.getItem("usuario"),
            sala: this.documentoSelecionado.nome
        })
    }

    recebeValorBancoSocket() {
        this.socket.on("textarea_value", (value:any) => {
            this.form.patchValue({
                textArea: value
            })
        })
    }

    recebeValoresSocket() {
    }

    sendChange(eve: any) {
        this.socket.emit("textarea_value", {
            value: this.form.controls.textArea.value,
            sala: this.documentoSelecionado.nome,
            usuario: localStorage.getItem("usuario")
        });
    }

}


interface doc {
    error: boolean,
    message: string,
    doc: {
        valor: string
    }
}