import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl;

  constructor( private http: HttpClient ) { }

  login(usuario, clave){
    var url = `${this.apiUrl}User/login`;

    const authData = {
      correo:  usuario,
      clave:    clave
    };

    return this.http.post(
      url, authData
    );
  }

  recuperPerfil(token){
    //var url = `${this.apiUrl}recupera-perfil/vistas/index.php`; 
    //var url = 'api/codigneiter/index.php/User/login'; 
    var url = this.apiUrl + 'User/login';
    const tokenData ={
      token: token
    };

    let headers = new HttpHeaders().set('content-type', 'application/json; charset=utf-8');

    return this.http.post(
      url, tokenData, {headers: headers}
    );
  }
}
