import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { OauthServicesService } from '../../services/oauth-services.service';
import { UserData, UserRes } from 'src/app/models/resOauth';
import { SwalAlert } from 'src/app/helpers/swal-alert';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Mensajes } from 'src/app/helpers/mensajes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('selectUs') selectUs!: ElementRef;

  formGroup!:FormGroup

  show:boolean = false;
  olvido: boolean = false;
  idIncorrect: boolean = false;
  msgError!: string;


  constructor(
    private formBuilder : FormBuilder,
    private auth :  AuthService,
    private oauth : OauthServicesService,
    private _Swal: SwalAlert,
    private router : Router,
    private mensajes : Mensajes
    ) {

  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      // tipo: [2,Validators.required],
      user: ['',Validators.required],
      pass: ['',Validators.required]
    })
    this.msgError = this.mensajes.MSG002_1;
  }

  showPass(){
    let pass = this.formGroup.get('pass')?.value
    // console.log('pass',pass);
    if(pass){
      this.show = !this.show
    }else{
      this.show = false
    }
  }

  alphaNumeric(event: any) {
    let regex = /[a-zA-Z0-9.]/
    let inputValue = String.fromCharCode(event.keyCode);
    if (regex.test(inputValue)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  noSpaces(event: any){
    let regex = /^\S*$/;
    let inputValue = String.fromCharCode(event.keyCode);
    if (regex.test(inputValue)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  setOlvido(){
    this.olvido = !this.olvido;
  }

  login(){
    if(this.formGroup.valid && this.formGroup.dirty){
      let usrReq = { usuario: this.formGroup.get('user')?.value,password:this.formGroup.get('pass')?.value}
      // console.log(usrReq);
      this._Swal.msjLoading();
      this.oauth.getToken(usrReq).subscribe( (resp: UserRes) => {
        this._Swal.close();
        if (resp.code == 200) {
          // console.log(resp);
          this.auth.setSession(resp.respuesta)          
        } else if (resp.code == 400) {
          this.idIncorrect = true;

          setTimeout(() => {
            this.idIncorrect = false;
          },5000);
          
          // console.log(resp);
        } else if (resp.code == 500){
          console.log(resp.mensaje);
          this._Swal.errorDialog(new HttpErrorResponse({error:resp.mensaje}))
        }else if (resp.code == 404){
          this.msgError = resp.mensaje;
          this.idIncorrect = true;
          setTimeout(() => {
            this.idIncorrect = false;
          },5000);
        }
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this._Swal.close();
        this._Swal.errorDialog(error);
        // console.log(error);
      });
    }
    
    
  }


}
