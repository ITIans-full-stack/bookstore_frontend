import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  userMessage = '';
  botResponse = '';
  isLoading = false;
  conversation: { role: string, content: string }[] = [];

  constructor(private chatbotService: ChatbotService) {}

  sendMessage(): void {
    if (!this.userMessage.trim()) return;

    this.conversation.push({ role: 'user', content: this.userMessage });
    this.isLoading = true;

    this.chatbotService.askChatbot(this.userMessage).subscribe({
      next: (res) => {
        const message = res?.choices?.[0]?.message?.content || 'No response.';
        this.conversation.push({ role: 'assistant', content: message });
        this.botResponse = message;
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
}
