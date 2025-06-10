import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
  department?: string;
  position?: string;
  role: string;
  permissions: string;
  isActive?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (requiredPermission: string) => boolean;
  hasRole: (requiredRole: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored authentication
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("auth_user");
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("auth_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  const hasPermission = (requiredPermission: string): boolean => {
    if (!user) return false;
    
    const userPermissions = user.permissions;
    
    // Full access can do everything
    if (userPermissions === 'full') return true;
    
    // Admin access can do admin and below
    if (userPermissions === 'admin' && ['admin', 'write', 'read'].includes(requiredPermission)) return true;
    
    // Write access can do write and read
    if (userPermissions === 'write' && ['write', 'read'].includes(requiredPermission)) return true;
    
    // Read access can only read
    if (userPermissions === 'read' && requiredPermission === 'read') return true;
    
    return false;
  };

  const hasRole = (requiredRole: string): boolean => {
    if (!user) return false;
    return user.role === requiredRole;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}