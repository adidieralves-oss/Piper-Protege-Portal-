import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Target, TrendingUp, Award, Star, Users as UsersIcon, Building2, GraduationCap } from 'lucide-react';
import { useSession } from '../SessionContext';
import { useNotify } from '../NotificationContext';
import { DB } from '../lib/db';
import { Goal } from '../types';

export const Resultados: React.FC = () => {
  const { user } = useSession();
  const { notify } = useNotify();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeTab, setActiveTab] = useState<'meu' | 'equipe' | 'empresa'>('meu');

  useEffect(() => {
    setGoals(DB.getGoals());
  }, []);

  const isAdmin = user?.role === 'Admin';
  const filteredGoals = goals.filter(g => {
    if (activeTab === 'meu') return g.individual && (g.targetUser === user?.name || g.targetUser === user?.email);
    if (activeTab === 'equipe') return !g.individual && (g.dept === user?.dept || g.dept === 'Todos');
    return !g.individual && g.dept === 'Todos';
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
        {[
          { id: 'meu', label: '👤 Meu Resultado', icon: Target },
          { id: 'equipe', label: '👥 Equipe', icon: UsersIcon },
          { id: 'empresa', label: '🏢 Empresa', icon: Building2 },
        ].map(tab => {
          if (!isAdmin && (tab.id === 'equipe' || tab.id === 'empresa')) {
            // Regular users might only see their team if allowed, but for now let's follow original logic
            // In original app, regular users could see team/company if they had permission
          }
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-secondary text-white shadow-lg shadow-secondary/20' 
                  : 'text-text-dim hover:text-text-primary hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Score Piper', value: '84', sub: '/100', color: 'text-secondary', icon: Star },
          { label: 'XP Acumulado', value: '1,240', sub: 'pts', color: 'text-accent3', icon: TrendingUp },
          { label: 'Aulas', value: '12', sub: '/25', color: 'text-blue-400', icon: GraduationCap },
          { label: 'Conquistas', value: '8', sub: '/15', color: 'text-amber-400', icon: Award },
        ].map((stat, i) => (
          <div key={i} className="bg-bg-card border border-white/5 rounded-2xl p-6 shadow-sm text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-2 text-text-dim">
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{stat.label}</div>
            <div className="flex items-baseline justify-center gap-1">
              <span className={`text-3xl font-black font-mono ${stat.color}`}>{stat.value}</span>
              <span className="text-xs text-text-dim font-bold">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-text-dim uppercase tracking-widest flex items-center gap-2 px-2">
          <div className="w-1 h-4 bg-secondary rounded-full" />
          Metas Ativas
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGoals.length > 0 ? filteredGoals.map((goal, i) => (
            <div key={i} className="bg-bg-card border border-white/5 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">{goal.type}</div>
                  <h4 className="text-sm font-bold text-white">{goal.name}</h4>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-white">{goal.value}</div>
                  <div className="text-[9px] text-text-dim uppercase">{goal.period}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-text-dim">Progresso</span>
                  <span className="text-secondary">65%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    className="h-full bg-gradient-to-r from-accent2 to-secondary"
                  />
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center space-y-4 bg-bg-card border border-white/5 rounded-2xl">
              <div className="text-4xl">📊</div>
              <h2 className="text-xl font-bold">Nenhuma meta configurada</h2>
              <p className="text-text-dim">As metas para esta visualização aparecerão aqui.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
