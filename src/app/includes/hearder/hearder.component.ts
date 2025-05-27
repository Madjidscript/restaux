import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SoketserviceService } from '../../soketservice/soketservice.service';
import { SessionserviceService } from '../../sessionservice/sessionservice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hearder',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './hearder.component.html',
  styleUrl: './hearder.component.scss'
})
export class HearderComponent implements OnInit{
  tb:any
  length:any =0
  message:any
  showNotifPopup = false;
  
  voixActive = false;
  notifdata:any
  constructor(private router: Router, private route: ActivatedRoute,private socket:SoketserviceService,private session:SessionserviceService ){}
  ngOnInit() {
    // Écoute les changements de route
    this.taille()
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
        
      });

     
  }

  taille(){
    this.length = this.session.notiflength();

    // 🔄 Mettre à jour en temps réel
    this.session.notif$.subscribe(() => {
      this.length = this.session.notiflength();
    });
  }


  notif() {
    this.notifdata = this.session.getItem("notif");
  
    if (!this.notifdata || !this.notifdata.message || this.notifdata.message.length === 0) {
      alert("Aucune notification disponible.");
      return;
    }
  
    this.message = this.notifdata.message.at(-1); // dernière notification
  
    this.lireVoix(this.message);
    this.showNotifPopup = true;
  }


  lireVoix(msg: string) {
    const duration = 3000;
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
     
 


}
