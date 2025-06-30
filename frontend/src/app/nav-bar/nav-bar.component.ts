import { Component, EventEmitter, Output } from '@angular/core';
import { SearchService } from '../core/services/search.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
   constructor(private searchService: SearchService) {}

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchService.setSearchTerm(value);
  }

}
