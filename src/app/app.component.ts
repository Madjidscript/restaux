import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { HearderComponent } from "./includes/hearder/hearder.component";
import { FooterComponent } from './includes/footer/footer.component';
import { SoketserviceService } from './soketservice/soketservice.service';
import { SessionserviceService } from './sessionservice/sessionservice.service';
import { ClientserviceService } from './clientservice/clientservice.service';
import { CommonModule } from '@angular/common';
import { PushserviceService } from './pushservice/pushservice.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HearderComponent,FooterComponent,CommonModule,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'qrrextaux';
  message:any
  
  voixActive = false;
  notifdata:any
  isOpen: any;
  loading: boolean = false; // 🔹 Ajouté ici
  key: any;

  constructor(private socket:SoketserviceService ,private session:SessionserviceService,private api:ClientserviceService,private route:Router,private activate:ActivatedRoute,
    private pushNotificationService:PushserviceService
  ){}

  ngOnInit(): void {
    
    this.activate.queryParamMap.subscribe(params => {
    const fromScan = params.get('from');
    console.log("my from",fromScan);
    

    if (fromScan === 'scan') {
      this.clientid(); // on déclenche la génération du emon_id
    }
  });

  this.recupstatut()
  this.getstatut()

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
  
getstatut(){
  this.loading = true; // ✅ Une fois les données reçues, on autorise l’affichage

    this.api.gettatut().subscribe({
      next:(res:any)=> {
        console.log("mon satut response",res);
        this.isOpen = res.isOpen

        
      },
      error:(err:any)=> {
        console.log("mon err",err);
        this.loading = false; // ✅ Une fois les données reçues, on autorise l’affichage

      },
      complete:()=> {
        console.log("ok");
        this.loading = false; // ✅ Une fois les données reçues, on autorise l’affichage

        
      },
    })

  }

  getpushkey(){
  this.loading = true; // ✅ Une fois les données reçues, on autorise l’affichage

    this.pushNotificationService.getPublicKey().subscribe({
      next:(res:any)=> {
        console.log("mon satut response",res);
        this.key = res.publicKey

        
      },
      error:(err:any)=> {
        console.log("mon err",err);
        this.loading = false; // ✅ Une fois les données reçues, on autorise l’affichage

      },
      complete:()=> {
        console.log("ok");
        this.loading = false; // ✅ Une fois les données reçues, on autorise l’affichage

        
      },
    })

  }

  createsuscribe(emonid:any){
  this.loading = true; // ✅ Une fois les données reçues, on autorise l’affichage

    this.pushNotificationService.subscribeToPush({emon_id:emonid}).subscribe({
      next:(res:any)=> {
        console.log("mon satut response",res);
        // this.key = res.publicKey

        
      },
      error:(err:any)=> {
        console.log("mon err",err);
        this.loading = false; // ✅ Une fois les données reçues, on autorise l’affichage

      },
      complete:()=> {
        console.log("ok");
        this.loading = false; // ✅ Une fois les données reçues, on autorise l’affichage

        
      },
    })

  }


  recupstatut(){
    this.loading=true
    setTimeout(() => {
      this.socket.onMessage("statut",data=> {
      console.log("mon data socket state",data.statut.isOpen);
       this.isOpen=data.statut.isOpen

      

    }  )
    }, 500);
  }

  // clientid(){
  //  let emon_id = localStorage.getItem("emon_id");
  //  console.log("yy",emon_id)

  //  if (!emon_id) {
  // emon_id = crypto.randomUUID(); // ou une lib UUID
  // localStorage.setItem("emon_id", emon_id);
  // }
  // }


//   clientid() {
//   let emon_id = localStorage.getItem("emon_id");

//   if (!emon_id) {
//     emon_id = crypto.randomUUID(); 
//     localStorage.setItem("emon_id", emon_id);
//     console.log('Nouveau emon_id généré:', emon_id);
//   } else {
//     console.log('Ancien emon_id conservé:', emon_id);
//   }
// }


clientid() {
  // Gestion de emon_id
  let emon_id = localStorage.getItem("emon_id");
 
  if (!emon_id) {
    emon_id = crypto.randomUUID();
    localStorage.setItem("emon_id", emon_id);
    console.log('Nouveau emon_id généré:', emon_id);
    // this.pushNotificationService.subscribeToPush(emon_id);/ // abonne l'utilisateur
  // this.pushNotificationService.listenToMessages();
  } else {
    console.log('Ancien emon_id conservé:', emon_id);
    //  this.pushNotificationService.subscribeToPush(emon_id); // abonne l'utilisateur
    //  this.pushNotificationService.listenToMessages();
  }


  // Gestion de session_qr_id
  let session_qr_id = localStorage.getItem("session_qr_id");
  const now = Date.now();
  const expirationDuration = 90 * 60 * 1000; // 1h30 en millisecondes

  if (!session_qr_id) {
    const new_session_id = crypto.randomUUID();
    localStorage.setItem("session_qr_id", new_session_id);
    localStorage.setItem("session_qr_id_created_at", now.toString());
    console.log('session_qr_id créé:', new_session_id);

    // Planifie suppression dans 1h30
    setTimeout(() => {
      localStorage.removeItem("session_qr_id");
      localStorage.removeItem("session_qr_id_created_at");
      console.log("session_qr_id supprimé après 1h30");
    }, expirationDuration);

  } else {
    const createdAt = parseInt(localStorage.getItem("session_qr_id_created_at") || "0", 10);
    const elapsed = now - createdAt;

    if (elapsed > expirationDuration) {
      localStorage.removeItem("session_qr_id");
      localStorage.removeItem("session_qr_id_created_at");
      console.log("session_qr_id expiré et supprimé");
    } else {
      const remaining = expirationDuration - elapsed;
      console.log("session_qr_id encore valide pour", remaining / 1000, "secondes");

      // Planifie suppression dans le temps restant
      setTimeout(() => {
        localStorage.removeItem("session_qr_id");
        localStorage.removeItem("session_qr_id_created_at");
        console.log("session_qr_id supprimé après expiration restante");
        window.close();

      }, remaining);
    }
  }

    this.demanderLocalisation()
    this.getpushkey()
    this.createsuscribe(emon_id)
    this.pushNotificationService.listenToMessages()


}




 demanderLocalisation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log('Latitude :', latitude);
          console.log('Longitude :', longitude);
        },
        (error) => {
          console.error('Accès à la localisation refusé ou erreur :', error.message);
          alert("Veuillez activer la localisation pour utiliser cette fonctionnalité.");
        }
      );
    } else {
      console.error("La géolocalisation n'est pas supportée par ce navigateur.");
    }
  }


  
}
