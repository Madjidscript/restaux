import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { PanierService } from '../../panierservice/panier.service';
import { ClientserviceService } from '../../clientservice/clientservice.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.scss'
})
export class PanierComponent implements OnInit {

 promoMessage: string = '';
  couponValide: boolean = false;
  reduction: number = 0;
  reductionPourcentage: boolean = false;
  reductionAmount: number = 0;
  codePromoControl = new FormControl('');

  cartItems: any[] = [];
  token: any;
  loading = false;
  subtotal: number = 0;
  total: number = 0;
  baseUrl = environment.apiUrl + '/';
  totalQuantite: number = 0;

  private isUpdatingPromoInput = false;

  constructor(
    private panierService: PanierService,
    private router: Router,
    private activate: ActivatedRoute,
    private api: ClientserviceService
  ) {}

  formatImagePath(path: string): string {
    return this.baseUrl + path.replace(/\\/g, '/');
  }

  ngOnInit(): void {
    this.token = this.activate.snapshot.paramMap.get("tb");

    this.loadCart();

    this.codePromoControl.valueChanges.subscribe((code: any) => {
      if (this.isUpdatingPromoInput) return;
      this.promoMessage = '';
      this.couponValide = false;
      this.clearReduction();
    });
  }

  loadCart(): void {
    this.loading = true;
    setTimeout(() => {
      const storedCart = sessionStorage.getItem('panier');
      this.cartItems = storedCart ? JSON.parse(storedCart) : [];

      this.updateTotals();

      // Appliquer automatiquement une réduction si déjà présente
      const storedCodePromo = sessionStorage.getItem('codePromo');
      const storedReductionData = sessionStorage.getItem('reductionData');

      if (storedCodePromo && storedReductionData) {
        this.isUpdatingPromoInput = true;
        this.codePromoControl.setValue(storedCodePromo, { emitEvent: false });
        this.isUpdatingPromoInput = false;

        const reductionObj = JSON.parse(storedReductionData);
        this.reduction = reductionObj.reduction;
        this.reductionPourcentage = reductionObj.isPercentage;

        this.couponValide = true;
        this.applyReduction(this.reduction, this.reductionPourcentage);

        this.promoMessage = `✅ Code promo ${storedCodePromo} déjà appliqué`;
      }

      this.loading = false;
    }, 500);
  }

  updateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.prix_total, 0);
    this.updateTotalWithReduction();
    this.totalQuantite = this.cartItems.reduce((sum, item) => sum + item.quantite, 0);
  }

  increase(item: any): void {
    item.quantite++;
    item.prix_total = item.quantite * item.prix_unitaire;
    this.saveAndRefresh();
    this.applyReduction(this.reduction, this.reductionPourcentage);
  }

  decrease(item: any): void {
    if (item.quantite > 1) {
      item.quantite--;
      item.prix_total = item.quantite * item.prix_unitaire;
      this.saveAndRefresh();
      this.applyReduction(this.reduction, this.reductionPourcentage);
    }
  }

  remove(item: any): void {
    this.cartItems = this.cartItems.filter(p => p.nom !== item.nom);
    this.saveAndRefresh();
  }

  saveAndRefresh(): void {
    sessionStorage.setItem('panier', JSON.stringify(this.cartItems));
    this.updateTotals();
    this.panierService.refreshPanier();
  }

  validerCommande() {
    this.router.navigate(['/client/validation', this.token]);
    console.log('pepepe', this.token);
  }

  appliquerCodePromo() {
    const code = this.codePromoControl.value?.trim();

    if (!code) {
      this.promoMessage = 'Veuillez entrer un code promo.';
      return;
    }

    const codeActuel = sessionStorage.getItem('codePromo');
    if (codeActuel && codeActuel !== code) {
      this.promoMessage = "Un autre code promo est déjà appliqué. Supprimez-le d'abord.";
      return;
    }

    this.api.verifcoupon(code).subscribe({
      next: (response: any) => {
        if (response.success && response.coupon) {
          const coupon = response.coupon;

          this.couponValide = true;
          this.reduction = coupon.reduction;
          this.reductionPourcentage = coupon.isPercentage;

          this.applyReduction(this.reduction, this.reductionPourcentage);

          this.promoMessage = `✅ Code appliqué : réduction de ${this.reduction}${this.reductionPourcentage ? '%' : '$'}`;

          sessionStorage.setItem('codePromo', code);
          sessionStorage.setItem('reductionData', JSON.stringify({
            reduction: coupon.reduction,
            isPercentage: coupon.isPercentage,
            totalwithreduct: this.total
          }));
        } else {
          this.promoMessage = response.message || "❌ Code promo invalide.";
        }
      },
      error: (err: any) => {
        this.promoMessage = "❌ Une erreur est survenue. Vérifiez votre connexion.";
        this.clearPromo();
      }
    });
  }

  applyReduction(value: number, isPercentage: boolean) {
    if (isPercentage) {
      this.reductionAmount = (this.subtotal * value) / 100;
    } else {
      this.reductionAmount = value;
    }
    this.updateTotalWithReduction();

    const codePromo = this.codePromoControl.value?.trim() || '';
    sessionStorage.setItem('codePromo', codePromo);
    sessionStorage.setItem('reductionData', JSON.stringify({
      reduction: value,
      isPercentage: isPercentage,
      totalwithreduct: this.total
    }));
  }

  updateTotalWithReduction() {
    this.total = this.subtotal - this.reductionAmount;
    if (this.total < 0) this.total = 0;
  }

  clearReduction() {
    this.reduction = 0;
    this.reductionPourcentage = false;
    this.reductionAmount = 0;
    this.updateTotalWithReduction();
  }

  clearPromo() {
    this.promoMessage = '';
    this.couponValide = false;
    this.clearReduction();

    sessionStorage.removeItem('codePromo');
    sessionStorage.removeItem('reductionData');

    this.codePromoControl.setValue('', { emitEvent: false });
  }
}
