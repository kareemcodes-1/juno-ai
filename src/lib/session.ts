
import { v4 as uuidv4 } from "uuid";

export function getSessionId(userId?: string) {
  if (userId) {
    // Logged-in user → use their userId
    return userId;
  }

  // Anonymous visitor → check localStorage
  let sessionId = localStorage.getItem("chat_session_id");
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem("chat_session_id", sessionId);
  }
  return sessionId;
}
