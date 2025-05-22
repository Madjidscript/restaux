import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HearderComponent } from '../includes/hearder/hearder.component';
import { FooterComponent } from '../includes/footer/footer.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {

}
