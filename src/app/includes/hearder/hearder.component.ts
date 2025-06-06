import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SoketserviceService } from '../../soketservice/soketservice.service';
import { SessionserviceService } from '../../sessionservice/sessionservice.service';
import { CommonModule } from '@angular/common';
import { ClientserviceService } from '../../clientservice/clientservice.service';

@Component({
  selector: 'app-hearder',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './hearder.component.html',
  styleUrl: './hearder.component.scss'
})
export class HearderComponent implements OnInit{
  tb:any
  token:any
  length:any =0
  message:any
  showNotifPopup = false;
  firstNotif = true; // au début

  
  voixActive = false;
  notifdata:any
  constructor(private router: Router, private route: ActivatedRoute,private socket:SoketserviceService,private session:SessionserviceService,private api:ClientserviceService ){}
  ngOnInit() {
    
    
    this.router.events
      .pipe(filter((event:any) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Traverse la route active pour trouver le paramètre `tb`
        let activeRoute = this.route.root;
        while (activeRoute.firstChild) {
          activeRoute = activeRoute.firstChild;
        }

        this.token = activeRoute.snapshot.paramMap.get("tb");
        console.log("TB dans le header :", this.tb);
        this.taille()
        this.gettb()
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
     

    gettb(){
      this.api.sigleqr(this.token).subscribe({
        next:(res:any)=>{
          console.log("ma reponse depuis hearder",res);
          this.tb = res.numeroTable
          
        },
        error:(err:any)=> {
         console.log("mon err hearder",err);
          
        },
        complete() {
          console.log("ok");
          
        },
      })
    }
 


}
