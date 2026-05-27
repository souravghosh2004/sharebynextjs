"use client"; // 🚀 Mandatory for React Context in Next.js

import { createContext, useState, useEffect, useContext } from "react";
// Make sure this path matches your new Next.js structure 
// (e.g., if you moved it to src/lib/api.js, update the path)
import { checkAuth } from "../api/auth.api"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true); // Start true so UI waits
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await checkAuth();
        
        // I recommend commenting out console logs for production
        // console.log("auth response = ", response); 
        
        // Added optional chaining (?.) for extra safety in case response is undefined
        if (response?.success) { 
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);