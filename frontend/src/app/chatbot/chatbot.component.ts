import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatbotService } from '../chatbot.service';
import { LinkifyPipe } from '../pipes/linkify.pipe'; // ✅ import your pipe

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, LinkifyPipe],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  userMessage = '';
  botResponse = '';
  isLoading = false;
  conversation: { role: string, content: string }[] = [];

  constructor(private chatbotService: ChatbotService, private router: Router) {}

  sendMessage(): void {
    if (!this.userMessage.trim()) return;

    this.conversation.push({ role: 'user', content: this.userMessage });
    this.isLoading = true;

    this.chatbotService.askChatbot(this.userMessage).subscribe({
  next: (res) => {
    const raw = res?.choices?.[0]?.message?.content || 'No response.';
    const parsed = this.parseBotMessage(raw);
    this.conversation.push({ role: 'assistant', content: parsed });
    this.botResponse = parsed;
    this.isLoading = false;
  },

      error: (err) => {
        console.error(err);
        this.botResponse = 'Something went wrong.';
        this.conversation.push({ role: 'assistant', content: this.botResponse });
        this.isLoading = false;
      },
    });

    this.userMessage = '';
  }


  parseBotMessage(message: string): string {
  return message.replace(/Title: (.+?) \[id=(.+?)\]/g, (match, title, id) => {
    const url = `/books/${id}`;
    return `Title: <a href="${url}" class="book-link">${title}</a>`;
  });
}

}
