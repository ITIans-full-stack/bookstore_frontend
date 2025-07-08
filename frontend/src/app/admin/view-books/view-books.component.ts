import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../book-details/models/book';
import { BookDataService } from '../../core/services/book-data.service';
import { BookInterface } from '../../core/interfaces/book-interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-view-books',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule], 
  templateUrl: './view-books.component.html',
  styleUrls: ['./view-books.component.css']
})
export class ViewBooksComponent implements OnInit {
  books: BookInterface[] = [];
  searchTerm: string = '';
searchType: 'title' | 'author' | 'category' = 'title';
filteredBooks: any[] = [];

selectedBook: BookInterface | null = null;
  editSelectedFile: File | null = null;
  editSelectedFileName: string = 'No file chosen';
  editImagePreviewUrl: string | ArrayBuffer | null = null;
  editForm!: FormGroup;
  toastMessage = '';
toastType: 'success' | 'error' = 'success';
showToast = false;
selectedBookToDelete: any = null;
availableCategories: string[] = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Fantasy', 'Literature', 'Poetry', 'Science-Fiction','Historical-Fiction','Children'];
selectedCategories: string[] = [];
selectedCategory: string = '';

  constructor(private bookService: BookDataService , private fb: FormBuilder) {}

  ngOnInit(): void {
    this.bookService.getAllBooks().subscribe({
  next: (res: any) => {
    if (Array.isArray(res.data)) {
      this.books = res.data.map((book: any) => ({
  ...book,
  category: Array.isArray(book.category)
    ? book.category
    : book.category.split(',').map((cat: string) => cat.trim())
}));
      this.filterBooks();
    } else {
      console.error('Data is not an array:', res);
    }
  },
  error: (err) => {
    console.error('Error fetching books:', err);
  }
});
 
  }
  

//=================================================================
  filterBooks(): void {
  const term = this.searchTerm.toLowerCase().trim();

  if (!term) {
    this.filteredBooks = [...this.books];
    return;
  }

  this.filteredBooks = this.books.filter(book => {
    const fieldValue = (book[this.searchType] || '').toString().toLowerCase();
    return fieldValue.includes(term);
  });
}

//====================================================================
  onEdit(book: BookInterface): void {
    this.selectedBook = { ...book };
    this.editSelectedFile = null;
    this.editSelectedFileName = 'No file chosen';
    this.editImagePreviewUrl = null;

     const normalizedCategories = Array.isArray(book.category)
    ? book.category
    : book.category.split(',').map(c => c.trim());

 
  this.selectedCategories = [...normalizedCategories];

    this.editForm = this.fb.group({
      title: [book.title, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      author: [book.author, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      description: [book.description, [Validators.required, Validators.minLength(5), Validators.maxLength(2000)]],
     category: [this.selectedCategories, [Validators.required]],

      price: [book.price, [Validators.required, Validators.min(0)]],
      discount: [book.discount ?? 0, [Validators.min(0), Validators.max(70)]],
      stock: [book.stock, [Validators.required, Validators.min(0)]],
      image: [book.image],
    });
  }

  cancelEdit(): void {
    this.selectedBook = null;
    this.editSelectedFile = null;
    this.editSelectedFileName = 'No file chosen';
    this.editImagePreviewUrl = null;
  }

  onEditFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.editSelectedFile = file;
      this.editSelectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.editImagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

 submitEdit(): void {
  if (!this.selectedBook || !this.editForm.valid) {
    this.editForm.markAllAsTouched();
    return;
  }

  const formData = new FormData();
  formData.append('title', this.editForm.get('title')?.value);
  formData.append('author', this.editForm.get('author')?.value);
  formData.append('description', this.editForm.get('description')?.value);
  this.editForm.get('category')?.value.forEach((cat: string) => {
  formData.append('category[]', cat);
});

  formData.append('price', String(this.editForm.get('price')?.value));
  formData.append('discount', String(this.editForm.get('discount')?.value));
  formData.append('stock', String(this.editForm.get('stock')?.value));

  if (this.editSelectedFile) {
    formData.append('image', this.editSelectedFile);
  }

  this.bookService.updateBookById(this.selectedBook._id, formData).subscribe({
    next: (res) => {
      this.toastType = 'success';
      this.toastMessage = 'Book updated successfully!';
      this.showToast = true;
      const index = this.books.findIndex(b => b._id === this.selectedBook?._id);
      if (index !== -1) {
        this.books[index] = { ...this.selectedBook!, ...this.editForm.value };
      }
      this.cancelEdit();
      this.filterBooks();
    },
    error: (err) => {
      console.error(err);
      this.toastType = 'error';
      this.toastMessage = 'Failed to update book.';
      this.showToast = true;
    }
  });
}

addCategory(category: string) {
  if (category && !this.selectedCategories.includes(category)) {
    this.selectedCategories.push(category);
    this.editForm.get('category')?.setValue(this.selectedCategories);
  }
  this.selectedCategory = '';
}

// Remove a selected category
removeCategory(cat: string) {
  this.selectedCategories = this.selectedCategories.filter(c => c !== cat);
  this.editForm.get('category')?.setValue(this.selectedCategories);
}
//====================================================================

  showToastMsg(message: string, type: 'success' | 'error' = 'success') {
  this.toastMessage = message;
  this.toastType = type;
  this.showToast = true;

  setTimeout(() => {
    this.showToast = false;
  }, 3000);
}

//====================================================================

confirmDelete(book: any) {
  this.selectedBookToDelete = book;
}

cancelDelete() {
  this.selectedBookToDelete = null;
}

deleteBook() {
  if (this.selectedBookToDelete) {
    this.bookService.deleteBookById(this.selectedBookToDelete._id).subscribe({
      next: () => {
        this.books = this.books.filter(b => b._id !== this.selectedBookToDelete._id);
        this.filterBooks();
        this.toastType = 'success';
        this.toastMessage = 'Book deleted successfully.';
        this.showToast = true;
        this.selectedBookToDelete = null;
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.toastType = 'error';
        this.toastMessage = 'Failed to delete book.';
        this.showToast = true;
      }
    });
  }
}




}
