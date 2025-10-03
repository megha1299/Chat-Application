import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../../supabase/chat.service';
import { Ichat } from '../../interface/chat-response';
import { DatePipe } from '@angular/common';
import { DeleteModalComponent } from '../../layout/delete-modal/delete-modal.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, DeleteModalComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  private auth = inject(AuthService);
  private chat_service = inject(ChatService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  chats = signal<Ichat[]>([])

  public chatForm!: FormGroup;

  constructor() {
    this.chatForm = this.fb.group({
      chat_message: ['', Validators.required]
    });
    /** Effect to load chat list on component initialization */
    effect(() => {
      this.onListChat();
    });
  }

  /** Function to log out user*/
  async logOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login'])
    }).catch((err) => {
      alert(err.messaage)
    })
  }

  /** Function to submit chat message*/
  onSubmit() {
    if (!this.chatForm.valid) {
      console.log('Form is invalid:', this.chatForm.errors);
      alert('Please enter a message before sending.');
      return;
    }
    const formValue = this.chatForm.value.chat_message;
    console.log('Submitting message:', formValue);

    this.chat_service
      .chatMessage(formValue)
      .then((res) => {
        console.log('API response:', res);
        this.chatForm.reset();
        this.onListChat();
      })
      .catch((err) => {
        console.error('API error:', err);
        alert(err && err.message ? err.message : JSON.stringify(err));
      });
  }

  /** Function to fetch and list chat*/
  onListChat() {
    this.chat_service.chatList().then((res: Ichat[] | null) => {
    console.log(res);
    if (res !== null) {
      this.chats.set(res);
    } else{
      console.log('No chats available');
      
    }
    })
    .catch((err) => {
      alert(err.message);
    })
    }

    /** Function to select and open chat message dropdown */
    openMessageDropdown(msg: Ichat) {
      console.log(msg);
      this.chat_service.selectedChats(msg);
    }
}
