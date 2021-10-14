import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MisitioService } from 'src/app/services/misitio.service';

@Component({
  selector: 'app-misitio',
  templateUrl: './misitio.component.html',
  styles: [
  ]
})
export class MisitioComponent implements OnInit {

  token = null;
  dataPerfil: any =[];
  perfil = '';

  constructor( private router: Router,
              private auth: AuthService,
              private misSitioService: MisitioService  ) {

      if(!localStorage.getItem('token')){
        this.router.navigate(['login']);
      }

      this.token = localStorage.getItem('token');

      // if(this.validaTokenExiste() == null){
      //   alert('no esta autenticado');
      //  this.router.navigateByUrl('/home');
      // }

      // this.recuperaPerfil();
   }

  ngOnInit(): void {
  }

  validaTokenExiste(){
    if(localStorage.getItem('token')){
      this.token = localStorage.getItem('token');
    }

    return this.token;
  }

  // recuperaPerfil(){
  //   this.auth.recuperPerfil(this.token)
  //     .subscribe( resp => {
  //       this.dataPerfil =  resp;
  //       this.perfil = this.dataPerfil.codigo;
  //     });
  // }

}
