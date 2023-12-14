import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { responseManual } from '../models/carga-pdf';
import { AuthService } from './auth.service';
import { UserData } from '../models/resOauth';

@Injectable({
  providedIn: 'root'
})
export class CargaPdfService {

  private serverEndPointURL = `${environment.URLCargaPDF}` + `/v1/`;
  user!: UserData | null;

  constructor(private http: HttpClient,private authService: AuthService) { }

  /*public validatePdf(body:any):Observable<any>{
    return this.http.post(this.serverEndPointURL + `validarpdf`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }*/

  public validatePdf(body:FormData): Observable<any> {
    this.authService.refreshToken();
    this.user = this.authService.sessionUserDataDecoded;
    const apiCall = fetch(this.serverEndPointURL + `validarpdf`, {
      
      method: 'POST',
      body: body,
      headers: {
        'token': (this.user) ? this.user.token : ""
      }

    })
      .then(response => response.json())
      .then(responseJson => {
        return responseJson
      }).catch((error) => {
        console.log(error);
        return error;
      })
    return from(apiCall)
  }

  /*public saveDocument(body:any):Observable<any>{
    return this.http.post(this.serverEndPointURL + `guardardocumento`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }*/

  public saveDocument(body:FormData):Observable<any>{
    this.authService.refreshToken()
    this.user = this.authService.sessionUserDataDecoded;
    const apiCall = fetch(this.serverEndPointURL + `guardardocumento`, {
      method: 'POST',
      body: body,
      headers: {
        'token': (this.user) ? this.user.token : ""
      }

    })
      .then(response => response.json())
      .then(responseJson => {
        return responseJson
      }).catch((error) => {
        console.log(error);
        return error;
      })
    return from(apiCall)
  }

  public getManual(manual: string): Observable<responseManual> {
    const url = this.serverEndPointURL + `manuales/` + manual;
    return this.http.get<responseManual>(url).pipe(
      map((response) => {
        return response;
      }));
  }

 

}
