import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from './categories.service';

@Component({
  selector: 'app-category-register',
  templateUrl: './category-register.component.html',
  styleUrls: ['./category-register.component.scss']
})
export class CategoryRegisterComponent implements OnInit {
  title = 'Registrar categoría';
  form!: FormGroup;
  loading = false;

  private id: string | null = null;     // si viene -> estamos editando
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoriesSrv: CategoriesService
  ) {}

  ngOnInit(): void {
    // 1) construir formulario
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(80)]],
      description: ['', [Validators.maxLength(300)]],
      state: [1] // opcional
    });

    // 2) detectar si venimos con :id (modo edición)
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      this.title = 'Editar categoría';
      this.loading = true;
      this.categoriesSrv.getOne(this.id).subscribe({
        next: (cat: any) => {
          // Ajusta las claves si tu API usa otros nombres
          this.form.patchValue({
            name: cat?.name,
            description: cat?.description,
            state: cat?.state ?? 1
          });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          alert('No se pudo cargar la categoría');
          this.router.navigate(['/categories']);
        }
      });
    }
  }

submit() {
  if (this.form.invalid) return;

  this.loading = true;
  const { name, description, state } = this.form.value;

  if (this.isEdit && this.id) {
    // actualizar
    const body = { _id: this.id, name, description, state };
    this.categoriesSrv.update(body).subscribe({
      next: () => {
        this.loading = false;
        alert('Categoría actualizada');
        this.router.navigate(['/categories/list']);
      },
      error: (err) => {
        console.error('Error al actualizar categoría', err);
        this.loading = false;
        alert('No se pudo actualizar la categoría');
      },
    });
  } else {
    // crear
        this.categoriesSrv.register({ name, description }).subscribe({
      next: () => {
        this.loading = false;
        alert('Categoría registrada');
        this.router.navigate(['/categories/list']);
      },
      error: (err) => {
        console.error('Error al registrar categoría', err);
        this.loading = false;
        alert('No se pudo registrar la categoría');
      },
    });
  }
}

  cancel(): void {
    this.router.navigate(['/categories']);
  }
}