import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { ClientserviceService } from '../../clientservice/clientservice.service';


@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.scss'
})
export class HistoriqueComponent implements OnInit {
  commandes: any[] = [];
  data:any
  statut:any
  loading=false
  baseUrl = environment.apiUrl + '/';
  emon_id:any;
  constructor(private api:ClientserviceService){}
  ngOnInit(): void {
    this.getcmmtby()
    console.log("dady");
    
  }


 formatImagePath(path: string): string {
    return this.baseUrl + path.replace(/\\/g, '/');
  }


  getcmmtby() {
    this.loading=true
  this.emon_id = localStorage.getItem("emon_id");

  this.api.getallcmdbyemonid(this.emon_id).subscribe({
    next: (res: any) => {
      this.statut=res.status
            console.log("Réponse brute :", res,"statut",this.statut);


      // Vérifie si res.commandes existe et est un objet
      if (res.commandes && Array.isArray(res.commandes)) {
      this.commandes = res.commandes.filter((cmd: any) => cmd.statut === 'Servie');
      console.log("Commandes filtrées :", this.commandes);
      } else {
       this.commandes = [];
      }


      console.log("Commandes transformées :", this.commandes,typeof(this.commandes));
    },
    error: (err: any) => {
      console.error("Erreur API :", err);
      this.commandes = [];
     this.loading=false

    },
    complete:()=> {
      this.loading=false
    },
  });
}

}


