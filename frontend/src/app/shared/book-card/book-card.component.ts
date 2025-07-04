import { Component, Input } from '@angular/core';
import { BookInterface } from '../../core/interfaces/book-interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {
  @Input() book!: BookInterface;

    constructor(private router: Router) {}

  goToDetails() {
    this.router.navigate(['/books', this.book._id]);
  }

}
