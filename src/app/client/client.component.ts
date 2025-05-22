import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HearderComponent } from '../includes/hearder/hearder.component';
import { FooterComponent } from '../includes/footer/footer.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent implements OnInit {
  constructor(private activate:ActivatedRoute){}
  tb: any;
  ngOnInit(): void {
    this.tb = this.activate.snapshot.paramMap.get("tb")
    console.log("mon tbfff",this.tb);
  }

}
