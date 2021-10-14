import { NgForm } from '@angular/forms';
import { AnecdotaService } from './../../services/anecdota.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-anecdotario',
  templateUrl: './anecdotario.component.html',
  styleUrls: ['./anecdotario.component.css']
})
export class AnecdotarioComponent implements OnInit {
  //atributos
  detalleId= null;
  dataEstudiante: any = [];
  estudiante: any = [];
  calificacionId: number;
  token = "";
  dataAnecdota: any = [];
  semanaActiva: boolean = false;
  anecdota: any = [];
  respAnecdota: any = [];
  correo= '';
  //creando foto
  archivo = {
    nombre: null,
    nombreArchivo: null,
    base64textString: null,
    token:  null,
    calificacion_id: null
  }
  //fotos url
  anecdotaUrl = environment.anecdotaUrl;
  //actualiza Foto
  archivoActualizar = {
    nombre: null,
    nombreArchivo: null,
    base64textString: null,
    token:  null,
    id: null
  }
  dataDescripcion: any = [];
  descripcion: any = [];




  constructor( private rutaActiva: ActivatedRoute,
    private router: Router,
    private Anecdota: AnecdotaService
    ) {

   if (this.validaTokenExiste() == null) {
     alert('no esta autenticado');
     this.router.navigateByUrl('/home');
   }

   this.rutaActiva.params.subscribe((params) => {
     this.calificacionId = params['id'];
     this.detalleId = params['detalleId'];
     this.correo = params['correo'];
   });

   this.getAnecdota(this.calificacionId);
   this.datosEstudiante();

  }


  ngOnInit(): void {
  }

  validaTokenExiste() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  getAnecdota(calificacionId){
    //console.log(calificacionId);
    this.Anecdota.getAnecdota(this.token,calificacionId).subscribe(resp =>{
      //console.log(resp);
      this.dataAnecdota = resp;
      this.semanaActiva = this.dataAnecdota.data.estadoSemana;
      this.anecdota = this.dataAnecdota.data.anecdotas;
      //console.log(this.anecdota);

    });
  }

  //insertar archivo en el sistema
  seleccionarArchivo(event){
    var files = event.target.files;
    var file = files[0];
    this.archivo.nombreArchivo = file.name;
    if(files && file){
      var reader = new FileReader();
      reader.onload = this._handlerReaderLoaded.bind(this);
      reader.readAsBinaryString(file);

    }

  }


  _handlerReaderLoaded(readerEvent){
    var binaryString = readerEvent.target.result;
    this.archivo.base64textString = btoa(binaryString);
  }

  upload(){
    //console.log(this.archivo.nombre);
    if(this.archivo.nombre == null || this.archivo.nombreArchivo == null){
      alert('Todos los campos son obligatorios!!!');
    }else{
      this.archivo.token = this.token;
    this.archivo.calificacion_id = this.calificacionId;
    this.Anecdota.postAnecdota(this.archivo).subscribe( resp => {
      this.respAnecdota = resp;
      if(this.respAnecdota.error == true){
        alert('Todos los campos son requeridos!!!');
      }else{
         location.reload();
      }
    });
    }

  }
  //fin inserta archivo//

  getAnecdotaId(id){
    //console.log(id);
    this.Anecdota.getAnecdotaId(this.token,id).subscribe(resp =>{
      //console.log(resp);
      this.dataDescripcion = resp;
      this.descripcion = this.dataDescripcion.data;
      //console.log(this.descripcion);
    });
  }

  actualizaDescripcion(form: NgForm){
    console.log(form.value.descripcion);
    console.log(form.value.id);
    this.Anecdota.actualizaDescripcion(this.token,form.value.descripcion,form.value.id)
      .subscribe(resp =>{
        location.reload();
      });
  }

  getEliminarAnecdota(id){
    //console.log(id);
    this.Anecdota.eliminarAnecdota(this.token,id).subscribe(resp =>{
      this.getAnecdota(this.calificacionId);
    });
  }


  ////////////////MODIFICAR FOTO////////
  actualizaFoto(fa: NgForm){
    this.archivoActualizar.token = this.token;
    this.archivoActualizar.id = fa.value.did;
    //console.log(this.archivoActualizar);
    this.Anecdota.actualizaFoto(this.archivoActualizar).subscribe( resp => {
      location.reload();
    });
  }

  //insertar archivo en el sistema
  seleccionarArchivoActualizar(event){
    var files = event.target.files;
    var file = files[0];
    this.archivoActualizar.nombreArchivo = file.name;
    if(files && file){
      var reader = new FileReader();
      reader.onload = this._handlerReaderLoadedUpdate.bind(this);
      reader.readAsBinaryString(file);

    }

  }

  _handlerReaderLoadedUpdate(readerEvent){
    var binaryString = readerEvent.target.result;
    this.archivoActualizar.base64textString = btoa(binaryString);
  }
  ///////////////FIN MODIFICAR FOTO ///////////////////////////////


  //Método que devuelve datos del estudiante pasadors por URL
  datosEstudiante(){
    this.Anecdota.getAnecdotario(this.token,this.correo).subscribe(resp=>{
      //console.log(resp);
      this.dataEstudiante = resp;
      this.estudiante = this.dataEstudiante.alumno;
      console.log(this.estudiante);
    });
  }
}
