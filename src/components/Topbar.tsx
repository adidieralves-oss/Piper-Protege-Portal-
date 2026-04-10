import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, Type, BookOpen, Menu, Zap } from 'lucide-react';
import { useSession } from '../SessionContext';
import { useTheme } from '../ThemeContext';

interface TopbarProps {
  onTogglePulse: () => void;
  pulseOpen: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({ onTogglePulse, pulseOpen }) => {
  const { user, identity } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');

  const dateStr = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  });

  return (
    <header className="sticky top-0 z-[100] h-[52px] bg-bg-elevated/95 backdrop-blur-md border-b border-border-subtle px-6 flex items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button className="md:hidden text-text-secondary hover:text-text-primary transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="relative w-full max-w-[300px] group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-secondary transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar conteúdo… (Ctrl+K)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-subtle border border-border-subtle rounded-lg py-1.5 pl-9 pr-4 text-sm text-text-primary focus:outline-none focus:border-secondary/30 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="hidden lg:block text-[11px] font-bold text-text-dim uppercase tracking-wider mr-2">
          {dateStr}
        </span>

        <div className="flex items-center gap-1 bg-surface-subtle rounded-lg p-0.5 border border-border-subtle">
          <button className="w-8 h-8 flex items-center justify-center text-text-dim hover:text-text-primary transition-colors hover:bg-surface-subtle rounded-md">
            <span className="text-[10px] font-bold">A-</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-text-dim hover:text-text-primary transition-colors hover:bg-surface-subtle rounded-md">
            <span className="text-[12px] font-bold">A+</span>
          </button>
        </div>

        <button className="w-8 h-8 flex items-center justify-center text-text-dim hover:text-text-primary transition-colors bg-surface-subtle border border-border-subtle rounded-lg hover:bg-white/10">
          <BookOpen className="w-4 h-4" />
        </button>

        <button 
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center text-text-dim hover:text-text-primary transition-colors bg-surface-subtle border border-border-subtle rounded-lg hover:bg-white/10"
          title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
        >
          {theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="relative">
          <button className="w-8 h-8 flex items-center justify-center text-text-dim hover:text-text-primary transition-colors bg-surface-subtle border border-border-subtle rounded-lg hover:bg-white/10">
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full border-2 border-bg-elevated" />
        </div>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <button 
          onClick={onTogglePulse}
          className={`relative w-8 h-8 flex items-center justify-center transition-all border rounded-lg ${
            pulseOpen 
              ? 'bg-secondary/10 border-secondary/30 text-secondary' 
              : 'bg-surface-subtle border-border-subtle text-text-dim hover:text-text-primary hover:bg-white/10'
          }`}
        >
          <Zap className={`w-4 h-4 ${pulseOpen ? 'fill-secondary' : ''}`} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-bg-elevated animate-pulse" />
        </button>

        <button className="w-8 h-8 rounded-lg bg-accent2 flex items-center justify-center text-[10px] font-bold text-white shrink-0 overflow-hidden border-2 border-secondary/20 hover:border-secondary/40 transition-all">
          {user?.photo ? <img src={user.photo} className="w-full h-full object-cover" /> : user?.name[0].toUpperCase()}
        </button>
      </div>
    </header>
  );
};
