import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Bell, Filter, CheckCircle2, Heart, MessageCircle, Send } from 'lucide-react';
import { useSession } from '../SessionContext';
import { useNotify } from '../NotificationContext';
import { DB } from '../lib/db';
import { Communication } from '../types';

export const Comunicacao: React.FC = () => {
  const { user } = useSession();
  const { notify } = useNotify();
  const [comms, setComms] = useState<Communication[]>([]);
  const [readComms, setReadComms] = useState<string[]>([]);
  const [filter, setFilter] = useState<'todos' | 'pendente' | 'aviso'>('todos');

  useEffect(() => {
    setComms(DB.getComms());
    setReadComms(DB.get(`readcomms_${user?.id || user?.email || user?.name}`, []));
  }, [user]);

  const handleMarkRead = (id: string) => {
    const updated = [...readComms, id];
    setReadComms(updated);
    DB.set(`readcomms_${user?.id || user?.email || user?.name}`, updated);
    notify('Leitura confirmada!', 'success');
  };

  const filteredComms = comms.filter(c => {
    const isRelevant = c.targetDept === 'Todos' || c.targetDept === user?.dept;
    if (!isRelevant) return false;
    
    if (filter === 'pendente') return !readComms.includes(c.id);
    if (filter === 'aviso') return c.commType === 'aviso';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
          {[
            { id: 'todos', label: '📋 Todos' },
            { id: 'pendente', label: '⏳ Pendentes' },
            { id: 'aviso', label: '🚨 Avisos' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === f.id 
                  ? 'bg-secondary text-white shadow-lg shadow-secondary/20' 
                  : 'text-text-dim hover:text-text-primary hover:bg-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredComms.length > 0 ? filteredComms.map(c => {
          const isRead = readComms.includes(c.id);
          return (
            <motion.div
              key={c.id}
              layout
              className={`bg-bg-card border rounded-2xl p-6 transition-all ${
                !isRead ? 'border-secondary/30 shadow-lg shadow-secondary/5' : 'border-white/5'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent2/10 flex items-center justify-center text-accent2">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        c.commType === 'aviso' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        c.commType === 'update' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {c.commType}
                      </span>
                      {c.critico && <span className="text-[10px] font-bold text-red-500 animate-pulse">🔴 CRÍTICO</span>}
                    </div>
                    <div className="text-[10px] text-text-dim mt-1">{c.date} · {c.author}</div>
                  </div>
                </div>
                {!isRead && <div className="w-2 h-2 bg-secondary rounded-full shadow-[0_0_8px_var(--color-secondary)]" />}
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{c.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">{c.body}</p>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1.5 text-xs font-bold text-text-dim hover:text-red-400 transition-colors">
                    <Heart className="w-4 h-4" />
                    Curtir
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-text-dim hover:text-white transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    Comentar
                  </button>
                </div>
                {!isRead ? (
                  <button 
                    onClick={() => handleMarkRead(c.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/30 text-secondary rounded-xl text-xs font-bold hover:bg-secondary hover:text-white transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Confirmar Leitura
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    Lido
                  </div>
                )}
              </div>
            </motion.div>
          );
        }) : (
          <div className="py-20 text-center space-y-4">
            <div className="text-4xl">📭</div>
            <h2 className="text-xl font-bold">Nenhum comunicado</h2>
            <p className="text-text-dim">Você está em dia com todas as novidades.</p>
          </div>
        )}
      </div>
    </div>
  );
};
