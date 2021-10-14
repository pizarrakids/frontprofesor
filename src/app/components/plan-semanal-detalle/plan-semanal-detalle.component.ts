import { NgForm } from '@angular/forms';
import { PlaninicialService } from 'src/app/services/planinicial.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-plan-semanal-detalle',
  templateUrl: './plan-semanal-detalle.component.html',
  styleUrls: ['./plan-semanal-detalle.component.css']
})
export class PlanSemanalDetalleComponent implements OnInit {
  token = "";
  detalleId: number;
  tema: String;
  es_calificado: boolean = false;
  material: String;
  //variables de datos del servicio
  dataTotal:   any = [];
  destrezas :  any = [];
  detalle:     any = [];
  recursos:    any = [];
  respuesta:   any = [];
  muestraActividad: boolean = true;
  muestraEstudiantes: boolean = false;
  //variable fecha hoy
  hoy: String = "";
  semanaActiva: boolean = false;
  //atributos para formulario actividad
  codigoRecurso: String  = "";
  tipoActividad: String = "actividad";
  tipoIndicador: String = "indicador";
  tipoMaterial: String = "material";
  detalleIdActividad : number;
  //atributos para calificar actividad
  dataEstudiantes: any = [];
  estudiantes: any = [];




  constructor( private rutaActiva: ActivatedRoute,
               private router: Router,
               private planServ: PlaninicialService
             ) {

              if (this.validaTokenExiste() == null) {
                alert('no esta autenticado');
                this.router.navigateByUrl('/home');
              }

              this.rutaActiva.params.subscribe((params) => {
                this.detalleId = params['id'];
              });
              //console.log(this.detalleId);

              this.getDatosRecursos();
             }

  ngOnInit(): void {
  }

  validaTokenExiste() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  onUpdate(campo){
    var valor: any;
    if( campo == 'tema'){
       valor= ((document.getElementById("tema") as HTMLInputElement).value);
    }else{
       valor = ((document.getElementById("es_calificado") as HTMLInputElement).checked);
    }
    //console.log(campo);
    //console.log(valor);

    this.planServ.updateDetalle(this.token,this.detalleId,campo,valor)
      .subscribe(resp =>{
        //console.log(resp);
      });
  }

  getDatosRecursos(){
    this.planServ.recursoDetalle(this.token,this.detalleId).subscribe(resp =>{
      //console.log(resp);
      this.dataTotal = resp;

      if(this.dataTotal.error == true){
        alert(this.dataTotal.mensaje);
      }else{
        this.destrezas  = this.dataTotal.dataDestrezas;
        this.detalle    = this.dataTotal.dataDetalle;
        this.recursos   = this.dataTotal.dataRecursos;
        this.tema       = this.detalle.tema;
       // this.detalleId = this.detalle.id;
        //console.log(this.detalle.id);
        console.log(this.detalle);

        if(this.detalle.es_calificado == 't'){
          this.es_calificado = true;
        }else{
          this.es_calificado = false;
        }

        this.hoy = this.getFechaActual();
        console.log(this.detalle.fecha_cierre);
        console.log(this.hoy);
        if( this.hoy <= this.detalle.fecha_cierre){
          this.semanaActiva = true;
        }else{
          this.semanaActiva = false;
        }
      }
    });
  }

  getFechaActual(){
    //return string
    var returnDate = "";
    var today = new Date();

    var dd = today.getDate();
    var mm = today.getMonth() + 1; //because January is 0!
    var yyyy = today.getFullYear();
    var h = today.getHours();
    var i = today.getMinutes();
    var s = today.getSeconds();

    //Interpolation date
    returnDate += `${yyyy}-`;

    if (mm < 10) {
      returnDate += `0${mm}-`;
    } else {
      returnDate += `${mm}-`;
    }

    if (dd < 10) {
        returnDate += `0${dd}`+`0${h}`+`0${i}`+`0${s}` ;
      } else {
        returnDate += `${dd}`+` ${h}`+`:${i}`+`:${s}`;
      }

      return returnDate;

  }

  ingresaRecursosForm(form: NgForm){
    if( form.invalid ){
      alert('Datos ingresados no son correctos!!!');
      return;
    }
    this.planServ.postInsertaRecurso(this.token,
      form.value.detalle_id,
      form.value.codigo,
      form.value.tipo,
      form.value.contenido
      ).subscribe(resp =>{
        this.respuesta = resp;
        if(this.respuesta.error == true){
          alert(this.respuesta.mensaje);
        }else{
          location.reload();
        }
      });
  }

  ingresarRecursoDestreza(codigo,tipo,contenido){
   /* console.log(codigo);
    console.log(tipo);
    console.log(contenido);
    console.log(this.detalleId);
  */
    this.planServ.postInsertaRecurso(this.token,
      this.detalleId,
      codigo,
      tipo,
      contenido
      ).subscribe(resp =>{
        this.respuesta = resp;
        if(this.respuesta.error == true){
          alert(this.respuesta.mensaje);
        }else{
          location.reload();
        }
      });
  }

  //metodo para eliminar recurso
  eliminarRecurso(recursoId){
    this.planServ.getEliminaRecurso(this.token,recursoId).subscribe(resp =>{
     this.getDatosRecursos();
    });

  }


  //codigo para los botones actividad y estudiantes
  actividad(){
    this.muestraActividad = true;
    this.muestraEstudiantes = false;
    console.log('muestra datos');
  }

  //metodo para insertar estudiantes en calificar actividad
  calificarActividad(){
    this.muestraActividad = false;
    this.muestraEstudiantes = true;
    //console.log('muestra estudiantes');
    this.planServ.getInsertaEstudiantes(this.token,this.detalleId).subscribe(resp =>{
      this.dataEstudiantes = resp;
      if(this.dataEstudiantes.error == true){
        alert(this.dataEstudiantes.mensaje);
      }else{
        this.estudiantes = this.dataEstudiantes.data;
        console.log(this.estudiantes);
      }
    });
  }

  //metodo para cambiar calificacion del estudiante
  cambiaCalificacion(calificacion_id, valor,campo){
    /*console.log(calificacion_id);
    console.log(valor);
    console.log(campo);

    */
    this.planServ.postInsertaEstudiantes(this.token,calificacion_id,valor,campo)
      .subscribe(resp =>{
        this.calificarActividad();
      });

  }

  ingresaRecursoMaterial(){

    //console.log(this.detalleId);
    var valor= ((document.getElementById("material") as HTMLInputElement).value);
    console.log(valor);

    this.planServ.postInsertaRecurso(this.token,this.detalleId,this.codigoRecurso,'material',valor)
      .subscribe(resp =>{
        this.respuesta = resp;
        if(this.respuesta.error == true){
          alert(this.respuesta.mensaje);
        }else{
          this.getDatosRecursos();
          this.material = '';
        }
      });

  }


}
