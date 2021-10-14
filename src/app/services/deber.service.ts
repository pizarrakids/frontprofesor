import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeberService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  //Para insertar deber
  postDeber(token, tema, descripcion, fecha_inicio, fecha_entrega, detalleId) {
    var url = `${this.apiUrl}Deber/deber`;
    const dataDeber = {
      token: token,
      tema: tema,
      descripcion: descripcion,
      fecha_inicio: fecha_inicio,
      fecha_entrega: fecha_entrega,
      detalle_id: detalleId,
    };
    return this.http.post(url, dataDeber);
  }

  //Muestra todos los deberes
  getDeber(token, detalleId) {
    var url = `${this.apiUrl}Deber/deberes/${token}/${detalleId}`;
    return this.http.get(url);
  }

  //Muestra UN deber en específico
  muestraDeber(token,id) {
    var url = `${this.apiUrl}Deber/deber/${token}/${id}`;
    return this.http.get(url);
  }

  //Método para eliminar deber
  eliminaDeber(token,id) {
    var url = `${this.apiUrl}Deber/delete/${token}/${id}`;
    return this.http.get(url);
  }

  //Método para subir archivo
  postSubirArchivo(archivo){
    //console.log(archivo);
    var url = `${this.apiUrl}Deber/insertamaterial`;
    return this.http.post(url, JSON.stringify(archivo));
  }

  //Actualiza deber
  postActualizaDeber(token,tema,descripcion,fecha_inicio,fecha_entrega,id){
    var url = `${this.apiUrl}Deber/actualizardeber`;
    const dataDeber = {
      token: token,
      tema: tema,
      descripcion: descripcion,
      fecha_inicio: fecha_inicio,
      fecha_entrega: fecha_entrega,
      id: id
    };
    return this.http.post(url, dataDeber);
  }

  //Método para DESCARGAR ARCHIVO DEL DEBER
  // getDescargaDeber(token,idDeber){
  //   var url = `${this.apiUrl}Deber/descargarmaterial/${token}/${idDeber}`;
  //   return this.http.get(url);
  // }

  //Método para eliminar UN ARCHIVO DEL DEBER
  getEliminaMaterialDeber(token,idDeber){
    var url = `${this.apiUrl}Deber/deletematerial/${token}/${idDeber}`;
    return this.http.get(url);
  }

  //Muestra todos los deberes segun el RegistroId
  getMuestraDeberes(token,registroId){
    var url = `${this.apiUrl}Deber/todoslosdeberes/${token}/${registroId}`;
    return this.http.get(url);
  }

}
