import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule,NavigationEnd } from '@angular/router';
import { PanierService } from '../../panierservice/panier.service';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  totalQuantite: number = 0;
  tb:any

  constructor(private panierService: PanierService,private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    console.log("yesss");
    
    this.totalQuantite = this.panierService.getTotalQuantite();

    // 🔄 Mettre à jour en temps réel
    this.panierService.panier$.subscribe(() => {
      this.totalQuantite = this.panierService.getTotalQuantite();
    });
    this.tbs()
  }


  tbs(){
    this.router.events
          .pipe(filter((event:any) => event instanceof NavigationEnd))
          .subscribe(() => {
            // Traverse la route active pour trouver le paramètre `tb`
            let activeRoute = this.route.root;
            while (activeRoute.firstChild) {
              activeRoute = activeRoute.firstChild;
            }
    
            this.tb = activeRoute.snapshot.paramMap.get('tb');
            console.log("TB dans le header :", this.tb);
          });
  }

}
