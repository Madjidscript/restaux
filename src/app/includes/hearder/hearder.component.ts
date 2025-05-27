import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SoketserviceService } from '../../soketservice/soketservice.service';
import { SessionserviceService } from '../../sessionservice/sessionservice.service';

@Component({
  selector: 'app-hearder',
  standalone: true,
  imports: [RouterModule,],
  templateUrl: './hearder.component.html',
  styleUrl: './hearder.component.scss'
})
export class HearderComponent implements OnInit{
  tb:any
  length:any =0
  message:any
  
  voixActive = false;
  notifdata:any
  constructor(private router: Router, private route: ActivatedRoute,private socket:SoketserviceService,private session:SessionserviceService ){}
  ngOnInit() {
    // Écoute les changements de route
    this.router.events
      .pipe(filter((event:any) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Traverse la route active pour trouver le paramètre `tb`
        let activeRoute = this.route.root;
        while (activeRoute.firstChild) {
          activeRoute = activeRoute.firstChild;
        }

        this.tb = activeRoute.snapshot.paramMap.get('tb');
        console.log("TB dans le header :", this.tb);
        this.taille()
      });

     
  }

  taille(){
    const notifStr = sessionStorage.getItem('notif');
        if (notifStr) {
           const notif = JSON.parse(notifStr);
          // 2. Ajouter un message dans le tableau 'message'
           console.log("ma notif length",this.length);
          return this.length =notif.notiflength;
          ;
     
          
        }
  }


  notif(){
    this.notifdata = this.session.getItem("notif")
    console.log("ma notif",this.notifdata);
    this.message = this.notifdata.message;

      // Durée totale de vocalisation (en millisecondes)
      const duration = 3000;
      const intervalTime = 1000; // délai entre chaque répétition
      const startTime = Date.now();
    
      const speakMessage = () => {
        const now = Date.now();
        if (now - startTime < duration) {
          const utterance = new SpeechSynthesisUtterance(this.message);
          utterance.lang = 'fr-FR';
          speechSynthesis.speak(utterance);
          console.log('lecture effectuer');
          
    
          // Planifie la prochaine lecture
          setTimeout(speakMessage, intervalTime);
        }
      };
    
      speakMessage(); // Démarrer la lecture
      
     }
     
 


}
