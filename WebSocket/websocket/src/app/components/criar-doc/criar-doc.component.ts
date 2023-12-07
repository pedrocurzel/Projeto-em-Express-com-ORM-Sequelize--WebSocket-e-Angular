import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-criar-doc',
  templateUrl: './criar-doc.component.html',
  styleUrls: ['./criar-doc.component.scss'],
})
export class CriarDocComponent  implements OnInit {

    constructor(private modalCtrl: ModalController) { }

    nome = "";

    async ngOnInit() {}

    criarDoc() {
        this.modalCtrl.dismiss(this.nome, "doc-criado");
    }

    close() {
        this.modalCtrl.dismiss();
    }

}
