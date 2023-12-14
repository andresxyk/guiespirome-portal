import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { WarningComponent } from 'src/app/components/modals/warning/warning.component';
import { Mensajes } from 'src/app/helpers/mensajes';
import { SwalAlert } from 'src/app/helpers/swal-alert';
import { Cabecera } from 'src/app/models/cabecera';
import { Espirometro, responseMSEspirometros } from 'src/app/models/espirometro';
import { modals } from 'src/app/models/modals';
import { OOAD, ResponseLstOOADMultiselect } from 'src/app/models/OOAD';
import { ResponseLstUM, UnidadMedica } from 'src/app/models/unidadMedica';
import { GeneralesService } from 'src/app/services/generales.service';
import { GestionService } from 'src/app/services/gestion.service';
import { GestionComponent } from '../gestion.component';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  cabecera!: Cabecera;
  espirometro!: Espirometro;
  idEspirometro: any = null;
  form: any;
  modal!: modals;
  msjValidation: any;
  blnGuardar!: boolean;
  blnEditar!: boolean;
  ubicacionSelected!: UnidadMedica;
  ooadSelected!: OOAD;


  lstOADD!: OOAD[];
  lstUbicaciones!: UnidadMedica[];


  constructor(public _Mensajes: Mensajes,
    public dialog: MatDialog,
    private aRoute: ActivatedRoute,
    private router: Router,
    public _Swal: SwalAlert,
    public gestion: GestionComponent,
    public _GestionService: GestionService,
    public _GeneralesService: GeneralesService) {
    this.blnGuardar = false;
    if (this.aRoute.snapshot.paramMap.has('idEspirometro'))
      this.idEspirometro = this.aRoute.snapshot.paramMap.get('idEspirometro');

    this.cabecera = new Cabecera();
    this.cabecera.boolBtn = true;
    this.cabecera.strRuta = 'espirometria/gestionar';
    if (this.idEspirometro != null) {
      if (parseInt(this.idEspirometro) == 0) {//Agregar espirometro
        this.cabecera.strTitulo = this._Mensajes.TITULO_ALTA_ESPIROMETRO;
        this.espirometro = new Espirometro();

        this.blnEditar = false;
      } else {//editar
        this.blnEditar = true;
        this.cabecera.strTitulo = this._Mensajes.TITULO_EDITAR_ESPIROMETRO;

      }
    }
  }

  ngOnInit(): void {
    this.ubicacionSelected = new UnidadMedica();
    this.getLstOOAD();

    this.formulario();
    if (this.blnEditar) {
      this.getData(this.idEspirometro);
      this.form.controls['c1'].disable();
    }




  }

  ngOnDestroy() {

    sessionStorage.removeItem('editarEspirome');
  }
  public getLstOOAD(): void {

    this.lstOADD = new Array<OOAD>();
    this._Swal.msjLoading(this._Mensajes.MSJ_GET_CATALOGO + ' OOAD');
    this._GeneralesService.getLstOOAD()
      .subscribe((resp: ResponseLstOOADMultiselect) => {
        if (resp.code == 200) {
          this.lstOADD = resp.respuesta;

        } else {
          this.mostrarMensaje(resp.mensaje, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING);
        }
        this._Swal.close();
      }, (error: HttpErrorResponse) => {
        this._Swal.close();
        this._Swal.errorDialog(error);

      });
  }

  public getLstUbicaciones(ooad: string): void {
    
    this.lstUbicaciones = new Array<UnidadMedica>();

    this._Swal.msjLoading(this._Mensajes.MSJ_GET_CATALOGO + ' UM');
    this._GeneralesService.getLstUbicaciones(ooad)
      .subscribe((resp: ResponseLstUM) => {
        switch (resp.code) {
          case 200:
            this.lstUbicaciones = resp.respuesta;
            this._Swal.close();
            break;
          case 404:
            this._Swal.close();
            this.mostrarMensaje(this._Mensajes.MSJ_SIN_UM, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING);
            break;

          default:
            this._Swal.close();
            this.mostrarMensaje(resp.mensaje, this._Mensajes.MSJ_ACEPTAR, this._Mensajes.MSJ_WARNING);
            break;
        }


      }, (error: HttpErrorResponse) => {
        this._Swal.close();
        this._Swal.errorDialog(error);
        console.log(error);
      });

  }

  public onlyLetrasNumeros(event: any) {
    const pattern = /^[A-Za-z0-9ñÑáéíóúüÁÉÍÓÚÜ ]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^A-Za-z0-9ñÑáéíóúüÁÉÍÓÚÜ ]/g, "");
    }
  }

  private formulario() {
    this.form = new FormGroup({
      c1: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6),
      Validators.pattern(/^[0-9]*$/)]),
      c2: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(12),
      Validators.pattern(/^[0-9]*$/)]),
      c3: new FormControl('', [Validators.required]),
      c4: new FormControl('', [Validators.required]),
      c5: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(45)]),
      c6: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(45),
      Validators.pattern(/^[A-Za-z0-9ñÑáéíóúüÁÉÍÓÚÜ ]+$/)]),
      c7: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10),
      Validators.pattern(/^[0-9]*$/)]),
      c8: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5),
      Validators.pattern(/^[0-9]*$/)]),
      c9: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(15),
      Validators.pattern(/^[0-9]*$/)]),
      /*  c10: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(50),
        Validators.pattern(/^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$/),]),*/
    });



    this.msjValidation = {
      c1: [
        { type: 'required', msj: this._Mensajes.MSJ_CAMPO_OBLIGATORIO },
        { type: 'minlength', msj: 'La longitud es de 6' },
        { type: 'maxlength', msj: 'La longitud es de 6' },
        { type: 'pattern', msj: 'Sólo números' }
      ],
      c2: [
        { type: 'required', msj: this._Mensajes.MSJ_CAMPO_OBLIGATORIO },
        { type: 'minlength', msj: 'La longitud es de 12' },
        { type: 'maxlength', msj: 'La longitud es de 12' },
        { type: 'pattern', msj: 'Sólo números' }
      ],
      c3: [{ type: 'required', msj: this._Mensajes.MSJ_CAMPO_OBLIGATORIO }],
      c4: [{ type: 'required', msj: this._Mensajes.MSJ_CAMPO_OBLIGATORIO }],
      c5: [{ type: 'required', msj: this._Mensajes.MSJ_CAMPO_OBLIGATORIO },
      { type: 'minlength', msj: 'Ingresar información' },
      { type: 'maxlength', msj: 'La longitud máxima es de 45' },],
      c6: [
        { type: 'required', msj: this._Mensajes.MSJ_CAMPO_OBLIGATORIO },
        { type: 'minlength', msj: 'Ingresar información' },
        { type: 'maxlength', msj: 'La longitud máxima es de 50' },
        { type: 'pattern', msj: 'Sólo letras y números' }
      ],
      c7: [
        { type: 'required', msj: this._Mensajes.MSJ_CAMPO_OBLIGATORIO },
        { type: 'minlength', msj: 'La longitud es de 10' },
        { type: 'maxlength', msj: 'La longitud es de 10' },
        { type: 'pattern', msj: 'Sólo números' }
      ],
      c8: [
        { type: 'required', msj: this._Mensajes.MSJ_CAMPO_OBLIGATORIO },
        { type: 'minlength', msj: 'La longitud es de 5' },
        { type: 'maxlength', msj: 'La longitud es de 5' },
        { type: 'pattern', msj: 'Sólo números' }
      ],
      c9: [
        { type: 'required', msj: this._Mensajes.MSJ_CAMPO_OBLIGATORIO },
        { type: 'minlength', msj: 'La longitud mínima es de 7' },
        { type: 'maxlength', msj: 'La longitud es de 15' },
        { type: 'pattern', msj: 'Sólo números' }
      ],

    };


  }

  get blnC1(): boolean {
    return (this.form.controls['c1'].invalid);
  }
  get blnC2(): boolean {
    return (this.form.controls['c2'].invalid);
  }
  get blnC3(): boolean {
    return (this.form.controls['c3'].invalid);
  }
  get blnC4(): boolean {
    return (this.form.controls['c4'].invalid);
  }
  get blnC5(): boolean {
    return (this.form.controls['c5'].invalid);
  }
  get blnC6(): boolean {
    return (this.form.controls['c6'].invalid);
  }

  get blnC7(): boolean {
    return (this.form.controls['c7'].invalid);
  }
  get blnC8(): boolean {
    return (this.form.controls['c8'].invalid);
  }

  get blnC9(): boolean {
    return (this.form.controls['c9'].invalid);
  }


  private getData(idEspirometro: number) {
    this._Swal.msjLoading();
    this.espirometro = JSON.parse(sessionStorage.getItem('editarEspirome') as string) as Espirometro;

    this.fillForm(this.espirometro);


  }

  private fillForm(espirometro: Espirometro) {
    

    this.getLstUbicaciones(espirometro.claveOoad);
    this.form.controls['c1'].setValue(espirometro.numeroSerie);
    this.form.controls['c2'].setValue(espirometro.nni);
    this.form.controls['c3'].setValue(espirometro.claveOoad);
    this.form.controls['c4'].setValue(espirometro.clavePresupuestal);
    this.form.controls['c5'].setValue(espirometro.areaResponsable);
    this.form.controls['c6'].setValue(espirometro.medicoResponsable);
    this.form.controls['c7'].setValue(espirometro.telMedico);
    this.form.controls['c8'].setValue(espirometro.ext);
    this.form.controls['c9'].setValue(espirometro.matriculaMedico);
    // this.form.controls['c10'].setValue(espirometro.nombreMedico);
  }

  public obtenerLstUbicaciones() {
    this.espirometro.claveOoad = this.form.controls['c3'].value;
    this.form.controls['c4'].setValue('');
    this.espirometro.ubicacion = this.form.controls['c4'].value;


    this.getLstUbicaciones(this.espirometro.claveOoad);

  }

  private getUMSelected(clavePresupuestal: string): UnidadMedica {
    
    
    let u = new UnidadMedica;
    for (let um of this.lstUbicaciones) {
      if (clavePresupuestal == um.cvePresupuestal) {
        u = um;
      }
    }

    return u;
  }

  private getOOADSelected(clave: string): OOAD {

    let o = new OOAD();
    o.descDelegacion = this.lstOADD.find(x => x.cveDelegacion === clave )?.descDelegacion + '';
    
    return o;
  }

  private fillOBject(): Espirometro {
    let registro = new Espirometro();

    if (this.blnEditar) {
      registro.idEquipoEspirometro = this.idEspirometro;


    }
    

    registro.numeroSerie = this.form.controls['c1'].value;
    registro.nni = this.form.controls['c2'].value;

    this.ooadSelected = this.getOOADSelected(this.form.controls['c3'].value);
    registro.ooad = this.ooadSelected.descDelegacion;
    registro.claveOoad = this.form.controls['c3'].value;
    
    this.ubicacionSelected = this.getUMSelected(this.form.controls['c4'].value);

    registro.cveEntidadFederativa = this.ubicacionSelected.cveEntidadFederativa;

    registro.unidadMedica = this.ubicacionSelected.nomUnidadMedica;// this.form.controls['c4'].value;
    //registro.claveunidadMedica = this.ubicacionSelected.cvePresupuestal + ''; //this.form.controls['c4'].value;
    registro.areaResponsable = this.form.controls['c5'].value;
    registro.medicoResponsable = this.form.controls['c6'].value;
    registro.telMedico = this.form.controls['c7'].value;
    registro.ext = this.form.controls['c8'].value;
    registro.matriculaMedico = this.form.controls['c9'].value;

    registro.clavePresupuestal = this.ubicacionSelected.cvePresupuestal;


    return registro;
  }



  public saveRegister(espirometro: Espirometro): void {

    this._Swal.msjLoading();

    this._GestionService.saveRegister(espirometro)
      .subscribe((resp: any) => {
        if (resp.estatus) {
          if (resp.code == 201) {
            this._Swal.close();
            this.router.navigateByUrl("/espirometria/gestionar");

            setTimeout(() => {
              this._Swal.invocaSucces(this._Mensajes.TITULO_ALERT_ALTA_EXITOSA, this._Mensajes.MSG023);
            }, 5500);
          } else {
            this._Swal.close();
            this._Swal.invocaError(this._Mensajes.TITULO_ALERT_ERROR, resp.mensaje);
          }
        } else {
          this._Swal.close();
          this._Swal.invocaError(this._Mensajes.TITULO_ALERT_ERROR, resp.mensaje);
        }
      }, (error: HttpErrorResponse) => {
        this._Swal.close();
        this._Swal.errorDialog(error);
        console.log(error);
      });
  }

  public editRegister(espirometro: Espirometro): void {

    this._Swal.msjLoading();

    this._GestionService.editRegister(espirometro)
      .subscribe((resp: responseMSEspirometros) => {
        if (resp.estatus) {
          if (resp.code == 200) {
            this._Swal.close();


            this.router.navigateByUrl("/espirometria/gestionar");
            setTimeout(() => {
              this._Swal.invocaSucces(this._Mensajes.TITULO_ALERT_EDITAR_ESPIROMETRO, this._Mensajes.MSG030);
            }, 5500);

          } else {
            this._Swal.close();
            this._Swal.invocaError(this._Mensajes.TITULO_ALERT_EDITAR_ESPIROMETRO, resp.mensaje);
          }
        } else {
          this._Swal.close();
          this._Swal.invocaError(this._Mensajes.TITULO_ALERT_EDITAR_ESPIROMETRO, resp.mensaje);
        }


      }, (error: HttpErrorResponse) => {
        this._Swal.close();
        this._Swal.errorDialog(error);
        console.log(error);
      });
  }



  public onlyNumbers(event: any) {
    const pattern = /^[0-9]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9]/g, "");
    }
  }



  private mostrarMensaje(mensaje: string, boton: string, tipo: string) {
    this.modal = new modals();

    this.modal.strTituloBoton = boton;
    switch (tipo) {
      case 'warning':
        this.modal.icon = 'warning';
        this.modal.strMensaje1 = mensaje;
        // this.modal.strMensaje2 = undefined;
        this._Swal.warningDialog(this.modal);
        break;

      case 'delete':
        this.modal.icon = 'delete';
        this.modal.strMensaje1 = mensaje;

        // this.deleteDialog(this.modal);
        break;

      default:
        break;
    }
  }

  editDialog(modal: modals) {

    modal.icon = 'edit';


    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = modal;
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.position = { top: '117px' };


    const dialogo1 = this.dialog.open(WarningComponent, dialogConfig);

    dialogo1.afterClosed().subscribe(res => {
      if (res) {
        if (res.event) {
          this.editRegister(this.fillOBject());
        }
      }

    });

  }



  public btnCancelar() {
    this.router.navigateByUrl("/espirometria/gestionar");
  }

  public btnGuardar() {

    this.blnGuardar = true;
    if (this.form.valid) {
      if (this.blnEditar) {
        this.modal = new modals();
        this.modal.strMensaje1 = this._Mensajes.MSG024;

        this.modal.strTituloBoton = 'Aceptar';
        this.editDialog(this.modal);

      } else {
        this.saveRegister(this.fillOBject());

      }

    } else {
      this.mostrarMensaje(this._Mensajes.MSG004, 'Aceptar', this._Mensajes.MSJ_WARNING);
    }

  }

}
