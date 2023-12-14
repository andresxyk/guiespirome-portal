import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { respPrueba, Prueba, reqPrueba, respReportes } from '../models/pruebas';
import {respOOAD, respUMF } from '../models/repOOAD';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private serverEndPointURL = `${environment.URLConsultaReporte}` + `/v1/`;
  private ruta = environment.production ? `${environment.URLConsultaReporte}` + `/v1/` : "../assets/json/";
  private rutalocaljson = "../assets/json/";

  header = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
  });

  constructor(private http: HttpClient) { }

  buscarreportes(req: reqPrueba): Observable<respPrueba>{
    //let url = this.ruta + `lstPruebas.json`;
    let url = this.serverEndPointURL + `consultarReporte`;
    return this.http.post<respPrueba>(url,req)
      .pipe(
        map((res) => {
          return res;
        })
      )
  }

  consultarreportespdf(nss: string): Observable<respReportes>{
    let url = this.serverEndPointURL + `visualizarReporte/` + nss;
    return this.http.get<respReportes>(url)
      .pipe(
        map((res) => {
          return res;
        })
      )
  }

  exportarPruebas(req: Prueba[], username: string, perfil: string): Observable<any>{
    let url = this.serverEndPointURL + `downloadReport`;
    this.header = this.header.set('nombreUsuario', username);
    this.header = this.header.set('perfil', perfil);
     return this.http.post(url, req,  { headers: this.header,  responseType: 'blob', observe: 'response'})
      .pipe(
        map((res) => {
          return res;
        })
      )
  }

  catalogoOOAD(): Observable<respOOAD>{
    let url = this.serverEndPointURL + `consultaOoad`;
    return this.http.get<respOOAD>(url)
      .pipe(
        map((res) => {
          return res;
        })
      )
  }

  catalogoUMF(arrooad: string[]): Observable<respUMF>{
    let url = this.serverEndPointURL + `consultaUmf`;
    return this.http.post<respUMF>(url, arrooad)
      .pipe(
        map((res) => {
          return res;
        })
      )
  }

  catalogoTodasUMF(ooad: string): Observable<respUMF>{
    let url = this.serverEndPointURL + `consultaUmf`;
    return this.http.get<respUMF>(url)
      .pipe(
        map((res) => {
          return res;
        })
      )
  }

}
