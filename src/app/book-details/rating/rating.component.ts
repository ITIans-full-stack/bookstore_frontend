import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar as faStarRegular, IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { Star } from '../models/star';
import { faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent {

  stars: Star[] = [
    { id: 1, selected: false, icon: faStarRegular },
    { id: 2, selected: false, icon: faStarRegular },
    { id: 3, selected: false, icon: faStarRegular },
    { id: 4, selected: false, icon: faStarRegular },
    { id: 5, selected: false, icon: faStarRegular },
  ]

  selectStar(selectedStar: Star) {
    this.stars.forEach(star => {
      if (star.id <= selectedStar.id) {
        star.selected = true;
        star.icon = faStar;
      } else {
        star.selected = false;
        star.icon = faStarRegular;
      }
    });
  }

}
