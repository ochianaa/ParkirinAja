import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Ganti nilai awal 'user' untuk testing
  // null = Belum Login
  // { name: 'Budi', role: 'renter' } = Login sebagai Renter
  // { name: 'Citra', role: 'owner' } = Login sebagai Owner
  // { name: 'Admin Utama', role: 'admin' } = Login sebagai Admin
  const [user, setUser] = useState({ name: 'Citra', role: 'owner' }); 

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};