import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoutesService } from '../services/routes.service';
import { HttpClient } from '@angular/common/http';
import Documento from '../models/Documento';
import { environment } from 'src/environments/environment';
import { ModalController, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { CriarDocComponent } from '../components/criar-doc/criar-doc.component';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    constructor(private routesService: RoutesService, private http: HttpClient, private modalCtrl: ModalController, private socket: Socket) {}

    ready = false;  
    user: any;
    docs: Documento[] = [];
    usuariosLogados: any[] = [];

    async ngOnInit() {
        this.ready = false;
        this.socket.connect();
        this.user = JSON.parse(localStorage.getItem("usuario")!);
        await this.getDocs();
        this.socket.emit("usuario_conectou_app", localStorage.getItem("usuario"));
        this.socket.on("documento_criado", (doc: any) => {
            this.docs.push(new Documento(doc));
        })
        this.socket.on("deletar_documento_home", (docName: any) => {
            this.docs.splice(this.docs.findIndex(doc => doc.nome == docName), 1);
        })
        this.ready = true;
    }

    async criarDocumento() {
        let modal = await this.modalCtrl.create({
            component: CriarDocComponent
        });

        modal.present();

        let res = await modal.onWillDismiss();
        //console.log(res);
        try {
            var doc = await this.http.post<criarDoc>(environment.api + "/criar-documento", {
                nome: res.data!
            }).toPromise();
            this.docs.push(new Documento(doc!.docCriado));
            this.socket.emit("documento_criado", doc!.docCriado);
        } catch(err) {
            alert("erro ao criar");
            console.log(err);
        }
    }

    async getDocs() {
        let docs = await this.http.get<documentosRes>(environment.api + "/listar-documentos").toPromise();
        this.docs = docs!.docs.map(doc => new Documento(doc));
    }

    async editarDocumento(documento: Documento) {
        localStorage.setItem("documento_selecionado", JSON.stringify(documento));
        this.routesService.routeForward("/documento");
    }

    async logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("ususario");
        this.socket.disconnect();
        await this.routesService.routeRoot("login");
    }

}

interface criarDoc {
    docCriado: any;
}

interface documentosRes {
    error: boolean,
    docs: any[],
    message: string
}