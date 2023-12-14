import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BarMenuComponent } from './components/bar-menu/bar-menu.component';
import { EspirometriaComponent } from './components/espirometria/espirometria.component';
import { CargaXmlComponent } from './components/espirometria/carga-xml/carga-xml.component';
import { ReporteComponent } from './components/espirometria/reporte/reporte.component';
import { GestionComponent } from './components/espirometria/gestion/gestion.component';
import { BarLoginComponent } from './components/bar-login/bar-login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { TitleComponent } from './components/templates/title/title.component';
import { WarningComponent } from './components/modals/warning/warning.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { Mensajes } from './helpers/mensajes';
import { ErrorComponent } from './components/modals/error/error.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { BienvenidaComponent } from './components/espirometria/bienvenida/bienvenida.component';
import { RegistroComponent } from './components/espirometria/gestion/registro/registro.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { DataTablesModule } from 'angular-datatables';
import { CerrarSesionComponent } from './components/bar-login/cerrar-sesion/cerrar-sesion.component';

import { registerLocaleData } from '@angular/common';
import { VerreporteComponent } from './components/espirometria/verreporte/verreporte.component';
import { VerpdfComponent } from './components/modals/verpdf/verpdf.component';
import { NgxExtendedPdfViewerModule} from 'ngx-extended-pdf-viewer';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { VerarchivoComponent } from './components/modals/verarchivo/verarchivo.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { InterceptorInterceptor } from './services/interceptor.interceptor';
import { MatSelectModule } from '@angular/material/select';
import { UnidadesComponent } from './components/modals/unidades/unidades.component';
import { NoCopyPasteDirective } from './directives/no-copy-paste.directive';
import { MatTableModule } from '@angular/material/table';

import { FooterComponent } from './components/footer/footer.component';
import localeEsMX from '@angular/common/locales/es-MX';
import { VisorArchivosComponent } from './components/espirometria/visor-archivos/visor-archivos.component';

registerLocaleData(localeEsMX, 'es-MX');
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BarMenuComponent,
    EspirometriaComponent,
    CargaXmlComponent,
    ReporteComponent,
    GestionComponent,
    BarLoginComponent,
    InicioComponent,
    TitleComponent,
    WarningComponent,
    ErrorComponent,
    BienvenidaComponent,
    RegistroComponent,
    CerrarSesionComponent,
    VerreporteComponent,
    VerpdfComponent,
    VerarchivoComponent,
    UnidadesComponent,
    NoCopyPasteDirective,
    FooterComponent,
    VisorArchivosComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatMenuModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatIconModule,
    DataTablesModule,
    NgxExtendedPdfViewerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentDateModule,
    MatButtonModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatDividerModule,
    MatProgressBarModule,
    NgIdleKeepaliveModule.forRoot(),
    MatSelectModule,
    MatTableModule

  ],
  providers: [Mensajes, MatDatepickerModule,GestionComponent,CargaXmlComponent,
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
