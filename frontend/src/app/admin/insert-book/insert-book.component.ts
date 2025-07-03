import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookDetailsService } from '../../book-details/services/book-details.service';

@Component({
  selector: 'app-insert-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './insert-book.component.html',
  styleUrls: ['./insert-book.component.css']
})
export class InsertBookComponent {
  selectedFileName: string = 'No file chosen';
  uploadedImageName: string = '';

  constructor(private bookService: BookDetailsService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
      this.uploadedImageName = input.files[0].name;
    } else {
      this.selectedFileName = 'No file chosen';
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const title = (document.getElementById('title') as HTMLInputElement).value;
    const author = (document.getElementById('author') as HTMLInputElement).value;
    const category = (document.getElementById('category') as HTMLSelectElement).value;
    const price = +(document.getElementById('price') as HTMLInputElement).value;
    const stock = +(document.getElementById('stock') as HTMLInputElement).value;
    const description = (document.getElementById('description') as HTMLTextAreaElement).value;

    // this.bookService.addBook({
    //   title,
    //   author,
    //   category,
    //   price,
    //   stock,
    //   description,
    //   imageName: this.uploadedImageName
    // });

    alert('Book inserted successfully!');
  }
}
