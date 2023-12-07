import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import UsuarioLogin from '../models/UsuarioLogin';
import ContaNova from '../models/ContaNova';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) { }

    async login(user: UsuarioLogin) {
        return await this.http.post<loginRes>(environment.api + "/login", user).toPromise();
    }

    async createAccount(newUser: ContaNova) {
        return await this.http.post(environment.api + "/criar-conta", newUser).toPromise();
    }

    async authenticateToken() {
        return await this.http.get<authRes>(environment.api + `/validate-token?token=${localStorage.getItem("token")}`).toPromise();
    }
}

interface authRes {
    error: boolean,
    isValid: boolean
};

interface loginRes {
    error: boolean,
    message: string,
    token: string,
    user: {
        nome: string,
        email: string
    }
}