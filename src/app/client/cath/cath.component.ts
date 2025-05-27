import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { ClientserviceService } from '../../clientservice/clientservice.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cath',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './cath.component.html',
  styleUrl: './cath.component.scss'
})
export class CathComponent implements OnInit {
  ngOnInit(): void {
    this.getallcath()
    this.tb =this.activate.snapshot.paramMap.get("tb")
    this.searchForm.get('searchTerm')?.valueChanges.subscribe(value => {
      this.filterData(value || '');
    });
  }

  constructor(private api:ClientserviceService,private router:Router,private activate:ActivatedRoute){}

  data:any
  filteredData: any[] = [];
  voixActive = false;
  tb:any
  loading=false
  baseUrl = environment.apiUrl + '/';
  searchForm = new FormGroup({
    searchTerm: new FormControl('')
  });
  formatImagePath(path: string): string {
    return this.baseUrl + path.replace(/\\/g, '/');
  }

  getallcath(){
    this.loading=true
    this.api.AllCathe().subscribe({
      next:(res:any)=> {
        console.log("ma reponse",res);
        this.data = res.recup
        this.filteredData = this.data;
        
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

   filterData(term: string): void {
    const search = term.toLowerCase();
    this.filteredData = this.data.filter((item:any) =>
      item.nom.toLowerCase().includes(search)
    );
  }

   nav(id:any){
    this.router.navigate([`/client/souscath/${id}/${this.tb}`])
    this.activerVoix()
   }



   activerVoix() {
    const test = new SpeechSynthesisUtterance("Bienvenue chez Restaux ! Nous sommes ravis de vous accueillir. Veuillez choisir une table pour commencer votre commande.");
    console.log('first read');
    
    test.lang = 'fr-FR';
    speechSynthesis.speak(test);

    this.voixActive = true;
  }



}
