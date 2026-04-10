import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Send, Heart, Rocket, MessageSquare, Image as ImageIcon, X, Trophy, Flame } from 'lucide-react';
import { useSession } from '../SessionContext';
import { useNotify } from '../NotificationContext';
import { DB } from '../lib/db';
import { PulsePost, PulseReaction, PulseComment } from '../types';
import { askPiperIA } from '../services/geminiService';

interface PulseProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Pulse: React.FC<PulseProps> = ({ isOpen, onClose }) => {
  const { user } = useSession();
  const { notify } = useNotify();
  const [posts, setPosts] = useState<PulsePost[]>([]);
  const [reactions, setReactions] = useState<Record<string, PulseReaction>>({});
  const [comments, setComments] = useState<Record<string, PulseComment[]>>({});
  const [activeTab, setActiveTab] = useState<'feed' | 'ranking' | 'highlights' | 'ia'>('feed');
  const [isComposing, setIsComposing] = useState(false);
  const [composeText, setComposeText] = useState('');
  const [composeType, setComposeType] = useState<PulsePost['type']>('resultado');
  
  // IA State
  const [iaMessages, setIaMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [iaInput, setIaInput] = useState('');
  const [isIaLoading, setIsIaLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPosts(DB.getPulsePosts());
      setReactions(DB.getPulseReactions());
      setComments(DB.getPulseComments());
    }
  }, [isOpen]);

  const handlePost = () => {
    if (!composeText.trim()) return;
    
    const newPost: PulsePost = {
      id: 'pp_' + Date.now(),
      userId: user?.id || 'anon',
      user: user?.name || 'Anônimo',
      photo: user?.photo,
      cargo: user?.cargo || '',
      dept: user?.dept || '',
      text: composeText,
      type: composeType,
      time: Date.now(),
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    DB.set('pulse_posts', updatedPosts);
    
    setComposeText('');
    setIsComposing(false);
    notify('Publicado no Piper Pulse!', 'success');
  };

  const handleIaSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!iaInput.trim() || isIaLoading) return;

    const userMsg = iaInput.trim();
    setIaInput('');
    setIaMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsIaLoading(true);

    try {
      const context = `Colaborador: ${user?.name}
Cargo: ${user?.cargo}
Departamento: ${user?.dept}
Score: 84/100`;

      const response = await askPiperIA(userMsg, context);
      setIaMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error: any) {
      notify(error.message, 'error');
    } finally {
      setIsIaLoading(false);
    }
  };

  const toggleLike = (postId: string) => {
    const userId = user?.id || 'anon';
    const postReax = reactions[postId] || { likes: [], rockets: [] };
    const hasLiked = postReax.likes.includes(userId);
    
    const updatedReax = {
      ...postReax,
      likes: hasLiked 
        ? postReax.likes.filter(id => id !== userId)
        : [...postReax.likes, userId]
    };
    
    const allReax = { ...reactions, [postId]: updatedReax };
    setReactions(allReax);
    DB.set('pulse_reactions', allReax);
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-[52px] right-0 bottom-0 w-full max-w-[360px] bg-bg-elevated border-l border-white/10 z-[180] flex flex-col shadow-2xl"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-gradient-to-br from-primary/30 to-secondary/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 font-black text-sm text-white">
            <Zap className="w-4 h-4 text-secondary fill-secondary" />
            Piper Pulse
          </div>
          <button onClick={onClose} className="text-text-dim hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-text-dim">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          12 pessoas online agora
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar">
        {[
          { id: 'feed', label: '📡 Feed' },
          { id: 'ranking', label: '🏆 Ranking' },
          { id: 'highlights', label: '🔥 Destaques' },
          { id: 'ia', label: '🧠 Piper IA' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 px-4 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'text-secondary border-secondary bg-secondary/5' 
                : 'text-text-dim border-transparent hover:text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        {activeTab === 'feed' && (
          <div className="p-4 space-y-4">
            {/* Compose CTA */}
            {!isComposing ? (
              <button 
                onClick={() => setIsComposing(true)}
                className="w-full p-4 bg-gradient-to-br from-accent2 to-secondary rounded-xl text-white font-bold text-sm shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Compartilhar no Pulse
              </button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-secondary/30 rounded-xl p-4 space-y-4"
              >
                <div className="flex gap-2 flex-wrap">
                  {['resultado', 'aprendizado', 'reconhecimento', 'cultura'].map(type => (
                    <button
                      key={type}
                      onClick={() => setComposeType(type as any)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
                        composeType === type 
                          ? 'bg-secondary/20 border-secondary/40 text-secondary' 
                          : 'bg-white/5 border-white/10 text-text-dim hover:text-text-secondary'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
                <textarea
                  value={composeText}
                  onChange={(e) => setComposeText(e.target.value)}
                  placeholder="O que você quer compartilhar hoje?"
                  className="w-full bg-transparent border-none focus:ring-0 text-sm text-text-primary placeholder:text-text-dim resize-none min-h-[80px]"
                  maxLength={280}
                />
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="text-[10px] text-text-dim">{composeText.length}/280</div>
                  <div className="flex gap-2">
                    <button onClick={() => setIsComposing(false)} className="px-3 py-1.5 text-[10px] font-bold text-text-dim hover:text-white transition-colors">
                      Cancelar
                    </button>
                    <button 
                      onClick={handlePost}
                      disabled={!composeText.trim()}
                      className="px-4 py-1.5 bg-secondary text-white text-[10px] font-bold rounded-lg disabled:opacity-50"
                    >
                      Publicar
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Posts */}
            <div className="space-y-4">
              {posts.map(post => {
                const reax = reactions[post.id] || { likes: [], rockets: [] };
                const hasLiked = reax.likes.includes(user?.id || 'anon');
                
                return (
                  <motion.div 
                    key={post.id}
                    layout
                    className="bg-bg-card border border-white/5 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent2 flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden">
                        {post.photo ? <img src={post.photo} className="w-full h-full object-cover" /> : post.user[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold text-text-primary truncate">{post.user}</div>
                          <div className="text-[9px] text-text-dim">agora</div>
                        </div>
                        <div className="text-[10px] text-text-dim truncate">{post.cargo} {post.dept && `· ${post.dept}`}</div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-text-secondary leading-relaxed">
                      {post.text}
                    </div>

                    <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                      <button 
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 text-[10px] font-bold transition-colors ${hasLiked ? 'text-red-400' : 'text-text-dim hover:text-red-400'}`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                        {reax.likes.length || ''}
                      </button>
                      <button className="flex items-center gap-1.5 text-[10px] font-bold text-text-dim hover:text-secondary transition-colors">
                        <Rocket className="w-3.5 h-3.5" />
                        {reax.rockets.length || ''}
                      </button>
                      <button className="flex items-center gap-1.5 text-[10px] font-bold text-text-dim hover:text-white transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {(comments[post.id] || []).length || ''}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'ranking' && (
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl">
                <div className="w-6 text-center font-black text-text-dim text-sm">{i}</div>
                <div className="w-8 h-8 rounded-lg bg-accent2 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                  U
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-text-primary truncate">Usuário {i}</div>
                  <div className="text-[9px] text-text-dim">Comercial</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-secondary">1.2k</div>
                  <div className="text-[8px] font-bold text-text-dim uppercase">XP</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'highlights' && (
          <div className="p-4 space-y-4">
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-[10px] uppercase tracking-wider mb-2">
                <Trophy className="w-3.5 h-3.5" />
                Maior Resultado
              </div>
              <div className="text-xs text-text-secondary italic">"Fechamos o maior contrato do trimestre! 🚀"</div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-accent2" />
                <span className="text-[10px] font-bold">João Silva</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-secondary font-bold text-[10px] uppercase tracking-wider mb-2">
                <Flame className="w-3.5 h-3.5" />
                Destaque da Semana
              </div>
              <div className="text-xs text-text-secondary italic">"Concluiu 15 aulas da universidade em 3 dias."</div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-accent2" />
                <span className="text-[10px] font-bold">Maria Oliveira</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ia' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {iaMessages.length === 0 && (
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto text-secondary">
                    <Zap className="w-6 h-6 fill-current" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">Olá! Sou o Piper IA</h4>
                    <p className="text-xs text-text-dim leading-relaxed">
                      Seu assistente inteligente de vendas e atendimento. Como posso ajudar você hoje?
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 pt-2">
                    {[
                      'Sugira uma abordagem para um cliente sumido',
                      'Crie um script para superar objeção de preço',
                      'Quais clientes têm maior chance de recompra?',
                    ].map(q => (
                      <button 
                        key={q}
                        onClick={() => { setIaInput(q); }}
                        className="text-[10px] font-bold text-text-secondary bg-white/5 hover:bg-white/10 p-2 rounded-lg text-left transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {iaMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-gradient-to-br from-accent2 to-secondary text-white rounded-tr-none' 
                      : 'bg-bg-card border border-white/10 text-text-primary rounded-tl-none shadow-sm'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              
              {isIaLoading && (
                <div className="flex justify-start">
                  <div className="bg-bg-card border border-white/10 p-4 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1">
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-text-dim rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-text-dim rounded-full" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-text-dim rounded-full" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleIaSubmit} className="p-4 border-t border-white/5 bg-bg-elevated">
              <div className="relative">
                <textarea
                  value={iaInput}
                  onChange={(e) => setIaInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleIaSubmit();
                    }
                  }}
                  placeholder="Pergunte ao Piper IA…"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm text-text-primary focus:outline-none focus:border-secondary/50 transition-all resize-none max-h-32"
                  rows={1}
                />
                <button 
                  type="submit"
                  disabled={!iaInput.trim() || isIaLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-accent2 to-secondary rounded-xl flex items-center justify-center text-white shadow-lg disabled:opacity-50 transition-all hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </motion.div>
  );
};

