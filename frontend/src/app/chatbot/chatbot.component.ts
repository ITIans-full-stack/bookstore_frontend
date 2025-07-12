import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatbotService } from '../chatbot.service';
import { LinkifyPipe } from '../pipes/linkify.pipe';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, LinkifyPipe],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  userMessage = '';
  isLoading = false;
  showChatbot = false;

  conversation: { role: string, content: string }[] = [];

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  constructor(private chatbotService: ChatbotService, private router: Router) {}

  toggleChatbot(): void {
    this.showChatbot = !this.showChatbot;
    setTimeout(() => this.scrollToBottom(), 50);
  }

  sendMessage(): void {
    if (!this.userMessage.trim()) return;

    this.conversation.push({ role: 'user', content: this.userMessage });
    this.isLoading = true;
    const currentQuery = this.userMessage;

    this.chatbotService.askChatbot(currentQuery).subscribe({
      next: (res) => {
        const message = res?.choices?.[0]?.message?.content || 'No response.';
        const formatted = this.parseBotMessage(message);
        this.conversation.push({ role: 'assistant', content: formatted });
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (err) => {
        console.error(err);
        const errorMessage = 'Something went wrong.';
        this.conversation.push({ role: 'assistant', content: errorMessage });
        this.isLoading = false;
        this.scrollToBottom();
      }
    });

    this.userMessage = '';
  }

  parseBotMessage(message: string): string {
    return message.replace(/Title: (.+?) \[id=(.+?)\]/g, (match, title, id) => {
      const url = `/books/${id}`;
      return `Title: <a href="${url}" class="book-link">${title}</a>`;
    });
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      try {
        const container = this.messagesContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      } catch (e) {
        console.warn('Scroll failed:', e);
      }
    }
  }
}
