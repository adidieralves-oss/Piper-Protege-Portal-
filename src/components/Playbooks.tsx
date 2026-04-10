import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, ChevronRight, ExternalLink, FileText, Play, Image as ImageIcon, Music, Globe } from 'lucide-react';
import { useSession } from '../SessionContext';
import { useNotify } from '../NotificationContext';
import { DB } from '../lib/db';
import { Playbook, PlaybookResource } from '../types';

export const Playbooks: React.FC = () => {
  const { user } = useSession();
  const { notify } = useNotify();
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);

  useEffect(() => {
    const items = DB.getPlaybooks();
    setPlaybooks(items);
    if (items.length > 0) setActiveTab(items[0].sector || 'Geral');
  }, []);

  const sectors = [...new Set(playbooks.map(p => p.sector || 'Geral'))];

  const filteredPlaybooks = playbooks.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                         p.body.toLowerCase().includes(search.toLowerCase());
    const matchesSector = search ? true : (p.sector || 'Geral') === activeTab;
    return matchesSearch && matchesSector;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return Play;
      case 'image': return ImageIcon;
      case 'pdf': return FileText;
      case 'podcast': return Music;
      case 'html': return Globe;
      default: return ExternalLink;
    }
  };

  if (selectedPlaybook) {
    const steps = selectedPlaybook.body.split('\n').filter(s => s.trim());
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setSelectedPlaybook(null)}
          className="flex items-center gap-2 text-sm font-bold text-text-dim hover:text-secondary transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Voltar para Playbooks
        </button>

        <div className="bg-gradient-to-br from-accent2/20 to-secondary/5 border border-white/10 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-bg-card flex items-center justify-center text-4xl shadow-2xl border border-white/10">
              {selectedPlaybook.emoji || '📋'}
            </div>
            <div>
              <div className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-1">{selectedPlaybook.sector}</div>
              <h2 className="text-2xl font-black text-white">{selectedPlaybook.title}</h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-bg-card border border-white/5 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <h3 className="text-xs font-bold text-text-dim uppercase tracking-widest">📝 Etapas do Processo</h3>
              </div>
              <div className="p-6 space-y-4">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-6 h-6 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-[10px] font-bold text-secondary shrink-0 mt-0.5 group-hover:bg-secondary group-hover:text-white transition-all">
                      {i + 1}
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-bg-card border border-white/5 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <h3 className="text-xs font-bold text-text-dim uppercase tracking-widest">📎 Recursos</h3>
              </div>
              <div className="p-2">
                {selectedPlaybook.resources?.length > 0 ? selectedPlaybook.resources.map((res, i) => {
                  const Icon = getResourceIcon(res.type);
                  return (
                    <a 
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-text-dim group-hover:text-secondary transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-text-primary truncate">{res.title || 'Recurso'}</div>
                        <div className="text-[9px] text-text-dim uppercase tracking-wider">{res.type}</div>
                      </div>
                      <ExternalLink className="w-3 h-3 text-text-dim opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  );
                }) : (
                  <div className="p-4 text-center text-[10px] text-text-dim">Nenhum recurso anexo.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim group-focus-within:text-secondary transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar playbooks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-text-primary focus:outline-none focus:border-secondary/50 focus:bg-white/10 transition-all"
          />
        </div>
        
        {!search && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {sectors.map(s => (
              <button
                key={s}
                onClick={() => setActiveTab(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === s 
                    ? 'bg-secondary text-white shadow-lg shadow-secondary/20' 
                    : 'text-text-dim hover:text-text-primary hover:bg-white/5'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPlaybooks.map((pb, i) => (
          <motion.button
            key={i}
            layout
            onClick={() => setSelectedPlaybook(pb)}
            className="bg-bg-card border border-white/5 rounded-2xl overflow-hidden text-left hover:border-secondary/30 hover:bg-bg-card-hover transition-all group shadow-sm"
          >
            <div className="h-24 bg-gradient-to-br from-accent2/20 to-secondary/10 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
              {pb.emoji || '📋'}
            </div>
            <div className="p-4 space-y-2">
              <div className="text-[9px] font-bold text-secondary uppercase tracking-widest">{pb.sector}</div>
              <h3 className="text-sm font-bold text-text-primary line-clamp-1">{pb.title}</h3>
              <p className="text-[10px] text-text-dim line-clamp-2 leading-relaxed">
                {pb.body.split('\n')[0]}
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="text-[9px] font-bold text-text-dim bg-white/5 px-2 py-0.5 rounded-full">
                  {pb.body.split('\n').filter(s => s.trim()).length} etapas
                </span>
                {pb.resources?.length > 0 && (
                  <span className="text-[9px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">
                    {pb.resources.length} anexos
                  </span>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
