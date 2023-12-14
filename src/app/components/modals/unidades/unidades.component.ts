import { Component, OnInit } from '@angular/core';
import { GeneralesService } from 'src/app/services/generales.service';
import { UnidadMedicaEspirometro, ResponseLstUMEspirometro } from 'src/app/models/unidadMedica';
import { OOAD, ResponseLstOOAD } from 'src/app/models/OOAD';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlert } from 'src/app/helpers/swal-alert';
import { Mensajes } from 'src/app/helpers/mensajes';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-unidades',
  templateUrl: './unidades.component.html',
  styleUrls: ['./unidades.component.css']
})
export class UnidadesComponent implements OnInit {

  unidades!: UnidadMedicaEspirometro[];
  entidades!: OOAD[];
  form: any;
  unidadSelected: string = "";
  unidadControl: FormControl = new FormControl();

  constructor(public dialogRef: MatDialogRef<UnidadesComponent>,
    public generalService: GeneralesService,
    public _Mensajes: Mensajes,
    private formBuilder: FormBuilder,
    public _Swal: SwalAlert,
    private router: Router) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.obtieneOOAD();

    this.unidadControl.valueChanges.subscribe(value => {
      // Aquí puedes obtener el valor seleccionado y hacer lo que necesites
      console.log(value);
      this.unidadSelected = value;
    });
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      entidades: ['', [Validators.required]],
      unidades: ['', [Validators.required]]
    });
  }

  obtieneOOAD(): void {
    console.log('Esta obteniendo las OOAD');
    this.generalService.getOoadEspirometro().subscribe((resp: ResponseLstOOAD) => {
      if (resp.code == 200) {
        this.entidades = resp.respuesta;
      } else {
        this._Swal.invocaError('Error de carga', resp.mensaje);
      }
      this._Swal.close();
    }, (error: HttpErrorResponse) => {
      this._Swal.close();
      this._Swal.errorDialog(error);
    });
  }

  obtieneUnidades(event: any): void {
    this._Swal.msjLoading();
    this.form.controls.unidades.setValue('')
    this.generalService.getUMEspirometros(event.value)
      .subscribe((resp: ResponseLstUMEspirometro) => {
        this._Swal.close();
        if (resp.code == 200) {
          this.unidades = resp.respuesta;
        } else {
          this._Swal.invocaError('Error de carga', resp.mensaje);
        }
      }, (error: HttpErrorResponse) => {
        this._Swal.close();
        this._Swal.errorDialog(error);
        console.log(error);
      });
  }

  cancelar(): void {
    this.dialogRef.close(this.router.navigate(['/espirometria/bienvenida']));
  }

  accionar(): void {
    this.dialogRef.close(this.unidadSelected);
  }

}
