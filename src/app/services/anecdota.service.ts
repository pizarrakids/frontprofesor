import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnecdotaService {

  apiUrl = environment.apiUrl;

  constructor( private http: HttpClient ) { }


  //metodo peticiones get para consultar anecdota del niño
  getAnecdota(token,calificacionId){
    var url = `${this.apiUrl}anecdota/anecdota/${token}/${calificacionId}`
    return this.http.get(url);
  }

  // metodo para insertar anecdota del niño
  postAnecdota(archivo){
    var url = `${this.apiUrl}anecdota/anecdota`;
    return this.http.post(url, JSON.stringify(archivo));
  }

  getAnecdotaId(token,id){
    var url = `${this.apiUrl}anecdota/anecdotaid/${token}/${id}`
    return this.http.get(url);
  }

  //post
  actualizaFoto(archivoActualizar){
    var url = `${this.apiUrl}anecdota/actualizarfoto`;
    return this.http.post(url, JSON.stringify(archivoActualizar));
  }

  //post
  actualizaDescripcion(token,descripcion,id){
    var url = `${this.apiUrl}anecdota/actualizardescripcion`;
    const data = {
      token: token,
      descripcion: descripcion,
      id: id
    };
      return this.http.post(url, data);

  }
  //get
  eliminarAnecdota(token,id){
    var url = `${this.apiUrl}anecdota/eliminar/${token}/${id}`
    return this.http.get(url);
  }

  //Método que devuelve datos del estudiante pasadors por URL
  getAnecdotario(token, correo){
    var url = `${this.apiUrl}Estudiante/datos/${token}/${correo}`;
    return this.http.get(url);
  }

}
