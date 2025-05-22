import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client.component';
import { HomeComponent } from './home/home.component';
import { PanierComponent } from './panier/panier.component';
import { CathComponent } from './cath/cath.component';
import { SouscathComponent } from './souscath/souscath.component';

const routes: Routes = [
  {
    path:"",component:ClientComponent,
    children:[
      { path: "home/:tb", component: HomeComponent },
  { path: "panier/:tb", component: PanierComponent },
  { path: "cath/:tb", component: CathComponent },
  { path: "souscath/:id/:tb", component: SouscathComponent },
  { path: "**", redirectTo: "home/:tb" }  // redirection par défaut
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
