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
export class HomePage implements OnInit, ViewWillEnter {

    constructor(private routesService: RoutesService, private http: HttpClient, private modalCtrl: ModalController, private socket: Socket) {}

    ready = false;  
    user: any;
    docs: Documento[] = [];

    async ionViewWillEnter() {
        console.log("voltou");
        
        this.ready = false;
        this.user = JSON.parse(localStorage.getItem("usuario")!);
        await this.getDocs();
        setTimeout(() => {
            this.socket.connect();
            this.socket.on("documento_criado", (documentos: any[]) => {
                this.docs = documentos.map(doc => new Documento(doc.id, doc.nome, doc.valor, doc.createdAt, doc.updatedAt));            
            })
            this.socket.on("delete_doc", (docNome:any) => {
                this.docs.splice(this.docs.findIndex(doc => doc.nome == docNome), 1);
            })
            this.ready = true;
        }, 50);
    }

    async ngOnInit() {
        
    }

    async criarDocumento() {
        let modal = await this.modalCtrl.create({
            component: CriarDocComponent
        });
        await modal.present();
        const res = await modal.onWillDismiss();
        
        if (res.data) {
            try {
                await this.http.post(environment.api + "/criar-documento", {nome: res.data, valor: ""}).toPromise();
                this.socket.emit("documento_criado", []);
            } catch(error) {
                console.log(error);
                alert("erro ao criar doc");
                
            }
        }
        
    }

    async getDocs() {
        this.docs = (await this.http.get<documentosRes>(environment.api + "/listar-documentos").toPromise())!.docs.map((obj) => new Documento(
            obj.id, obj.nome, obj.valor, obj.createdAt, obj.updatedAt
        ))
    }

    async editarDocumento(documento: Documento) {
        this.socket.disconnect();
        localStorage.setItem("documento-selecionado", JSON.stringify(documento));
        setTimeout(async () => {
            await this.routesService.routeForward("documento");
        }, 50);
    }

    async logout() {
        localStorage.removeItem("token");
        await this.routesService.routeRoot("login");
    }

}

interface documentosRes {
    error: boolean,
    docs: any[],
    message: string
}