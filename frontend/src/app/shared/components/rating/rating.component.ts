import { Component, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Star } from '../../../book-details/models/star';




@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent implements OnInit {
  // not work because no relation  parent and child now
  //fixed later
  @Input() avgRating!: number
  @Input() reviewCount!: number

  stars: Star[] = [
    { id: 1, selected: false, icon: faStarRegular },
    { id: 2, selected: false, icon: faStarRegular },
    { id: 3, selected: false, icon: faStarRegular },
    { id: 4, selected: false, icon: faStarRegular },
    { id: 5, selected: false, icon: faStarRegular },
  ]

  ngOnInit(): void {
    this.stars.forEach(star => {
      if (star.id <= this.avgRating) {
        star.selected = true;
        star.icon = faStar;
      } else {
        star.selected = false;
        star.icon = faStarRegular;
      }
    })
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