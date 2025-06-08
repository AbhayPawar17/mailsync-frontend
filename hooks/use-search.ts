import axios from 'axios';

export interface MailItem {
  id: number;
  user_id: number;
  category: string;
  title: string;
  sentimental: string;
  from_name: string;
  from_email: string;
  created_at: string;
  description: string;
  due_at: string;
  action_link: string;
  priority: string;
  graph_id: string;
}

export interface SearchResponse {
  data: {
    query: string;
    status: boolean;
    mail: MailItem[];
  };
}

const API_BASE_URL = 'https://mailsync.l4it.net/api';
const AUTH_TOKEN = 'Bearer 83|4Q9k3kuVUHaXPm5tM8dMZ3NM5Y0Fl5ExKpMiKbXD46b684ec';

export const searchMails = async (query: string): Promise<SearchResponse> => {
  try {
    const response = await axios.post<SearchResponse>(
      `${API_BASE_URL}/search`,
      new URLSearchParams({ query }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': AUTH_TOKEN,
        }
      }
    );
    console.log('Search response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error searching mails:', error);
    throw error;
  }
};