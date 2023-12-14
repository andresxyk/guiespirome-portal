import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResponseLstEntidades } from '../models/entidad';
import { ResponseLstUM, ResponseLstUMEspirometro } from '../models/unidadMedica';
import { ResponseLstOOAD } from '../models/OOAD';
import { SwalAlert } from '../helpers/swal-alert';
import { AuthService } from 'src/app/services/auth.service';
import { UserData } from "src/app/models/resOauth";

@Injectable({
  providedIn: 'root'
})
export class GeneralesService {
  userData!: UserData | null;
  private serverEndPointURL = `${environment.URLGenerales}` + `/v1/`;

  constructor(private http: HttpClient,
    public _Swal: SwalAlert, private authService: AuthService) {
    this.userData = this.authService.sessionUserDataDecoded;
   }


    /**Obtener OOAD de Servicios Digitales */
  getLstOOAD(): Observable<ResponseLstOOAD> {
    return this.http.get<ResponseLstOOAD>(this.serverEndPointURL + `getOoad`).pipe(
      map((response: ResponseLstOOAD) => {
        if (response.code == 200) {
        /* for (let item of response.respuesta) {
            if (parseInt(item.clave) >= 1 && parseInt(item.clave) <= 9) {
              item.clave = '0' + item.clave;
            }
          }
          */
        }
        return response;
      })
    );


  }

  getOoadEspirometro(): Observable<ResponseLstOOAD> {
    this.authService.refreshToken();
    var header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'Accept': '*/*',
      'token':  (this.userData)? this.userData.token : "",
    });

    return this.http.get<ResponseLstOOAD>(this.serverEndPointURL + `getOoadEspirometro`, { headers: header }).pipe(
      map((response: ResponseLstOOAD) => {
        if (response.code == 200) {
          response.respuesta = response.respuesta.filter(item => item.descripcion !== 'undefined');
        }
        return response;
      })
    );


  }


  /**Obtener Entidades de Servicios Digitales */
  getLstEntidades(): Observable<ResponseLstEntidades> {
    return this.http.get<ResponseLstEntidades>(this.serverEndPointURL + `getentidad`).pipe(
      map((response: ResponseLstEntidades) => {
        return response;
      })
    );


  }

  /**Obtener Ubicaciones de Servicios Digitales */
  getLstUbicaciones(ooad: string): Observable<ResponseLstUM> {
    return this.http.get<ResponseLstUM>(this.serverEndPointURL + `getUnidadesMedicas/${ooad}`).pipe(
      map((response: ResponseLstUM) => {
        return response;
      })
    );


  }

  /**Obtener Ubicaciones de Servicios Digitales */
  getUMEspirometros(ooad: string): Observable<ResponseLstUMEspirometro> {
    this.authService.refreshToken();
    var header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'Accept': '*/*',
      'token':  (this.userData)? this.userData.token : "",
    });

    return this.http.get<ResponseLstUMEspirometro>(this.serverEndPointURL + `getUMEspirometro/${ooad}`, { headers: header }).pipe(
      map((response: ResponseLstUMEspirometro) => {
        return response;
      })
    );


  }


  private handleError(error: HttpErrorResponse) {
    console.log("Error", error.status);
    // Return an observable with a user-facing error message.
    this._Swal.errorDialog(error);

  }
}
