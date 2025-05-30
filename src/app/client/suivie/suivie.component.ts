import { Component, OnInit } from '@angular/core';
import { ClientserviceService } from '../../clientservice/clientservice.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SoketserviceService } from '../../soketservice/soketservice.service';
import { SessionserviceService } from '../../sessionservice/sessionservice.service';

@Component({
  selector: 'app-suivie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suivie.component.html',
  styleUrl: './suivie.component.scss'
})
export class SuivieComponent implements OnInit {
  loading=false 
  data:any
  data2:any
  index:any
  length:any
  statut="en_attente";
  notifdata: any;

  progressWidth: string = '0%';
  ngOnInit(): void {
    this.getallcmd()
    
    
    

   
    
  }

  constructor(private api:ClientserviceService,private activate:ActivatedRoute,private session:SessionserviceService ){}


  recupstatut() {
    this.session.notif$.subscribe((data: any) => {
      this.notifdata = data;
      this.statut = data?.statut 
      console.log('mon statut :', this.statut);
      this.updateProgress()
    });
  }


  getallcmd() {
    this.loading = true;
  
    this.api.AllCommande().subscribe({
      next: (res: any) => {
        this.index = this.activate.snapshot.paramMap.get("id")
        this.recupstatut()
        console.log("mon indes",this.index);
        this.data = res;
        console.log("reste hoo", this.data);
      
        // 1. Filtrer les commandes valides
        const commandesValides = this.data.filter((item: any) =>
          item.statut === "en_attente" || item.statut === "en_preparation" 
        );
      
        // 2. Trouver l’index réel de la commande cible via UID (this.index est un ID, pas un index numérique)
        const position = commandesValides.findIndex((cmd: any) => cmd.index == this.index);
      
        // 3. Si la commande est trouvée
        if (position >= 0) {
          this.data2 = commandesValides.slice(0, position); // commandes avant ma commande
          this.length = this.data2.length; // 4. Nombre de commandes avant
        } else {
          this.data2 = [];
          this.length = 0;
        }
         },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des commandes :', err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
    
  }


  updateProgress() {
    switch (this.statut) {
      case 'en_attente':
        this.progressWidth = '0%';
        break;
      case 'en_preparation':
        this.progressWidth = '50%';
        break;
      case 'Servie':
        this.progressWidth = '100%';
        break;
      default:
        this.progressWidth = '0%';
    }
  }
  

}
