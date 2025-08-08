import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { SwPush } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class PushserviceService {

 constructor(private swPush: SwPush, private http: HttpClient) {}
    api_url= environment.apiUrl 
  

  // Récupérer la clé publique depuis Express
  // getPublicKey() {
  //   return this.http.get<{ publicKey: string }>(`${this.api_url}/push/public-key`);
  // }

  // // S'abonner aux notifications push
  // subscribeToPush(emon_id: string) {
  //   this.getPublicKey().subscribe({
  //     next: (data) => {
  //       this.swPush.requestSubscription({
  //         serverPublicKey: data.publicKey
  //       }).then(sub => {
  //         // Envoi de l'abonnement au backend
  //         this.http.post(`${this.api_url}/subscribe`, {
  //           emon_id,
  //           subscription: sub
  //         }).subscribe(() => {
  //           console.log('✅ Abonnement push enregistré');
  //         });
  //       }).catch(err => console.error('❌ Erreur abonnement push', err));
  //     }
  //   });
  // }

   getPublicKey() {
    return this.http.get(this.api_url+"/admin/public-key" );
  }


  subscribeToPush(emon_id: string, subscription: any) {
  const body = { emon_id, subscription };
  return this.http.post(this.api_url + "/admin/subscribe", body);
}

  // Écouter les notifications entrantes
  listenToMessages() {
    this.swPush.messages.subscribe((message:any) => {
      console.log('📩 Notification reçue', message);
      alert(message['message'] || 'Nouvelle notification reçue');
    });
  }



}
