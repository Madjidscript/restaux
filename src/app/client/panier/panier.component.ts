import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { PanierService } from '../../panierservice/panier.service';
import { ClientserviceService } from '../../clientservice/clientservice.service';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.scss'
})
export class PanierComponent implements OnInit {


  cartItems: any[] = [];
  tb:any
  token:any
  loading=false
  subtotal: number = 0;
  total: number = 0;
  baseUrl = environment.apiUrl + '/';
  totalQuantite: any;
    formatImagePath(path: string): string {
         return this.baseUrl + path.replace(/\\/g, '/');
    }

  ngOnInit(): void {
    this.token = this.activate.snapshot.paramMap.get("tb")
    this.loadCart()

    
  }

  constructor(private panierService:PanierService,private router:Router,private activate:ActivatedRoute,private api:ClientserviceService){}

  // loadCart(): void {
  //   this.loading = true
  //   const storedCart = sessionStorage.getItem('panier');
  //   this.cartItems = storedCart ? JSON.parse(storedCart) : [];
  //   console.log('my cartitems',this.cartItems);
    
  //   if (this.cartItems.length >0) {
  //     this.loading =false
  //   }
        

  //   // Met à jour les calculs
  //   this.updateTotals();
  //   this.update()

  // }

  loadCart(): void {
  this.loading = true;

  setTimeout(() => {  // Simule un petit délai pour afficher le "patientez"
    const storedCart = sessionStorage.getItem('panier');
    this.cartItems = storedCart ? JSON.parse(storedCart) : [];

    this.updateTotals();
    this.update();

    this.loading = false; // Toujours le mettre ici, à la fin
  }, 500); // Délai de 0.5s pour laisser apparaître le loader
}


  updateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.prix_total, 0);
    this.total = this.subtotal; // Ajouter d'autres frais si besoin
  }

  increase(item: any): void {
    item.quantite += 1;
    item.prix_total = item.quantite * item.prix_unitaire;
    this.saveAndRefresh();
    this.update()

  }

  decrease(item: any): void {
    if (item.quantite > 1) {
      item.quantite -= 1;
      item.prix_total = item.quantite * item.prix_unitaire;
      this.saveAndRefresh();
      this.update()

    }
  }

  remove(item: any): void {
    this.cartItems = this.cartItems.filter(p => p.nom !== item.nom);
    this.saveAndRefresh();
    this.update()
   
  }

  saveAndRefresh(): void {
    sessionStorage.setItem('panier', JSON.stringify(this.cartItems));
    this.updateTotals();
  }

  update(){
     // Mets à jour le localStorage (ou sessionStorage selon ton usage)
  sessionStorage.setItem('panier', JSON.stringify(this.cartItems));

  // Met à jour l'observable du service
  this.panierService.refreshPanier();

  // Optionnel : recalculer la quantité totale si tu l'affiches
  this.totalQuantite = this.cartItems.reduce((sum, p) => sum + p.quantite, 0);
  }

  validerCommande() {
    this.router.navigate(['/client/validation', this.token]); // Redirection vers une page de validation
  }

   
  

}
