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


  constructor(private panierService: PanierService,private router: Router, private route: ActivatedRoute,private socket:SoketserviceService) {}

  ngOnInit() {
    console.log("yesss");
    
    this.totalQuantite = this.panierService.getTotalQuantite();

    // 🔄 Mettre à jour en temps réel
    this.panierService.panier$.subscribe(() => {
      this.totalQuantite = this.panierService.getTotalQuantite();
    });
    this.tbs()
  }


  tbs(){
    this.router.events
          .pipe(filter((event:any) => event instanceof NavigationEnd))
          .subscribe(() => {
            // Traverse la route active pour trouver le paramètre `tb`
            let activeRoute = this.route.root;
            while (activeRoute.firstChild) {
              activeRoute = activeRoute.firstChild;
            }
    
            this.tb = activeRoute.snapshot.paramMap.get('tb');
            console.log("TB dans le footer :", this.tb);
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

  

}
