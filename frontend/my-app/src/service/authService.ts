export const authService = {
  register: async (username: string, email: string, password: string) => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  },

  login: async (email: string, password: string) => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  },
};
