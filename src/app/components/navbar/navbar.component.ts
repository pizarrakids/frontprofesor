import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit {

  token     = '';
  nickname  = '';
  usuario: any = [];

  constructor( private auth: AuthService,
               private router: Router) {

    if(localStorage.getItem('token')){
      this.token = localStorage.getItem('token');
      this.nickname = localStorage.getItem('nickname');
    }
   }

  ngOnInit(): void {
  }

  login( formuLogin: NgForm ){

      this.auth.login(formuLogin.value.email, formuLogin.value.password)
      .subscribe( resp => {
        //console.log(resp);
        this.usuario = resp;
        localStorage.setItem('token', this.usuario.token);
        localStorage.setItem('nickname', this.usuario.nickname);
        location.reload();
      });

  }

  logout(){
    localStorage.clear();
    this.token='';
    this.router.navigateByUrl('/home');
  }

}
