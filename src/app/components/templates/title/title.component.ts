import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cabecera } from 'src/app/models/cabecera';
import { CargaXmlComponent } from '../../espirometria/carga-xml/carga-xml.component';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {
  @Input() data!: Cabecera;

  constructor(
    private router: Router,
    private _CargaXML: CargaXmlComponent
  ) {

  }

  ngOnInit(): void {
    if (this.data) { }
    this.data.strFecha = this.getFecha();
  }


  private getFecha(): string {
    let hoy = new Date();
    return this.getDia(hoy.getDay()) + " " + hoy.getDate() + " de " + this.getMes(hoy.getMonth()) + " de " + hoy.getFullYear();

  }

  private getDia(dia: number): string {
    let dias: string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    return dias[dia - 1];
  }

  private getMes(mes: number): string {
    let meses: string[] = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    return meses[mes];
  }

  btnRegresar() {
    if(this.data.boolBtnHide){
      this.btnOcultar();
    }else{
      if (this.data.strRuta != "" && this.data.strRuta != null)
      this.router.navigate([this.data.strRuta]);
    }
 
  }

  btnOcultar() {

    this._CargaXML.configurarCabecera(true);
  }
}
