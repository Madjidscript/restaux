import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HearderComponent } from "./includes/hearder/hearder.component";
import { FooterComponent } from './includes/footer/footer.component';
import { SoketserviceService } from './soketservice/soketservice.service';
import { SessionserviceService } from './sessionservice/sessionservice.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HearderComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'qrrextaux';
  message:any
  
  voixActive = false;
  notifdata:any
  constructor(private socket:SoketserviceService ,private session:SessionserviceService){}

  ngOnInit(): void {
    this.notifdata = this.session.getItem('notif');
    console.log("ma notif",this.notifdata);

    
    this.socket.onMessage("notification", data => {
      console.log("mon message depuis le socket backend111", data);

      const notifStr = sessionStorage.getItem("notif");
      if (!notifStr) return; 

      const notifdata = JSON.parse(notifStr); // pas this.notifdata ici
      console.log("notifdata.num =", notifdata.num);
      console.log("data.num =", data.num);
      console.log("notifdata.index =", notifdata.index);
      console.log("data.index =", data.index);
      console.log("data.type =", data.type);
      
      if (notifdata.num == data.num && notifdata.index ==data.index && data.type=="valider" ) {
        console.log("mon message depuis le socket backend222", data);
        this.message = data.message;

        const notifStr = sessionStorage.getItem('notif');
        if (notifStr) {
          const notif = JSON.parse(notifStr);
          notif.message.push(this.message);
          notif.statut=data.statut;
          notif.notiflength = notif.message.length;
        
          // Mets à jour sessionStorage
          sessionStorage.setItem('notif', JSON.stringify(notif));
        
          // Mets à jour le BehaviorSubject pour réveiller le header
          this.session.setNotif(notif); // 🔁 AJOUT ESSENTIEL
        }
      
      // Durée totale de vocalisation (en millisecondes)
      const duration = 2000;
      const intervalTime = 1000; // délai entre chaque répétition
      const startTime = Date.now();
    
      const speakMessage = () => {
        const now = Date.now();
        if (now - startTime < duration) {
          const utterance = new SpeechSynthesisUtterance(this.message);
          utterance.lang = 'fr-FR';
          speechSynthesis.speak(utterance);
    
          // Planifie la prochaine lecture
          setTimeout(speakMessage, intervalTime);
        }
      };
    
      speakMessage(); // Démarrer la lecture
      
     }
     
    });
   
  }


  

  activerVoix() {
    const test = new SpeechSynthesisUtterance("Notifications vocales activées");
    test.lang = 'fr-FR';
    speechSynthesis.speak(test);

    this.voixActive = true;
    
  }
  

  
}
