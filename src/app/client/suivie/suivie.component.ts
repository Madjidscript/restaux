import { Component, OnInit } from '@angular/core';
import { ClientserviceService } from '../../clientservice/clientservice.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  statut: any;
  ngOnInit(): void {
    // this.getallcmd()
    this.index = this.activate.snapshot.paramMap.get("id")

    // this.api.detailcmmdbyindex(this.index).subscribe((commande: any) => {
    //   this.statut = commande.statut;
    //   console.log("Statut de la commande :", this.statut);
    // });
    
  }

  constructor(private api:ClientserviceService,private activate:ActivatedRoute){}


  // getallcmd() {
  //   this.loading = true;
  
  //   this.api.AllCommande().subscribe({
  //     next: (res: any) => {
  //       this.data = res;
    
  //       // Filtrer uniquement les commandes valides
  //       const commandesValides = this.data.filter((item: any) =>
  //         item.statut === "en_attente" || item.statut === "en_preparation"
  //       );
    
  //       // Trouver l’index réel de la commande cible
  //       const position = commandesValides.findIndex((cmd: any) => cmd.id === this.index);
    
  //       if (position >= 0) {
  //         // Garder les commandes avant celle-là
  //         this.data2 = commandesValides.slice(0, position);
  //       } else {
  //         // Si l’id n’existe pas, on garde tout
  //         this.data2 = commandesValides;
  //         this.length = this.data.length
  //       }
    
  //       console.log("Commandes avant la mienne :", this.data2);
    
       
  //     },
  //     error: (err: any) => {
  //       console.error('Erreur lors de la récupération des commandes :', err);
  //       this.loading = false;
  //     },
  //     complete: () => {
  //       this.loading = false;
  //     }
  //   });
    
  // }
  

}
