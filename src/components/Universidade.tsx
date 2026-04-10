import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, ChevronDown, Play, CheckCircle2, Lock, Trophy, Map, Star, Users as UsersIcon } from 'lucide-react';
import { useSession } from '../SessionContext';
import { useNotify } from '../NotificationContext';
import { DB } from '../lib/db';
import { Track, Level, Lesson } from '../types';

export const Universidade: React.FC = () => {
  const { user } = useSession();
  const { notify } = useNotify();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [progress, setProgress] = useState<Record<string, Record<string, boolean>>>({});
  const [activeView, setActiveView] = useState<'trilhas' | 'missoes' | 'conquistas' | 'ranking'>('trilhas');
  const [expandedTracks, setExpandedTracks] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setTracks(DB.getTracks());
    setProgress(DB.get(`prog_${user?.id || user?.email || user?.name}`, {}));
  }, [user]);

  const toggleTrack = (idx: number) => {
    setExpandedTracks(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const isLessonDone = (trackIdx: number, levelIdx: number, lessonIdx: number) => {
    const trackKey = `track_${trackIdx}`;
    const lessonKey = `${trackKey}_lv${levelIdx}_${lessonIdx}`;
    return progress[trackKey]?.[lessonKey] || false;
  };

  const handleMarkDone = (trackIdx: number, levelIdx: number, lessonIdx: number) => {
    const trackKey = `track_${trackIdx}`;
    const lessonKey = `${trackKey}_lv${levelIdx}_${lessonIdx}`;
    
    const newProgress = { ...progress };
    if (!newProgress[trackKey]) newProgress[trackKey] = {};
    newProgress[trackKey][lessonKey] = true;
    
    setProgress(newProgress);
    DB.set(`prog_${user?.id || user?.email || user?.name}`, newProgress);
    notify('Aula concluída! +10 pontos', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 bg-surface-subtle p-1 rounded-xl border border-border-subtle overflow-x-auto no-scrollbar">
        {[
          { id: 'trilhas', label: '📚 Trilhas', icon: GraduationCap },
          { id: 'missoes', label: '🗺️ Missões', icon: Map },
          { id: 'conquistas', label: '🏅 Conquistas', icon: Trophy },
          { id: 'ranking', label: '🏆 Ranking', icon: Star },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeView === tab.id 
                ? 'bg-secondary text-white shadow-lg shadow-secondary/20' 
                : 'text-text-dim hover:text-text-primary hover:bg-surface-subtle'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeView === 'trilhas' && (
        <div className="space-y-4">
          {tracks.length > 0 ? tracks.map((track, tIdx) => {
            const isExpanded = expandedTracks[tIdx];
            return (
              <div key={tIdx} className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => toggleTrack(tIdx)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-surface-subtle transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent2 to-secondary flex items-center justify-center text-2xl shadow-lg shadow-secondary/10">
                    {track.emoji || '📚'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white">{track.name}</h3>
                    <p className="text-xs text-text-dim">{track.sector} · {track.levels.length} níveis</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-text-dim transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden border-t border-border-subtle bg-white/[0.02]"
                    >
                      <div className="p-5 space-y-6">
                        {track.levels.map((level, lIdx) => (
                          <div key={lIdx} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-[10px] font-bold text-secondary border border-secondary/30">
                                {lIdx + 1}
                              </div>
                              <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider">{level.level}</h4>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {level.lessons.map((lesson, iIdx) => {
                                const done = isLessonDone(tIdx, lIdx, iIdx);
                                return (
                                  <div 
                                    key={iIdx}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                      done ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-surface-subtle border-border-subtle hover:border-white/10'
                                    }`}
                                  >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                      done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-text-dim'
                                    }`}>
                                      {done ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs font-bold truncate">{lesson.title}</div>
                                      <div className="text-[10px] text-text-dim">{lesson.duration || '5 min'}</div>
                                    </div>
                                    {!done && (
                                      <button 
                                        onClick={() => handleMarkDone(tIdx, lIdx, iIdx)}
                                        className="px-3 py-1 bg-secondary text-white text-[10px] font-bold rounded-lg hover:scale-105 transition-transform"
                                      >
                                        Concluir
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }) : (
            <div className="py-20 text-center space-y-4">
              <div className="text-4xl">🎓</div>
              <h2 className="text-xl font-bold">Nenhuma trilha disponível</h2>
              <p className="text-text-dim">Fale com seu gestor para liberar novos conteúdos.</p>
            </div>
          )}
        </div>
      )}

      {activeView === 'missoes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Primeiros Passos', desc: 'Complete 3 aulas de qualquer trilha', progress: 1, total: 3, reward: '50 XP' },
            { title: 'Engajado', desc: 'Faça 5 posts no Piper Pulse', progress: 2, total: 5, reward: '100 XP' },
            { title: 'Expert Comercial', desc: 'Complete a trilha de Processo Comercial', progress: 0, total: 1, reward: 'Badge Expert' },
          ].map((missao, i) => (
            <div key={i} className="bg-bg-card border border-border-subtle rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-bold text-white">{missao.title}</h4>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{missao.reward}</span>
              </div>
              <p className="text-xs text-text-dim">{missao.desc}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-text-dim">
                  <span>Progresso</span>
                  <span>{Math.round((missao.progress / missao.total) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-surface-subtle rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary transition-all duration-500" 
                    style={{ width: `${(missao.progress / missao.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeView === 'conquistas' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[
            { title: 'Pioneiro', icon: '🚀', unlocked: true },
            { title: 'Comunicador', icon: '📢', unlocked: true },
            { title: 'Estudioso', icon: '📖', unlocked: false },
            { title: 'Top 1', icon: '🏆', unlocked: false },
            { title: 'Social', icon: '🤝', unlocked: true },
            { title: 'Mestre', icon: '🧙‍♂️', unlocked: false },
          ].map((conquista, i) => (
            <div 
              key={i} 
              className={`bg-bg-card border rounded-2xl p-6 text-center space-y-3 transition-all ${
                conquista.unlocked ? 'border-secondary/30 bg-secondary/5' : 'border-border-subtle opacity-50 grayscale'
              }`}
            >
              <div className="text-3xl">{conquista.icon}</div>
              <div className="text-[10px] font-bold text-white uppercase tracking-wider">{conquista.title}</div>
              {conquista.unlocked ? (
                <div className="text-[8px] font-black text-secondary uppercase">Desbloqueado</div>
              ) : (
                <div className="text-[8px] font-black text-text-dim uppercase">Bloqueado</div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeView === 'ranking' && (
        <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border-subtle bg-white/[0.02]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              Top Colaboradores do Mês
            </h3>
          </div>
          <div className="divide-y divide-border-subtle">
            {[
              { name: 'Ricardo Silva', dept: 'Comercial', xp: 2450, rank: 1 },
              { name: 'Ana Paula', dept: 'Operacional', xp: 2100, rank: 2 },
              { name: 'João Souza', dept: 'Financeiro', xp: 1850, rank: 3 },
              { name: 'Maria Oliveira', dept: 'RH', xp: 1600, rank: 4 },
              { name: 'Pedro Santos', dept: 'Comercial', xp: 1450, rank: 5 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                  item.rank === 1 ? 'bg-amber-500 text-white' : 
                  item.rank === 2 ? 'bg-slate-300 text-slate-800' :
                  item.rank === 3 ? 'bg-amber-700 text-white' : 'text-text-dim'
                }`}>
                  {item.rank}
                </div>
                <div className="w-10 h-10 rounded-xl bg-accent2 flex items-center justify-center text-xs font-bold text-white">
                  {item.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{item.name}</div>
                  <div className="text-[10px] text-text-dim uppercase tracking-wider">{item.dept}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-secondary">{item.xp}</div>
                  <div className="text-[8px] font-bold text-text-dim uppercase">XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
