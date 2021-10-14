import { DeberService } from './../../services/deber.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-deber',
  templateUrl: './deber.component.html',
  styleUrls: ['./deber.component.css'],
})
export class DeberComponent implements OnInit {
  token: any = [];
  fechaInicio: Date;
  fechaEntrega: Date;
  horaInicio;
  horaEntrega;
  tema;
  descripcion;
  config: any;
  detalleId: String;
  titulo : String;
  //IsmodelShow = false;
  dataDeber: any = [];
  deber: any = [];

  //creando archivo
  archivo = {
    nombreArchivo: null,
    base64textString: null,
    token: null,
    titulo: null,
    deber_id : null
  };
  //atributos de clase #2
  dataTarea: any= [];
  tarea: any= [];
  hora_fi;
  tarea_fe;
  hora_fe;
  material: any  = [];
  //atributos para la descarga de archivos
  apiUrl = environment.apiUrl;
  url = `${this.apiUrl}Deber/descargarmaterial/`;

  constructor(
    private router: Router,
    private servDeber: DeberService,
    private rutaActiva: ActivatedRoute
  ) {
    if (this.validaTokenExiste() == null) {
      alert('no esta autenticado');
      this.router.navigateByUrl('/login');
    }

    this.configDataPicker();

    this.rutaActiva.params.subscribe((params) => {
      this.detalleId = params['detalleId'];
      this.titulo = params['titulo'];
    });

    this.todosDeberes();
  }

  ngOnInit(): void {}

  validaTokenExiste() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
    }

    return this.token;
  }

  configDataPicker() {
    this.config = {
      format: 'YYYY-MM-DD HH:mm:ss',
    };
  }

  //insertar archivo en el sistema
  seleccionarArchivo(event) {
    var files = event.target.files;
    var file = files[0];
    this.archivo.nombreArchivo = file.name;
    if (files && file) {
      var reader = new FileReader();
      reader.onload = this._handlerReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  _handlerReaderLoaded(readerEvent) {
    var binaryString = readerEvent.target.result;
    this.archivo.base64textString = btoa(binaryString);
  }

  upload() {
    //console.log(this.archivo);
    this.archivo.token = this.token;
    this.archivo.deber_id = this.tarea.id;
    //console.log(this.archivo);
    this.servDeber.postSubirArchivo(this.archivo).subscribe(resp=>{
      //console.log(resp);
      this.muestraDeber(this.tarea.id);
      this.archivo.titulo = '';
    });
  }
  //fin de insertar archivo

  //post deber
  insertaDeber() {
    let finicio = this.fechaInicio + ' ' + this.horaInicio;
    let fentrega = this.fechaEntrega + ' ' + this.horaEntrega;
    this.servDeber
      .postDeber(
        this.token,
        this.tema,
        this.descripcion,
        finicio,
        fentrega,
        this.detalleId
      )
      .subscribe((resp) => {
        //console.log(resp);
        location.reload();
      });
  }

  //Método para actualizar deber
  actualizaDeber() {
    let finicio = this.tarea.fecha_creacion + ' ' + this.hora_fi;
    let fentrega = this.tarea_fe + ' ' + this.hora_fe;
    this.servDeber
      .postActualizaDeber(
        this.token,
        this.tarea.tema,
        this.tarea.descripcion,
        finicio,
        fentrega,
        this.tarea.id
      )
      .subscribe((resp) => {
        //console.log(resp);
        location.reload();
      });
  }

  //   close() {
  //     this.IsmodelShow=true;// set false while you need open your model popup
  //    // do your more code
  // }

  todosDeberes() {
    this.servDeber.getDeber(this.token, this.detalleId).subscribe((resp) => {
      // console.log(resp);
      this.dataDeber = resp;
      this.deber = this.dataDeber.deberes;
      console.log(resp);
    });
  }

  //Método para mostrar UN deber
  muestraDeber(id) {
    this.servDeber.muestraDeber(this.token, id).subscribe((resp) => {
      //console.log(resp);
      this.dataTarea = resp;
      this.tarea = this.dataTarea.deberes.deber;
      this.material = this.dataTarea.deberes.material;
      this.hora_fi = this.tarea.fecha_inicio.substring(11,16);
      this.tarea_fe = this.tarea.fecha_entrega.substring(0,10);
      this.hora_fe = this.tarea.fecha_entrega.substring(11,16);

      //console.log(this.material);
    });
  }

  //Método para eliminar deber
  eliminaDeber(id) {
    this.servDeber.eliminaDeber(this.token, id).subscribe((resp) => {
      //console.log(resp);
      this.todosDeberes();
    });
  }

  //Método para descargar un Deber por id
  // descargaDeber(id){
  //   console.log(id);
  //   this.servDeber.getDescargaDeber(this.token,id);
  // }

  //Elimina Archivo de UN DEBER
  EliminaMaterialDeber(id){
    console.log(id);
     this.servDeber.getEliminaMaterialDeber(this.token,id).subscribe(resp=>{
       //console.log(resp);
       this.muestraDeber(this.tarea.id);
     });
  }

}
