"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminRole, AdminUser } from './types';
import { INITIAL_ADMIN_USERS } from './mockData';

interface AuthContextType {
  currentUser: AdminUser;
  setCurrentUser: (user: AdminUser) => void;
  switchRole: (role: AdminRole) => void;
  hasPermission: (permission: string) => boolean;
  canAccessModule: (moduleName: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AdminUser>(INITIAL_ADMIN_USERS[0]); // Default Super Admin
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Switch role seamlessly to test the entire RBAC matrix
  const switchRole = (role: AdminRole) => {
    const matched = INITIAL_ADMIN_USERS.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      setIsAuthenticated(true);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!isAuthenticated) return false;
    if (currentUser.role === 'SUPER_ADMIN') return true;
    return currentUser.permissions.includes(permission) || currentUser.permissions.includes('all');
  };

  const canAccessModule = (moduleName: string): boolean => {
    if (!isAuthenticated) return false;
    const role = currentUser.role;

    switch (moduleName) {
      case 'dashboard':
        return true;
      case 'revenue_kpis':
        return role === 'SUPER_ADMIN';
      case 'products':
      case 'categories':
        return true; // Read for logistics, full for super/catalog
      case 'orders':
        return true; // Read for catalog, full for super/logistics
      case 'banners':
      case 'journal':
      case 'coupons':
        return role === 'SUPER_ADMIN' || role === 'CATALOG_MGR';
      case 'page_locks':
      case 'settings':
      case 'audit_log':
        return role === 'SUPER_ADMIN';
      default:
        return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Idle timeout simulator (30 minutes)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        // Idle logout
        console.warn('FITTEE Admin session timed out due to 30 minutes of inactivity.');
      }, 30 * 60 * 1000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        hasPermission,
        canAccessModule,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
