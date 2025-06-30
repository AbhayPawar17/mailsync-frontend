import type { Email } from "@/types/email"
import Cookies from "js-cookie"

const API_BASE_URL = "https://mailsync.l4it.net/api"

const getToken = (): string => {
  const token = Cookies.get("authToken")
  if (!token) {
    throw new Error("Authentication token not found in cookies")
  }
  return token
}

export async function fetchAllMessages(): Promise<Email[]> {
  try {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}/allmessages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch messages")
    }

    const data = await response.json()

    if (data.status && data.message) {
      return data.message.map((email: any) => ({
        ...email,
        read: Math.random() > 0.3, // Simulate read status
        flagged: email.priority === "High",
      }))
    }

    return []
  } catch (error) {
    console.error("Error fetching messages:", error)
    return []
  }
}

export async function fetchMessageDetail(graphId: string): Promise<any> {
  try {
    const token = getToken()
    const formData = new FormData()
    formData.append("graph_id", graphId)

    const response = await fetch(`${API_BASE_URL}/view_message`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to fetch message detail")
    }

    const data = await response.json()

    if (data.status && data.data) {
      return data.data
    }

    return null
  } catch (error) {
    console.error("Error fetching message detail:", error)
    return null
  }
}

export async function fetchSmartReplies(graphId: string): Promise<string[]> {
  try {
    const token = getToken()
    const formData = new FormData()
    formData.append("graph_id", graphId)

    const response = await fetch(`${API_BASE_URL}/smart_reply`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to fetch smart replies")
    }

    const data = await response.json()

    if (data.data && data.data.body && data.data.body.replies) {
      // Convert HTML to plain text
      return data.data.body.replies.map((reply: string) => {
        // Remove HTML tags and decode HTML entities
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = reply
        return tempDiv.textContent || tempDiv.innerText || ""
      })
    }

    return []
  } catch (error) {
    console.error("Error fetching smart replies:", error)
    return []
  }
}

export async function sendSmartReply(graphId: string, replyMessage: string): Promise<boolean> {
  try {
    const token = getToken();
    const formData = new FormData();
    formData.append("graph_id", graphId);
    formData.append("reply_message", replyMessage);

    const response = await fetch(`${API_BASE_URL}/reply`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to send reply");
    }

    const data = await response.json();
    
    // Check both possible response formats:
    // 1. The nested format you showed: { message: { status: boolean, message: string } }
    // 2. Direct status format for backward compatibility
    if (data.message?.status !== undefined) {
      return data.message.status;
    } else if (data.status !== undefined) {
      return data.status;
    }
    
    // If neither format is found, assume failure
    return false;
  } catch (error) {
    console.error("Error sending smart reply:", error);
    return false;
  }
}

export async function updateMail(): Promise<boolean> {
  try {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}/update_mail`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to update mail")
    }

    const data: { status: boolean } = await response.json()
    return data.status || false
  } catch (error) {
    console.error("Error updating mail:", error)
    return false
  }
}

export async function searchEmails(query: string): Promise<Email[]> {
  try {
    const token = getToken()
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        query: query,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to search emails")
    }

    const data = await response.json()

    if (data.data && data.data.status && data.data.mail) {
      return data.data.mail.map((email: any) => ({
        ...email,
        read: Math.random() > 0.3, // Simulate read status
        flagged: email.priority === "High",
      }))
    }

    return []
  } catch (error) {
    console.error("Error searching emails:", error)
    return []
  }
}
