import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookInterface } from '../core/interfaces/book-interface';
import { BookCardComponent } from '../shared/book-card/book-card.component';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SearchService } from '../core/services/search.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BookCardComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {


searchTerm = '';
  private searchSub!: Subscription;

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.searchSub = this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term.toLowerCase();
      this.applyFilters();
    });
  }

  ngOnDestroy() {
    this.searchSub.unsubscribe();
  }

  books: BookInterface[] = [
  { name: 'The Great Gatsby', image: '../../assets/book-covers/book-1.webp', price: 10, originalPrice: 15, discount: 33, rating: 95, category: 'Fiction' },
  { name: 'Sapiens', image: '../../assets/book-covers/book-1.webp', price: 20, originalPrice: 25, discount: 20, rating: 98, category: 'Non-Fiction' },
  { name: 'Dune', image: '../../assets/book-covers/book-1.webp', price: 15, originalPrice: 20, discount: 25, rating: 97, category: 'Sci-Fi' },
  { name: '1984', image: '../../assets/book-covers/book-1.webp', price: 12, originalPrice: 18, discount: 33, rating: 96, category: 'Fiction' },
  { name: 'Educated', image: '../../assets/book-covers/book-1.webp', price: 18, originalPrice: 24, discount: 25, rating: 94, category: 'Non-Fiction' },
  { name: 'Brave New World', image: '../../assets/book-covers/book-1.webp', price: 14, originalPrice: 20, discount: 30, rating: 93, category: 'Fiction' },
  { name: 'Foundation', image: '../../assets/book-covers/book-1.webp', price: 16, originalPrice: 22, discount: 27, rating: 95, category: 'Sci-Fi' },
  { name: 'Atomic Habits', image: '../../assets/book-covers/book-1.webp', price: 22, originalPrice: 28, discount: 21, rating: 97, category: 'Non-Fiction' },
  { name: 'To Kill a Mockingbird', image: '../../assets/book-covers/book-1.webp', price: 13, originalPrice: 17, discount: 24, rating: 98, category: 'Fiction' },
  { name: 'The Martian', image: '../../assets/book-covers/book-1.webp', price: 17, originalPrice: 23, discount: 26, rating: 96, category: 'Sci-Fi' },
  { name: 'Becoming', image: '../../assets/book-covers/book-1.webp', price: 21, originalPrice: 30, discount: 30, rating: 92, category: 'Non-Fiction' },
  { name: 'Fahrenheit 451', image: '../../assets/book-covers/book-1.webp', price: 11, originalPrice: 16, discount: 31, rating: 94, category: 'Fiction' },
  { name: 'Hyperion', image: '../../assets/book-covers/book-1.webp', price: 19, originalPrice: 25, discount: 24, rating: 95, category: 'Sci-Fi' },
  { name: 'Man’s Search for Meaning', image: '../../assets/book-covers/book-1.webp', price: 18, originalPrice: 22, discount: 18, rating: 99, category: 'Non-Fiction' },
  { name: 'The Catcher in the Rye', image: '../../assets/book-covers/book-1.webp', price: 14, originalPrice: 20, discount: 30, rating: 91, category: 'Fiction' },
  { name: 'Neuromancer', image: '../../assets/book-covers/book-1.webp', price: 16, originalPrice: 21, discount: 24, rating: 93, category: 'Sci-Fi' }
];


  filteredBooks: BookInterface[] = [...this.books];
  // searchTerm = '';
  sortBy: 'lowToHigh' | 'highToLow' | '' = '';
  selectedCategories: Set<string> = new Set();
  showAllBooks = false;
  availableCategories = ['Fiction', 'Non-Fiction', 'Sci-Fi'];

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value.toLowerCase();
    this.applyFilters();
  }

  onSortChange(sortType: 'lowToHigh' | 'highToLow') {
    if (this.sortBy === sortType) {
      this.sortBy = ''; // toggle off
    } else {
      this.sortBy = sortType;
    }
    this.applyFilters();
  }

  onCategoryChange(category: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedCategories.add(category);
    } else {
      this.selectedCategories.delete(category);
    }
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.books];

    // Search
    if (this.searchTerm) {
      filtered = filtered.filter(book =>
        book.name.toLowerCase().includes(this.searchTerm)
      );
    }

    // Category filter
    if (this.selectedCategories.size > 0) {
      filtered = filtered.filter(book =>
        this.selectedCategories.has(book.category)
      );
    }

    // Sorting
    if (this.sortBy === 'lowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'highToLow') {
      filtered.sort((a, b) => b.price - a.price);
    }

    this.filteredBooks = filtered;
  }

  onViewAllClick() {
    this.showAllBooks = true;
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories.has(category);
  }

  addToCart(book: BookInterface) {
    console.log(`${book.name} added to cart`);
  }
}
