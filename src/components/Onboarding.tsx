import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, ChevronRight, CheckCircle2, Globe, ExternalLink } from 'lucide-react';
import { useSession } from '../SessionContext';
import { useNotify } from '../NotificationContext';
import { DB } from '../lib/db';
import { OnboardingItem } from '../types';

export const Onboarding: React.FC = () => {
  const { user } = useSession();
  const { notify } = useNotify();
  const [items, setItems] = useState<OnboardingItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setItems(DB.getOnboarding());
  }, []);

  if (!items.length) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="text-4xl">🚀</div>
        <h2 className="text-xl font-bold">Nenhum conteúdo de onboarding</h2>
        <p className="text-text-dim">Fale com seu gestor para iniciar sua jornada.</p>
      </div>
    );
  }

  const item = items[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Primeiros Passos</h2>
            <p className="text-xs text-text-dim">Passo {currentIndex + 1} de {items.length}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {items.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? 'w-8 bg-secondary' : 
                i < currentIndex ? 'w-4 bg-emerald-500' : 'w-4 bg-white/10'
              }`} 
            />
          ))}
        </div>
      </div>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-bg-card border border-white/5 rounded-3xl p-8 shadow-2xl space-y-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-4xl shadow-inner">
            {item.emoji || '🚀'}
          </div>
          <h3 className="text-2xl font-black text-white">{item.title}</h3>
        </div>

        <div className="text-text-secondary leading-relaxed whitespace-pre-wrap text-lg">
          {item.body}
        </div>

        {item.link && (
          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all group"
          >
            <ExternalLink className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
            Acessar recurso externo
          </a>
        )}

        <div className="flex items-center justify-between pt-8 border-t border-white/5">
          <button 
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-6 py-3 text-sm font-bold text-text-dim hover:text-white disabled:opacity-0 transition-all"
          >
            ← Anterior
          </button>
          
          {currentIndex < items.length - 1 ? (
            <button 
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="px-8 py-3 bg-secondary text-white font-bold rounded-xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              Próximo passo
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-5 h-5" />
              Onboarding Concluído!
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
