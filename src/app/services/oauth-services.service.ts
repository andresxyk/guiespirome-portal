import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Refresh, UserRes, UserReq } from '../models/resOauth';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OauthServicesService {

  header = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
  });

  private URL = `${environment.URLOauth}/v1/token`;

  constructor(
    private http: HttpClient
  ) { }

  getToken(data: UserReq): Observable<UserRes> {
    let url = this.URL + `/loginSist`;
    return this.http.post<UserRes>(url, data, { headers: this.header }).pipe(
      map((res) => {//en vez de usar el map puedo usar el tap
        return res;
      })
    )

  }

  refreshToken(data: string): Observable<Refresh> {
    let url = this.URL + `/refresh`;
    return this.http.post<Refresh>(url, data, { headers: this.header }).pipe(
      map((res) => {
        return res;
      })
    )

  }
}
