import { Component, Inject,  OnInit } from '@angular/core';
import { modals } from 'src/app/models/modals';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.css']
})
export class WarningComponent implements OnInit {
  lg:string = 'lg';
  dataparams: modals;
  constructor( public dialogRef: MatDialogRef<WarningComponent>,
    @Inject(MAT_DIALOG_DATA) data: modals) {
      this.dataparams = data;
    }

  ngOnInit(): void {
    if (this.dataparams.strMensaje2) {
      var tot = this.dataparams.strMensaje2.length + this.dataparams.strMensaje1.length;
      if (tot  >= 100)
        this.lg = 'lg';
      else if (tot <= 55) {
        this.lg = 'xs';
      } else {
        this.lg = 'md';
      }

    } else if (this.dataparams.strMensaje1.length <= 55) {
      this.lg = 'xs';
    } else if (this.dataparams.strMensaje1.length >= 100) {
      this.lg = 'lg';
    } else {
      this.lg = 'md';
    }
    console.log(this.lg)
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  accionar(): void {
    this.dialogRef.close({event:true});
  }

}
