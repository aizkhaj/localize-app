export interface Message {
  _id?: string;
  name: string;
  message: string;
  createdAt?: string;
}

export interface ChatContextType {
  messages: Message[];
  name: string;
  setName: (name: string) => void;
  sendMessage: (message: string) => void;
  isLoading: boolean;
}