import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'gui-espirometria';
  timedOut: boolean = false;
  lastPing!: Date;

  constructor(
    private idle : Idle, 
    private keepalive : Keepalive, 
    private router: Router,
    private authService : AuthService
  ){ }

  ngOnInit(): void {
    this.idle.setIdle(825);//825 seg para los 15 min considerando el tiempo antes de cerrar la sesión ↓
    this.idle.setTimeout(75);//tiempo antes de ejecutar el cierre
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    

    this.idle.onIdleStart.subscribe( ()=> {
    })

    this.idle.onIdleEnd.subscribe( ()=> {
      this.authService.refreshToken(true);
    })

    this.idle.onTimeout.subscribe( ()=> {
      this.timedOut = true;
      this.authService.logout();
    })

    this.idle.onTimeoutWarning.subscribe( (countdown)=> {
    })

    this.keepalive.interval(15);
    this.keepalive.onPing.subscribe( ()=> {
      this.lastPing = new Date();
    })

    if(this.logged()){
      this.idle.watch();
    }else{
      this.idle.stop();
    }
    
  }

  resetIdel(){
    this.idle.watch();
    this.timedOut = false;
  }
  stay(){
    this.resetIdel();
  }

  logged(){
    return this.authService.logueado();
  }
}
