import { Component, inject, signal } from '@angular/core';
import { ChatService } from '../../supabase/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css'
})
export class DeleteModalComponent {
  private chart_service = inject(ChatService);
  private router = inject(Router);
  dismiss = signal(false);

  constructor() { }

  /** Function to delete selected chat message */
  deleteChat() {
    const chat = (this.chart_service.savedChats() as {id: string}).id;
  
    this.chart_service.deleteChat(chat).then(() => {
      let currentUrl = this.router.url;

      this.dismiss.set(true);

      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>{
        this.router.navigate([currentUrl]);
      })
    }).catch((err) => {
      console.log(err);
      alert(err.message);
    });
    
  }
}
