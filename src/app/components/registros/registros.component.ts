import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RegistrosService } from 'src/app/services/registros.service';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.css'],
})
export class RegistrosComponent implements OnInit {
  token = null;
  resp : any = [];
  respData : any [];

  constructor(private router: Router, 
              private auth: AuthService,
              private regis: RegistrosService ) {

    if (this.validaTokenExiste() == null) {
      alert('no esta autenticado');
      this.router.navigateByUrl('/home');
    }

    this.recuperaRegistros();
  }

  ngOnInit(): void {}

  validaTokenExiste() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
    }

    return this.token;
  }

  recuperaRegistros(){
    this.regis.tomaRegistrosDocente(this.token).subscribe( resp => {
      
      this.resp = resp;

      if(this.resp.error == true){
        alert(this.resp.mensaje);
      }else{
        //console.log(resp);
        this.respData = this.resp.data;
        console.log(this.respData);
      }

    });

  }

}
