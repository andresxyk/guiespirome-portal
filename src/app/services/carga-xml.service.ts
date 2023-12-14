import { XmlLectura, LecturaResponse } from '../models/carga-xml';
import { environment } from 'src/environments/environment';
import { SwalAlert } from '../helpers/swal-alert';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserData } from "src/app/models/resOauth";
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CargaXmlService {
  serverURL: string;
  userData!: UserData | null;


  constructor(private http: HttpClient, public _Swal: SwalAlert, private authService: AuthService) {
    this.userData = this.authService.sessionUserDataDecoded;
    this.serverURL = `${environment.URLCargaXML}` + `/v1/`;

  }



  leerXML(payload: XmlLectura): Observable<LecturaResponse> {

    const formdata = new FormData();
    const blob = new Blob([payload.file], { type: 'application/xml' });
    formdata.append('file', blob,payload.file.name);
    if (payload.perfil && payload.perfil == 'Administrador') {
      formdata.append("perfil", payload.perfil);
      formdata.append("idEspirometro", payload.idEspirometro);
    }
    return this.http.post<LecturaResponse>(this.serverURL + `leer`, formdata).pipe(
      map((response: LecturaResponse) => {
        return response;
      })
    );
  }




}
