import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Demo credentials — in production connect to your real API
const DEMO_USERS = [
  { email: 'demo@señas.mx', password: 'demo123' },
  { email: 'test@test.com',  password: '123456'  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    const found = DEMO_USERS.find(
      u => u.email === email && u.password === password
    );
    if (found) {
      setUser({ email: found.email });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
