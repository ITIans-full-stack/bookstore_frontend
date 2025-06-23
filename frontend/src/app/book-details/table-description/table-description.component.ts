import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-description',
  standalone: true,
  imports: [],
  templateUrl: './table-description.component.html',
  styleUrl: './table-description.component.css'
})
export class TableDescriptionComponent {
  @Input() author!:string
  @Input() avgRating!:number

}
