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
  notifdata:any
  constructor(private socket:SoketserviceService ,private session:SessionserviceService){}

  ngOnInit(): void {
    this.notifdata = this.session.getItem("notif")
    console.log("ma notif",this.notifdata);

    
    this.socket.onMessage("notification", data => {
      console.log("mon message depuis le socket backend111", data);

      console.log("notifdata.num =", this.notifdata.num);
console.log("data.num =", data.num);
console.log("notifdata.index =", this.notifdata.index);
console.log("data.index =", data.index);
console.log("data.type =", data.type);
      
      if (this.notifdata.num == data.num && this.notifdata.index ==data.index && data.type=="valider" ) {
        console.log("mon message depuis le socket backend222", data);
        this.message = data.message;

        const notifStr = sessionStorage.getItem('notif');
        if (notifStr) {
           const notif = JSON.parse(notifStr);
          // 2. Ajouter un message dans le tableau 'message'
          notif.message.push(this.message); // 'this.message' contient ton message à ajouter
          // 3. Réenregistrer dans le sessionStorage
          sessionStorage.setItem('notif', JSON.stringify(notif));
        }
      
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
    
          // Planifie la prochaine lecture
          setTimeout(speakMessage, intervalTime);
        }
      };
    
      speakMessage(); // Démarrer la lecture
      
     }
     
    });
   
  }
  

  
}
