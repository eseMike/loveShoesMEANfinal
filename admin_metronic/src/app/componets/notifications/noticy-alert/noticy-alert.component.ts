import { Component, Input, OnInit } from '@angular/core';
import { Toast } from 'ngx-toast-notifications';

@Component({
  selector: 'app-noticy-alert',
  templateUrl: './noticy-alert.component.html',
  styleUrls: ['./noticy-alert.component.scss']
})
export class NoticyAlertComponent implements OnInit {
  @Input() toast: Toast;
  @Input() data: any; // ✅ Agregado para que el HTML no marque error

  alert: string = '';
  txt: string = '';

  constructor() {}

  ngOnInit(): void {
    if (this.toast?.text?.includes('-')) {
      const parts = this.toast.text.split('-');
      this.alert = parts[0];
      this.txt = parts[1];
      this.data = { type: parts[0], text: parts[1] };
    } else {
      // fallback si no hay formato con '-'
      this.alert = 'info';
      this.txt = this.toast.text;
      this.data = { type: 'info', text: this.toast.text };
    }
  }
}
