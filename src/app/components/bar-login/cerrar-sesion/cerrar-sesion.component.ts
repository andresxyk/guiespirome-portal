import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-cerrar-sesion',
  templateUrl: './cerrar-sesion.component.html',
  styleUrls: ['./cerrar-sesion.component.css']
})
export class CerrarSesionComponent implements OnInit {

  modalData!: any

  constructor(
    public dialogRef: MatDialogRef<CerrarSesionComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private router: Router,
    private authService : AuthService
  ) {
    this.modalData = data
  }

  ngOnInit(): void {
  }

  cerrarModal(){
    this.dialogRef.close({event:false});
  }
  salir(){
    this.authService.logout();
    this.dialogRef.close({event:false});
  }

}
