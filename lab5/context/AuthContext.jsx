import { createContext, useContext, useState } from 'react';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // логін
  const login = (email, password) => {
    console.log('Логін:', email, password);
    setIsAuthenticated(true);
  };

  // Реєстрація
  const register = (email, password, name) => {
    console.log('Реєстрація:', name, email);
    setIsAuthenticated(true);
  };

  // Вихід з акаунту
  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);