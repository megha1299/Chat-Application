import { inject, Injectable, NgZone } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase!: SupabaseClient;

  private router = inject(Router);
  private _ngZone = inject(NgZone);

  constructor() { 
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    )

    this.supabase.auth.onAuthStateChange((event, session) => {
      
      localStorage.setItem('session', JSON.stringify(session?.user));

      if (session?.user) {
        /** Navigate to chat page on successful login */
        this._ngZone.run(() => {
          this.router.navigate(['/chat']);
        });
      }
    })
  }

  /** to determine if logged in or not */
  get isLoggedIn(): boolean {
     const user = localStorage.getItem('session') as string

     return user === 'undefined' ? false : true;
  }

  /** Function to handle user sign-in with Google OAuth */
  async signIn() {
    await this.supabase.auth.signInWithOAuth({
      provider: 'google'
    });
  }

  /** Function to handle user sign-out */
  async signOut() {
    await this.supabase.auth.signOut();
  }
}
