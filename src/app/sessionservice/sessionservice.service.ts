import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SessionserviceService {

   private sessionSubject = new BehaviorSubject<any[]>(this.getNotifFromStorage());
  public notif$ = this.sessionSubject.asObservable();

  constructor() { }

   // Enregistrer une donnée
   setItem(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  // Récupérer une donnée
  getItem<T>(key: string): T | null {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) as T : null;
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


  private getNotifFromStorage(): any {
    if (typeof window !== 'undefined') {
      return JSON.parse(sessionStorage.getItem('notif') || '{}');
    }
    return {};
  }


  notiflength(): number {
    const notif = this.getNotifFromStorage();
    return notif.notiflength || 0; // Retourne 0 si undefined
  }
}
