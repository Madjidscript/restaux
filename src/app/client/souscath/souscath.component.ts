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
  filteredData: any[] = [];

  

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
    // this.tb = this.activate.snapshot.paramMap.get("tb")
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
  
  

    addToCart(item: any) {
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
  

}
