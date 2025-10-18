import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../_services/users.service';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { User } from '../../../material/formcontrols/autocomplete/autocomplete.component';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {
  @Output() UserC: EventEmitter<any> = new EventEmitter();

  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    public modal: NgbActiveModal,
    public userService: UsersService,
    public toaster: Toaster
  ) {}

  ngOnInit(): void {}

  save() {
    // Validación de campos vacíos
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

    // Validación de contraseña
    if (this.password !== this.confirmPassword) {
      this.toaster.open(NoticyAlertComponent, {
        text: `Las contraseñas no coinciden`,
        type: 'danger',
        duration: 3000
      });
      return;
    }

    const data = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password
    };

    this.userService.createUser(data).subscribe({
      next: (response) => {
        console.log(response);
        this.UserC.emit(response);
        this.toaster.open(NoticyAlertComponent, {
          text: `Usuario creado correctamente`,
          type: 'success',
          duration: 3000
        });
        this.modal.close(true);
      },
      error: (err) => {
        console.error(err);
        this.toaster.open(NoticyAlertComponent, {
          text: `Error al crear el usuario`,
          type: 'danger',
          duration: 3000
        });
      }
    });
  }
}
