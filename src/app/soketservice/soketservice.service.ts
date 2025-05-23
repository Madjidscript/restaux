import { io, Socket } from 'socket.io-client';
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoketserviceService {

  // socket: Socket;

  socket!: Socket;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const hostname = window.location.hostname;
      // this.socket = io(`http://${hostname}:7000`);
      this.socket = io(`https://qrrestaux.onrender.com`);
    }
  }

  // constructor() {
  //   const hostname = window.location.hostname;
  //   this.socket = io(`http://${hostname}:7000`);

  // }

  sendMessage(title:any,msg: any) {
    this.socket.emit(title, msg);
  }

  onMessage(title:any,callback: (data: any) => void) {
    this.socket.on(title, callback);
  }
}
