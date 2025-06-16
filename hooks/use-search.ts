import axios from 'axios';
import Cookies from 'js-cookie';

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

const BASE_URI = process.env.NEXT_PUBLIC_BASE_URI

export const searchMails = async (query: string): Promise<SearchResponse> => {
  // Get token from cookies - matches your auth implementation
  const authToken = Cookies.get('authToken');
  
  if (!authToken) {
    throw new Error('Authentication token not found in cookies');
  }

  try {
    const response = await axios.post<SearchResponse>(
      `${BASE_URI}/search`,
      new URLSearchParams({ query }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${authToken}`,
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