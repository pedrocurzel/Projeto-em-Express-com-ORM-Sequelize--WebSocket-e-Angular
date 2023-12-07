import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import UsuarioLogin from '../models/UsuarioLogin';
import { RoutesService } from '../services/routes.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    eyeIcon = "eye";
    showPass = false;

    constructor(public formBuilder: FormBuilder, private authService: AuthService, private routesService: RoutesService) { }

    form = this.formBuilder.group({
        email: ["pedrocurzel@gmail.com", [Validators.required, Validators.email]],
        password: ["1234567890", Validators.required]
    })

    ngOnInit() {
    }

    async login() {
        if (this.form.valid) {
            const usuarioLogin = new UsuarioLogin(this.form.get("email")!.value!, this.form.get("password")!.value!);
            try {
                let res = await this.authService.login(usuarioLogin);
                console.log(res);
                
                localStorage.setItem("token", res!.token);
                localStorage.setItem("usuario", JSON.stringify(res!.user));
                await this.routesService.routeRoot("home");
            } catch(error) {
                console.log(error);
                alert("erro ao logar");
            }
        }
    }

    showPassword() {
        this.showPass = !this.showPass;
        if (this.showPass) {
            this.eyeIcon = "eye-off";
        } else {
            this.eyeIcon = "eye";
        }
    }

}
