import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Mensajes } from 'src/app/helpers/mensajes';
import { SwalAlert } from 'src/app/helpers/swal-alert';
import { CargaPdfService } from 'src/app/services/carga-pdf.service';
import { environment } from 'src/environments/environment';

interface docs {manual: string,manualUsuario: string, manualPrograma: string}
@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit {
  filesPaths!: docs;

  constructor(
    private cargaPdf : CargaPdfService,
    private _Swal : SwalAlert,
    private mensajes : Mensajes
  ) { }

  ngOnInit(): void {

    this.filesPaths =  { 
      manual:`manualeasyon`,
      manualUsuario:`manualsgmpda`, 
      manualPrograma:`manualespirome`
    }
  }

  downloadFile(action: number){
    if (action === 1){
      this.getManual(this.filesPaths.manual);
    }else if (action === 2){
      this.getManual(this.filesPaths.manualUsuario);
    }else if (action === 3){
      this.getManual(this.filesPaths.manualPrograma);
    }
  }

  getManual(nombreManual: string){

    this.cargaPdf.getManual(nombreManual).subscribe( res =>{
      if(res.code == 200){
        let pathFile = res.respuesta.ruta.split('/')
        this._Swal.invocaSucces('Descargando archivo',pathFile[pathFile.length-1])
        let url = environment.URLFiles+res.respuesta.ruta;
        setTimeout( ()=>{
          window.open(url, '_blank');
        },500)
      }else if(res.code == 404){
        this._Swal.onPressWar(res.mensaje,'');
      }
      else{
        let msg = this.mensajes.MSG019.split('.')
        this._Swal.onPressWar(msg[0],msg[1]);
      }
    },(error: HttpErrorResponse) => {
      let msg = this.mensajes.MSG019.split('.')
      this._Swal.onPressWar(msg[0],msg[1]);
    });

  }

}
