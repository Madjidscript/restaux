import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HearderComponent } from "./includes/hearder/hearder.component";
import { FooterComponent } from './includes/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HearderComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'qrrextaux';

  
}
