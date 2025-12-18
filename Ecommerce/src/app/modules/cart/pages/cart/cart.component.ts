import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from 'src/app/shared/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartItems: CartItem[] = [];
  total = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
    });

this.cartService.subtotals$.subscribe((subtotal: number) => {
      this.total = subtotal;
    });
  }

  increase(item: CartItem): void {
    this.cartService.increment(item._id);
  }

  decrease(item: CartItem): void {
    this.cartService.decrement(item._id);
  }

  remove(item: CartItem): void {
    this.cartService.remove(item._id);
  }

}
