import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './components/espirometria/bienvenida/bienvenida.component';
import { CargaXmlComponent } from './components/espirometria/carga-xml/carga-xml.component';
import { EspirometriaComponent } from './components/espirometria/espirometria.component';
import { GestionComponent } from './components/espirometria/gestion/gestion.component';
import { RegistroComponent } from './components/espirometria/gestion/registro/registro.component';
import { ReporteComponent } from './components/espirometria/reporte/reporte.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { VerreporteComponent } from './components/espirometria/verreporte/verreporte.component';
import { GuardGuard } from './guards/guard.guard';
import { VisorArchivosComponent } from './components/espirometria/visor-archivos/visor-archivos.component';

const routes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent, canActivate: [GuardGuard] },
  { path: 'login', component: LoginComponent },

  {
    path: 'espirometria', component: EspirometriaComponent, children: [
      { path: '', redirectTo: '/espirometria/bienvenida', pathMatch: 'full' },
      { path: 'bienvenida', component: BienvenidaComponent, canActivate: [GuardGuard] },
      { path: 'carga', component: CargaXmlComponent, canActivate: [GuardGuard] },
      { path: 'reporte', component: ReporteComponent, canActivate: [GuardGuard] },
      { path: 'gestionar', component: GestionComponent, canActivate: [GuardGuard] },
      { path: 'registro/:idEspirometro', component: RegistroComponent, canActivate: [GuardGuard] },
      { path: 'ver-reporte/:nss', component: VerreporteComponent, canActivate: [GuardGuard] },
      { path: 'ver-pdf', component: VisorArchivosComponent, canActivate: [GuardGuard] },
    ], canActivate: [GuardGuard]

  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
