import { Component, OnInit } from '@angular/core';
import { Mensajes } from 'src/app/helpers/mensajes';
import { SwalAlert } from 'src/app/helpers/swal-alert';
import { Cabecera } from 'src/app/models/cabecera';

import { modals } from 'src/app/models/modals';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { WarningComponent } from '../../modals/warning/warning.component';
import { VerpdfComponent } from '../../modals/verpdf/verpdf.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportesService } from 'src/app/services/reportes.service';
import { HttpErrorResponse } from '@angular/common/http';
import { respReportes, Reportes } from 'src/app/models/pruebas';

@Component({
  selector: 'app-verreporte',
  templateUrl: './verreporte.component.html',
  styleUrls: ['./verreporte.component.css']
})
export class VerreporteComponent implements OnInit {
  cabecera!: Cabecera;
  modal!: modals;
  nssPaciente!: any;
  lstReportes!: Reportes[]

  constructor(
    public _Mensajes: Mensajes,
    public _Swal: SwalAlert,
    public dialog: MatDialog,
    private router: Router,
    private activerouter: ActivatedRoute,
    private reportservice: ReportesService
  ) { }

  ngOnInit(): void {
    this.cabecera = new Cabecera();
    this.cabecera.strTitulo = this._Mensajes.TITULO_VER_REPORTES;
    this.cabecera.boolBtn = true;
    this.cabecera.strRuta = "/espirometria/reporte";
    this.nssPaciente = this.activerouter.snapshot.paramMap.get('nss');
    if(this.nssPaciente != undefined && this.nssPaciente.length > 0)
      this.consultaReportesPDF();
  }

  consultaReportesPDF() {
    this._Swal.msjLoading();
    this.reportservice.consultarreportespdf(this.nssPaciente).subscribe({next:(data) =>{
      if(data.estatus && data.code == 200){
        this.lstReportes = data.respuesta;
      } else {
        this.mostrarMensaje(this._Mensajes.MSG022, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING);
      }
      this._Swal.close();
    }, error: (err: HttpErrorResponse) => {
      console.log('Error en servicio', err);
      this._Swal.close();
      this.mostrarMensaje(this._Mensajes.MSG022, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING);
    }})
  }

  verreporte(rep: Reportes) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = rep;
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '1000px'; //'98vw';
    dialogConfig.height = '35vw';

    let dialogo1 = this.dialog.open(VerpdfComponent, dialogConfig);

    dialogo1.afterClosed().subscribe(res => {
      if(!res){
        this.mostrarMensaje(this._Mensajes.MSG022, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING);
      }
    });
  }

  private mostrarMensaje(mensaje: string, boton: string, tipo: string) {
    this.modal = new modals();
    this.modal.strTituloBoton = boton;
    switch (tipo) {
      case 'warning':
        this.modal.strMensaje1 = mensaje;
        this.modal.icon = "warning";
        this._Swal.warningDialog(this.modal);
        break;
      case 'error':
        this.modal.strMensaje1 = mensaje;
        this.modal.icon = "error";
        //this._Swal.errorDialog(this.modal);
        break;
      default:
        break;
    }
  }

}
