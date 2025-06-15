import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanierService {

  private panierSubject = new BehaviorSubject<any[]>(this.getPanierFromStorage());
  public panier$ = this.panierSubject.asObservable();

  constructor() {}

  private getPanierFromStorage(): any[] {
    if (typeof window !== 'undefined') {
      return JSON.parse(sessionStorage.getItem('panier') || '[]');
    }
    return [];
  }

  private savePanierToStorage(panier: any[]) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('panier', JSON.stringify(panier));
    }
  }

  // 🔁 Cette méthode recharge le panier depuis sessionStorage et le notifie
  refreshPanier() {
    const panier = this.getPanierFromStorage();
    this.panierSubject.next(panier);
  }

  getTotalQuantite(): number {
    const panier = this.getPanierFromStorage();
    return panier.reduce((sum, item) => sum + item.quantite, 0);
  }

  getPanier(): any[] {
    return this.getPanierFromStorage();
  }

  // addToPanier(item: any) {
  //   const panier = this.getPanier();
  //   // const index = panier.findIndex((p: any) => p._id === item.id_cath);
    
  //   const index = panier.findIndex((p: any) => 
  //     p._id === item._id && p.nom === item.nom
  //   );
    

  //   if (index !== -1) {
  //     panier[index].quantite += 1;
  //     panier[index].prix_total = panier[index].quantite * panier[index].prix_unitaire;
  //   } else {
  //     panier.push({
  //       // _id: item.id_cath,
  //       _id: item._id,
  //       nom: item.nom,
  //       image: item.image,
  //       prix_unitaire: item.prix,
  //       quantite: 1,
  //       prix_total: item.prix,
       
  //     });
  //   }


    

  //   this.savePanierToStorage(panier);
  //   this.panierSubject.next(panier); // 🔔 Notifie les abonnés
  // }



  addToPanier(item: any) {
  const panier = this.getPanier();

  const index = panier.findIndex((p: any) =>
    p._id === item._id && p.nom === item.nom
  );

  if (index !== -1) {
    panier[index].quantite += 1;
    panier[index].prix_total = panier[index].quantite * panier[index].prix_unitaire;
  } else {
    panier.push({
      _id: item._id,
      nom: item.nom,
      image: item.image,
      prix_unitaire: item.prix,
      quantite: 1,
      prix_total: item.prix,
    });
  }

  // Sauvegarder panier (array) dans sessionStorage
  this.savePanierToStorage(panier);

  // Garder code promo et réduction en sessionStorage (inchangé)
  // Par exemple, si tu as un code promo actif, tu peux le réappliquer :
  const codePromo = sessionStorage.getItem('codePromo');
  const reductionData = sessionStorage.getItem('reductionData');
  if (codePromo && reductionData) {
    // Pas besoin de modifier le panier ici, juste s'assurer que le code est stocké
    // Et la logique de calcul du total avec réduction sera dans le composant panier
  }

  this.panierSubject.next(panier); // Notifie les abonnés
}

}
