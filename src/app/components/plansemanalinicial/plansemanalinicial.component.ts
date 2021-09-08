import { NgForm } from '@angular/forms';
import { DeberService } from './../../services/deber.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaninicialService } from 'src/app/services/planinicial.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-plansemanalinicial',
  templateUrl: './plansemanalinicial.component.html',
  styleUrls: ['./plansemanalinicial.component.css'],
})
export class PlansemanalinicialComponent implements OnInit {
  token = null;
  registroId = null;
  respuestaCrear: any = [];
  respuestaPlanes: any = [];
  planes: any = [];
  planId: number;
  respuestaDetalles: any = [];
  dias: any = [];
  horas: any = [];
  dataDetalles: any = [];
  dataDeber : any = [];
  deber : any = [];
  //Atributos para boton modal de generar reporte PDF
  fechaDesde = Date;
  fechaHasta = Date;
  titulo='';
  //URL
  url = environment.apiUrl;
  urlCompleta = '';


  constructor(
    private planServ: PlaninicialService,
    private deberServ: DeberService,
    private router: Router,
    private rutaActiva: ActivatedRoute
  ) {
    if (this.validaTokenExiste() == null) {
      alert('no esta autenticado');
      this.router.navigateByUrl('/home');
    }

    this.rutaActiva.params.subscribe((params) => {
      this.registroId = params['id'];
    });

    this.consultarPlanes();
  }

  ngOnInit(): void {}

  validaTokenExiste() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
    }

    return this.token;
  }

  crearPlan() {
    this.planServ.crear(this.token, this.registroId).subscribe((resp) => {
      this.consultarPlanes();
    });
  }

  consultarPlanes() {
    this.planServ.getTodos(this.token, this.registroId).subscribe((resp) => {
      //console.log(resp);
      this.respuestaPlanes = resp;
      // console.log(this.respuestaPlanes.data);
      this.planes = this.respuestaPlanes.data;
    });
  }

  muestraCalendario(id) {
    this.planId = id;
    //console.log(id);
    this.planServ.getCalendario(this.token, id).subscribe((resp) => {
      //console.log(resp);
      this.respuestaDetalles = resp;
      if (this.respuestaDetalles.error == true) {
        alert(this.respuestaDetalles.mensaje);
      } else {
        console.log(this.respuestaDetalles);
        this.dias = this.respuestaDetalles.dias;
        this.dataDetalles = this.respuestaDetalles.data;
        this.horas = this.respuestaDetalles.horas;
        this.deberServ.getDeber(this.token,this.planId).subscribe(resp=>{
          //console.log(resp);
          this.dataDeber = resp;
          this.deber = this.dataDeber.deberes;
          console.log(this.deber);
        });
      }
    });
  }

  reportePdfForm(form: NgForm){
    if( form.invalid ){
      alert('Datos ingresados no son correctos!!!');
      return;
    }
    //console.log(form.value.titulo);

    // var title = this.titulo;
    //title = title.replace(/ /g,"%20");
    // console.log(title);

    // console.log(this.fechaDesde);
    // console.log(this.fechaHasta);
    this.urlCompleta = `${this.url}PlanSemanalReporte/plan/${this.token}/${this.fechaDesde}/${this.fechaHasta}/${this.titulo}/${this.registroId}`;
    console.log(this.urlCompleta);
  }
}
