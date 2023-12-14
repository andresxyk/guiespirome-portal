import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Mensajes } from 'src/app/helpers/mensajes';
import { SwalAlert } from 'src/app/helpers/swal-alert';
import { Cabecera } from 'src/app/models/cabecera';
import { modals } from 'src/app/models/modals';
import { VerarchivoComponent } from 'src/app/components/modals/verarchivo/verarchivo.component';
import { pdfList, registroConFechas } from 'src/app/models/carga-pdf';

@Component({
  selector: 'visor-archivos',
  templateUrl: './visor-archivos.component.html',
  styleUrls: ['./visor-archivos.component.css']
})
export class VisorArchivosComponent implements OnInit {
  @Input() data!: pdfList[];
  cabecera!: Cabecera;
  modal!: modals;
  listaArchivos!: registroConFechas[];
  listaFiles!: pdfList[];

  constructor(public _Mensajes: Mensajes,
    public _Swal: SwalAlert,
    public dialog: MatDialog,

     ) {
   
  }

  ngOnInit(): void {

    this.cabecera = new Cabecera();
    this.cabecera.strTitulo = this._Mensajes.TITULO_VER_REPORTES;
    this.cabecera.boolBtn = true;
    if (this.data != undefined) {
      this.listaFiles = this.data;
    }


  }



  verarchivo(archivo: pdfList) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = archivo;
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '1000px'; //'98vw';
    dialogConfig.height = '600px';

    const dialogo1 = this.dialog.open(VerarchivoComponent, dialogConfig);
    dialogo1.afterClosed().subscribe(res => {
    });
  }





}
