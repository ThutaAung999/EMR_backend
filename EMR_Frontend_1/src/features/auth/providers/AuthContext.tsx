import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  auth: {
    token: string | null;
    isAuthenticated: boolean;
     userImage: string | null;
  };
  setAuth: React.Dispatch<React.SetStateAction<{
    token: string | null;
    isAuthenticated: boolean;
    userImage: string | null;
  }>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
  });

  useEffect(() => {
    if (auth.token) {
      localStorage.setItem('token', auth.token);
    } else {
      localStorage.removeItem('token');
    }
  }, [auth.token]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
