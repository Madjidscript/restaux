import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
  token:any
  tb:any
  statut:any
  loading=false
  baseUrl = environment.apiUrl + '/';
  emon_id:any;
  constructor(private api:ClientserviceService, private activate:ActivatedRoute){}
  ngOnInit(): void {
    this.activate.paramMap.subscribe(params => {
    this.token = params.get('tb'); // tb

    console.log("TOKEN :", this.token);

    this.gettb();
    // this.getallcmd();
  });

    this.getcmmtby()
    
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


gettb(){
  this.loading = true;
    this.token =this.activate.snapshot.paramMap.get("tb")
  this.api.sigleqr(this.token).subscribe({
    next: (res: any) => {
      console.log("ma reponse depuis suivie", res);
      this.tb = res.numeroTable;
      // this.message = res?.message
      console.log("lidy",this.token);
      // this.emon_id = localStorage.getItem("emon_id");

      
      


    },
    error: (err: any) => {
      console.log("mon ersr", err);
      this.tb = null;
      this.loading = false; // ← ici, sinon le spinner reste bloqué
    },
    complete: () => {
      console.log("ok");
    },
  });
}




}


