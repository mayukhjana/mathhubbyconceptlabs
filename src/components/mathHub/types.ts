
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  image?: string;
}

export interface ChatSession {
  date: string;
  messages: Message[];
}
