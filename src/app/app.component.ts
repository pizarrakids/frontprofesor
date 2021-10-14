import { Component, OnInit, DoCheck } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService]
})
export class AppComponent implements OnInit, DoCheck {

  public token: any = '';
  public nickname: any = '';

  title = 'suitFront';

  constructor(private _authService: AuthService ){
    if(localStorage.getItem('token')){
      this.token = localStorage.getItem('token');
      this.nickname = localStorage.getItem('nickname');

      // console.log(this.token);
      // console.log(this.nickname);
    }
  }

  ngOnInit(){}

  ngDoCheck(){
    this.token = localStorage.getItem('token');
    this.nickname = localStorage.getItem('nickname');
  }
}
