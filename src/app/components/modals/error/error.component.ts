import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { modals } from 'src/app/models/modals';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  dataparams: HttpErrorResponse;
  estatus!: string;
  mensaje!: string;
  descripcion!: string
  constructor(public dialogRef: MatDialogRef<ErrorComponent>,
    @Inject(MAT_DIALOG_DATA) data: HttpErrorResponse) {
    this.dataparams = data;
  }

  ngOnInit(): void {

    this.codigoMensaje(this.dataparams);

    this.descripcion = this.dataparams.error.url?this.dataparams.error.url : this.dataparams.error?.error?.message?this.dataparams.error.error.message :'' ;
    
  }

  private codigoMensaje(error: HttpErrorResponse) {
    this.estatus = error.status?"Código " + error.status:'';
    switch (error.error.status) {
   
      case 401:
        this.mensaje = 'Su sesión ha caducado';
        break;
      case 403:
        this.mensaje = 'Acceso denegado/prohibido';
        break;
      case 404:
        this.mensaje = 'La página solicitada no se encuentra en este servidor';
        break;
      case 500:
        this.mensaje = 'Error interno del servidor';
        break;
      case 502:
        this.mensaje = 'Puerta de enlace incorrecta';
        break;
      case 503:
        this.mensaje = 'Servicio no disponible';
        break;
      default:
        this.mensaje = "Falla en la petición al servidor";
        break;
    }
  }

  btnCerrar() {
    this.dialogRef.close(this.dataparams);
  }


  cancelar(): void {
    this.dialogRef.close();
  }

  accionar(): void {
    this.dialogRef.close({ event: true });
    console.log("accionar");
  }

}
