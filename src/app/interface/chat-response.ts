export interface Ichat {
    created_at: string;
    editable: boolean;
    id: number;
    text: string;
    sender: string;
    users: {
        avatar_url: string;
        id: string;
        full_name: string;
    }    
}