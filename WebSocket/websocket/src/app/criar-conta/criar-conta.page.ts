import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import ContaNova from '../models/ContaNova';
import { RoutesService } from '../services/routes.service';

@Component({
  selector: 'app-criar-conta',
  templateUrl: './criar-conta.page.html',
  styleUrls: ['./criar-conta.page.scss'],
})
export class CriarContaPage implements OnInit {

  constructor(public formBuilder: FormBuilder, private authService: AuthService, private routeService: RoutesService) { }

  form = this.formBuilder.group({
    nome: ["", [Validators.required, Validators.minLength(10)]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(10)]]
  });

  ngOnInit() {
  }


    async criarConta() {
        if (this.form.valid) {
            let nome = this.form.controls.nome.value!;
            let email = this.form.controls.email.value!;
            let password = this.form.controls.password.value!;
            try {
                await this.authService.createAccount(new ContaNova(nome, email, password))
                alert("conta criada com sucesso!");
                await this.routeService.routeRoot("login");
            } catch(erro) {
                console.log(erro);
                alert("erro ao criar conta");
            }
        }
    }

}
