import { Component, Input, NgModule, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStarHalf, faStarHalfAlt, faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Star } from '../../../book-details/models/star';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent implements OnInit {
  @Input() averageRating?: number;

  @Input() reviewCount!: number
   @Input() hasRating: boolean = false;

  stars: Star[] = [
    { id: 1, selected: false, icon: faStarRegular },
    { id: 2, selected: false, icon: faStarRegular },
    { id: 3, selected: false, icon: faStarRegular },
    { id: 4, selected: false, icon: faStarRegular },
    { id: 5, selected: false, icon: faStarRegular },
  ]


fullStar = faStar;
  halfStar = faStarHalfAlt;
  emptyStar = faStarRegular;

  getStarIcon(index: number): any {
    if (!this.hasRating || this.averageRating === undefined) return this.emptyStar;

    if (index + 1 <= this.averageRating) return this.fullStar;
    if (this.averageRating > index && this.averageRating < index + 1) return this.halfStar;
    return this.emptyStar;
  }

  getStarClass(): string {
    return this.hasRating ? 'text-warning' : 'text-muted opacity-50';
  }
  ngOnInit(): void {
    // this.stars.forEach(star => {
    //   if (star.id <= this.averageRating) {
    //     star.selected = true;
    //     star.icon = faStar;
    //   } else {
    //     star.selected = false;
    //     star.icon = faStarRegular;
    //   }
    // })
  }


  selectStar(selectedStar: Star) {

  }

}
// this.stars.forEach(star => {
//   if (star.id <= selectedStar.id) {
//     star.selected = true;
//     star.icon = faStar;
//   } else {
//     star.selected = false;
//     star.icon = faStarRegular;
//   }
// });