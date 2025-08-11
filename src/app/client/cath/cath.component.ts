import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { ClientserviceService } from '../../clientservice/clientservice.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { PushserviceService } from '../../pushservice/pushservice.service';
import { SwPush } from '@angular/service-worker';


@Component({
  selector: 'app-cath',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './cath.component.html',
  styleUrl: './cath.component.scss'
})
export class CathComponent implements OnInit {
  emon_id: string|any =" ";
  ngOnInit(): void {
    this.gettb()
    let emon_id = sessionStorage.getItem("emon_id");
    this.createsuscribe(this.emon_id)

   console.log("yy",emon_id)

    // this.getallcath()

    console.log("madjid",this.token,this.tb);
    
    this.searchForm.get('searchTerm')?.valueChanges.subscribe(value => {
      this.filterData(value || '');
    });
  }

  constructor(private api:ClientserviceService,private router:Router,private activate:ActivatedRoute,  
      private pushNotificationService:PushserviceService,private swPush: SwPush
  ){}

  data:any
  filteredData: any[] = [];
  voixActive = false;
  isReady = false;
  tb:any
  token:any
  message:any
  loading=false
  baseUrl = environment.apiUrl + '/';
  searchForm = new FormGroup({
    searchTerm: new FormControl('')
  });
  formatImagePath(path: string): string {
    return this.baseUrl + path.replace(/\\/g, '/');
  }

  getallcath(){
    this.loading=true
    this.api.AllCathe().subscribe({
      next:(res:any)=> {
        console.log("ma reponse",res);
        this.data = res.recup
        this.filteredData = this.data;
        // this.gettb()
        
      },
  
      error:(err:any)=> {
        console.log("mon eror",err);
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

   nav(id:any){
    this.router.navigate([`/client/souscath/${id}/${this.token}`])
    this.activerVoix()
   

   }



   activerVoix() {
    // Vérifie si déjà activé dans sessionStorage
    const dejaActive = sessionStorage.getItem('voixActive');
  
    if (dejaActive === 'true') {
      console.log('Voix déjà activée, on ne répète pas.');
      return;
    }
  
    const message = new SpeechSynthesisUtterance("Bienvenue ! Nous sommes ravis de vous accueillir. Veuillez effectuer votre commande.");
    message.lang = navigator.language.startsWith('en') ? 'en-US' : 'fr-FR';
    
    speechSynthesis.speak(message);
  
    // Marque comme activée
    sessionStorage.setItem('voixActive', 'true');
    this.voixActive = true;
  }

  createsuscribe(emonid: string) {
  this.loading = true;

  // Récupérer la clé publique
  this.pushNotificationService.getPublicKey().subscribe({
    next: (res: any) => {
      // Demander l'abonnement au service worker
      this.swPush.requestSubscription({
        serverPublicKey: res.publicKey
      }).then((subscription:any) => {
        // Envoyer emon_id ET subscription au backend
        this.pushNotificationService.subscribeToPush(emonid, subscription).subscribe({
          next: (res: any) => {
            console.log("Abonnement enregistré côté backend", res);
            this.loading = false;
          },
          error: (err: any) => {
            console.error("Erreur abonnement backend", err);
            this.loading = false;
          }
        });
      }).catch((err:any) => {
        console.error("Erreur requestSubscription", err);
        this.loading = false;
      });
    },
    error: (err: any) => {
      console.error("Erreur getPublicKey", err);
      this.loading = false;
    }
  });
}




  gettb(){
  this.loading = true;
    this.token =this.activate.snapshot.paramMap.get("tb")
  this.api.sigleqr(this.token).subscribe({
    next: (res: any) => {
      console.log("ma reponse depuis cath", res);
      this.tb = res.numeroTable;
      this.message = res?.message
      console.log("lidy",this.token);
      this.emon_id = localStorage.getItem("emon_id");

      // this.pushNotificationService.subscribeToPush(this.emon_id); // abonne l'utilisateur
      
      this.getallcath();
      
      this.pushNotificationService.listenToMessages();


    },
    error: (err: any) => {
      console.log("mon ersr", err);
      this.tb = null;
      this.loading = false; // ← ici, sinon le spinner reste bloqué
    },
    complete: () => {
      console.log("ok");
    },
  });
}



}
