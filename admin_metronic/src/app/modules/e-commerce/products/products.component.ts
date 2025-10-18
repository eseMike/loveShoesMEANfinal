// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductsService } from '../_services';
import {
  GroupingState,
  PaginatorState,
  SortState,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
} from '../../../_metronic/shared/crud-table';
import { DeleteProductModalComponent } from './components/delete-product-modal/delete-product-modal.component';
import { DeleteProductsModalComponent } from './components/delete-products-modal/delete-products-modal.component';
import { UpdateProductsStatusModalComponent } from './components/update-products-status-modal/update-products-status-modal.component';
import { FetchProductsModalComponent } from './components/fetch-products-modal/fetch-products-modal.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent
  implements
  OnInit,
  OnDestroy,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
  IFilterView {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  
public products = [
  { id: 1, name: 'Mules', description: 'Calzado estilo mules', price: 950, status: 'activo', condition: 'nuevo' },
  { id: 2, name: 'Sandalias', description: 'Sandalias cómodas y frescas', price: 850, status: 'activo', condition: 'nuevo' },
  { id: 3, name: 'Flats/Balerinas', description: 'Flats elegantes para uso diario', price: 780, status: 'activo', condition: 'nuevo' },
  { id: 4, name: 'Tenis', description: 'Tenis deportivos y casuales', price: 1200, status: 'activo', condition: 'nuevo' },
  { id: 5, name: 'Botas/Botines', description: 'Botines de moda y resistentes', price: 1500, status: 'activo', condition: 'nuevo' },
  { id: 6, name: 'Tacones', description: 'Tacones elegantes para ocasiones especiales', price: 1100, status: 'activo', condition: 'nuevo' },
  { id: 7, name: 'Plataformas', description: 'Zapatos de plataforma modernos', price: 1050, status: 'activo', condition: 'nuevo' },
  { id: 8, name: 'Confort', description: 'Calzado diseñado para comodidad', price: 980, status: 'activo', condition: 'nuevo' },
  { id: 9, name: 'New Arrivals', description: 'Últimos modelos en calzado', price: 1300, status: 'activo', condition: 'nuevo' }
];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public productsService: ProductsService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    // this.productsService.fetch(); 
    const sb = this.productsService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.grouping = this.productsService.grouping;
    this.paginator = this.productsService.paginator;
    this.sorting = this.productsService.sorting;
    // this.productsService.fetch(); 
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      status: [''],
      condition: [''],
      searchTerm: [''],
    });
    this.subscriptions.push(
      this.filterGroup.controls.status.valueChanges.subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.condition.valueChanges.subscribe(() => this.filter())
    );
  }

  filter() {
    const filter = {};
    const status = this.filterGroup.get('status').value;
    if (status) {
      filter['status'] = status;
    }

    const condition = this.filterGroup.get('condition').value;
    if (condition) {
      filter['condition'] = condition;
    }
    this.productsService.patchState({ filter });
  }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(
        /*
  The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
  we are limiting the amount of server requests emitted to a maximum of one every 150ms
  */
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));
    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {
    this.productsService.patchState({ searchTerm });
  }

  // sorting
  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.productsService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.productsService.patchState({ paginator });
  }
  // actions
  delete(id: number) {
    const modalRef = this.modalService.open(DeleteProductModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => this.productsService.fetch(),
      () => { }
    );
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteProductsModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(
      () => this.productsService.fetch(),
      () => { }
    );
  }

  updateStatusForSelected() {
    const modalRef = this.modalService.open(
      UpdateProductsStatusModalComponent
    );
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(
      () => this.productsService.fetch(),
      () => { }
    );
  }

  fetchSelected() {
    const modalRef = this.modalService.open(FetchProductsModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(
      () => this.productsService.fetch(),
      () => { }
    );
  }
}
