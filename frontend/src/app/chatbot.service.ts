import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookDataService } from './core/services/book-data.service';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private availableBooks: any[] = [];

  constructor(private http: HttpClient, private bookService: BookDataService) {
    this.bookService.getAllBooks().subscribe({
      next: (res: any) => {
        this.availableBooks = res.data || [];
      },
      error: (err) => {
        console.error('Error loading books:', err);
      }
    });
  }

  askChatbot(userQuestion: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.OpenrouterToken}`,
      'HTTP-Referer': 'http://localhost:4200',
      'X-Title': 'bookstore-assistant'
    });

    const booksList = this.availableBooks.map(book => {
      const link = `http://localhost:4200/book-details/${book._id}`;
      return `📘 <b>Title:</b> <a href="${link}" target="_blank">${book.title}</a><br>
✍️ <b>Author:</b> ${book.author}<br>
📂 <b>Category:</b> ${book.category}<br>
💵 <b>Price:</b> ${book.price}<br><br>`;
    }).join('\n');

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
- Separate between each book by making new line
- When showing a book, add its ID in the format [id=BOOK_ID] after the title.
- If nothing matches at all, reply: "📚 No matching books found."

Respond in this format:
📘 Title: Book Name [id=BOOK_ID]  
✍️ Author: Author Name  
📂 Category: Category  
💵 Price: $Price
`
        },
        { role: 'user', content: userQuestion }
      ]
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
