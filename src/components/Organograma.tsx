import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Network, Users as UsersIcon, ChevronRight } from 'lucide-react';
import { useSession } from '../SessionContext';
import { DB } from '../lib/db';
import { Org, User } from '../types';

export const Organograma: React.FC = () => {
  const { user } = useSession();
  const [org, setOrg] = useState<Org>({ depts: [], teams: [], roles: [] });
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setOrg(DB.getOrg());
    setUsers(DB.getUsers());
  }, []);

  if (!org.depts.length) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="text-4xl">🗂️</div>
        <h2 className="text-xl font-bold">Nenhum departamento cadastrado</h2>
        <p className="text-text-dim">Configure a estrutura da empresa no painel Admin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 overflow-x-auto pb-8 no-scrollbar">
      <div className="flex flex-col items-center gap-12 min-w-max px-8">
        {org.depts.map((dept, dIdx) => {
          const deptUsers = users.filter(u => u.dept === dept);
          const deptTeams = (org.teamsByDept || {})[dept] || org.teams;
          
          return (
            <div key={dIdx} className="flex flex-col items-center gap-6 w-full">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-accent2 to-secondary rounded-2xl p-4 px-10 text-white font-black text-lg shadow-xl shadow-secondary/20 border border-white/20 min-w-[200px] text-center relative"
              >
                {dept}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-white/10" />
              </motion.div>

              <div className="flex gap-4 flex-wrap justify-center">
                {deptUsers.map((u, uIdx) => (
                  <motion.div 
                    key={uIdx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: uIdx * 0.05 }}
                    className="bg-bg-card border border-white/5 rounded-xl p-3 flex items-center gap-3 shadow-sm hover:border-secondary/30 transition-all min-w-[180px]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent2 flex items-center justify-center text-[10px] font-bold text-white shrink-0 overflow-hidden">
                      {u.photo ? <img src={u.photo} className="w-full h-full object-cover" /> : u.name[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{u.name}</div>
                      <div className="text-[9px] text-text-dim uppercase tracking-wider truncate">{u.role}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
