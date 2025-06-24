import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
   cartItems = [
    {
      title: 'Angular book ',
      price: 150,
      quantity: 2,
      imageUrl: 'https://m.media-amazon.com/images/I/71g2ednj0JL.jpg'
    },
    {
      title: 'book name',
      price: 200,
      quantity: 1,
      imageUrl: 'https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg'
    },
     {
      title: 'book 55',
      price: 200,
      quantity: 1,
      imageUrl: 'https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg'
    },
     {
      title: 'book 44',
      price: 200,
      quantity: 1,
      imageUrl: 'https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg'
    },
     {
      title: 'book gg;',
      price: 200,
      quantity: 1,
      imageUrl:  'https://m.media-amazon.com/images/I/71g2ednj0JL.jpg'
    }
  ];

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  removeItem(itemToRemove: any) {
    this.cartItems = this.cartItems.filter(item => item !== itemToRemove);
  }
  increaseQty(item: any) {
  item.quantity++;
}

decreaseQty(item: any) {
  if (item.quantity > 1) {
    item.quantity--;
  }
}

}
