import { Component, OnInit, ViewChild } from '@angular/core';
import { Cabecera } from 'src/app/models/cabecera';
import { buscarEspirometro, Espirometro, responseMSEspirometros, responseLstEspirometros, BusquedaRequest } from 'src/app/models/espirometro';
import { OOAD, ResponseLstOOADMultiselect } from 'src/app/models/OOAD';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { modals } from 'src/app/models/modals';
import { Mensajes } from 'src/app/helpers/mensajes';
import { SwalAlert } from 'src/app/helpers/swal-alert';
import { GestionService } from 'src/app/services/gestion.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { WarningComponent } from '../../modals/warning/warning.component';
import { GeneralesService } from 'src/app/services/generales.service';

import { ResponseLstUM, UnidadMedica } from 'src/app/models/unidadMedica';
import { MatOption } from '@angular/material/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserData } from 'src/app/models/resOauth';



declare var $: any;
var table: any;
var paginaactual: number = 0;
@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})
export class GestionComponent implements OnInit {

  datatableElement: any = DataTableDirective;
  cabecera!: Cabecera;
  buscarEspirometro!: BusquedaRequest;
  etiquetaResultados: string = "";

  blnBloquearUbicaciones!: boolean;
  lstOADD!: OOAD[];
  lstUbicaciones!: UnidadMedica[];
  umTODAS!: UnidadMedica;
  blnErrorC1!: boolean;
  blnErrorC2!: boolean;
  blnErrorC3!: boolean;
  public c1: FormControl = new FormControl('');
  public c2: FormControl = new FormControl('');
  public c3: FormControl = new FormControl('');
  modal!: modals;
  form: any;
  numitems: number = 10;
  pagactual: number = 1;
  lstEspirometros!: Espirometro[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  usuario!: UserData;
  blnAdministrador: boolean = false;
  @ViewChild('allSelectedOoad') private allSelectedOoad!: MatOption;
  @ViewChild('allSelectedUmf') private allSelectedUmf!: MatOption;
  constructor(
    public dialog: MatDialog,
    public _Mensajes: Mensajes,
    public _Swal: SwalAlert,
    public _GestionService: GestionService,
    public _GeneralesService: GeneralesService,
    private router: Router,
    private _Auth: AuthService) { }

  ngOnInit(): void {

    if (this._Auth.sessionUserDataDecoded != null) {
      this.usuario = this._Auth.sessionUserDataDecoded;
      if (this.usuario.perfil === 'Administrador') {
        this.blnAdministrador = true;
      }
    } else {
      this.blnAdministrador = false;
    }

    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: this.numitems,
      processing: true,
      info: false,
      ordering: true,
      retrieve: true,
      searching: false,
      columnDefs: [
        { "orderable": false, "targets": 0 },
        { "orderable": false, "targets": 1 },
        { "orderable": true, "targets": 2 },
        { "orderable": true, "targets": 3 },
        { "orderable": false, "targets": 4 },
        { "orderable": false, "targets": 5 },
        { "orderable": false, "targets": 6 },
        { "orderable": false, "targets": 7 },
        { "orderable": false, "targets": 8 },
        { "orderable": false, "targets": 9 },


      ],
      order: [[2, 'desc']],
      "lengthChange": false,
      scrollX: true,
      responsive: true,
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

    this.lstEspirometros = new Array();
    this.lstUbicaciones = new Array<UnidadMedica>();
    this.blnBloquearUbicaciones = true;



    this.validacionResultados();
    this.formulario();
    this.btnLimpiar(false);
    this.modal = new modals();
    this.buscarEspirometro = new BusquedaRequest();
    this.cabecera = new Cabecera();
    this.cabecera.strTitulo = this._Mensajes.TITULO_GESTION_ESPIROMETRIA;

    this.getLstOOAD();
    setTimeout(() => {
      this.fillForm();
    }, 1500);

  }

  ngOnDestroy() {
    // sessionStorage.removeItem('buscarEspirome');
  }


  private formulario() {
    this.form = new FormGroup({
      c1: new FormControl(''),
      c2: new FormControl(''),
      c3: new FormControl('', [Validators.minLength(6),
      Validators.maxLength(6)])
    });
  }


  public getLstOOAD(): void {

    this.lstOADD = new Array<OOAD>();
    this._Swal.msjLoading();
    this._GestionService.getLstOOAD()
      .subscribe((resp: ResponseLstOOADMultiselect) => {
        if (resp.code == 200) {
          this.lstOADD = resp.respuesta;

        } else {
          this.mostrarMensaje(resp.mensaje, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING, null, false);
        }
        this._Swal.close();
      }, (error: HttpErrorResponse) => {
        this._Swal.close();
        this._Swal.errorDialog(error);

      });
  }



  public toggleAll() {
    if (this.allSelectedOoad.selected) {
      this.form.controls['c1'].patchValue([...this.lstOADD.map(item => item), 0]);
    } else {
      this.form.controls['c1'].patchValue([]);
    }
  }

  toggleUmfAll() {
    if (this.allSelectedUmf.selected) {
      this.form.controls['c2'].patchValue([...this.lstUbicaciones.map(item => item), 0]);
    } else {
      this.form.controls['c2'].patchValue([]);
    }
  }


  cargaubicacion() {
    this.lstUbicaciones = [];
    let todas: boolean = false;

    let arrooad: Array<OOAD> = new Array<OOAD>();

    arrooad = this.form.controls['c1'].value;
    
    if (arrooad.length == this.lstOADD.length + 1) {
      todas = true;
    }
    
    this.buscarEspirometro.ooad = this.obtenerClavesOOAD(arrooad);
    if (this.parametrosBusqueda(this.buscarEspirometro)) {
     

      if (todas) {
        this._Swal.msjLoading(this._Mensajes.MSJ_GET_CATALOGO + ' ubicaciones');
        this._GestionService.getLstUMAll()
          .subscribe((resp: ResponseLstUM) => {
            if (resp.estatus) {
              switch (resp.code) {
                case 200:
                  this.lstUbicaciones = resp.respuesta;
                  break;
                case 404:
                  this.mostrarMensaje(this._Mensajes.MSJ_SIN_UBICACIONES, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING, null, false);
                  break;

                default:
                  this.mostrarMensaje(resp.mensaje, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING, null, false);
                  break;
              }

            } else {
              this.mostrarMensaje(resp.mensaje, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING, null, false);
            }
            this._Swal.close();
          }, (error: HttpErrorResponse) => {
            console.log(error);
            this._Swal.close();
            this._Swal.errorDialog(error);

          });

      } else {
     
        if (this.buscarEspirometro.ooad.length != 0) {
          this._Swal.msjLoading(this._Mensajes.MSJ_GET_CATALOGO + ' ubicaciones');
          this._GestionService.getLstUM(this.buscarEspirometro.ooad)
            .subscribe((resp: ResponseLstUM) => {
              if (resp.estatus) {
                switch (resp.code) {
                  case 200:
                    this.lstUbicaciones = resp.respuesta;
                    break;
                  case 404:
                    this.mostrarMensaje(this._Mensajes.MSJ_SIN_UBICACIONES, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING, null, false);
                    break;

                  default:
                    this.mostrarMensaje(resp.mensaje, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING, null, false);
                    break;
                }

              } else {
                this.mostrarMensaje(resp.mensaje, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING, null, false);
              }
              this._Swal.close();
            }, (error: HttpErrorResponse) => {
              console.log(error);
              this._Swal.close();
              this._Swal.errorDialog(error);

            });
        }


      }
    }




  }

  private getLstEspirometros(): void {
    this._Swal.msjLoading(this._Mensajes.MSJ_BUSCANDO);
    this.lstEspirometros = [];
    this._GestionService.getLstEspirometros(this.buscarEspirometro)
      .subscribe((resp: responseLstEspirometros) => {

        switch (resp.code) {
          case 200:
            this.lstEspirometros = resp.respuesta;
            this.pagactual = 1;
            setTimeout(() => {
              table = $('#tblEspirome').DataTable();
              this.dtOptions.pageLength = this.numitems;
              setTimeout(() => {
                table.on('page', () => {

                  paginaactual = table.page.info().page;
                  this.pagactual = paginaactual + 1;
                });
              }, 1000);

            }, 1000);
            this._Swal.close();
            break;
          case 404:
            this._Swal.close();
            this.mostrarMensaje(this._Mensajes.MSG012, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING, null, false);

            break;

          default:
            this._Swal.close();
            this.mostrarMensaje(resp.mensaje, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING, null, false);
            break;
        }

        this.validacionResultados();
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this._Swal.close();
        this._Swal.errorDialog(error);

      });
  }

  private desactivateEspirometro(espirometro: Espirometro): void {
    this._Swal.msjLoading();
    this.lstEspirometros = [];
    this._GestionService.deleteRegister(espirometro.numeroSerie)
      .subscribe((resp: responseMSEspirometros) => {
        if (resp.estatus) {
          if (resp.code == 200) {

            this._Swal.close();
            setTimeout(() => {
              this._Swal.invocaSucces(this._Mensajes.TITULO_ALERT_DESACTIVAR, this._Mensajes.MSG014_1);

            }, 1300);


          } else {
            this._Swal.close();
          }
        }
        this.validacionResultados();
      }, (error: HttpErrorResponse) => {

        this._Swal.close();
        this._Swal.errorDialog(error);
        console.log(error);
      });
  }


  private reactivateEspirometro(espirometro: Espirometro): void {
    this._Swal.msjLoading();
    this.lstEspirometros = [];
    this._GestionService.reactivateRegister( espirometro.numeroSerie)
      .subscribe((resp: responseMSEspirometros) => {
        if (resp.estatus) {
          if (resp.code == 200) {

            setTimeout(() => {
              this._Swal.invocaSucces(this._Mensajes.TITULO_ALERT_ACTIVAR, this._Mensajes.MSG014_2);

            }, 1300);




          }
        }
        this.validacionResultados();
        this._Swal.close();
      }, (error: HttpErrorResponse) => {

        this._Swal.close();
        this._Swal.errorDialog(error);
        console.log(error);
      });
  }




  private validacionResultados() {
    if (this.lstEspirometros.length > 0) {

      this.etiquetaResultados = "Equipos de espirometría";
    } else {

      this.etiquetaResultados = "Resultado(s) de búsqueda";
    }

  }


  btnLimpiar(todo: boolean) {
    if (todo) {
      sessionStorage.removeItem('buscarEspirome');
      this.lstEspirometros = new Array();
      this.lstUbicaciones = new Array<UnidadMedica>();
      this.validacionResultados();
      this.form.reset();
      this.form.controls['c1'].patchValue([]);
      this.form.controls['c2'].patchValue([]);
      this.buscarEspirometro = new BusquedaRequest();
      this.blnErrorC1 = false;
      this.blnErrorC2 = false;
      this.blnErrorC3 = false;
    } else {
      this.lstEspirometros = new Array();
      this.lstUbicaciones = new Array<UnidadMedica>();
      this.validacionResultados();
      this.form.reset();
      this.form.controls['c1'].setValue("");
      this.form.controls['c2'].setValue("");
      this.form.controls['c1'].patchValue([]);
      this.form.controls['c2'].patchValue([]);
      this.buscarEspirometro = new BusquedaRequest();
      this.blnErrorC1 = false;
      this.blnErrorC2 = false;
      this.blnErrorC3 = false;
    }
  }


  fillForm() {



    if (JSON.parse(sessionStorage.getItem('buscarEspirome') as string) as buscarEspirometro) {

      this.buscarEspirometro = JSON.parse(sessionStorage.getItem('buscarEspirome') as string) as BusquedaRequest
      if (this.parametrosBusqueda(this.buscarEspirometro)) {

        let lstOOAD = [];
        for (let ooad of this.buscarEspirometro.ooad) {
          lstOOAD.push(this.lstOADD.find(e => e.cveOoad === ooad) as OOAD);
        }
        this.form.controls['c1'].patchValue(lstOOAD);

        if (this.buscarEspirometro.ooad) {

          this.cargaubicacion();

        }

        setTimeout(() => {

          let lstUM = [];

          if (this.buscarEspirometro.umf != undefined) {
            for (let um of this.buscarEspirometro.umf) {

              lstUM.push(this.lstUbicaciones.find(e => e.descripcionUmf === um) as UnidadMedica);
            }
          }

          this.form.controls['c2'].setValue(lstUM);
          this.form.controls['c3'].setValue(this.buscarEspirometro.numeroserie);

          this.btnBuscar();

        }, 2500);

      }




    }
  }


  private obtenerClavesOOAD(lst: Array<OOAD>): Array<string> {
    let lstParametros = new Array<string>();
    if (lst != undefined) {
      for (let ooad of lst) {
        if (ooad != undefined) {
          let dato = ooad.cveOoad;
          lstParametros.push(dato);
        }
      }
    }
    return lstParametros
  }

  private obtenerClavesUM(lst: Array<UnidadMedica>): Array<string> {

    let lstParametros = new Array<string>();
    if (lst.length != 0) {
      for (let um of lst) {
        if (um != undefined) {
          let dato = um.cveUmf;
          lstParametros.push(dato);
        }
      }
    }
    return lstParametros
  }

  btnBuscar() {
    let arrooad = this.form.controls['c1'].value;
    let arrum = this.form.controls['c2'].value;
    this.buscarEspirometro = new BusquedaRequest();
    this.buscarEspirometro.ooad = this.obtenerClavesOOAD(arrooad);
    this.buscarEspirometro.umf = this.obtenerClavesUM(arrum);
    this.buscarEspirometro.numeroserie = this.form.controls['c3'].value;

    if (this.parametrosBusqueda(this.buscarEspirometro)) {

      if (this.buscarEspirometro.numeroserie != null && this.buscarEspirometro.numeroserie != '') {
        this.ex02(this.buscarEspirometro.numeroserie);
      }

      if (this.buscarEspirometro.numeroserie == null) {
        this.buscarEspirometro.numeroserie = '';
      }

      if (!this.blnErrorC3) {
        if ((arrum.length == this.lstUbicaciones.length + 1 || arrum == "")
          && (arrooad.length == this.lstOADD.length + 1) || arrooad == "") {
          this.buscarEspirometro.ooad = [];
          this.buscarEspirometro.umf = [];
        }
        this.getLstEspirometros();
      }



    } else {
      this.ex01();
    }

  }

  public btnDesactivar(espirometro: Espirometro) {
    this.mostrarMensaje(this._Mensajes.MSG013, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_DELETE, espirometro, true);

  }

  public btnReactivar(espirometro: Espirometro) {
    this.mostrarMensaje(this._Mensajes.MSG013_1, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_DELETE, espirometro, false);

  }

  public btnAgregar() {
    this.router.navigate(['/espirometria/registro/0']);

  }
  public btnEditar(espirometro: Espirometro) {
    sessionStorage.setItem('editarEspirome', JSON.stringify(espirometro));
    this.router.navigate(['/espirometria/registro/' + espirometro.idEquipoEspirometro]);
  }

  /*Sin parámetros de búsqueda*/
  private ex01() {
    this.blnErrorC1 = true;
    this.blnErrorC2 = true;
    this.blnErrorC3 = true;
    this.mostrarMensaje(this._Mensajes.MSG010, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING, null, false);

  }

  /*Número de serie incorrecto*/
  private ex02(numero_serie: string) {
    if (numero_serie.length == 6) {
      this.blnErrorC3 = false;

    } else {
      this.blnErrorC3 = true;
      this.mostrarMensaje(this._Mensajes.MSG015, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING, null, false);
    }
  }

  private mostrarMensaje(mensaje: string, boton: string, tipo: string, obj: any, opEliminar: boolean) {
    this.modal = new modals();

    this.modal.strTituloBoton = boton;
    switch (tipo) {
      case 'warning':
        this.modal.icon = 'warning'
        this.modal.strMensaje1 = mensaje;

        this._Swal.warningDialog(this.modal);
        break;
      case 'delete':
        this.modal.icon = 'delete'
        this.modal.strMensaje1 = mensaje;
        this.modal.strTituloBotonCancel = 'Cancelar';

        this.activarDesactivarDialog(this.modal, obj, opEliminar);

        break;

      default:
        break;
    }
  }


  /*
  opEliminar: true = Eliminar, false = Reactiva
  */
  activarDesactivarDialog(modal: modals, espirometro: Espirometro, opEliminar: boolean) {
    if (opEliminar) {
      modal.icon = 'delete';
    } else {
      modal.icon = 'warning';
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = modal;
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.position = { top: '117px' };


    const dialogo1 = this.dialog.open(WarningComponent, dialogConfig);

    dialogo1.afterClosed().subscribe(res => {

      if (res) {
        if (res.event) {

          if (opEliminar) {

            this.desactivateEspirometro(espirometro);
          } else {
            this.reactivateEspirometro(espirometro);
          }
          this.btnBuscar();



        }
      }

    });

  }



  /**Valida si existen filtros para realizar la búsqueda */
  private parametrosBusqueda(filtros: BusquedaRequest): boolean {

    let existen: boolean = false;
    if ((filtros.ooad.length > 0)
      || (filtros.umf.length > 0)
      || (filtros.numeroserie != null)) {
      this.blnErrorC1 = false;
      this.blnErrorC2 = false;
      this.blnErrorC3 = false;
      existen = true;
      sessionStorage.setItem('buscarEspirome', JSON.stringify(filtros));
    }

    return existen;
  }

  public onlyNumbers(event: any) {
    const pattern = /^[0-9]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9]/g, "");
    }
  }





}
