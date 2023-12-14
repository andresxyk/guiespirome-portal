import { Injectable } from '@angular/core';
import { UserData } from "../models/resOauth";
import { Observable, Subject, of } from 'rxjs';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { formatDate } from '@angular/common'
import { OauthServicesService } from './oauth-services.service';
import { SwalAlert } from 'src/app/helpers/swal-alert';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  protected USER_KEY : string = "_sessionUserDataEspiro_";

  constructor(
    private router : Router, 
    private oauth : OauthServicesService,
    private _Swal: SwalAlert,
  ) {
    
  }

  public set sessionUserData(user: UserData){
    let tokenDateLogged = formatDate(new Date(),'yyyy/MM/dd HH:mm:ss','en-ES',)//datelogged creada por que el micro arroja otra hora
    let withDate = {...user,tokenDateLogged}
    sessionStorage.setItem( window.btoa (this.USER_KEY), window.btoa ( encodeURIComponent( JSON.stringify(withDate))));
  }

  public get sessionUserDataDecoded(): UserData | null {
    let encodeJson = sessionStorage.getItem( window.btoa (this.USER_KEY));
    if (encodeJson && encodeJson.length > 0){
      return JSON.parse(decodeURIComponent( window.atob(encodeJson)));
    } else {
      return null;
    }
  }

  public userProfile(): boolean | null{
    let usr = this.sessionUserDataDecoded
    if(usr){
      return usr.perfil == 'Administrador'
    }else{
      return null
    }
  }

  public setSession(userData: UserData){
    this.sessionUserData = userData
    // this.router.navigateByUrl('/espirometria/bienvenida')
    window.location.replace('/espirometria/bienvenida');
  }

  public logout(){
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/login/']);
    window.location.replace('/login/');
  }

  checkAuth(route: ActivatedRouteSnapshot): Observable<boolean>{
    if(!this.sessionUserDataDecoded){
      this.logout()
      return of (false)
    }
    let typeAdmin = this.userProfile();
    if(route.url[0].path == 'gestionar'){
      if(!this.logueado() || !typeAdmin || !route || !route.url){
        this.logout()
        return of (false)
      }else{
        return of (true)
      }

    }else{
      if(!this.logueado() || !route || !route.url){
        this.logout()
        return of (false)
      }else{
        return of (true)
      }
    }
  }

  public logueado(): boolean{
    return this.sessionUserDataDecoded?.nombreUsuario ? true : false
  }

  public refreshToken(refInactiv: boolean = false){
    let usr = this.sessionUserDataDecoded
    if(usr && usr.tokenDateLogged){
      let dateActual = new Date()
      let dateToken = new Date(usr.tokenDateLogged)//datelogged creada porque el micro arroja otra hora
      let difference = dateActual.getTime() - dateToken.getTime();
      let resultInMinutes = Math.round(difference / 60000);
      if(resultInMinutes >= 10){ //despues de 10min de uso se renueva el token
        this.oauth.refreshToken(usr.token).subscribe( resp => {
          if (resp.code == 200) {
            let newUserData: UserData;
            if(usr){
              newUserData = {
                expira: resp.respuesta.expira,
                expiresInSecond: resp.respuesta.expiresInSecond,
                delegacion: usr.delegacion,
                nombreUsuario: usr.nombreUsuario,
                cveDelegacion: usr.cveDelegacion,
                token: resp.respuesta.token,
                umf: usr.umf,
                perfil: usr.perfil,
              }
              this.sessionUserData = newUserData;
            }
          } else if (resp.code == 401) {
            if(!refInactiv){
              this.logout()
            }
          } else {
            this._Swal.errorDialog(new HttpErrorResponse({error:resp.mensaje,status:resp.code}))
          }
        },(error: HttpErrorResponse) => {
          this._Swal.close();
          this._Swal.errorDialog(error);
        })
      }

    }
  }
}
