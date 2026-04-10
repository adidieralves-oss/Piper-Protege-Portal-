import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Shield, User as UserIcon, Lock, ChevronRight } from 'lucide-react';
import { useSession } from '../SessionContext';
import { useNotify } from '../NotificationContext';
import { DB } from '../lib/db';
import { User } from '../types';

export const Login: React.FC = () => {
  const { login, identity } = useSession();
  const { notify } = useNotify();
  const [view, setView] = useState<'users' | 'email' | 'admin' | 'new'>('users');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [newName, setNewName] = useState('');
  const [newCargo, setNewCargo] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(DB.getUsers());
  }, []);

  const handleLoginAs = (user: User) => {
    const savedPass = DB.get(`upass_${user.id || user.email || user.name}`, null);
    if (savedPass) {
      notify('Este usuário possui senha. Use o login por email.', 'warning');
      setView('email');
      setEmail(user.email || '');
      return;
    }
    login(user);
    notify(`Bem-vindo(a), ${user.name.split(' ')[0]}!`, 'success');
  };

  const handleEmailLogin = () => {
    if (!email) return notify('Informe o email.', 'warning');
    const u = users.find(usr => usr.email.toLowerCase() === email.toLowerCase());
    if (!u) return notify('Email não encontrado.', 'error');

    const savedPass = DB.get(`upass_${u.id || u.email || u.name}`, null);
    if (savedPass && password !== savedPass) {
      return notify('Senha incorreta.', 'error');
    }

    login(u);
    notify(`Bem-vindo(a), ${u.name.split(' ')[0]}!`, 'success');
  };

  const handleAdminLogin = () => {
    const stored = DB.get('adminPass', 'piper@2026');
    if (adminPass !== stored) return notify('Senha incorreta.', 'error');

    let adminUser = users.find(u => u.role === 'Admin');
    if (!adminUser) {
      adminUser = {
        id: 'admin',
        name: 'Administrador',
        email: 'admin@piperprotege.com',
        role: 'Admin',
        active: true,
        cargo: 'Administrador'
      };
      const updatedUsers = [adminUser, ...users];
      DB.set('users', updatedUsers);
    }

    login(adminUser);
    notify('Bem-vindo, Admin!', 'success');
  };

  const handleNewUser = () => {
    if (!newName) return notify('Informe seu nome.', 'warning');
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: newName,
      email: '',
      role: 'Colaborador',
      active: true,
      cargo: newCargo
    };
    const updatedUsers = [...users, newUser];
    DB.set('users', updatedUsers);
    login(newUser);
    notify(`Bem-vindo(a), ${newName.split(' ')[0]}!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center p-5 overflow-y-auto bg-[#0D1130]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_-10%,rgba(25,35,100,0.95)_0%,transparent_65%),radial-gradient(ellipse_50%_40%_at_85%_90%,rgba(15,8,50,0.7)_0%,transparent_55%)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center mb-8"
      >
        <h1 className="font-serif text-5xl font-bold text-white mb-2 tracking-tight">
          {identity.name || 'Piper Pulse'}
        </h1>
        <p className="text-lg text-white/60">
          Portal de cultura e desenvolvimento
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[400px] bg-white rounded-3xl p-8 shadow-2xl"
      >
        {view === 'users' && (
          <div className="space-y-4">
            {users.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-4">Escolha seu perfil</p>
                {users.slice(0, 4).map((u, i) => (
                  <button
                    key={i}
                    onClick={() => handleLoginAs(u)}
                    className="w-full flex items-center gap-3 p-3 bg-slate-50 border-2 border-slate-100 rounded-xl hover:border-secondary hover:bg-white hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent2 flex items-center justify-center text-white font-bold overflow-hidden shrink-0">
                      {u.photo ? <img src={u.photo} className="w-full h-full object-cover" /> : u.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{u.name}</div>
                      <div className="text-[10px] text-slate-500">{u.role} {u.dept && `· ${u.dept}`}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-secondary transition-colors" />
                  </button>
                ))}
              </div>
            )}

            <div className="relative flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap">ou acesse com</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setView('email')} className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                <UserIcon className="w-5 h-5 text-slate-600" />
                <span className="text-xs font-bold text-slate-600">Email</span>
              </button>
              <button onClick={() => setView('admin')} className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                <Lock className="w-5 h-5 text-slate-600" />
                <span className="text-xs font-bold text-slate-600">Admin</span>
              </button>
            </div>

            <button onClick={() => setView('new')} className="w-full py-3 text-sm font-bold text-slate-500 hover:text-secondary transition-colors">
              Novo colaborador? Clique aqui →
            </button>
          </div>
        )}

        {view === 'email' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full p-3 bg-slate-100 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-secondary focus:bg-white transition-all text-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900">Senha (se houver)</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 pr-12 bg-slate-100 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-secondary focus:bg-white transition-all text-slate-900"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              onClick={handleEmailLogin}
              className="w-full py-4 bg-secondary text-white font-bold rounded-xl shadow-lg shadow-secondary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Entrar
            </button>
            <button onClick={() => setView('users')} className="w-full text-sm font-bold text-slate-400 hover:text-slate-600">
              Voltar
            </button>
          </div>
        )}

        {view === 'admin' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900">Senha de Administrador</label>
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="Senha admin"
                className="w-full p-3 bg-slate-100 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-accent2 focus:bg-white transition-all text-slate-900"
              />
            </div>
            <button
              onClick={handleAdminLogin}
              className="w-full py-4 bg-accent2 text-white font-bold rounded-xl shadow-lg shadow-accent2/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              🔐 Entrar como Admin
            </button>
            <button onClick={() => setView('users')} className="w-full text-sm font-bold text-slate-400 hover:text-slate-600">
              Voltar
            </button>
          </div>
        )}

        {view === 'new' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900">Nome completo</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Seu nome"
                className="w-full p-3 bg-slate-100 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-secondary focus:bg-white transition-all text-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900">Cargo</label>
              <input
                type="text"
                value={newCargo}
                onChange={(e) => setNewCargo(e.target.value)}
                placeholder="Seu cargo"
                className="w-full p-3 bg-slate-100 border-2 border-slate-100 rounded-xl focus:outline-none focus:border-secondary focus:bg-white transition-all text-slate-900"
              />
            </div>
            <button
              onClick={handleNewUser}
              className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Entrar como Colaborador →
            </button>
            <button onClick={() => setView('users')} className="w-full text-sm font-bold text-slate-400 hover:text-slate-600">
              Voltar
            </button>
          </div>
        )}
      </motion.div>

      <div className="relative z-10 mt-8 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-secondary flex items-center justify-center mx-auto mb-2 text-secondary font-black text-lg">
          p.
        </div>
        <p className="text-sm text-white/40">v1.0.0</p>
        <p className="text-xs text-white/30">© 2026 Piper. Todos os direitos reservados.</p>
      </div>
    </div>
  );
};
