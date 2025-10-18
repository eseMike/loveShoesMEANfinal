import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../auth/_services/auth.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  allUsers() {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({
      'x-access-token': this.authservice.token
    });
    const URL = URL_SERVICIOS + 'users/list';
    return this.http.get(URL, { headers }).pipe(
      finalize(() => {
        this.isLoadingSubject.next(false);
      })
    );
  }

  createUser(data) {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({
      'x-access-token': this.authservice.token
    });
    const URL = URL_SERVICIOS + 'users/register_admin';
    return this.http.post(URL, data, { headers }).pipe(
      finalize(() => {
        this.isLoadingSubject.next(false);
      })
    );
  }

  updateUser(data) {
    this.isLoadingSubject.next(true);
    const headers = new HttpHeaders({
      'x-access-token': this.authservice.token
    });
    const URL = URL_SERVICIOS + 'users/update';
    return this.http.put(URL, data, { headers }).pipe(
      finalize(() => {
        this.isLoadingSubject.next(false);
      })
    );
  }

  deleteUser(id: string) {
  this.isLoadingSubject.next(true);
  const headers = new HttpHeaders({
    'x-access-token': this.authservice.token
  });
  const URL = URL_SERVICIOS + 'users/delete';
  // Angular permite body en DELETE via options.body
  return this.http.delete(URL, { headers, body: { _id: id } }).pipe(
    finalize(() => {
      this.isLoadingSubject.next(false);
    })
  );
  }
  
  searchUsers(value: string) {
  this.isLoadingSubject.next(true);
  const headers = new HttpHeaders({
    'x-access-token': this.authservice.token
  });
  const URL = `${URL_SERVICIOS}users/list?value=${encodeURIComponent(value || '')}`;
  return this.http.get(URL, { headers }).pipe(
    finalize(() => {
      this.isLoadingSubject.next(false);
    })
  );
}
}
