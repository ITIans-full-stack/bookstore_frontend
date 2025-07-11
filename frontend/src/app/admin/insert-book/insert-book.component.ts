import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookDataService } from '../../core/services/book-data.service';
import { FormBuilder, FormGroup , FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-insert-book',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './insert-book.component.html',
  styleUrls: ['./insert-book.component.css']
})
export class InsertBookComponent implements OnInit{
 bookForm!: FormGroup;
  selectedFileName: string = 'No file chosen';
  selectedFile: File | null = null;
  selectedImagePreview:string='';
   toastMessage = '';
  showToast = false;
  toastType: 'success' | 'error' = 'success';
availableCategories: string[] = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Fantasy', 'Literature', 'Poetry', 'Science-Fiction','Historical-Fiction','Children'];
selectedImages: File[] = [];

imagesError: boolean = false;

selectedImagesPreview: string[] = [];


selectedPdfFile: File | null = null;
selectedPdfFileName = 'No file chosen';
pdfError = false;





  constructor(private fb: FormBuilder ,private bookDataService:BookDataService) {
  }

   ngOnInit(): void {
    this.bookForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    author: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]],
    image: ['', Validators.required],
    images: [[]],
    category: [[], [Validators.required, Validators.minLength(1)]],
    price: [null, [Validators.required, Validators.min(0)]],
    discount: [null, [Validators.min(0), Validators.max(70)]],
    stock: [null, [Validators.required, Validators.min(1)]],
    averageRating: [0],

    });

    
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.selectedFileName = file.name;
      this.selectedFile = file;
      this.bookForm.patchValue({ image: file });
      this.bookForm.get('image')?.updateValueAndValidity();

       const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  
    }

  }
  removeCoverImage(): void {
  this.selectedFile = null;
  this.selectedFileName = 'No file chosen';
  this.selectedImagePreview = '';
  this.bookForm.patchValue({ image: null });
  this.bookForm.get('image')?.markAsTouched();
}


onExtraImageSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedImages.push(file);

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImagesPreview.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  // Reset the input to allow selecting same file again
  event.target.value = '';
}
removeExtraImage(index: number): void {
  this.selectedImages.splice(index, 1);
  this.selectedImagesPreview.splice(index, 1);
}


onPdfSelected(event: Event): void {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (file && file.type === 'application/pdf') {
    this.selectedPdfFile = file;
    this.selectedPdfFileName = file.name;
    this.pdfError = false;
  } else {
    this.selectedPdfFile = null;
    this.selectedPdfFileName = 'No file chosen';
    this.pdfError = true;
    this.showToastMsg('Please select a valid PDF file.', 'error');
  }
}


 showToastMsg(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  hideToast() {
    this.showToast = false;
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.bookForm.invalid || !this.selectedFile) {
      this.bookForm.markAllAsTouched();
      this.showToastMsg('⚠️ Please fill in all required fields and upload an image.', 'error');
      return;
    }
    if (!this.selectedPdfFile) {
  this.pdfError = true;
  this.showToastMsg('⚠️ Please upload the book PDF.', 'error');
  return;
}

    const formData = new FormData();
    formData.append('title', this.bookForm.get('title')?.value);
    formData.append('author', this.bookForm.get('author')?.value);
    formData.append('description', this.bookForm.get('description')?.value);
    const categories = this.bookForm.get('category')?.value;
    categories.forEach((cat: string) => formData.append('category[]', cat));
    formData.append('price', this.bookForm.get('price')?.value);
    formData.append('discount', this.bookForm.get('discount')?.value);
    formData.append('stock', this.bookForm.get('stock')?.value);
    formData.append('image', this.selectedFile);
    this.selectedImages.forEach((file) => {
  formData.append('images', file);
});
formData.append('pdf', this.selectedPdfFile);

    this.bookDataService.addBook(formData).subscribe({
      next: () => {
        this.showToastMsg('✅ Book added successfully!', 'success');
        this.bookForm.reset();
        this.selectedFileName = 'No file chosen';
        this.selectedFile = null;
        this.selectedImages = [];
        this.selectedImagesPreview=[];
        // this.selectedCategories=[];
        this.selectedImagePreview='';
        this.selectedPdfFile=null;
        this.selectedPdfFileName='No file chosen'

        this.selectedCategories = [];
        this.bookForm.patchValue({ category: [] });

        
   
      },
      error: (err) => {
        console.error('Book submission failed:', err);
        this.showToastMsg('❌ Failed to add book. Please try again.', 'error');
      }
    });
  }


selectedCategory: string = '';
selectedCategories: string[] = [];

addCategory(cat: string): void {
  if (cat && !this.selectedCategories.includes(cat)) {
    this.selectedCategories.push(cat);
    // this.bookForm.get('category')?.setValue(this.selectedCategories);
    // this.bookForm.get('category')?.markAsTouched();

    this.bookForm.patchValue({ category: this.selectedCategories });
    this.bookForm.get('category')?.updateValueAndValidity();
  }
  this.selectedCategory = ''; // reset the select
}

removeCategory(cat: string): void {
  this.selectedCategories = this.selectedCategories.filter(c => c !== cat);
  // this.bookForm.get('category')?.setValue(this.selectedCategories);
  // this.bookForm.get('category')?.markAsTouched();

  this.bookForm.patchValue({ category: this.selectedCategories });
  this.bookForm.get('category')?.updateValueAndValidity();
}

}
