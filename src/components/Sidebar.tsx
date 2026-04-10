import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  MessageSquare, 
  GraduationCap, 
  Lightbulb, 
  BookOpen, 
  Rocket, 
  BarChart3, 
  Users, 
  Zap, 
  Network, 
  Palette, 
  Settings, 
  LogOut, 
  ChevronLeft,
  ChevronDown,
  Shield
} from 'lucide-react';
import { useSession } from '../SessionContext';
import { UserRole } from '../types';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (mod: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const MODULES = [
  { id: 'home', name: 'Início', icon: Home, group: 'principal' },
  { id: 'comunicacao', name: 'Comunicação', icon: MessageSquare, group: 'principal' },
  { id: 'universidade', name: 'Universidade', icon: GraduationCap, group: 'conhecimento' },
  { id: 'faq', name: 'Base de Conhecimento', icon: Lightbulb, group: 'conhecimento' },
  { id: 'playbooks', name: 'Playbooks', icon: BookOpen, group: 'conhecimento' },
  { id: 'onboarding', name: 'Onboarding', icon: Rocket, group: 'conhecimento' },
  { id: 'resultados', name: 'Resultados', icon: BarChart3, group: 'performance' },
  { id: 'coaching', name: 'Coaching', icon: Users, group: 'performance' },
  { id: 'pulse', name: 'Piper Pulse', icon: Zap, group: 'empresa' },
  { id: 'organograma', name: 'Organograma', icon: Network, group: 'empresa' },
  { id: 'identidade', name: 'Identidade', icon: Palette, group: 'empresa', adminOnly: true },
  { id: 'admin', name: 'Configurações', icon: Settings, group: 'sistema', adminOnly: true },
];

const GROUPS = {
  principal: 'Principal',
  conhecimento: 'Conhecimento',
  performance: 'Telemetria',
  empresa: 'Empresa',
  sistema: 'Sistema',
};

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule, collapsed, setCollapsed }) => {
  const { user, identity, logout } = useSession();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (group: string) => {
    setCollapsedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const filteredModules = MODULES.filter(m => {
    if (m.adminOnly && user?.role !== 'Admin') return false;
    return true;
  });

  const groupedModules = filteredModules.reduce((acc, m) => {
    if (!acc[m.group]) acc[m.group] = [];
    acc[m.group].push(m);
    return acc;
  }, {} as Record<string, typeof MODULES>);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 260 }}
      className="fixed left-0 top-0 h-screen bg-bg-elevated border-r border-border-subtle flex flex-col z-[200] shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border-subtle flex items-center gap-3 min-h-[60px]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent2 to-secondary flex items-center justify-center shrink-0 shadow-lg shadow-secondary/20">
          {identity.logo ? (
            <img src={identity.logo} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <Shield className="w-5 h-5 text-white" />
          )}
        </div>
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 min-w-0"
          >
            <div className="font-bold text-sm truncate">{identity.name}</div>
            <div className="text-[9px] uppercase tracking-widest text-text-dim truncate">{identity.tagline}</div>
          </motion.div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-6 h-6 rounded-md bg-surface-subtle border border-border-subtle flex items-center justify-center text-text-dim hover:text-secondary transition-colors"
        >
          <ChevronLeft className={`w-3 h-3 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* User Card */}
      <div className="p-2">
        <button 
          onClick={() => setActiveModule('profile')}
          className="w-full flex items-center gap-3 p-2 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/5 border border-secondary/10 hover:border-secondary/30 transition-all group overflow-hidden"
        >
          <div className="w-7 h-7 rounded-lg bg-accent2 flex items-center justify-center text-[10px] font-bold text-white shrink-0 overflow-hidden">
            {user?.photo ? <img src={user.photo} className="w-full h-full object-cover" /> : user?.name[0].toUpperCase()}
          </div>
          {!collapsed && (
            <div className="text-left min-w-0">
              <div className="text-xs font-bold truncate">{user?.name}</div>
              <div className="text-[10px] text-text-dim truncate">{user?.role}</div>
            </div>
          )}
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4 custom-scrollbar">
        {Object.entries(GROUPS).map(([groupId, groupName]) => {
          const modules = groupedModules[groupId];
          if (!modules) return null;

          return (
            <div key={groupId} className="space-y-1">
              {!collapsed && (
                <button 
                  onClick={() => toggleGroup(groupId)}
                  className="w-full flex items-center justify-between px-2 py-1 text-[9px] font-bold text-text-dim uppercase tracking-widest hover:text-text-secondary transition-colors"
                >
                  <span>{groupName}</span>
                  {groupId !== 'principal' && (
                    <ChevronDown className={`w-3 h-3 transition-transform ${collapsedGroups[groupId] ? '-rotate-90' : ''}`} />
                  )}
                </button>
              )}
              
              <AnimatePresence initial={false}>
                {!collapsedGroups[groupId] && (
                  <motion.div
                    initial={collapsed ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-1"
                  >
                    {modules.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setActiveModule(m.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group ${
                          activeModule === m.id 
                            ? 'bg-secondary/10 text-secondary font-bold border border-secondary/20' 
                            : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary border border-transparent'
                        }`}
                      >
                        <m.icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${activeModule === m.id ? 'text-secondary' : 'text-text-dim'}`} />
                        {!collapsed && <span className="text-sm truncate">{m.name}</span>}
                        {activeModule === m.id && (
                          <motion.div 
                            layoutId="active-pill"
                            className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-secondary rounded-full"
                          />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border-subtle space-y-2">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-text-dim hover:text-red-400 hover:bg-red-400/5 transition-all group overflow-hidden"
        >
          <LogOut className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          {!collapsed && <span className="text-xs font-medium">Sair do portal</span>}
        </button>
        {!collapsed && (
          <div className="text-[9px] text-text-dim text-center opacity-50">
            Piper Protege © {new Date().getFullYear()}
          </div>
        )}
      </div>
    </motion.aside>
  );
};
