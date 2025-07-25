import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { FooterComponent } from './footer/footer.component';
import { SocketService } from './core/services/services/socket.service';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { WishlistService } from './core/services/services/wishlist.service'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, FooterComponent, ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'online-bookstore';

  constructor(
    private wishlistService: WishlistService,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.wishlistService.loadWishlist();
  }
}
