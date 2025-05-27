import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SessionserviceService {

  private notifSubject = new BehaviorSubject<any[]>(this.getNotifFromStorage());
  notif$ = this.notifSubject.asObservable();


  constructor() { }

   // Enregistrer une donnée
   setItem(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  
  // Supprimer une donnée spécifique
  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  // Supprimer plusieurs clés spécifiques (ex: toutes les données de l'utilisateur connecté)
  removeItems(keys: string[]): void {
    keys.forEach(key => sessionStorage.removeItem(key));
  }

  // Supprimer toute la session
  clear(): void {
    sessionStorage.clear();
  }


 
  getItem(key: string): any {
    if (typeof window !== 'undefined') {
      return JSON.parse(sessionStorage.getItem(key) || 'null');
    }
    return null;
  }
  
  setNotif(data: any) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('notif', JSON.stringify(data));
      this.notifSubject.next(data);
    }
  }
  
  private getNotifFromStorage(): any {
    if (typeof window !== 'undefined') {
      return JSON.parse(sessionStorage.getItem('notif') || '{"message":[],"notiflength":0}');
    }
    return { message: [], notiflength: 0 };
  }
  
  notiflength(): number {
    if (typeof window !== 'undefined') {
      const notif = this.getNotifFromStorage();
      return notif?.notiflength || 0;
    }
    return 0;
  }

  
}
