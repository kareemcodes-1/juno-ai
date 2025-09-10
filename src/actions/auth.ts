
import { User } from "../../types";

export async function registerUser(userInfo: User) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/register`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to register');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error; // So caller can handle it
  }
}
