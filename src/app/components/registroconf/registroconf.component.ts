import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrosService } from 'src/app/services/registros.service';

@Component({
  selector: 'app-registroconf',
  templateUrl: './registroconf.component.html',
  styleUrls: ['./registroconf.component.css'],
})
export class RegistroconfComponent implements OnInit {
  token = null;
  registroId: number;
  registroData: any = [];
  registroDatos: any = [];
  registroEstudiantes: any = [];

  divDatos = true;
  divEstudiantes = false;

  constructor(
    private rutaActiva: ActivatedRoute,
    private registrosServ: RegistrosService,
    private router: Router
  ) {
    if (this.validaTokenExiste() == null) {
      alert('no esta autenticado');
      this.router.navigateByUrl('/home');
    }

    this.rutaActiva.params.subscribe((params) => {
      this.registroId = params['id'];
    });

    this.datosRegistro();
  }
  //FIN DE CONSTRUCTOR////////

  ngOnInit(): void {}

  validaTokenExiste() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
    }

    return this.token;
  }

  datosRegistro() {
    this.registrosServ
      .registroPorId(this.token, this.registroId)
      .subscribe((resp) => {
        this.registroData = resp;
        console.log(this.registroData);

        if (this.registroData.error == true) {
          alert(this.registroData.mensaje);
        } else {
          this.registroDatos = this.registroData.data;
          this.registroEstudiantes = this.registroData.estudiantes;
        }
      });
  }


  datos(){
    this.divDatos = true;
    this.divEstudiantes = false;
    console.log('muestra datos');
  }
  
  estudiantes(){
    this.divDatos = false;
    this.divEstudiantes = true;
    console.log('muestra estudiantes');
  }

}
