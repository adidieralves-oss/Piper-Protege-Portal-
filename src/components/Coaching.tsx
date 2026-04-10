import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Calendar, BookOpen, Target, CheckCircle2, Plus, ChevronRight, Play } from 'lucide-react';
import { useSession } from '../SessionContext';
import { useNotify } from '../NotificationContext';
import { DB } from '../lib/db';

export const Coaching: React.FC = () => {
  const { user } = useSession();
  const { notify } = useNotify();
  const [activeTab, setActiveTab] = useState<'plano' | 'sessoes' | 'recursos'>('plano');
  const [pdi, setPdi] = useState({ objetivo: '', fortes: '', melhorias: '' });

  useEffect(() => {
    const saved = DB.get(`pdi_${user?.id || 'guest'}`, { objetivo: '', fortes: '', melhorias: '' });
    setPdi(saved);
  }, [user]);

  const handleSavePDI = () => {
    DB.set(`pdi_${user?.id || 'guest'}`, pdi);
    notify('PDI salvo com sucesso!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar">
        {[
          { id: 'plano', label: '📋 Plano de Desenvolvimento', icon: Target },
          { id: 'sessoes', label: '📅 Sessões', icon: Calendar },
          { id: 'recursos', label: '📚 Recursos', icon: BookOpen },
        ].map(tab => (
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
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'plano' && (
            <div className="space-y-6">
              <div className="bg-bg-card border border-white/5 rounded-2xl p-8 shadow-sm space-y-6">
                <h3 className="text-xs font-bold text-text-dim uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1 h-4 bg-secondary rounded-full" />
                  Plano de Desenvolvimento Individual (PDI)
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest">🎯 Objetivo Principal</label>
                    <textarea 
                      placeholder="O que você quer alcançar nos próximos 90 dias?"
                      value={pdi.objetivo}
                      onChange={(e) => setPdi({ ...pdi, objetivo: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-secondary/50 outline-none transition-all min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest">💪 Pontos Fortes</label>
                      <textarea 
                        placeholder="Suas principais forças..." 
                        value={pdi.fortes}
                        onChange={(e) => setPdi({ ...pdi, fortes: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-secondary/50 outline-none transition-all min-h-[80px]" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest">🔧 Áreas de Melhoria</label>
                      <textarea 
                        placeholder="O que você quer desenvolver..." 
                        value={pdi.melhorias}
                        onChange={(e) => setPdi({ ...pdi, melhorias: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-secondary/50 outline-none transition-all min-h-[80px]" 
                      />
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleSavePDI}
                  className="px-8 py-3 bg-secondary text-white font-bold rounded-xl shadow-lg shadow-secondary/20 hover:scale-[1.02] transition-all"
                >
                  Salvar PDI
                </button>
              </div>

              <div className="bg-bg-card border border-white/5 rounded-2xl p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-text-dim uppercase tracking-widest">✅ Plano de Ação</h3>
                  <button className="text-xs font-bold text-secondary flex items-center gap-1 hover:underline">
                    <Plus className="w-4 h-4" />
                    Adicionar Ação
                  </button>
                </div>
                
                <div className="space-y-2">
                  {[
                    { text: 'Completar trilha de Vendas Avançadas', done: true },
                    { text: 'Realizar 5 roleplays com o gestor', done: false },
                    { text: 'Ler o playbook de Objeções', done: false },
                  ].map((acao, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl group">
                      <button className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                        acao.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/20 hover:border-secondary'
                      }`}>
                        {acao.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <span className={`text-sm ${acao.done ? 'text-text-dim line-through' : 'text-text-primary'}`}>
                        {acao.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sessoes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-bold text-text-dim uppercase tracking-widest">📅 Próximas Sessões</h3>
                <button className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded-xl shadow-lg shadow-secondary/20">
                  Agendar Sessão
                </button>
              </div>
              
              <div className="space-y-3">
                {[
                  { date: '12 Abr', time: '14:30', title: 'Feedback Mensal', coach: 'Ricardo Silva', status: 'confirmado' },
                  { date: '25 Abr', time: '10:00', title: 'Mentoria Técnica', coach: 'Ana Paula', status: 'pendente' },
                ].map((sess, i) => (
                  <div key={i} className="bg-bg-card border border-white/5 rounded-2xl p-5 flex items-center gap-6 shadow-sm">
                    <div className="w-14 h-14 bg-gradient-to-br from-accent2 to-secondary rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-lg">
                      <div className="text-lg font-black text-white leading-none">{sess.date.split(' ')[0]}</div>
                      <div className="text-[9px] font-bold text-white/70 uppercase">{sess.date.split(' ')[1]}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white mb-1">{sess.title}</h4>
                      <div className="text-xs text-text-dim flex items-center gap-3">
                        <span>👤 {sess.coach}</span>
                        <span>⏰ {sess.time}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      sess.status === 'confirmado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {sess.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'recursos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Guia de Feedback', type: 'PDF', icon: BookOpen },
                { title: 'Workshop de Carreira', type: 'Vídeo', icon: Play },
                { title: 'E-book: Liderança', type: 'E-book', icon: BookOpen },
              ].map((res, i) => (
                <button key={i} className="bg-bg-card border border-white/5 rounded-2xl p-6 text-left hover:border-secondary/30 hover:bg-bg-card-hover transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 text-text-dim group-hover:text-secondary transition-colors">
                    <res.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{res.title}</h4>
                  <p className="text-[10px] text-text-dim uppercase tracking-widest">{res.type}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-accent2/20 to-secondary/10 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-black text-white">🎯 Seu Perfil de Desenvolvimento</h3>
            <div className="flex items-center gap-4">
              <div className="text-4xl">🔥</div>
              <div>
                <div className="text-sm font-bold text-white">Nível 4 · Competente</div>
                <div className="text-xs text-text-dim">540 XP · Próximo: Expert</div>
              </div>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed italic">
              "Bom progresso! Aproveite para aprofundar seus conhecimentos nos Playbooks e participar ativamente do Piper Pulse."
            </p>
          </div>

          <div className="bg-bg-card border border-white/5 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-[10px] font-bold text-text-dim uppercase tracking-widest">📊 Diagnóstico</h3>
            <div className="space-y-3">
              {[
                { label: 'Aulas concluídas', value: '12/40', color: 'text-secondary' },
                { label: 'Engajamento', value: '24/30', color: 'text-accent3' },
                { label: 'Comunicados', value: '8/20', color: 'text-accent2' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-xs text-text-secondary">{item.label}</span>
                  <span className={`text-xs font-black ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
