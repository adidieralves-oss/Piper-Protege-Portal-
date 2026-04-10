import React from 'react';
import { motion } from 'motion/react';
import { Zap, Trophy, Target, Calendar, ChevronRight, Play, MessageSquare, GraduationCap, Lightbulb, BookOpen, Rocket, BarChart3, Users, Network, Palette, Settings } from 'lucide-react';
import { useSession } from '../SessionContext';
import { DB } from '../lib/db';

interface HomeProps {
  setActiveModule: (mod: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setActiveModule }) => {
  const { user, identity } = useSession();
  const [comms, setComms] = React.useState<any[]>([]);
  const [tracks, setTracks] = React.useState<any[]>([]);
  const [goals, setGoals] = React.useState<any[]>([]);

  React.useEffect(() => {
    setComms(DB.getComms());
    setTracks(DB.getTracks());
    setGoals(DB.getGoals());
  }, []);

  const pendingCommsCount = comms.length; // Simplified
  const activeTracksCount = tracks.length;
  const activeGoalsCount = goals.length;

  const modules = [
    { id: 'comunicacao', name: 'Comunicação', icon: MessageSquare, desc: 'Comunicados e avisos' },
    { id: 'universidade', name: 'Universidade', icon: GraduationCap, desc: 'Trilhas de capacitação' },
    { id: 'faq', name: 'Base de Conhecimento', icon: Lightbulb, desc: 'Perguntas frequentes' },
    { id: 'playbooks', name: 'Playbooks', icon: BookOpen, desc: 'Processos operacionais' },
    { id: 'onboarding', name: 'Onboarding', icon: Rocket, desc: 'Primeiros passos' },
    { id: 'resultados', name: 'Resultados', icon: BarChart3, desc: 'Metas e indicadores' },
    { id: 'coaching', name: 'Coaching', icon: Users, desc: 'Orientação e desenvolvimento' },
    { id: 'pulse', name: 'Piper Pulse', icon: Zap, desc: 'Rede social corporativa' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden border border-border-subtle shadow-2xl min-h-[230px] flex items-end p-8"
      >
        <div className="absolute inset-0 bg-primary">
          {identity.cover && <img src={identity.cover} className="w-full h-full object-cover opacity-40" />}
          <div className="absolute inset-0 bg-gradient-to-tr from-bg-base via-bg-base/80 to-transparent" />
        </div>
        
        <div className="relative z-10 space-y-2">
          {identity.logo && <img src={identity.logo} className="w-16 h-16 rounded-xl mb-4 shadow-lg" />}
          <div className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            Sistema Ativo
          </div>
          <h1 className="text-3xl font-light text-white">
            Olá, <span className="font-black">{user?.name.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-text-secondary max-w-md text-sm leading-relaxed">
            {identity.tagline} — {identity.name}
          </p>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />
      </motion.div>

      {/* Stats & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold text-text-dim uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-secondary" />
                Meu Progresso
              </h2>
              <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full border border-secondary/20">
                45% concluído
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-accent2/10 to-secondary/5 border border-border-subtle rounded-xl p-4 flex items-center gap-4">
                  <div className="text-3xl">🔥</div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-text-dim uppercase tracking-wider">Nível 4 · Competente</div>
                    <div className="h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '65%' }}
                        className="h-full bg-gradient-to-r from-accent2 to-secondary"
                      />
                    </div>
                    <div className="text-[9px] text-text-dim mt-2 flex justify-between">
                      <span>540 XP total</span>
                      <span>160 XP para o próximo nível</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Pontos', value: '1,240', color: 'text-accent3' },
                  { label: 'Conquistas', value: '12', color: 'text-secondary' },
                  { label: 'Sequência', value: '5d', color: 'text-amber-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-surface-subtle border border-border-subtle rounded-xl p-3 text-center">
                    <div className={`text-lg font-black font-mono ${stat.color}`}>{stat.value}</div>
                    <div className="text-[8px] font-bold text-text-dim uppercase tracking-wider mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Module Grid */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-text-dim uppercase tracking-widest flex items-center gap-2">
              <div className="w-1 h-4 bg-secondary rounded-full" />
              Módulos
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {modules.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id)}
                  className="bg-bg-card border border-border-subtle rounded-2xl p-5 text-left hover:border-secondary/30 hover:bg-bg-card-hover transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent2 to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <m.icon className="w-6 h-6 text-text-secondary mb-3 group-hover:text-secondary transition-colors" />
                  <h3 className="text-sm font-bold text-text-primary mb-1">{m.name}</h3>
                  <p className="text-[10px] text-text-dim leading-relaxed">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Next Steps */}
          <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border-subtle flex items-center justify-between">
              <h2 className="text-xs font-bold text-text-dim uppercase tracking-widest flex items-center gap-2">
                <Rocket className="w-4 h-4 text-secondary" />
                Próximos Passos
              </h2>
              <span className="text-[10px] text-text-dim">2/5 missões</span>
            </div>
            <div className="p-2">
              {[
                { icon: MessageSquare, title: 'Ler comunicado urgente', meta: '2 pendentes', color: 'bg-red-500/10 text-red-400', action: 'comunicacao' },
                { icon: Play, title: 'Continuar: Script de Vendas', meta: 'Trilha Comercial', color: 'bg-secondary/10 text-secondary', action: 'universidade' },
                { icon: Trophy, title: 'Ver meu ranking', meta: 'Top 10 do time', color: 'bg-amber-500/10 text-amber-400', action: 'resultados' },
              ].map((step, i) => (
                <button
                  key={i}
                  onClick={() => setActiveModule(step.action)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-subtle transition-colors group text-left"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${step.color}`}>
                    <step.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate">{step.title}</div>
                    <div className="text-[10px] text-text-dim">{step.meta}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-dim group-hover:text-secondary transition-colors" />
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-border-subtle">
              <button 
                onClick={() => setActiveModule('universidade')}
                className="w-full py-2 bg-surface-subtle border border-border-subtle rounded-xl text-[10px] font-bold text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all"
              >
                Ver todas as missões →
              </button>
            </div>
          </div>

          {/* Events */}
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 shadow-sm">
            <h2 className="text-xs font-bold text-text-dim uppercase tracking-widest flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-secondary" />
              Eventos do Mês
            </h2>
            <div className="space-y-4">
              {[
                { day: '15', month: 'ABR', title: 'Treinamento de Objeções', type: 'treinamento' },
                { day: '22', month: 'ABR', title: 'Reunião de Resultados', type: 'reuniao' },
              ].map((ev, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-10 h-12 bg-gradient-to-br from-accent2 to-secondary rounded-lg flex flex-col items-center justify-center shrink-0 shadow-lg shadow-secondary/20">
                    <div className="text-sm font-black text-white leading-none">{ev.day}</div>
                    <div className="text-[8px] font-bold text-white/70 uppercase">{ev.month}</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{ev.title}</div>
                    <div className="text-[10px] text-text-dim mt-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      {ev.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
