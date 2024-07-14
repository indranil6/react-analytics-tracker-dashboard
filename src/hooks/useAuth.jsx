import { useState, useEffect, useContext, createContext } from 'react';
import { onUserStateChange } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem('rat:dashboard:user') ? JSON.parse(localStorage.getItem('rat:dashboard:user')) : null
  );

  useEffect(() => {
    const unsubscribe = onUserStateChange((user) => {
      localStorage.setItem('rat:dashboard:user', JSON.stringify(user));
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>;
};
