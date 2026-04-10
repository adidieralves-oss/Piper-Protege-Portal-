import React from 'react';
import { motion } from 'motion/react';
import { Palette, Shield, Target, Heart } from 'lucide-react';
import { useSession } from '../SessionContext';

export const Identidade: React.FC = () => {
  const { identity } = useSession();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-bg-card border border-white/5 rounded-3xl p-10 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent2 to-secondary flex items-center justify-center text-4xl shadow-xl border border-white/20">
            {identity.logo ? <img src={identity.logo} className="w-full h-full object-cover rounded-2xl" /> : <Shield className="w-10 h-10 text-white" />}
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">{identity.name}</h1>
            <p className="text-lg text-secondary font-bold tracking-widest uppercase">{identity.tagline}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/5 relative z-10">
          {[
            { icon: Target, title: 'Missão', text: 'Proteger quem protege através de soluções inovadoras e seguras.' },
            { icon: Shield, title: 'Visão', text: 'Ser a referência global em segurança e cultura corporativa.' },
            { icon: Heart, title: 'Valores', text: 'Segurança, Inovação, Transparência e Foco no Colaborador.' },
          ].map((item, i) => (
            <div key={i} className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-secondary">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{item.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bg-card border border-white/5 rounded-3xl p-10 shadow-sm space-y-6">
        <h2 className="text-xl font-black text-white flex items-center gap-3">
          <Palette className="w-6 h-6 text-secondary" />
          Manifesto da Marca
        </h2>
        <div className="text-text-secondary leading-relaxed space-y-4 text-lg italic">
          <p>"Na Piper Protege, acreditamos que a segurança não é apenas um serviço, mas uma cultura. Protegemos o que é mais valioso: as pessoas e o seu potencial."</p>
          <p>"Nossa identidade é construída sobre a confiança e a inovação constante. Cada colaborador é um guardião dessa cultura, evoluindo diariamente para construir um futuro mais seguro."</p>
        </div>
      </div>
    </div>
  );
};
