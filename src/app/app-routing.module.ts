import { DeberComponent } from './components/deber/deber.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MisitioComponent } from './components/misitio/misitio.component';
import { RegistroconfComponent } from './components/registroconf/registroconf.component';
import { RegistrosComponent } from './components/registros/registros.component';
import { PlansemanalinicialComponent } from './components/plansemanalinicial/plansemanalinicial.component';
import { PlanSemanalDetalleComponent } from './components/plan-semanal-detalle/plan-semanal-detalle.component';
import { AnecdotarioComponent } from './components/anecdotario/anecdotario.component';
import { CalificarDeberComponent } from './components/calificar-deber/calificar-deber.component';
import { CalificarDeberEstudianteComponent } from './components/calificar-deber-estudiante/calificar-deber-estudiante.component';


const routes: Routes = [
  //{ path:'home', component: HomeComponent },
  { path: '', component: LoginComponent },
  { path:'login', component: LoginComponent },
  { path:'logout/:sure', component: LoginComponent },
  { path:'misitio', component: MisitioComponent },
  { path:'registros', component: RegistrosComponent },
  { path:'registroconf/:id', component: RegistroconfComponent },
  { path:'plansemanalinicial/:id', component: PlansemanalinicialComponent },
  { path:'planSemanalDetalle/:id', component: PlanSemanalDetalleComponent },
  { path:'anecdotario/:id/:detalleId/:correo', component: AnecdotarioComponent },
  { path:'deber/:detalleId/:titulo', component: DeberComponent },
  { path:'calificar-deber/:id', component: CalificarDeberComponent },
  { path:'calificar-deber-estudiante/:id', component: CalificarDeberEstudianteComponent },
  // { path: '**', pathMatch: 'full', redirectTo: '/login'}
  { path:'**', component: MisitioComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
