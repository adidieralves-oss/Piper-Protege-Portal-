import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Home } from './components/Home';
import { Pulse } from './components/Pulse';
import { Login } from './components/Login';
import { Comunicacao } from './components/Comunicacao';
import { Universidade } from './components/Universidade';
import { Admin } from './components/Admin';
import { Faq } from './components/Faq';
import { Playbooks } from './components/Playbooks';
import { Onboarding } from './components/Onboarding';
import { Resultados } from './components/Resultados';
import { Coaching } from './components/Coaching';
import { Organograma } from './components/Organograma';
import { Identidade } from './components/Identidade';
import { SessionProvider, useSession } from './SessionContext';
import { NotificationProvider, useNotify } from './NotificationContext';
import { ThemeProvider } from './ThemeContext';
import { ChevronRight, User as UserIcon, Camera, Key, Shield } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user } = useSession();
  const [activeModule, setActiveModule] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pulseOpen, setPulseOpen] = useState(false);

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen flex bg-bg-base">
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={setActiveModule}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-[64px]' : 'ml-[260px]'} ${pulseOpen ? 'mr-[360px]' : 'mr-0'}`}>
        <Topbar onTogglePulse={() => setPulseOpen(!pulseOpen)} pulseOpen={pulseOpen} />
        
        <div className="p-6 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeModule === 'home' && <Home setActiveModule={setActiveModule} />}
              {activeModule === 'comunicacao' && <Comunicacao />}
              {activeModule === 'universidade' && <Universidade />}
              {activeModule === 'faq' && <Faq />}
              {activeModule === 'playbooks' && <Playbooks />}
              {activeModule === 'onboarding' && <Onboarding />}
              {activeModule === 'resultados' && <Resultados />}
              {activeModule === 'coaching' && <Coaching />}
              {activeModule === 'organograma' && <Organograma />}
              {activeModule === 'identidade' && <Identidade />}
              {activeModule === 'admin' && <Admin />}
              {activeModule === 'profile' && <ProfileView />}
              {activeModule !== 'home' && activeModule !== 'comunicacao' && activeModule !== 'universidade' && activeModule !== 'faq' && activeModule !== 'playbooks' && activeModule !== 'onboarding' && activeModule !== 'resultados' && activeModule !== 'coaching' && activeModule !== 'organograma' && activeModule !== 'identidade' && activeModule !== 'admin' && activeModule !== 'profile' && (
                <div className="py-20 text-center space-y-4">
                  <div className="text-4xl">📦</div>
                  <h2 className="text-xl font-bold">Módulo {activeModule}</h2>
                  <p className="text-text-dim">Este módulo está sendo implementado.</p>
                  <button 
                    onClick={() => setActiveModule('home')}
                    className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all"
                  >
                    Voltar para o Início
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Pulse isOpen={pulseOpen} onClose={() => setPulseOpen(false)} />
    </div>
  );
};

const ProfileView: React.FC = () => {
  const { user, updateUser } = useSession();
  const [activeTab, setActiveTab] = useState('dados');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 p-6 bg-white/5 border border-white/5 rounded-2xl">
        <div className="relative group">
          <div className="w-24 h-24 rounded-3xl bg-accent2 flex items-center justify-center text-3xl font-black text-white overflow-hidden border-4 border-secondary/20 shadow-xl">
            {user?.photo ? <img src={user.photo} className="w-full h-full object-cover" /> : user?.name[0].toUpperCase()}
          </div>
          <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-secondary rounded-xl flex items-center justify-center text-white shadow-lg border-2 border-bg-base group-hover:scale-110 transition-transform">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">{user?.name}</h1>
          <p className="text-text-dim">{user?.role} {user?.dept && `· ${user?.dept}`} {user?.cargo && `· ${user?.cargo}`}</p>
        </div>
      </div>

      <div className="flex border-b border-white/5">
        {[
          { id: 'dados', label: '👤 Dados', icon: UserIcon },
          { id: 'senha', label: '🔑 Senha', icon: Key },
          { id: 'acesso', label: '🔒 Acesso', icon: Shield },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === tab.id 
                ? 'text-secondary border-secondary bg-secondary/5' 
                : 'text-text-dim border-transparent hover:text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-bg-card border border-white/5 rounded-2xl p-8 shadow-sm">
        {activeTab === 'dados' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Nome Completo</label>
              <input type="text" defaultValue={user?.name} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-secondary/50 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Email</label>
              <input type="email" defaultValue={user?.email} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-secondary/50 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Cargo</label>
              <input type="text" defaultValue={user?.cargo} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-secondary/50 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest">WhatsApp</label>
              <input type="text" defaultValue={user?.whatsapp} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-secondary/50 outline-none transition-all" />
            </div>
            <div className="md:col-span-2 pt-4">
              <button className="px-8 py-3 bg-secondary text-white font-bold rounded-xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Salvar Alterações
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'senha' && (
          <div className="max-w-md space-y-6">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-200 leading-relaxed">
              Defina uma senha para proteger seu acesso no login.
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Nova Senha</label>
                <input type="password" placeholder="Mínimo 4 caracteres" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-secondary/50 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Confirmar Senha</label>
                <input type="password" placeholder="Repita a nova senha" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-secondary/50 outline-none transition-all" />
              </div>
              <button className="w-full py-3 bg-secondary text-white font-bold rounded-xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Definir Senha
              </button>
            </div>
          </div>
        )}

        {activeTab === 'acesso' && (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">Módulos que você tem acesso:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {['Comunicação', 'Universidade', 'FAQ', 'Playbooks', 'Onboarding', 'Resultados', 'Coaching', 'Pulse'].map(mod => (
                <div key={mod} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-sm font-medium">{mod}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <SessionProvider>
          <AppContent />
        </SessionProvider>
      </ThemeProvider>
    </NotificationProvider>
  );
}
