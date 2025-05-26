import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionserviceService {

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
}
