import { PlansemanalinicialComponent } from './../components/plansemanalinicial/plansemanalinicial.component';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PlaninicialService {

  apiUrl = environment.apiUrl;

  constructor( private http: HttpClient ) { }

  crear( token, registroId){
    var url = `${this.apiUrl}PlanSemanal/crear`;

    const postData = {
      token   :   token,
      registroId : registroId
    }

    return this.http.post( url, postData );

  }

  //para recibir semanas creadas por registro academico_id
  getTodos(token,registroId){
    var url = `${this.apiUrl}PlanSemanal/planes/${token}/${registroId}`;
    return this.http.get(url);
  }

  //Recibe detalles del calendario
  getCalendario(token,planId){
    var url = `${this.apiUrl}PlanSemanalDetalle/plandetalle/${token}/${planId}`;
    return this.http.get(url);
  }

  // metodo para actualizar datos del plan semanal detalle
  updateDetalle(token,detalleId,campo,contenido){
    var url = `${this.apiUrl}planSemanalDetalle/detalle`;

    const data = {
      token: token,
      detalle_id: detalleId,
      campo: campo,
      contenido: contenido
    };

    return this.http.post(url, data);
  }

  //metodo para datos del plansemanal detalle- recursos
  recursoDetalle(token,detalleId){
    var url = `${this.apiUrl}PlanSemanalRecurso/recurso/${token}/${detalleId}`;
    return this.http.get(url);
  }

  //metodo para ingresar recursos al detalle
  postInsertaRecurso(token,detalleId,codigo,tipo,contenido){
    var url = `${this.apiUrl}planSemanalRecurso/recurso`;

    const data = {
      token: token,
      detalle_id: detalleId,
      codigo: codigo,
      tipo: tipo,
      contenido: contenido
    };

    return this.http.post(url, data);
  }

  //metodo para eliminar recursos del plan semanal detalle
  getEliminaRecurso(token,recursoId){
    var url = `${this.apiUrl}PlanSemanalRecurso/delete/${token}/${recursoId}`;
    return this.http.get(url);
  }

  //metodo para insertar estudiantes para calificar la actividad del plan semanal detalle
  getInsertaEstudiantes(token,detalleId){
    var url = `${this.apiUrl}PlanSemanalDetalle/calificaractividad/${token}/${detalleId}`;
    return this.http.get(url);
  }

  //metodo para cambiar nota de la calificacion de la actividad del plan semanal detalle
  postInsertaEstudiantes(token,calificacion_id,valor,campo){
    var url = `${this.apiUrl}PlanSemanalDetalle/calificaractividad/`;
    const data = {
      token: token,
      calificacion_id: calificacion_id,
      valor: valor,
      campo: campo
    }
    return this.http.post(url, data);
  }

  //Método para Generar Reporte PDF
  getGeneraReporte(token,fechaDesde,fechaHasta,titulo,registroId){
    var url = `${this.apiUrl}PlanSemanalReporte/plan/${token}/${fechaDesde}/${fechaHasta}/${titulo}/${registroId}`;
    return this.http.get(url);
  }

}
