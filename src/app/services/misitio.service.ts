import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MisitioService {
  apiUrl = environment.apiUrl;

  constructor( private http: HttpClient ) { }

  recuperaProductos(token){
    var url = `${this.apiUrl}mi-sitio/vistas/index.php`; 

    const tokenData = {
      token: token
    };

    return this.http.post(url, tokenData);
  }

}
