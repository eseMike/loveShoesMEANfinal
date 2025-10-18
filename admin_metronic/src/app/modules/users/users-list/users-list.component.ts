import { Component, OnInit } from '@angular/core';
import { User } from '../../material/formcontrols/autocomplete/autocomplete.component';
import { UsersService } from '../_services/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUsersComponent } from '../components/add-users/add-users.component';
import { EditUsersComponent } from '../components/edit-users/edit-users.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  users: any[] = [];
  isLoading$: any;

  constructor(
    public _userService: UsersService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this._userService.isLoading$;

    this.isLoading$.subscribe((val: boolean) => {
      console.log('¿Está cargando usuarios?:', val);
    });

    this.allUsers();
  }

  allUsers() {
    this._userService.allUsers().subscribe((resp: any) => {
      console.log('👥 Usuarios recibidos del backend:', resp);
      this.users = resp.users;

      // 👇 Ahora tendrás toda la información para verificar si viene lastname
      console.log('✅ Users cargados en this.users:', this.users);
    });
  }

  onSearch(term: string) {
  const q = (term ?? '').trim();

  // Si está vacío, recargamos todo
  if (!q) {
    this.allUsers();
    return;
  }

  this._userService.searchUsers(q).subscribe((resp: any) => {
    console.log('🔎 Resultado de búsqueda:', resp);
    this.users = resp?.users ?? [];
  });
}

  openCreate() {
    const modalRef = this.modalService.open(AddUsersComponent, {
      centered: true,
      size: 'lg'
    });

    modalRef.componentInstance.UserC.subscribe((resp: any) => {
      console.log('Usuario nuevo creado:', resp);
      this.users.unshift(resp.user);
    });

    modalRef.result.then(
      (result) => {
        if (result === 'success') {
          this.allUsers();
        }
      },
      (reason) => {
        console.log('Modal cerrado con reason:', reason);
      }
    );
  }

  editUser(user: User) {
    const modalRef = this.modalService.open(EditUsersComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.user_selected = user;

    modalRef.componentInstance.UserE.subscribe((resp: any) => {
  const idx = this.users.findIndex(u => u._id === resp.user._id);

  if (idx !== -1) {
    // Actualiza en su misma posición (sin duplicar)
    this.users[idx] = resp.user;
  } else {
    // Si por alguna razón no está en la lista, lo agregamos al inicio
    this.users.unshift(resp.user);
  }

  console.log('Usuario actualizado correctamente:', resp.user);
});

    modalRef.result.then(
      (result) => {
        if (result === 'success') {
          this.allUsers();
        }
      },
      (reason) => {
        console.log('Modal cerrado con reason:', reason);
      }
    );
  }

 delete(user: User) {
  if (!user || !(user as any)._id) {
    console.warn('No hay _id para eliminar:', user);
    return;
  }

  const ok = window.confirm(`¿Eliminar al usuario "${(user as any).name || (user as any).email}"?`);
  if (!ok) return;

  this._userService.deleteUser((user as any)._id).subscribe({
    next: (resp: any) => {
      console.log('Usuario eliminado correctamente:', resp);
      // Remueve de la tabla
      this.users = this.users.filter(u => u._id !== (user as any)._id);
    },
    error: (err) => {
      console.error('Error eliminando usuario:', err);
    }
  });
} 
}
