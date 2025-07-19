import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BookInterface } from '../core/interfaces/book-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../core/services/search.service';
import { BookDataService } from '../core/services/book-data.service';
import { Subscription } from 'rxjs';
import { CommonModule, ViewportScroller } from '@angular/common';
import { BookCardComponent } from '../shared/components/book-card/book-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-books-page',
  standalone: true,
  imports: [CommonModule, BookCardComponent, FormsModule],
  templateUrl: './books-page.component.html',
  styleUrl: './books-page.component.css'
})
export class BooksPageComponent implements OnInit, OnDestroy {

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
availableAuthors: string[] = [];
selectedAuthors: Set<string> = new Set();

  constructor(private searchService: SearchService , private booksService:BookDataService , private route: ActivatedRoute,
  private router: Router, private viewportScroller: ViewportScroller,private renderer: Renderer2) {}

  ngOnInit() {
  this.loadBooks(this.currentPage , this.pageSize);
  this.searchSub = this.searchService.searchTerm$.subscribe(term => {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  });
  this.booksService.getCategories().subscribe({
      next: (cats) => (this.availableCategories = cats),
      error: (err) => console.error('Failed to load categories', err),
    });
    this.booksService.getAllAuthors().subscribe({
  next: (res) => {
    this.availableAuthors = res.data;
  },
  error: (err) => {
    console.error('Failed to fetch authors', err);
  }
});
}
  ngOnDestroy() {
    this.searchSub.unsubscribe();
     this.renderer.removeStyle(document.body, 'overflow');
  }

loadBooks(page: number = 1, limit : number =8) {
  this.booksService.getBooks(page,limit).subscribe({
    next: (res: any) => {
      if (Array.isArray(res.data)) {
        this.books = res.data;
        this.filteredBooks = [...this.books];
        this.totalPages = res.totalPages;
        this.currentPage = res.page;
        this.scrollToTop(); 
        this.availableCategories; 
        this.availableAuthors; 
        this.applyFilters(); 
      }
    },
    error: (err) => {
      console.error('Error fetching books:', err);
    }
  });
}

scrollToTop(): void {
  this.viewportScroller.scrollToPosition([0, 0]);
}
// setAvailableCategories() {
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
// setAvailableAuthors() {
//   const authorMap = new Map<string, string>();

//   this.books.forEach(book => {
//     if (book.author) {
//       const formatted = this.formatCategoryName(book.author);
//       const lowerKey = formatted.toLowerCase();

//       if (!authorMap.has(lowerKey)) {
//         authorMap.set(lowerKey, formatted);
//       }
//     }
//   });

//   this.availableAuthors = Array.from(authorMap.values());
// }

// private formatCategoryName(category: string): string {
//   return category
//     .toLowerCase()
//     .split('-')
//     .map(part => part.charAt(0).toUpperCase() + part.slice(1))
//     .join('-');
// }


//=========================================================================

toggleFilters = false;

  openFilters() {
    this.toggleFilters = true;
    this.renderer.setStyle(document.body, 'overflow', 'hidden'); // prevent scroll
  }

  closeFilters() {
    this.toggleFilters = false;
    this.renderer.removeStyle(document.body, 'overflow'); // restore scroll
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

   onAuthorChange(author: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedAuthors.add(author);
    } else {
      this.selectedAuthors.delete(author);
    }
    this.applyFilters();
    
  }

  applyFilters() {
  let filtered = [...this.books];

  // Filter by search term (title)
  if (this.searchTerm.trim()) {
    const searchLower = this.searchTerm.trim().toLowerCase();
    filtered = filtered.filter(book =>
      book.title?.toLowerCase().includes(searchLower)
    );
  }

  // Filter by selected categories
 if (this.selectedCategories.size > 0) {
  filtered = filtered.filter(book =>
    Array.isArray(book.category) && book.category.length > 0
      ? book.category.some(
          (cat: string) =>
            Array.from(this.selectedCategories).some(
              selected => selected.toLowerCase() === String(cat).toLowerCase()
            )
        )
      : this.selectedCategories.has(String(book.category).toLowerCase())
  );
}


  // Filter by selected authors
if (this.selectedAuthors.size > 0) {
  filtered = filtered.filter(book => {
    if (!book.author) return false;

    const bookAuthor = String(book.author).trim().toLowerCase();

    return Array.from(this.selectedAuthors).some(
      selected => selected.trim().toLowerCase() === bookAuthor
    );
  });
}


  // Sort by price
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
  isAuthorSelected(author: string): boolean {
    return this.selectedAuthors.has(author);
  }

  addToCart(book: BookInterface) {
    console.log(`${book.title} added to cart`);
  }
}
