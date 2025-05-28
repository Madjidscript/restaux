import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientserviceService } from '../../clientservice/clientservice.service';
import { SessionserviceService } from '../../sessionservice/sessionservice.service';
import { PanierService } from '../../panierservice/panier.service';


@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './validation.component.html',
  styleUrl: './validation.component.scss'
})
export class ValidationComponent {

 
  cartItems: any[] = [];
  tb:any
  notif:any
  statut:any
  commandeValidee = false;
  validationForm:FormGroup = new FormGroup({
    allergies: new FormControl('')
  });
  total: any;
  index:any

  constructor( private router:Router,private activate:ActivatedRoute,private api:ClientserviceService,private session:SessionserviceService,private paniers:PanierService) {
   
  }

  generateUniqueIndex(): string {
    const timestamp = Date.now().toString(36); // Encodage base36
    const random = Math.random().toString(36).substring(2, 8); // 6 caractères aléatoires
    return `${timestamp}-${random}`;
  }

  ngOnInit() {
    this.cartItems = JSON.parse(sessionStorage.getItem('panier') || '[]');
    this.commandeValidee = sessionStorage.getItem('commandeValidee') === 'true';
    this.tb=this.activate.snapshot.paramMap.get("tb")
    this.total = this.cartItems.reduce((sum, item) => sum + item.prix_total, 0);
    console.log("mon tatal",this.total,this.cartItems);
    this.index = this.generateUniqueIndex();
    
  }

  confirmerCommande() {
    this.commandeValidee = true;
    this.statut="en_attente"
    const allergies = this.validationForm.get('allergies')?.value;
     
    
    const commande = {
      num: this.tb,
      total: this.total.toString(),
      statut: "en_attente",
      index: this.index,
      data: this.cartItems.map(item => ({
        id: item._id,
        image: item.image,
        nom: item.nom,
        prix: item.prix_total,
        prixIni: item.prix_unitaire,
        nbre: item.quantite
      })),
      alergit:allergies
    };

    
    console.log("ma commande backend",commande);

    this.api.validationcmmd(commande).subscribe({
      next:(res:any)=> {
        console.log("ma reponse ",res);
        if (res.status== "success") {
          sessionStorage.removeItem('alergit');

          this.notif={
            num:commande.num,
            index:commande.index,
            message:[],
            notiflength:0
      
          }
          if (sessionStorage.getItem('notif')) {
            console.log('supprimer et nouveau');

            
            console.log("datanotif",this.notif);
            
            
            sessionStorage.removeItem('notif');

            this.notif={
              num:commande.num,
              index:commande.index,
              message:[],
              notiflength:0
        
            }
            console.log("md",this.notif);
            
          }
          this.session.setNotif(this.notif);
        // sessionStorage.setItem('notif', JSON.stringify(this.notif));
        sessionStorage.removeItem('panier');
        sessionStorage.setItem('commandeValidee', 'true');
        this.paniers.refreshPanier()
        setTimeout(() => {
        sessionStorage.removeItem('commandeValidee');
        sessionStorage.removeItem('voixActive');
        this.router.navigate([`/client/cath/${this.tb}`])
          
        }, 8000);
          
        }
        
        
      },
      error:(err:any)=> {
        console.log("mon err",err);
        
      },
      complete:()=> {
        console.log("ok");
        this.cartItems = [];
      },
    })

   
    
    
    
    
  }


  

  annulerCommande(){
    
     
    this.api.annulecmd(this.index,this.tb).subscribe({
      next:(res:any)=> {
        console.log("mons data",res);
        
        if (res.status== "success"){

        
        sessionStorage.removeItem('commandeValidee');
        sessionStorage.removeItem('alergit');
        this.paniers.refreshPanier()

        this.commandeValidee = false;
        this.statut=false

        // setTimeout(() => {

        //   this.router.navigate([`/client/cath/${this.tb}`])
        // }, 5000);

        }
      
         
      },
      error:(err:any)=> {
        console.log("mon erreur",err);
       
        
        
      },
      complete:()=> {
        console.log("mon api youpi");
        
      },
    })

  }
  

  

  viderPanier() {
    sessionStorage.removeItem('panier');
    sessionStorage.removeItem('notif');
    this.cartItems = [];
    this.paniers.refreshPanier()
    this.router.navigate([`/client/cath/${this.tb}`])
  }

  panier(){
    this.router.navigate([`/client/panier/${this.tb}`])
  }

}
