import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { buscarEspirometro, BusquedaRequest, Espirometro, responseLstEspirometros, responseMSEspirometros } from '../models/espirometro';
import { SwalAlert } from '../helpers/swal-alert';
import { ResponseLstUM } from '../models/unidadMedica';
import { ResponseLstOOADMultiselect } from '../models/OOAD';

@Injectable({
  providedIn: 'root'
})
export class GestionService {
  private serverEndPointURL = `${environment.URLEspirometro}` + `/v1/`;

  constructor(private http: HttpClient,
    public _Swal: SwalAlert) { }


    getLstEspirometros(filtros: BusquedaRequest): Observable<responseLstEspirometros> {
      return this.http.post<responseLstEspirometros>(this.serverEndPointURL + `consultarEspirometro`, filtros).pipe(
        map((response: responseLstEspirometros) => {
          return response;
        })
      );
  
  
    }


/**Multiselect OOAD */    
    getLstOOAD(): Observable<ResponseLstOOADMultiselect> {
      return this.http.get<ResponseLstOOADMultiselect>(this.serverEndPointURL + `consultaEquipoOoad`).pipe(
        map((response: ResponseLstOOADMultiselect) => {
          return response;
        })
      );
  
  
    }



    
    getLstUM(lstOOAD: Array<string>): Observable<ResponseLstUM> {
      return this.http.post<ResponseLstUM>(this.serverEndPointURL + `consultaEquipoUmf`, lstOOAD).pipe(
        map((response: ResponseLstUM) => {
          return response;
        })
      );
  
  
    }

    getLstUMAll(): Observable<ResponseLstUM> {
      return this.http.get<ResponseLstUM>(this.serverEndPointURL + `consultaEquipoUmf`).pipe(
        map((response: ResponseLstUM) => {
          return response;
        })
      );
  
  
    }





  getLstEspirometrosMedico(matricula: string): Observable<responseLstEspirometros> {
    return this.http.get<responseLstEspirometros>(this.serverEndPointURL + `listEspirometros/${matricula}`,{}).pipe(
      map((response: responseLstEspirometros) => {
        return response;
      })
    );
  }

  saveRegister(espirometro: Espirometro): Observable<any> {

    return this.http.post<any>(this.serverEndPointURL + `registrarEspirometros`, espirometro).pipe(

      map((response: any) => {
        return response;
      })
    );
  }

  editRegister(espirometro: Espirometro): Observable<any> {

    return this.http.post<any>(this.serverEndPointURL + `editarEspirometros`, espirometro).pipe(

      map((response: responseMSEspirometros) => {
        return response;
      })
    );
  }





  deleteRegister(numeroSerie: string): Observable<any> {
    return this.http.post<any>(this.serverEndPointURL + `eliminar/${numeroSerie}`, numeroSerie).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  reactivateRegister(numeroSerie: string): Observable<any> {
    return this.http.post<any>(this.serverEndPointURL + `activarEspirometro/${numeroSerie}`, numeroSerie).pipe(
      map((response: any) => {
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
