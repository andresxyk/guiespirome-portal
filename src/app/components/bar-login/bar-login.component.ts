import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CerrarSesionComponent } from './cerrar-sesion/cerrar-sesion.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from 'src/environments/environment';
import { CargaPdfService } from 'src/app/services/carga-pdf.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlert } from 'src/app/helpers/swal-alert';
import { Mensajes } from 'src/app/helpers/mensajes'

interface item {src: string, srcHover: string ,srcHoverOut: string,name: string, function: number | string, visible: boolean | null};
interface docs {manual: string,manualUsuario: string, manualPrograma: string}
interface optionsI {
  src: string, 
  srcHover: string, 
  srcHoverOut: string,
  name: string,
  name2?: string,
  function: number,
  visible: boolean
};
@Component({
  selector: 'app-bar-login',
  templateUrl: './bar-login.component.html',
  styleUrls: ['./bar-login.component.css']
})

export class BarLoginComponent implements OnInit {

  menuList!: Array<item>
  admin: boolean | null = false
  usuario: string = ''
  delegacion: string = ''
  filesPaths!: docs;
  cerrarOp!: optionsI;
  descargarOp! : optionsI;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private authService : AuthService,
    private cargaPdf : CargaPdfService,
    private _Swal : SwalAlert,
    private mensajes : Mensajes
  ) { }

  ngOnInit(): void {
    this.initMenuList();
    let userData = this.authService.sessionUserDataDecoded
    if(userData){
      this.usuario = userData.nombreUsuario
      this.delegacion = userData.delegacion
    }
    this.filesPaths =  { 
      manual:`manualeasyon`,
      manualUsuario:`manualespirome`, 
      manualPrograma:`manualsgmpda`
    }
  }

  cerrarSesion(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      tit: 'Cerrar',
      question: '¿Está seguro que desea salir?'
    };
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '479px'
    dialogConfig.height = '245px'
    dialogConfig.panelClass = 'panel-style'
    dialogConfig.position = { top: '119px' };

    this.dialog.open(CerrarSesionComponent, dialogConfig);
  }

  menuAction(action: number | string){
    
    if(action === 0){
      this.cerrarSesion();
    }else if (action === 1){
      this.getManual(this.filesPaths.manual);
    }else if (action === 2){
      this.getManual(this.filesPaths.manualUsuario);
    }else if (action === 3){
      this.getManual(this.filesPaths.manualPrograma);
    }
    else{
      this.router.navigate([action])
    }
  }

  initMenuList(){
    this.admin = this.authService.userProfile() //obtener perfil
    this.menuList = [
      {
        src: 'inicio-house.svg', 
        srcHover:'inicio-house-green.svg', 
        srcHoverOut:'inicio-house.svg',
        name: 'Inicio', 
        function: 'espirometria/bienvenida/',
        visible:true
      },
      {
        src: 'load-file-xml.svg', 
        srcHover:'load-file-xml-green.svg', 
        srcHoverOut:'load-file-xml.svg',
        name: 'Cargar Archivo XML', 
        function: 'espirometria/carga/',
        visible:true
      },
      {
        src: 'consultar-reporte.svg', 
        srcHover:'consultar-reporte-green.svg', 
        srcHoverOut:'consultar-reporte.svg',
        name: 'Consultar Reporte', 
        function: 'espirometria/reporte/',
        visible:true
      },
      {
        src: 'gestionar-espiro.svg', 
        srcHover:'gestionar-espiro-green.svg', 
        srcHoverOut:'gestionar-espiro.svg',
        name: 'Gestión de Espirómetro', 
        function: 'espirometria/gestionar/',
        visible:this.admin
      },
      {
        src: 'fi_user.svg', 
        srcHover:'fi_user-green.svg', 
        srcHoverOut:'fi_user.svg',
        name: 'Manual de Usuario', 
        function: 1,
        visible:true
      },
      {
        src: 'dowload-file.svg', 
        srcHover:'dowload-file-green.svg', 
        srcHoverOut:'dowload-file.svg',
        name: 'Descargar Programa', 
        function: 2,
        visible:true
      },     
    ];

    this.descargarOp = {
      src: 'fi_help-circle.svg', 
      srcHover:'fi_help-circle-green.svg', 
      srcHoverOut:'fi_help-circle.svg',
      name: '¿Cómo cargar',
      name2: 'un archivo?', 
      function: 3,
      visible:true
    },

    this.cerrarOp = {
      src: 'fi_power.svg', 
      srcHover:'fi_power-green.svg', 
      srcHoverOut:'fi_power.svg',
      name: 'Cerrar sesión', 
      function: 0,
      visible:true
    };

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
