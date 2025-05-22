import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-hearder',
  standalone: true,
  imports: [RouterModule,],
  templateUrl: './hearder.component.html',
  styleUrl: './hearder.component.scss'
})
export class HearderComponent implements OnInit{
  tb:any
  constructor(private router: Router, private route: ActivatedRoute){}
  ngOnInit() {
    // Écoute les changements de route
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
