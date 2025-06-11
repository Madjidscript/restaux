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
    this.gettb()
     let emon_id = sessionStorage.getItem("emon_id");
   console.log("yy",emon_id)

    // this.getallcath()

    console.log("madjid",this.token,this.tb);
    
    this.searchForm.get('searchTerm')?.valueChanges.subscribe(value => {
      this.filterData(value || '');
    });
  }

  constructor(private api:ClientserviceService,private router:Router,private activate:ActivatedRoute){}

  data:any
  filteredData: any[] = [];
  voixActive = false;
  isReady = false;
  tb:any
  token:any
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
        // this.gettb()
        
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
    this.router.navigate([`/client/souscath/${id}/${this.token}`])
    this.activerVoix()
   

   }



   activerVoix() {
    // Vérifie si déjà activé dans sessionStorage
    const dejaActive = sessionStorage.getItem('voixActive');
  
    if (dejaActive === 'true') {
      console.log('Voix déjà activée, on ne répète pas.');
      return;
    }
  
    const message = new SpeechSynthesisUtterance("Bienvenue ! Nous sommes ravis de vous accueillir. Veuillez effectuer votre commande.");
    message.lang = navigator.language.startsWith('en') ? 'en-US' : 'fr-FR';
    
    speechSynthesis.speak(message);
  
    // Marque comme activée
    sessionStorage.setItem('voixActive', 'true');
    this.voixActive = true;
  }


  gettb(){
  this.loading = true;
    this.token =this.activate.snapshot.paramMap.get("tb")
  this.api.sigleqr(this.token).subscribe({
    next: (res: any) => {
      console.log("ma reponse depuis cath", res);
      this.tb = res.numeroTable;
      console.log("lidy",this.token);
      
      this.getallcath();
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
