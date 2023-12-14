import { Component, OnInit, ElementRef, LOCALE_ID, ViewChild } from '@angular/core';
import { Mensajes } from 'src/app/helpers/mensajes';
import { SwalAlert } from 'src/app/helpers/swal-alert';
import { Cabecera } from 'src/app/models/cabecera';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { Moment } from 'moment';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { modals } from 'src/app/models/modals';
import { ReportesService } from 'src/app/services/reportes.service';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Prueba, reqPrueba } from 'src/app/models/pruebas';
import { catOOAD, catUMF } from 'src/app/models/repOOAD';
import { errors } from 'src/app/models/repErrors';
import { calendarHelper, CustomDateAdapter } from 'src/app/helpers/calendar';
import { AuthService } from 'src/app/services/auth.service';
import { UserData } from "src/app/models/resOauth";

declare var $: any;
var table:any;
var paginaactual: number = 0;

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: calendarHelper.MY_DATE_FORMATS },
    {
      provide: LOCALE_ID, useValue: 'es-MX'
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' }

  ]
})
export class ReporteComponent implements OnInit {
  @ViewChild('picker') picker: any;

  cabecera!: Cabecera;
  reporte: any;
  strPerfilUser!: string;
  modal!: modals;
  user!: UserData | null;

  lstPruebas: Array<Prueba> = new Array<Prueba>();
  listErrors!: errors;
  lstOoad: Array<catOOAD> = new Array<catOOAD>();
  lstUmf: Array<catUMF> = new Array<catUMF>();
  mdlRequest: reqPrueba = new reqPrueba();

  numitems:number = 10; //Paginacion
  pagactual:number = 1;
  dtOptions: DataTables.Settings = {};

  formatofecha!: string;
  fechaminima!: string;
  fechamaxima!: string;
  minDate!: any;
  maxDate!: any;

  @ViewChild('allSelectedOoad') private allSelectedOoad!:MatOption;
  @ViewChild('allSelectedUmf') private allSelectedUmf!:MatOption;
  constructor(  public _Mensajes: Mensajes,
    public _Swal: SwalAlert,
    private formBuilder: FormBuilder,
    private elementRef:ElementRef,
    public dialog: MatDialog,
    private router: Router,
    private reportservice: ReportesService,
    private authService: AuthService
    ) { }

  myFilter = calendarHelper.myFilter.bind(this);

  ngOnInit(): void {
    this.cabecera = new Cabecera();
    this.cabecera.strTitulo = this._Mensajes.TITULO_REPORTES;

    this.getPerfil();
    this.cargaVars();
    this.buildform();
    this.cargaooad();

    setTimeout(() => {
      this.recargaValores();
    }, 800);
  }

  private getPerfil() {
    this.user = this.authService.sessionUserDataDecoded;
    if(this.user) {
      this.strPerfilUser = this.user.perfil;
      //console.log("USER", this.user);
    } else {
      this.authService.logout();
    }
  }

  private cargaVars(){
    this.formatofecha = "DD/MM/YYYY";
    this.fechaminima = "01/01/2022";
    this.fechamaxima =  moment().format('DD/MM/YYYY');
    this.minDate = moment(this.fechaminima, this.formatofecha);
    this.maxDate = moment(this.fechamaxima, this.formatofecha);

    this.listErrors = new errors();
    this.setErrors(false);

    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: this.numitems,
      processing: true,
      info: false,
      ordering: true,
      columnDefs: [
        { type: "extract-date", targets: 6 },
        {
          orderable: false,
          targets: "no-sort"
        },{
          orderable: false,
          targets: 0,
        }
      ],
      order: [[6, 'desc']],
      searching: false,
      retrieve: true,
      scrollX: true,
      responsive: true,
      "lengthChange": false,
      "dom": "t<'table-pie' <'col-lg-4 col-md-4 col-sm-4 col-xs-4'><'col-md-7 col-lg-7 col-sm-6 col-xs-6 text-right'p><'col-lg-1 col-md-1 col-sm-2 col-xs-2'>>",
      "language": {
        "paginate": {
          "first": "First page",
          "previous": '<span class="glyphicon glyphicon-menu-left paginacion-icon-navegacion" aria-hidden="true"></span>',
          "next": '<span class="glyphicon glyphicon-menu-right paginacion-icon-navegacion" aria-hidden="true"></span>',
          "last": "last"
        }
      }
    };
  }

  private buildform() {
    this.reporte = this.formBuilder.group({
      ooad:[{value:'', disabled: this.strPerfilUser != 'Administrador'}, Validators.compose([
        Validators.required
      ])],
      ubicacion:['', Validators.compose([
        Validators.required,
      ])],
      fechainicio:[''],
      fechafin:[''],
      nss:['', Validators.compose([
        Validators.required,
      ])],
    })
  }

  cargaooad(){
    this._Swal.msjLoading();
    this.reportservice.catalogoOOAD().subscribe({next: (data) =>{
      if(data.estatus && data.code == 200){
        this.lstOoad = data.respuesta;
      } else {
        //ERROR
        this.mostrarMensaje(data.mensaje, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING);
      }
      this._Swal.close();
    }, error: (err: HttpErrorResponse) => {
      console.log('Error en servicio', err);
      this._Swal.close();
      this._Swal.errorDialog(err);
    }});
  }

  cargaubicacion() {
    this.setErrors(false, "ooad");
    let arrooad: Array<catOOAD> = new Array<catOOAD>();
    //console.log("ooad", this.reporte.controls['ooad'].value);
    arrooad = this.reporte.controls['ooad'].value;
    this._Swal.msjLoading();
    if(arrooad.length == this.lstOoad.length + 1){
      //SELECCION TODAS
      this.reportservice.catalogoTodasUMF("").subscribe({next: (data) =>{
        if(data.estatus && data.code == 200){
          this.lstUmf = data.respuesta;
        } else {
          //ERROR
          this.mostrarMensaje(data.mensaje, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING);
        }
        this._Swal.close();
      }, error: (err: HttpErrorResponse) => {
        console.log('Error en servicio', err);
        this._Swal.close();
        this._Swal.errorDialog(err);
      }})

    } else if(arrooad.length > 0) {
      let arrreq: string[] = [];
      for(let itm of arrooad){
        arrreq.push(itm.cveOoad);
      }
      this.reportservice.catalogoUMF(arrreq).subscribe({next: (data) =>{
        if(data.estatus && data.code == 200){
          this.lstUmf = data.respuesta;
        } else {
          //ERROR
          this.mostrarMensaje(data.mensaje, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING);
        }
        this._Swal.close();
      }, error: (err: HttpErrorResponse) => {
        console.log('Error en servicio', err);
        this._Swal.close();
        this._Swal.errorDialog(err);
      }})
    } else {
      this.lstUmf = new Array<catUMF>();
      this._Swal.close();
    }
  }

  toggleOoadAll() {
    if(this.allSelectedOoad.selected){
      this.reporte.controls['ooad'].patchValue([...this.lstOoad.map(item => item), 0]);
    } else {
      this.reporte.controls['ooad'].patchValue([]);
    }
  }

  toggleUmfAll() {
    if(this.allSelectedUmf.selected){
      this.reporte.controls['ubicacion'].patchValue([...this.lstUmf.map(item => item), 0]);
    } else {
      this.reporte.controls['ubicacion'].patchValue([]);
    }
  }

  btnLimpiar(){
    this.setErrors(false);
    this.lstPruebas = new Array<Prueba>();
    if(this.strPerfilUser == "Administrador") {
      this.lstUmf = new Array<catUMF>();
      this.reporte.controls['ooad'].patchValue([]);

    }
    this.reporte.controls['ubicacion'].patchValue([]);
    this.reporte.controls['fechainicio'].setValue("");
    this.reporte.controls['fechafin'].setValue("");
    this.reporte.controls['nss'].setValue("");
    this.reporte.markAsUntouched();
    this.reporte.markAsPristine();
    sessionStorage.removeItem('lstReportes');
  }

  recargaValores() {
    if (JSON.parse(sessionStorage.getItem('lstReportes') as string) as reqPrueba) {
      this._Swal.msjLoading();
      let objReqprueba = JSON.parse(sessionStorage.getItem('lstReportes') as string) as reqPrueba;
      //console.log("🚀 ~ file: reporte.component.ts:259 ~ ReporteComponent ~ recargaValores ~ objReqprueba:", objReqprueba)

      if(objReqprueba.ooad.length == 0) {
        this.reporte.controls['ooad'].patchValue([]);
      } else if (objReqprueba.ooad.length > 0) {
        let objooad: catOOAD = new catOOAD();
        let arrooad: Array<catOOAD> = new Array<catOOAD>();
        for(let it of objReqprueba.ooad) {
          objooad = this.lstOoad.find(x=>x.cveOoad.trim() == it) as catOOAD;
          arrooad.push(objooad);
        }
        this.reporte.controls['ooad'].patchValue(arrooad);
      }

      this.reporte.controls['fechainicio'].setValue(moment(objReqprueba.fechaInicio, this.formatofecha));
      this.reporte.controls['fechafin'].setValue(moment(objReqprueba.fechaFin, this.formatofecha));
      this.reporte.controls['nss'].setValue(objReqprueba.nss);

      if(objReqprueba.umf.length == 0) {
        this.reporte.controls['ubicacion'].patchValue([]);
        this.validarFiltrosBusqueda();
        this._Swal.close();
      } else if(objReqprueba.umf.length > 0) {
        this.cargaubicacion();
        let arrumf: Array<catUMF> = new Array<catUMF>();
        setTimeout(() => {
          for(let it of objReqprueba.umf) {
            arrumf.push(this.lstUmf.find(x=> x.cvePresupuestal == it.cvePresupuestal)as catUMF);
          }
          this.reporte.controls['ubicacion'].patchValue(arrumf);
          this.validarFiltrosBusqueda();
          this._Swal.close();
        },800);
      }
    } else if(this.user?.perfil != "Administrador") {
      this._Swal.msjLoading();
      let objooad: catOOAD = new catOOAD();
      let arrooad: Array<catOOAD> = new Array<catOOAD>();
      objooad = this.lstOoad.find(x=>x.descripcionOoad.trim() == this.user?.delegacion.trim()) as catOOAD;
      arrooad.push(objooad);
      this.reporte.controls['ooad'].patchValue(arrooad);
      this.cargaubicacion();

      let arrumf: Array<catUMF> = new Array<catUMF>();
      let objumf: catUMF = new catUMF();
      this.reporte.controls['ubicacion'].patchValue(arrumf);

      /** Apartado que setea solo la umf designada al user logueado
       *
       *
      setTimeout(() => {
        if(this.user?.umf){
          objumf = this.lstUmf.find(x=> x.cvePresupuestal == this.user?.umf) as catUMF;
          if(objumf)
            arrumf.push(objumf);
        }
        this.reporte.controls['ubicacion'].patchValue(arrumf);
        //console.log("UMF", this.reporte.controls['ubicacion'].value);
        this._Swal.close();
      },800);
      */
    }
  }

  btnBuscar() {
    this.validarFiltrosBusqueda();
  }

  validarFiltrosBusqueda() {
    //if(this.strPerfilUser == "Administrador") {
      if((this.reporte.controls['ooad'].value != undefined && this.reporte.controls['ooad'].value != "") ||
      (this.reporte.controls['ubicacion'].value != undefined && this.reporte.controls['ubicacion'].value != "") ||
      (this.reporte.controls['fechainicio'].value != undefined && this.reporte.controls['fechainicio'].value != "") ||
      (this.reporte.controls['fechafin'].value != undefined && this.reporte.controls['fechafin'].value != "") ||
      (this.reporte.controls['nss'].value != undefined && this.reporte.controls['nss'].value != "")
      ){
        this.buscarreporte();
      } else {
        //Muesta mensaje modal
        this.setErrors(true);
        this.mostrarMensaje(this._Mensajes.MSG010, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING);
      }
    /*} else {
      if(
      (this.reporte.controls['fechainicio'].value != undefined && this.reporte.controls['fechainicio'].value != "") ||
      (this.reporte.controls['fechafin'].value != undefined && this.reporte.controls['fechafin'].value != "") ||
      (this.reporte.controls['nss'].value != undefined && this.reporte.controls['nss'].value != "")
      ){
        this.buscarreporte();
      } else {
        //Muesta mensaje modal
        this.setErrors(true);
        this.mostrarMensaje(this._Mensajes.MSG010, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING);
      }
    }
    */
  }

  buscarreporte(){
    if(this.reporte.controls['nss'].value.length > 0){
      if(this.reporte.controls['nss'].invalid){
        //NSS no valido
        this.mostrarMensaje(this._Mensajes.MSG011, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING);
        this.setErrors(false);
        return;
      }
    }
    this._Swal.msjLoading();
    this.lstPruebas = new Array<Prueba>();
    this.setErrors(false);
    let strooad: string[] = [];
    let strumf: string[] = [];
    let arrUmf: catUMF[] = [];

    if(this.reporte.controls['ooad'].value.length == this.lstOoad.length +1) {
      strooad = [];
    } else if(this.reporte.controls['ooad'].value.length > 0) {
      for(let i of this.reporte.controls['ooad'].value){
        strooad.push(i.cveOoad);
      }
    }

    if(this.reporte.controls['ubicacion'].value.length == this.lstUmf.length +1) {
      strumf = [];
      arrUmf = [];
    } else if(this.reporte.controls['ubicacion'].value.length > 0) {
      for(let i of this.reporte.controls['ubicacion'].value){
        arrUmf.push(i);
      }
    }

    if (this.reporte.controls['fechainicio'].value == "") {
      this.reporte.controls['fechainicio'].setValue(this.maxDate);
    }
    if (this.reporte.controls['fechafin'].value == "") {
      this.reporte.controls['fechafin'].setValue(this.maxDate);
    }

    this.mdlRequest.ooad = strooad;
    this.mdlRequest.umf = arrUmf;
    this.mdlRequest.nss = this.reporte.controls['nss'].value != "" ? this.reporte.controls['nss'].value : "";
    this.mdlRequest.fechaInicio = this.reporte.controls['fechainicio'].value != "" ? moment(this.reporte.controls['fechainicio'].value).format(this.formatofecha) : this.fechamaxima;
    this.mdlRequest.fechaFin =  this.reporte.controls['fechafin'].value != "" ?  moment(this.reporte.controls['fechafin'].value).format(this.formatofecha) : this.fechamaxima;

    this.reportservice.buscarreportes(this.mdlRequest).subscribe({next: (data) =>{
      if(data.estatus && data.code == 200){
        sessionStorage.setItem('lstReportes', JSON.stringify(this.mdlRequest));
        for(let im of data.respuesta){
          const [day, month, year] = im.fechaPrueba.split('/');
          im.datePrueba = new Date(+year, +month - 1, +day);
        }
        //console.log("RES", data.respuesta);
        this.lstPruebas = data.respuesta;
        this.pagactual = 1;
        setTimeout(()=>{
          table = $('#tblreportes').DataTable();
          this.dtOptions.pageLength = this.numitems;
          setTimeout(()=>{
            table.on( 'page', ()=> {
              paginaactual = table.page.info().page;
              this.pagactual = paginaactual + 1;
              } );
          },1000);
          this._Swal.close();
        },1000);
      } else if (data.estatus == true && data.code == 404){
        //SIN resultados
        this.mostrarMensaje(this._Mensajes.MSG012, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING);
      } else if(data.estatus == false && data.code == 400){
        //NSS no valido
        this.mostrarMensaje(this._Mensajes.MSG011, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING);
      } else {
        //ERROR
        this.mostrarMensaje(data.mensaje, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING);
      }
      this._Swal.close();
    }, error: (err: HttpErrorResponse) => {
      console.log('Error en servicio', err);
      this._Swal.close();
      this._Swal.errorDialog(err);
    }});
  }

  verreportes(nss: string){
    this.router.navigate(['/espirometria/ver-reporte/' + nss]);
  }

  btnExportar() {
    try {
      this._Swal.msjLoading();
      this.reportservice.exportarPruebas(this.lstPruebas, this.user?.nombreUsuario || "", this.user?.perfil || "").subscribe({next: (response) =>{
        if(response.ok && response.status == "200"){
          this.downLoadFile(response, "application/ms-excel");
        } else {
          this.mostrarMensaje(this._Mensajes.MSG019, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING);
        }
        this._Swal.close();
      }, error: (err: HttpErrorResponse) => {
        console.log('Error en servicio', err);
        this._Swal.close();
        this.mostrarMensaje(this._Mensajes.MSG019, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING);
      }});
    } catch(e: any) {
      this.mostrarMensaje(this._Mensajes.MSG019, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING);
    } finally {
      this._Swal.close();
    }
  }

  downLoadFile(data: any, type: string) {
    const ela2 = document.createElement('a');
    document.body.appendChild(ela2);
    let blob = new Blob([data.body], { type: type});
    let url = window.URL.createObjectURL(blob);
    ela2.href = url;
    ela2.download = this.getFileName(data);
    ela2.click();
    window.URL.revokeObjectURL(url);
  }

  getFileName(response: HttpResponse<Blob>) {
    let filename: string = "";
    try {
      let contentDisposition: any = ""
      contentDisposition = response.headers.get('content-disposition');
      //console.log("🚀 ~ file: reporte.component.ts:395 ~ ReporteComponent ~ getFileName ~ contentDisposition:", contentDisposition)

      const r = /(?:filename=")(.+)(?:;")/
      // if(contentDisposition != null && contentDisposition != ""){
      //   filename = r.exec(contentDisposition).toString().length > 0 ? r.exec(contentDisposition)[1] : "";
      // }

      if (contentDisposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
        }
      } else {
        filename = 'Registro de Pruebas.xls'
      }

    }
    catch (e) {
      filename = 'Registro de Pruebas.xls'
    }
    return filename
  }

  public onchangefechaIni(event: MatDatepickerInputEvent<Moment>): void {
    let date1 = moment(event.value).format(this.formatofecha);
    if(this.reporte.controls['fechafin'].value != undefined && this.reporte.controls['fechafin'].value != ""){
      //Si fechainicio > fechafin
      if(moment(event.value, this.formatofecha).isAfter(moment(this.reporte.controls['fechafin'].value, this.formatofecha))){
        this.reporte.get('fechafin')?.patchValue(event.value);
        this.reporte.controls['fechafin'].setValue(event.value);
      }
    }

  }
  public onchangefechaFin(event: MatDatepickerInputEvent<Moment>): void {
    let date1 = moment(event.value).format(this.formatofecha);
    if(this.reporte.controls['fechainicio'].value != undefined && this.reporte.controls['fechainicio'].value != ""){
      //Si fechafin < fechainicio
      if(moment(event.value, this.formatofecha).isBefore(moment(this.reporte.controls['fechainicio'].value, this.formatofecha))){
        this.reporte.get('fechainicio')?.patchValue(event.value);
        this.reporte.controls['fechainicio'].setValue(event.value);
      }
    }
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

  setErrors(valor:boolean, campo?: string){
    if(campo != undefined) {
      this.listErrors[campo as keyof errors] = valor;
    } else {
      const objto  = Object.keys(this.listErrors);
      for(let i of objto){
        this.listErrors[i as keyof errors] = valor;
      }
    }
    //console.log("ERRORS", this.listErrors);
  }

  public onlyNumbers(event: any) {
    const pattern = /^[0-9]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9]/g, "");
    }
  }



}
