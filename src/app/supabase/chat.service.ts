import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { Ichat } from '../interface/chat-response';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private supabase!: SupabaseClient;
  public savedChats = signal({});

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    )
  }

  /** Function to send chat message to Supabase */
  async chatMessage(text:string) {
    try {
      const {data, error} = await this.supabase.from('chat').insert({text});

      if (error) {
        alert(error.message);
        return null;
      }
      return data;
    } catch(error) {
      alert(error);
      return null;
    }
  }

  /** Function to fetch chat list from Supabase */
  async chatList() {
    try {
      const {data, error} = await this.supabase.from('chat').select('*, users(*)');

      if (error) {
        alert(error.message);
        return null;
      }
      return data;
    } catch(error) {
      throw error;
    }
  }

  /** Function to delete chat message from Supabase */
  async deleteChat(id: string) {
    const data = await this.supabase.from('chat').delete().eq('id', id);
    return data;
  }

  /** Function to save selected chat message */
  selectedChats(msg: Ichat) {
    this.savedChats.set(msg);
  }
}
