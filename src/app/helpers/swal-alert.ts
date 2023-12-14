import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ErrorComponent } from '../components/modals/error/error.component';
import { WarningComponent } from '../components/modals/warning/warning.component';
import { modals } from '../models/modals';
import { Mensajes } from './mensajes';

@Injectable({
  providedIn: 'root'
})
export class SwalAlert {

  constructor(private _Mensajes: Mensajes,
    public dialog: MatDialog) { }

  public msjLoading(mensaje?: string) {
    Swal.fire({
      title: mensaje?mensaje:this._Mensajes.MSJ_PROCESANDO,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })
  }

  public close() {
    Swal.close();
  }


  public errorDialog(Error: HttpErrorResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      error: Error,

    };
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    // dialogConfig.width = '479px';
    // dialogConfig.height = '270px';
    dialogConfig.position = { top: '117px' };
    const dialogo1 = this.dialog.open(ErrorComponent, dialogConfig);

    dialogo1.afterClosed().subscribe(res => {
      console.log("result: ", res);
      if (res) {
        console.log(res);
      }
      /* if(Error.status == 401){
        sessionStorage.clear();
        localStorage.clear();
        window.location.replace('/login/');
        console.log('Token expirado swal');
      } */

    });

  }

  warningDialog(modal: modals) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = modal;
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.position = { top: '117px' };
    
  //  dialogConfig.width = '500px';
  //  dialogConfig.height = '280px';



    const dialogo1 = this.dialog.open(WarningComponent, dialogConfig);

    dialogo1.afterClosed().subscribe(res => {
      console.log("result: ", res);
      if (res) {

      }

    });



    // dialogo1.componentInstance.onAlert.subscribe(dats => {
    //   console.log("result: ", dats);
    //   this.mostrarMensaje(dats.type, dats.message, dats.typeMsg);
    // });
  }

  invocaSucces(title: string, text:string) : void {

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        showCloseButton: true,
        closeButtonHtml: '<img src="assets/icons/icon-succes-close.svg" width="24" height="24">',
        customClass: {
          closeButton: 'custom-close-button-class',
          container: 'custom-container-class',
        },
        background: "#e2f6d7",
        color: "#5cbc29",
        
      });

      Toast.fire({
        title: '<div style="font-size: 14px">'+ title+'</div>',
        text: text,
      });

  }

  invocaError(title: string, text:string) : void {

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        showCloseButton: true,
        closeButtonHtml: '<img src="assets/icons/icon-error-close.svg" width="24" height="24">',
        customClass: {
          closeButton: 'custom-close-button-class',
          container: 'custom-container-class',
        },
        background: "#fee3d5",
        color: "#e10000",
      });

      Toast.fire({
        title: '<div style="font-size: 14px">'+ title+'</div>',
        text: text,
      });

  }

  loader():void {
      Swal.fire({
          title: '',
          html: '',
          background: '#FFFFFF00',
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
              Swal.showLoading()
          }
      });
  }

  onPressWar(msg1:string, msg2:string): void {
    this.dialog.open(WarningComponent, {
      data: {
        icon: 'warning'
        , strMensaje1: msg1
        , strMensaje2: msg2
        , strTituloBoton: 'Aceptar'
      },
    }).disableClose = true;

  }



}
