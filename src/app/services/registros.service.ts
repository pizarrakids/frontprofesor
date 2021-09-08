import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class RegistrosService {
  apiUrl = environment.apiUrl;

  constructor( private http: HttpClient ) {

  }

  tomaRegistrosDocente(token){
    var url = `${this.apiUrl}Registrosacademicos/registros/${token}`;
    return this.http.get(url);
  }

  registroPorId(token, registroId){
    var url = `${this.apiUrl}Registrosacademicos/registro/${token}/${registroId}`;
    return this.http.get(url);
  }


}
