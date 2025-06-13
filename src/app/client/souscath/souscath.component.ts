import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { ClientserviceService } from '../../clientservice/clientservice.service';
import { PanierService } from '../../panierservice/panier.service';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-souscath',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './souscath.component.html',
  styleUrl: './souscath.component.scss'
})
export class SouscathComponent implements OnInit {
  totalQuantite: any;
  loading=false
  tb: any;
  token: any;
  filteredData: any[] = [];

  showToast = false;
  toastMessage = '';
  loadingButtons: Set<string> = new Set();

  

  constructor(private api:ClientserviceService, private activate:ActivatedRoute, private panierService:PanierService){

  }

  id:any
   data:any
   baseUrl = environment.apiUrl + '/';
   panier: []|any;

   searchForm = new FormGroup({
       searchTerm: new FormControl('')
     });
  formatImagePath(path: string): string {
       return this.baseUrl + path.replace(/\\/g, '/');
  }

  ngOnInit() {
    this.id = this.activate.snapshot.paramMap.get("id");
    console.log("mon id", this.id);
    this.token = this.activate.snapshot.paramMap.get("tb")
    console.log("madjid tb",this.tb);
    
    // console.log("mon tbfff",this.tb);

    this.searchForm.get('searchTerm')?.valueChanges.subscribe(value => {
      this.filterData(value || '');
    });
    
    this.getsouscath();
  
    // 🔁 Initialisation du panier
    const storedPanier = sessionStorage.getItem('panier');
    if (storedPanier) {
      this.panier = JSON.parse(storedPanier);
      console.log("Panier récupéré :", this.panier);
      console.log("mon panier length :", this.panier.length);
    } else {
      // Le panier n'existe pas encore, on l'initialise à un tableau vide
      this.panier = [];
      sessionStorage.setItem('panier', JSON.stringify(this.panier));
      console.log("Aucun panier trouvé, initialisation vide.");
    }
  }
  
    
  
    getsouscath(){
      this.loading=true
      let body={
        id_cath:this.id
      }
      this.api.AllsousCathebycath(body).subscribe({
        next:(res:any)=> {
          console.log("response",res);
          this.data =res.data
        this.filteredData = this.data;
    this.gettb()


          
        },
  
        error:(err:any)=> {
          console.log("err",err);
           this.loading=false

          
        },
        complete:()=> {
          console.log("ok");
         this.loading=false

          
        },
      })
  
    }


    filterData(term: string): void {
      const search = term.toLowerCase();
      this.filteredData = this.data.filter((item:any) =>
        item.nom.toLowerCase().includes(search)
      );
    }
  
  

    addToCarts(item: any) {
      this.panierService.addToPanier(item);
    }
    
    updatePanierCount() {
      // this.panier = JSON.parse(sessionStorage.getItem('panier') || '[]');
      // this.totalQuantite = this.panier.reduce((sum:any, item:any) => sum + item.quantite, 0);
      console.log("yesss");
    
    this.totalQuantite = this.panierService.getTotalQuantite();

    // 🔄 Mettre à jour en temps réel
    this.panierService.panier$.subscribe(() => {
      this.totalQuantite = this.panierService.getTotalQuantite();
    });
    }



    
  gettb(){
      this.api.sigleqr(this.token).subscribe({
        next:(res:any)=>{
          console.log("ma reponse depuis cath",res);
          this.tb = res.numeroTable
          
        },
        error:(err:any)=> {
         console.log("mon ersr",err);
          
        },
        complete() {
          console.log("ok");
          
        },
      })
    }
  




    // bolt

    addToCart(item: any, event?: Event) {
    // Récupérer le bouton cliqué
    const button = event?.target as HTMLElement;
    const itemId = item.id || item._id || item.nom; // Utilisez l'identifiant unique de votre item
    
    // Ajouter l'état de chargement
    if (button) {
      button.classList.add('loading');
      this.loadingButtons.add(itemId);
    }

    try {
      // Votre logique d'ajout au panier
      this.panierService.addToPanier(item);
      
      // Simuler un petit délai pour l'effet visuel (optionnel)
      setTimeout(() => {
        // Retirer l'état de chargement
        if (button) {
          button.classList.remove('loading');
          button.classList.add('success');
        }
        this.loadingButtons.delete(itemId);
        
        // Afficher la notification toast
        this.showSuccessToast(item.nom);
        
        // Retirer l'état de succès après l'animation
        setTimeout(() => {
          if (button) {
            button.classList.remove('success');
          }
        }, 1200);
        
      }, 500); // Délai court pour l'effet visuel
      
    } catch (error) {
      // Gestion d'erreur
      console.error('Erreur lors de l\'ajout au panier:', error);
      
      if (button) {
        button.classList.remove('loading');
        button.classList.add('error'); // Vous pouvez ajouter un style d'erreur
      }
      this.loadingButtons.delete(itemId);
      
      this.showErrorToast('Erreur lors de l\'ajout au panier');
      
      setTimeout(() => {
        if (button) {
          button.classList.remove('error');
        }
      }, 1200);
    }
  }

  // Méthode pour afficher la notification de succès
  showSuccessToast(itemName: string) {
    this.toastMessage = `✅ "${itemName}" ajouté au panier !`;
    this.showToast = true;
    
    // Masquer la notification après 3 secondes
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  // Méthode pour afficher la notification d'erreur
  showErrorToast(message: string) {
    this.toastMessage = `❌ ${message}`;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  // Méthode pour vérifier si un bouton est en cours de chargement
  isButtonLoading(item: any): boolean {
    const itemId = item.id || item._id || item.nom;
    return this.loadingButtons.has(itemId);
  }


}
