
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

export interface ChatHistoryItem {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  created_at: string;
  has_image?: boolean;
}
