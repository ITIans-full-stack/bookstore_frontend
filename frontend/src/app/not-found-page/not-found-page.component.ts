import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.css'
})
export class NotFoundPageComponent {

}
