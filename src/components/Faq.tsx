import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, Search, ChevronDown, HelpCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useSession } from '../SessionContext';
import { useNotify } from '../NotificationContext';
import { DB } from '../lib/db';
import { FaqCategory, FaqItem } from '../types';

export const Faq: React.FC = () => {
  const { user } = useSession();
  const { notify } = useNotify();
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const cats = DB.getFaqCats();
    setCategories(cats);
    if (cats.length > 0) setActiveCat(cats[0].name);
  }, []);

  const toggleItem = (catName: string, idx: number) => {
    const key = `${catName}_${idx}`;
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.q.toLowerCase().includes(search.toLowerCase()) || 
      item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="space-y-6">
      <div className="relative group max-w-2xl mx-auto w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim group-focus-within:text-secondary transition-colors" />
        <input 
          type="text" 
          placeholder="Busque por dúvidas, processos ou ferramentas…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-text-primary focus:outline-none focus:border-secondary/50 focus:bg-white/10 transition-all shadow-xl"
        />
      </div>

      {!search && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setActiveCat(cat.name)}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                activeCat === cat.name 
                  ? 'bg-secondary/10 border-secondary/30 text-secondary' 
                  : 'bg-white/5 border-white/5 text-text-dim hover:text-text-primary hover:bg-white/10'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {filteredCategories.map(cat => (
          <div key={cat.name} className="space-y-3">
            {!search && activeCat !== cat.name ? null : (
              <>
                <h3 className="text-xs font-bold text-text-dim uppercase tracking-widest flex items-center gap-2 px-2">
                  <div className="w-1 h-4 bg-secondary rounded-full" />
                  {cat.name}
                </h3>
                <div className="space-y-2">
                  {cat.items.map((item, idx) => {
                    const isExpanded = expandedItems[`${cat.name}_${idx}`];
                    return (
                      <div key={idx} className="bg-bg-card border border-white/5 rounded-2xl overflow-hidden shadow-sm">
                        <button 
                          onClick={() => toggleItem(cat.name, idx)}
                          className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition-colors"
                        >
                          <span className="text-sm font-bold text-text-primary">{item.q}</span>
                          <ChevronDown className={`w-4 h-4 text-text-dim transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden border-t border-white/5 bg-white/[0.01]"
                            >
                              <div className="p-5 space-y-4">
                                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{item.a}</p>
                                {item.example && (
                                  <div className="p-4 bg-secondary/5 border-l-2 border-secondary rounded-r-xl">
                                    <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Exemplo Prático</div>
                                    <p className="text-xs text-text-secondary italic">{item.example}</p>
                                  </div>
                                )}
                                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                  <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Isso ajudou?</span>
                                  <div className="flex gap-2">
                                    <button className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all text-text-dim">
                                      <ThumbsUp className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-all text-text-dim">
                                      <ThumbsDown className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
