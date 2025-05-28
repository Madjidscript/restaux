import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule,NavigationEnd } from '@angular/router';
import { PanierService } from '../../panierservice/panier.service';
import { filter } from 'rxjs/operators';
import { SessionserviceService } from '../../sessionservice/sessionservice.service';
import { SoketserviceService } from '../../soketservice/soketservice.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  totalQuantite: number = 0;
  tb:any
  message:any
  showContactPopup = false;
  showNoCommandePopup = false;
  idCommande: string | null = null; // à remplir dynamiquement




  constructor(private panierService: PanierService,private router: Router, private route: ActivatedRoute,private socket:SoketserviceService,private session:SessionserviceService) {}

  ngOnInit() {
    console.log("yesss");
    
    this.totalQuantite = this.panierService.getTotalQuantite();
    // console.log("mon index md",this.idCommande);
    

    // 🔄 Mettre à jour en temps réel
    this.panierService.panier$.subscribe(() => {
      this.totalQuantite = this.panierService.getTotalQuantite();
    });
    this.tbs()
  }

    



  tbs(){
  this.router.events
    .pipe(filter((event: any) => event instanceof NavigationEnd))
    .subscribe(() => {
      let activeRoute = this.route.root;
      while (activeRoute.firstChild) {
        activeRoute = activeRoute.firstChild;
      }

      const tb = activeRoute.snapshot.paramMap.get("tb");
      if (tb) {
        this.tb = tb;
        this.idCommande = this.session.getItem("notif").index

        console.log("✅ TB dans le footer :", this.tb);
      } else {
        console.warn("❌ Aucun paramètre 'tb' trouvé dans l'URL.");
      }
    });
}

  


  ouvrirPopup() {
    this.showContactPopup = true;
  
    // Émettre la demande de serveur ici (à ajuster selon ton implémentation Socket)
    this.socket.sendMessage("demande_serveur", { numeroTable: this.tb })

    this.socket.onMessage("retourdemande",(data)=>{
      console.log("data message",data);
      this.message = data.texte +'a la table '+ data.numeroTable

      const message = new SpeechSynthesisUtterance(this.message);
      message.lang = navigator.language.startsWith('en') ? 'en-US' : 'fr-FR';
    
      speechSynthesis.speak(message);
      
    })
  }
  
  fermerPopup() {
    this.showContactPopup = false;
  }


  

handleSuiviClick() {
  if (!this.idCommande) {
    this.showNoCommandePopup = true;
  } else {
    this.router.navigate(['/client/suivie', this.idCommande, this.tb]);
  }
}

  

}
