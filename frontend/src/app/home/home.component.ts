import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BookInterface } from '../core/interfaces/book-interface';

import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SearchService } from '../core/services/search.service';
import { BookDataService } from '../core/services/book-data.service';
import { BookCardComponent } from '../shared/components/book-card/book-card.component';
import { ActivatedRoute, Router } from '@angular/router';

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
currentPage: number = 1;
totalPages: number = 1;
pageSize: number = 8;
books: BookInterface[] = [];
filteredBooks: BookInterface[] = [];
topSalesBooks: any[] = [];
sortBy: 'lowToHigh' | 'highToLow' | '' = '';
selectedCategories: Set<string> = new Set();
showAllBooks = false;
availableCategories: string[] = [];

  constructor(private searchService: SearchService , private booksService:BookDataService , private route: ActivatedRoute,
  private router: Router) {}

  ngOnInit() {
  this.loadBooks(this.currentPage);
  this.searchSub = this.searchService.searchTerm$.subscribe(term => {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  });
}
  ngOnDestroy() {
    this.searchSub.unsubscribe();
  }

@ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }
  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

loadBooks(page: number = 1) {
  this.booksService.getBooks(page).subscribe({
    next: (res: any) => {
      if (Array.isArray(res.data)) {
        this.books = res.data;
        this.filteredBooks = [...this.books];
        this.totalPages = res.totalPages;
        this.currentPage = res.page;
        this.setTopSalesBooks();
        this.setAvailableCategories(); 
        this.applyFilters(); 
      }
    },
    error: (err) => {
      console.error('Error fetching books:', err);
    }
  });
}

setAvailableCategories() {
  const categoryMap = new Map<string, string>();

  this.books.forEach(book => {
    if (book.category) {
      const formatted = this.formatCategoryName(book.category);
      const lowerKey = formatted.toLowerCase();

      if (!categoryMap.has(lowerKey)) {
        categoryMap.set(lowerKey, formatted);
      }
    }
  });

  this.availableCategories = Array.from(categoryMap.values());
}

private formatCategoryName(category: string): string {
  return category
    .toLowerCase()
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('-');
}


//=========================================================================

setTopSalesBooks() {
  this.topSalesBooks = [...this.books]
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 7);
}

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
        book.title.toLowerCase().includes(this.searchTerm)
      );
    }

    // Category filter
    if (this.selectedCategories.size > 0) {
  filtered = filtered.filter(book =>
    Array.from(this.selectedCategories).some(
      cat => cat.toLowerCase() === book.category.toLowerCase()
    )
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

  // onViewAllClick() {
  //   this.showAllBooks = true;
  // }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories.has(category);
  }

  addToCart(book: BookInterface) {
    console.log(`${book.title} added to cart`);
  }
}
