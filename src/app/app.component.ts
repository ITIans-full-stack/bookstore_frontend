import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookDetailsComponent } from "./book-details/book-details.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BookDetailsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'online-bookstore';
}
