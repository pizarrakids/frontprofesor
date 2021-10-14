import { DeberService } from './../../services/deber.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { tr } from 'date-fns/locale';

@Component({
  selector: 'app-calificar-deber',
  templateUrl: './calificar-deber.component.html',
  styleUrls: ['./calificar-deber.component.css'],
})
export class CalificarDeberComponent implements OnInit {
  token = null;
  registroId = null;
  dataDeberes: any = [];
  deberes: any = [];

  constructor(private router: Router,
    private rutaActiva: ActivatedRoute,
    private servDeber: DeberService
    ) {
    if (this.validaTokenExiste() == null) {
      alert('no esta autenticado');
      this.router.navigateByUrl('/home');
    }

    this.rutaActiva.params.subscribe((params) => {
      this.registroId = params['id'];
    });
    this.muestraDeberes();

  }

  ngOnInit(): void {}

  validaTokenExiste() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
    }

    return this.token;
  }

  //Método para mostrar todos los deberes segun el "registroId"
  muestraDeberes(){
    this.servDeber.getMuestraDeberes(this.token,this.registroId).subscribe(resp=>{
      //console.log(resp);
      this.dataDeberes = resp;
      this.deberes = this.dataDeberes.data;
      console.log(this.deberes);
    });
  }
}
