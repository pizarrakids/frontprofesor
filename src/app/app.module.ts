import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { MisitioComponent } from './components/misitio/misitio.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrosComponent } from './components/registros/registros.component';
import { RegistroconfComponent } from './components/registroconf/registroconf.component';
import { PlansemanalinicialComponent } from './components/plansemanalinicial/plansemanalinicial.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { PlanSemanalDetalleComponent } from './components/plan-semanal-detalle/plan-semanal-detalle.component';
import { AnecdotarioComponent } from './components/anecdotario/anecdotario.component';
import { DeberComponent } from './components/deber/deber.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalificarDeberComponent } from './components/calificar-deber/calificar-deber.component';
import { CalificarDeberEstudianteComponent } from './components/calificar-deber-estudiante/calificar-deber-estudiante.component';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    MisitioComponent,
    LoginComponent,
    RegistrosComponent,
    RegistroconfComponent,
    PlansemanalinicialComponent,
    PlanSemanalDetalleComponent,
    AnecdotarioComponent,
    DeberComponent,
    CalificarDeberComponent,
    CalificarDeberEstudianteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
