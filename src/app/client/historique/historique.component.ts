import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.scss'
})
export class HistoriqueComponent implements OnInit {
  commandes:any
  ngOnInit(): void {
    this.getcmmt()
    console.log("dady");
    
  }


  getcmmt(){
    
    this.commandes = [
  {
    _id: "663d7d12f1",
    num: "Table 4",
    total: "12000",
    statut: "livrée",
    date: "2024-06-07T12:30:00",
    data: [
      { nom: "Pizza", nbre: 2, prixIni: 3000 },
      { nom: "Coca", nbre: 1, prixIni: 1000 }
    ]
  }
];
  }
}
