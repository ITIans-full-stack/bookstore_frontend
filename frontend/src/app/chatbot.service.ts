
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookDataService } from './core/services/book-data.service';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private availableBooks: any[] = []; 

  constructor(private http: HttpClient, private bookService: BookDataService) {
    this.bookService.getAllBooks().subscribe({
      next: (res: any) => {
        if (Array.isArray(res.data)) {
          this.availableBooks = res.data;
        }
      },
      error: (err) => {
        console.error('Error fetching books:', err);
      }
    });
  }

  askChatbot(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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', // Don't expose secrets
      'HTTP-Referer': 'http://localhost:4200',
      'X-Title': 'bookstore-assistant'
    });

    const booksList = this.availableBooks.map(
      book => `"${book.title}" by ${book.author} desription ${book.description} price ${book.price}`
    ).join('\n');

    const body = {
      model: 'mistralai/mistral-7b-instruct',
      messages: [
        {
          role: 'system',
          content: `
You are a helpful assistant for an online bookstore.

Below is a list of available books in the store:
${booksList}

Your Task:
- Based ONLY on this list, recommend books that match the user's query by **title**, **author**, or **category**.
- Do NOT recommend any book that is not present in the list.
- If no book exactly matches the title or author, try recommending books from the same category.
- If nothing matches at all, reply: "📚 No matching books found."

Response Format (for each result):
📘 Title: [Book Title]  
✍️ Author: [Author Name]  
📂 Category: [Category]  
💵 Price: $[Price]

Be concise and friendly. Only return relevant results from the list.


`
        },
        { role: 'user', content: message }
      ]
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
