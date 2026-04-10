import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Identity } from './types';
import { DB } from './lib/db';

interface SessionContextType {
  user: User | null;
  identity: Identity;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  updateIdentity: (identity: Identity) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => DB.get('session', null));
  const [identity, setIdentity] = useState<Identity>(() => DB.getIdentity());

  const login = (u: User) => {
    setUser(u);
    DB.set('session', u);
  };

  const logout = () => {
    setUser(null);
    DB.delete('session');
    window.location.reload();
  };

  const updateUser = (u: User) => {
    setUser(u);
    DB.set('session', u);
    // Also update in users list
    const users = DB.getUsers();
    const idx = users.findIndex(usr => usr.id === u.id || usr.email === u.email);
    if (idx >= 0) {
      users[idx] = u;
      DB.set('users', users);
    }
  };

  const updateIdentity = (id: Identity) => {
    setIdentity(id);
    DB.set('identity', id);
  };

  return (
    <SessionContext.Provider value={{ user, identity, login, logout, updateUser, updateIdentity }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
