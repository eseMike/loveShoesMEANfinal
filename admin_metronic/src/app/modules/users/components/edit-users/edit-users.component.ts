import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../_services/users.service';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss']
})
export class EditUsersComponent implements OnInit {
  @Input() user_selected: any; // Input property to receive user data

  @Output() UserE: EventEmitter<any> = new EventEmitter();

  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  lastname: string = '';
  confirmPassword: string = '';

  constructor(
    public modal: NgbActiveModal,
    public userService: UsersService,
    public toaster: Toaster
  ) {}

  ngOnInit(): void {
    if (this.user_selected) {
      this.name = this.user_selected.name || '';
      this.lastname = this.user_selected.lastname || ''; // ✅ corregido aquí
      this.email = this.user_selected.email || '';
      this.password = '';
      this.confirmPassword = '';
    }
  }

  save() {
    if (
      !this.name ||
      !this.surname ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.toaster.open(NoticyAlertComponent, {
        text: `Rellena todos los campos`,
        type: 'danger',
        duration: 3000
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toaster.open(NoticyAlertComponent, {
        text: `Las contraseñas no coinciden`,
        type: 'danger',
        duration: 3000
      });
      return;
    }
    const data = {
      _id: this.user_selected._id,
      name: this.name,
      lastname: this.lastname, // ✅ corregido aquí
      email: this.email,
      password: this.password
    };

    this.userService.updateUser(data).subscribe({
      next: (response) => {
        console.log(response);
        this.UserE.emit(response);
        this.toaster.open(NoticyAlertComponent, {
          text: `Usuario actualizado correctamente`,
          type: 'success',
          duration: 3000
        });
        this.modal.close('success');
      },
      error: (err) => {
        console.error(err);
        this.toaster.open(NoticyAlertComponent, {
          text: `Error al actualizar el usuario`,
          type: 'danger',
          duration: 3000
        });
      }
    });
  }
}
