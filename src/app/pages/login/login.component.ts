import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 private auth = inject(AuthService);

 /** Function to handle user authentication */
 async handleAuth() {
  const response = await this.auth.signIn();
 }
}
