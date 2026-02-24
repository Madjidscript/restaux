import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SoketserviceService } from '../../soketservice/soketservice.service';
import { SessionserviceService } from '../../sessionservice/sessionservice.service';
import { CommonModule } from '@angular/common';
import { ClientserviceService } from '../../clientservice/clientservice.service';
import { ElementRef, ViewChild } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-hearder',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './hearder.component.html',
  styleUrl: './hearder.component.scss'
})
export class HearderComponent implements OnInit{
    @ViewChild('toastElement') toastEl!: ElementRef;

  tb:any
  token:any
  length:any =0
  message:any
  statut:any
  message2:any
  loading=false
  showNotifPopup = false;
  firstNotif = true; // au début
  tableInvalide = false;
  showContactPopup = false;





  
  voixActive = false;
  notifdata:any
  tokenactive: any;
  // url: string="";
  constructor(private router: Router, private route: ActivatedRoute,private socket:SoketserviceService,private session:SessionserviceService,private api:ClientserviceService,private activate :ActivatedRoute ){}
 

  ngOnInit() {
    this.loading = true
    this.taille(); // écoute des notifications
    this.checkScroll();


  
     this.router.events
      .pipe(filter((event:any) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Traverse la route active pour trouver le paramètre `tb`
        let activeRoute = this.route.root;
        while (activeRoute.firstChild) {
          activeRoute = activeRoute.firstChild;
        }
 
        this.token = activeRoute.snapshot.paramMap.get("tb");
        
      this.gettb(); 

    if (this.tb) {
      console.log("tok1",this.token,"tb1",this.tb);
      // Récupérer le numéro de table
    } else if(!this.tb) {
      // this.tb = null;
      this.tableInvalide = true;
      this.loading = false;
      console.log("tok2",this.token,this.tb);
      
    }
  });
}



  taille() {
    this.session.notif$.subscribe((data: any) => {
      this.notifdata = data;
      this.length = data?.notiflength || 0;
      console.log('Longueur des notifications (header) :', this.length);
    });
  }
  

  


  notif() {
    this.message = this.notifdata?.message?.at(-1) || "Pas de notification";
    if (this.firstNotif && this.notifdata.message.length === 1) {
      console.log("Première notification reçue");
      this.firstNotif = false; // Ne plus l'afficher après
      // this.lireVoix(this.message);
    }
   
    this.showNotifPopup = true;
  }


  lireVoix(msg: string) {
    const duration = 2000;
    const intervalTime = 1000;
    const startTime = Date.now();
  
    const speakMessage = () => {
      const now = Date.now();
      if (now - startTime < duration) {
        const utterance = new SpeechSynthesisUtterance(msg);
        utterance.lang = 'fr-FR';
        speechSynthesis.speak(utterance);
        console.log('Lecture effectuée');
        setTimeout(speakMessage, intervalTime);
      }
    };
  
    speakMessage();
  }

     fermerPopup() {
      this.showNotifPopup = false;
    }
     

    
 

   gettb() {
  this.loading = true;
  this.tableInvalide = false;
  
  this.api.sigleqr(this.token).subscribe({
    next: (res: any) => {
      console.log("Réponse headers :", res);
      this.statut = res?.status;
      this.message2 = res?.message;
      this.tokenactive = res?.tokenactive
      // this.url = `https://restaux-mmds.vercel.app/client/cath/${this.tokenactive}?from=scan`;

      console.log("le message2",this.message2);
      
      this.tb = res?.numeroTable;
    },
    error: (err: any) => {
      console.error("Erreur header :", err);
      this.tb = null;
      this.tableInvalide = true;
    },
    complete: () => {
      this.loading = false;
    },
  });
}



recupstatut() {
    this.session.notif$.subscribe((data: any) => {
      this.notifdata = data;
      this.statut = data?.statut 
      console.log('mon statut :', this.statut);
    });
  }
  

  reload(){
    window.location.reload();
  }


  ouvrirPopup() {
  this.showContactPopup = true;

  setTimeout(() => {
    if (this.toastEl) {
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(this.toastEl.nativeElement);
      toastBootstrap.show();
    }
  });

  // 🔥 envoyer la demande serveur
  this.socket.sendMessage("demande_serveur", {
    numeroTable: this.tb
  });

  // 🔥 écouter la réponse
  this.socket.onMessage("retourdemande", (data) => {
    this.message = data.texte + ' à la table ' + data.numeroTable;

    const msg = new SpeechSynthesisUtterance(this.message);
    msg.lang = navigator.language.startsWith('en') ? 'en-US' : 'fr-FR';
    speechSynthesis.speak(msg);
  });
}

fermerPopupcontact() {
  this.showContactPopup = false;
}

ngOnChanges() {
  this.checkScroll();
}

checkScroll() {
  if (!this.loading && (this.statut === '403' || (this.tableInvalide && !this.tb))) {
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }
}

}
