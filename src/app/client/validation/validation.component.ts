import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientserviceService } from '../../clientservice/clientservice.service';
import { SessionserviceService } from '../../sessionservice/sessionservice.service';
import { PanierService } from '../../panierservice/panier.service';

declare var bootstrap:any
@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './validation.component.html',
  styleUrl: './validation.component.scss'
})
export class ValidationComponent {

   @ViewChild('toastElement') toastEl!: ElementRef;
 
  cartItems: any[] = [];
  tb:any
  total2:any
  promo:any
  token:any
  notif:any
  statut:any
  statuts=false
  loading=false
  commandeValidee = false;
  showContactPopup = false;

  validationForm:FormGroup = new FormGroup({
    allergies: new FormControl(''),
    type_service : new FormControl('',Validators.required)
  });
  total: any;
  index:any;
  maintenant: any;
  dateActuelle: any;
  heureActuelle: any;
  reduct: any;
  totaux: any;

  constructor( private router:Router,private activate:ActivatedRoute,private api:ClientserviceService,private session:SessionserviceService,private paniers:PanierService) {
   
  }

  generateUniqueIndex(): string {
    const timestamp = Date.now().toString(36); // Encodage base36
    const random = Math.random().toString(36).substring(2, 8); // 6 caractères aléatoires
    return `${timestamp}-${random}`;
  }

  ngOnInit() {
   this.loadCart()
    
  }

  loadCart(): void {
  this.loading = true;

  setTimeout(() => {  // Simule un petit délai pour afficher le "patientez"
    this.cartItems = JSON.parse(sessionStorage.getItem('panier') || '[]');
    this.commandeValidee = sessionStorage.getItem('commandeValidee') === 'true';
    this.token=this.activate.snapshot.paramMap.get("tb")
    console.log("tok",this.token);
    
    this.gettb()

    this.total = this.cartItems.reduce((sum, item) => sum + item.prix_total, 0);
    const reductionData = sessionStorage.getItem('reductionData') ;
    // this.reduct = reductionData ? reductionData.reduction : 0;
     this.promo = sessionStorage.getItem('codePromo');
     console.log("doidou",this.promo);
    
     

    if (reductionData) {
       const parsedData = JSON.parse(reductionData);
       this.total2 = parsedData.totalwithreduct;
       this.reduct = parsedData.reduction;
       console.log("reduct",this.reduct);

    }    
    console.log("mon tatal",this.total,this.cartItems,this.total2);
     if (this.promo) {
     this.totaux = this.total2;
     console.log('totaux1',this.totaux);
     
     }else{
      this.totaux = this.total;
     console.log('totaux2',this.totaux);

     }
    this.index = this.generateUniqueIndex();
    this.heure()

   
    this.loading = false; // Toujours le mettre ici, à la fin
  }, 500); // Délai de 0.5s pour laisser apparaître le loader

  }



  confirmerCommande() {

   const typeService = this.validationForm.get('type_service')?.value;

  if (!typeService) {
    this.ouvrirPopup()
    return;
  }

    this.commandeValidee = true;
    // this.statuts =true
    this.statut="en_attente"
    const allergies = this.validationForm.get('allergies')?.value;
    const service = this.validationForm.get('type_service')?.value;
     const emont = localStorage.getItem("emon_id");
     
    
    const commande = {
      num: this.tb,
      total: this.totaux.toString(),
      statut: "en_attente",
      index: this.index,
      promo: this.promo,
      reduct: this.reduct,
      heure: this.heureActuelle,
      data: this.cartItems.map(item => ({
        id: item._id,
        image: item.image,
        nom: item.nom,
        prix: item.prix_total,
        prixIni: item.prix_unitaire,
        nbre: item.quantite
      })),
      alergit:allergies,
      type_service:service,
      emon_id:emont

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
            notiflength:0,
            statut:"en_attente"      
          }
          if (sessionStorage.getItem('notif')) {
            console.log('supprimer et nouveau');

            
            console.log("datanotif",this.notif);
            
            
            sessionStorage.removeItem('notif');

            this.notif={
              num:commande.num,
              index:commande.index,
              message:[],
              notiflength:0,
              statut:"en_attente"
        
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
        sessionStorage.removeItem('reductionData');
        sessionStorage.removeItem('codePromo');
        this.router.navigate([`/client/cath/${this.token}`])
          
        }, 10000);
          
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
    const statut = "deleted_by_user"
    this.api.annulecmd(this.index,this.tb,statut).subscribe({
      next:(res:any)=> {
        console.log("mons papa",res);
        
        if (res.status== "success"){
        this.statuts=true
        
        sessionStorage.removeItem('commandeValidee');
        sessionStorage.removeItem('alergit');
        // sessionStorage.removeItem('notif');
        this.session.removeItem("notif")
        this.paniers.refreshPanier()

        

        


        setTimeout(() => {

          this.router.navigate([`/client/cath/${this.token}`])
        }, 5000);

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
    this.router.navigate([`/client/cath/${this.token}`])
  }

  panier(){
    this.router.navigate([`/client/panier/${this.tb}`])
  }




  heure(){
    this.maintenant = new Date();

// Format français : jj/mm/aaaa
this.dateActuelle = this.maintenant.toLocaleDateString('fr-FR');

// Heure : hh:mm (24h)
this.heureActuelle = this.maintenant.toLocaleTimeString('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

console.log('Date :', this.dateActuelle);   // ex : 01/06/2025
console.log('Heure :', this.heureActuelle); // ex : 14:45
  }

  ouvrirPopup() {
  this.showContactPopup = true;

  // Attendre que l'élément toast soit visible dans le DOM
  setTimeout(() => {
    if (this.toastEl) {
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(this.toastEl.nativeElement);
      toastBootstrap.show();
    }
  });
   }


  fermerPopup() {
    this.showContactPopup = false;
  }


  gettb(){
      this.api.sigleqr(this.token).subscribe({
        next:(res:any)=>{
          console.log("ma reponse depuis validation",res.numeroTable);
          this.tb = res.numeroTable
          
        },
        error:(err:any)=> {
         console.log("mon footer",err);
          
        },
        complete() {
          console.log("ok");
          
        },
      })
    }
 

}
