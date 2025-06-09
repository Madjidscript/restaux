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
  commandes:any
  data:any
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


  getcmmtby(){
    this.emon_id = localStorage.getItem("emon_id");

    this.api.getallcmdbyemonid(this.emon_id).subscribe({
      next:(res:any)=>  {
        console.log("mon api",res);
        this.commandes = res.commandes
      },
      error:(err:any)=> {
        console.log("mon err",err);
        
      },
    })
  
}
}


