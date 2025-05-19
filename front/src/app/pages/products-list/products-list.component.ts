import { Component, OnInit } from '@angular/core';
import { ProductService } from '../..//services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';  // import CommonModule here
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-products-list',
  standalone: true,                
  imports: [CommonModule, FormsModule,RouterModule],         
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  search: string = '';
  page: number = 1;
  pageSize: number = 10;
  total: number = 0;
  loading = false;
  categoryOptions: string[] = ['Electronics', 'Books', 'Clothing', 'Furniture', 'Other'];
  selectedCategory: string = '';
toastMessage: string | null = null;

  constructor(private productService: ProductService,public toastService: ToastService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
  this.loading = true;
  this.productService.getAll(this.search, this.selectedCategory, this.page, this.pageSize)
    .subscribe(response => {
      this.products = response.data;
      this.total = response.total;
      this.loading = false;
    });
}
get totalPages(): number {
  return Math.ceil(this.total / this.pageSize);
}

nextPage() {
  if (this.page < this.totalPages) {
    this.page++;
    this.loadProducts();
  }
}

previousPage() {
  if (this.page > 1) {
    this.page--;
    this.loadProducts();
  }
}
onPageSizeChange() {
  this.page = 1;
  this.loadProducts();
}


  onSearch() {
    this.page = 1;
    this.loadProducts();
  }

  deleteProduct(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(id).subscribe(() => {
      this.loadProducts();
    });
  }
}
