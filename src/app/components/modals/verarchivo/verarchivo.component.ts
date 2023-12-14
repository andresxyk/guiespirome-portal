import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { pdfList } from 'src/app/models/carga-pdf';

@Component({
  selector: 'app-verarchivo',
  templateUrl: './verarchivo.component.html',
  styleUrls: ['./verarchivo.component.css']
})
export class VerarchivoComponent implements OnInit {

  public sidebarVisible = false;
  public theme = "dark";
  public srcArchivo : string = '';
  public fileName : string = '';

  constructor(@Inject(MAT_DIALOG_DATA) data:
  {
    archivoBase: string,
    nombre: string,
    blob: any
  },
  private dialogRef: MatDialogRef<VerarchivoComponent>) {
    dialogRef.disableClose = true;
    this.srcArchivo = data.blob;
    this.fileName = data.nombre;
  }

  ngOnInit(): void {
  }

  close(){
    this.srcArchivo = '';
    this.dialogRef.close();
    }

}
