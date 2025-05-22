import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { ClientserviceService } from '../../clientservice/clientservice.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cath',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './cath.component.html',
  styleUrl: './cath.component.scss'
})
export class CathComponent implements OnInit {
  ngOnInit(): void {
    this.getallcath()
  }

  constructor(private api:ClientserviceService,private router:Router){}

  data:any
  loading=false
  baseUrl = environment.apiUrl + '/';
  formatImagePath(path: string): string {
    return this.baseUrl + path.replace(/\\/g, '/');
  }

  getallcath(){
    this.loading=true
    this.api.AllCathe().subscribe({
      next:(res:any)=> {
        console.log("ma reponse",res);
        this.data = res.recup
        
      },
  
      error:(err:any)=> {
        console.log("mon eror",err);
     this.loading=false

        
      },
  
      complete:()=> {
        console.log("ok");
    this.loading=false

        
      },
    })
   }

   nav(id:any){
    this.router.navigate([`/client/souscath/${id}/19`])
   }



}
