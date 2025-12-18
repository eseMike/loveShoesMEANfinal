import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../shared/product.service';
import { CartService } from '../../shared/cart.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categoryId!: string;
  products: any[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id') as string;
      if (this.categoryId) {
        this.loadProductsByCategory(this.categoryId);
      }
    });
  }

  loadProductsByCategory(categoryId: string): void {
    this.loading = true;
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (res: any) => {
        this.products = Array.isArray(res) ? res : (res?.items ?? res?.data ?? []);
        this.loading = false;
      },
      error: () => {
        this.products = [];
        this.loading = false;
      }
    });
  }

  addToCart(product: any): void {
    this.cartService.addProduct(product);
  }

}
