import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  topRatingBooks: any[] = [];
  sortBy: 'lowToHigh' | 'highToLow' | '' = '';
  selectedCategories: Set<string> = new Set();
  showAllBooks = false;
  availableCategories: string[] = [];
  newestBooks: BookInterface[] = [];


  constructor(private searchService: SearchService, private booksService: BookDataService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.loadBooks();
    this.searchSub = this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term.toLowerCase();
    });

    this.booksService.getCategories().subscribe({
      next: (cats) => (this.availableCategories = cats),
      error: (err) => console.error('Failed to load categories', err),
    });

    this.booksService.getTopSalesBooks().subscribe(res => this.topSalesBooks = res.data);
    this.booksService.getTopRatedBooks().subscribe(res => this.topRatingBooks = res.data);
    this.booksService.getNewestBooks().subscribe(res => this.newestBooks = res.data);
  }
  ngOnDestroy() {
    this.searchSub.unsubscribe();
  }

  @ViewChild('newestScroll', { static: false }) newestScroll!: HTMLElement;
  @ViewChild('salesScroll', { static: false }) salesScroll!: HTMLElement;

  scrollRight(ref: HTMLElement) {
    ref.scrollBy({ left: 300, behavior: 'smooth' });
  }

  scrollLeft(ref: HTMLElement) {
    ref.scrollBy({ left: -300, behavior: 'smooth' });
  }



  loadBooks() {
    this.booksService.getAllBooks().subscribe({
      next: (res: any) => {
        if (Array.isArray(res.data)) {
          this.books = res.data;
          this.filteredBooks = [...this.books];
          this.totalPages = res.totalPages;
          this.currentPage = res.page;
          // this.setTopSalesBooks();
          // this.setTopRatingBooks();
          // this.setAvailableCategories(); 
          // this.setNewestBooks();

        }
      },
      error: (err) => {
        console.error('Error fetching books:', err);
      }
    });
  }
  //   setAvailableCategories() {
  //   const categoryMap = new Map<string, string>();

  //   this.books.forEach(book => {
  //     if (book.category) {
  //       const formatted = this.formatCategoryName(book.category);
  //       const lowerKey = formatted.toLowerCase();

  //       if (!categoryMap.has(lowerKey)) {
  //         categoryMap.set(lowerKey, formatted);
  //       }
  //     }
  //   });

  //   this.availableCategories = Array.from(categoryMap.values());
  // }

  // private formatCategoryName(category: string): string {
  //   return category
  //     .toLowerCase()
  //     .split('-')
  //     .map(part => part.charAt(0).toUpperCase() + part.slice(1))
  //     .join('-');
  // }
  // setTopSalesBooks() {
  //   this.topSalesBooks = [...this.books]
  //     .sort((a, b) => b.discount - a.discount)
  //     .slice(0, 7);
  // }
  // setTopRatingBooks() {
  //   this.topRatingBooks = [...this.books]
  //     .sort((a, b) => b.averageRating! - a.averageRating!)
  //     .slice(0, 4);
  // }


  // setNewestBooks() {
  //   this.newestBooks = [...this.books]
  //     .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  //     .slice(0, 5);
  // }
  onViewAllClick() {
    this.router.navigate(['/books']);

  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories.has(category);
  }

  addToCart(book: BookInterface) {
    console.log(`${book.title} added to cart`);
  }




}
