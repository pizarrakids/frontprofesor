import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  token     = '';
  nickname  = '';
  data: any = [];
  usuario: any = [];
  perfil: any = [];

  constructor( private auth: AuthService, 
               private router: Router, private _route: ActivatedRoute ) { 
                //  this.verificaToken();
               }

  ngOnInit(): void {
    this.logout();
  }

  // verificaToken(){
  //   if(localStorage.getItem('token')){
  //     this.router.navigateByUrl('/misitio');
  //   }
  // }

  onSubmit( form: NgForm){

    let estado: any;

    if( form.invalid ){ 
      alert('Datos ingresados no son correctos!!!');
      return; 
    }

    this.auth.login( form.value.email, form.value.password)
      .subscribe( resp => {
        //console.log(resp);
        this.data = resp;
        estado = this.data.error;
        
        if( estado == true ){
          alert(this.data.mensaje);
          return;
        }else{        
          //console.log (this.data)
          //this.data = resp.data;
          localStorage.setItem('token', this.data.data.token);
          localStorage.setItem('nickname', this.data.data.nickname);
          this.router.navigate(['misitio']);
        }
      })

  }

  logout(){
    this._route.params.subscribe( params => {
      let logout = +params['sure'];
      if(logout == 1){
        localStorage.removeItem('token');
        localStorage.removeItem('nickname');
        
        this.token = '';
        this.nickname = '';

        //redireccion
        //this.router.navigate(['misitio']);
      }
    });
 }



}
