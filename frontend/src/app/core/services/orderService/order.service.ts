import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() {}
     getOrders(): Observable<any[]> {
        const now = new Date();
        const fourMonthsAgo = new Date();
        fourMonthsAgo.setMonth(now.getMonth() - 4);

        const sevenMonthsAgo = new Date();
        sevenMonthsAgo.setMonth(now.getMonth() - 7);
      const mockOrders = [
        {
          _id: 'order1',
          totalPrice: 120,
          createdAt: now,
          status: 'Delivered',
          books: [
            { title: 'Clean Code', quantity: 1 },
            { title: 'You Don\'t Know JS', quantity: 2 },
          ],
        },
        {
          _id: 'order2',
          totalPrice: 80,
          createdAt: fourMonthsAgo,
          status: 'Pending',
          books: [{ title: 'Eloquent JavaScript', quantity: 1 }],
        },
      {
        _id: 'order3',
        totalPrice: 150,
        createdAt: sevenMonthsAgo, 
        status: 'Shipped',
        books: [{ title: 'Angular for Beginners', quantity: 1 }],
      },
      ];
      return of(mockOrders);
  }
  
}
