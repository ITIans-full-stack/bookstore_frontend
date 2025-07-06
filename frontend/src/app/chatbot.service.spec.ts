// src/app/chatbot/chatbot.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private apiKey = 'YOUR_OPENROUTER_API_KEY'; // Replace with your actual key

  constructor(private http: HttpClient) {}

  askChatbot(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    });

    const body = {
      model: 'openai/gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
