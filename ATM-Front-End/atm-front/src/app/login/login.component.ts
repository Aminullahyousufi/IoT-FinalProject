import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router,private toastr: ToastrService) {}

  login() {
    const user = {
      username: this.username,
      password: this.password
    };

    this.http.post<any>('http://localhost:3000/users/login', user).subscribe(
      (response) => {
        if (response.success) {
          localStorage.setItem('username', this.username);
          this.router.navigate(['/dashboard']);
        } else {
          

          console.log('Invalid credentials');
          this.toastr.error('Invalid UserName or Password');
          console.log("You can't login");
        }
      },
      (error) => {
        console.error('Error occurred: ', error);
      }
    );
  }
}