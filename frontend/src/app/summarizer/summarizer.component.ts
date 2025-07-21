import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-summarizer',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './summarizer.component.html',
  styleUrls: ['./summarizer.component.css']
})
export class SummarizerComponent implements OnInit {
  pdfUrl: string = '';
  summaryText: string = '';
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.pdfUrl = params['pdf'];
      console.log("🧾 Received PDF URL:", this.pdfUrl);
      if (this.pdfUrl) {
        this.summarizePdf();
      }
    });
  }

  summarizePdf() {
    this.isLoading = true;
    console.log("📤 Sending request to OpenRouter for summary...");

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.bookSumToken}`,
      'HTTP-Referer': `${environment.apiUrl}`,
      'X-Title': 'bookstore-summarizer'
    });

    const body = {
      model: 'mistralai/mistral-7b-instruct',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Summarize the contents of the following book PDF clearly and concisely in bullet points.'
        },
        {
          role: 'user',
          content: `Please summarize this PDF book: ${this.pdfUrl}`
        }
      ]
    };

    this.http.post('https://openrouter.ai/api/v1/chat/completions', body, { headers }).subscribe({
      next: (res: any) => {
        this.summaryText = res?.choices?.[0]?.message?.content || 'No summary generated.';
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Summarization error:', err);
        this.summaryText = 'Failed to summarize the PDF.';
        this.isLoading = false;
      }
    });
  }
}
