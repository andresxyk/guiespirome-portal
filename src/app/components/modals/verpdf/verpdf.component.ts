import { Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxExtendedPdfViewerService, ProgressBarEvent } from 'ngx-extended-pdf-viewer';
import { Reportes } from 'src/app/models/pruebas';
import { modals } from '../../../models/modals';
import { WarningComponent } from '../warning/warning.component';
import { Mensajes } from 'src/app/helpers/mensajes';
import { SwalAlert } from 'src/app/helpers/swal-alert';
import { environment } from 'src/environments/environment';
import { ReportesService } from 'src/app/services/reportes.service';
import { HttpErrorResponse } from '@angular/common/http';
declare var $: any

@Component({
  selector: 'app-verpdf',
  templateUrl: './verpdf.component.html',
  styleUrls: ['./verpdf.component.css']
})
export class VerpdfComponent implements OnInit, OnDestroy {
  objReporte: Reportes = new Reportes();

  public sidebarVisible = true;
  public theme = "dark";
  public replaceBrowserPrint = true;

  imprimir: boolean = false;
  modal!: modals;
  rutapdf: string = "";
  mostrar: boolean = false;

  public printPercentage = 0;
  public totalPages = 0;
  public currentPageRendered = 0;
  public showProgress = false;
  public showCompleted = false;
  public hideBuiltInProgress = false;

  constructor(private dialogRef: MatDialogRef<VerpdfComponent>,
    private pdfService: NgxExtendedPdfViewerService,
    public dialog: MatDialog,
    public _Mensajes: Mensajes,
    public _Swal: SwalAlert,
    private reportservice: ReportesService,
    @Inject(MAT_DIALOG_DATA) data: Reportes) {
      this.mostrar = false;
      this.objReporte = data;
    }
  ngOnInit(): void {
    this._Swal.msjLoading();
    this.reportservice.consultarreportespdf(this.objReporte.nss).subscribe({next:(data) =>{
      if(data.estatus && data.code == 200){
        this.rutapdf = `${environment.URLFiles}` + this.objReporte.rutaArchivo;
        this.mostrar = true;
      } else {
        this._Swal.close();
        this.dialogRef.close(false);
      }
    }, error: (err: HttpErrorResponse) => {
      console.log('Error en servicio', err);
      this._Swal.close();
      this.dialogRef.close(false);
    }})
  }

  close() {
    this.dialogRef.close(true);
  }

  onBeforePrint() {
    this.showCompleted = false;
    this.showProgress = true;
  }

  public onAfterPrint() {
    this.showCompleted = true;
    this.showProgress = false;
    this.imprimir = false;
  }

  public cancel() {
    document.getElementById('printCancel')?.click();
  }

  get isPrintCancelled(): boolean {
    return this.totalPages !== this.currentPageRendered;
  }

  onProgress(event: ProgressBarEvent): void {
    if (this.showProgress && !this.imprimir) {
      this.totalPages = event.total;
      this.printPercentage = event.percent;
      this.currentPageRendered = event.page ?? 0;
      if(this.printPercentage > 1){
        this.cancel();
        setTimeout(() => {
          this.muestraModal();
        },500);
      }
    }
  }

  loaded(event: any) {
    console.log(event);
    this.mostrar = true;
    this._Swal.close();
  }

  loadingFail(event: any) {
    console.log(event);
    this._Swal.close();
    this.mostrar = false;
    this.dialogRef.close(false);
  }

  ngOnDestroy() {
    this.mostrar = false;
  }

  muestraModal() {
    $('#content').modal({
      keyboard: false,
      backdrop: 'static',
    })
    $('#content').modal('show')
  }

  btnAccionar() {
    $('#content').modal('hide');
    this.imprimir = true;
    this.pdfService.print();
  }

  btnCancelar() {
    this.imprimir = false;
    $('#content').modal('hide');
  }

}
