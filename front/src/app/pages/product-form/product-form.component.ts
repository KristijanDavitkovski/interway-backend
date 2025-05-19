import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-form',
  standalone: true,                // <-- add if missing
  imports: [CommonModule, FormsModule,RouterModule],         // <-- add this line
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    quantityInStock: 0,
    category: '',
    imageUrl: ''
  };
  categoryOptions: string[] = ['Electronics', 'Books', 'Clothing', 'Furniture', 'Other'];

  isEdit = false;
  isLoad = false;
  selectedFile?: File;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private toastService: ToastService
  ) {}

ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productService.get(id).subscribe(product => {
        this.product = product;
        this.isEdit = true;
        this.isLoad = true;
      });
    } 
  
  }
toastMessage: string | null = null;

showToast(message: string) {
  console.log('shown');
  this.toastMessage = message;
  setTimeout(() => {
    this.toastMessage = null;
  }, 3000); // 3 seconds
}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
  const formData = new FormData();
  formData.append('name', this.product.name);
  formData.append('description', this.product.description ?? '');
  formData.append('price', this.product.price.toString());
  formData.append('quantityInStock', this.product.quantityInStock.toString());
  formData.append('category', this.product.category ?? '');
  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }

  if (this.isEdit) {
    this.productService.update(formData, this.product.id).subscribe({
      next: () => {
        this.toastService.show('✅ Product updated successfully!');
        this.router.navigate(['/products']);
      },
      error: () => this.showToast('❌ Failed to update product.')
    });
  } else {
    this.productService.create(formData).subscribe({
      next: () => {
        this.showToast('✅ Product created successfully!');
        this.router.navigate(['/products']);
      },
      error: () => this.showToast('❌ Failed to create product.')
    });
  }
}

}
