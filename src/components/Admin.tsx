import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Users as UsersIcon, 
  MessageSquare, 
  GraduationCap, 
  Database, 
  Palette, 
  Globe, 
  Bell, 
  Smartphone,
  Plus,
  Trash2,
  Edit2,
  Save,
  ChevronRight,
  File as FileIcon,
  Upload,
  Eye
} from 'lucide-react';
import { useSession } from '../SessionContext';
import { useNotify } from '../NotificationContext';
import { DB } from '../lib/db';
import { User, Communication, Track, Org, FileAsset } from '../types';
import { BulkUpload } from './BulkUpload';
import { FileViewer } from './FileViewer';

export const Admin: React.FC = () => {
  const { user, identity, updateIdentity } = useSession();
  const { notify } = useNotify();
  const [activeTab, setActiveTab] = useState('visual');
  const [users, setUsers] = useState<User[]>([]);
  const [comms, setComms] = useState<Communication[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [org, setOrg] = useState<Org>({ depts: [], teams: [], roles: [] });
  const [assets, setAssets] = useState<FileAsset[]>([]);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingComm, setEditingComm] = useState<Communication | null>(null);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [viewingFile, setViewingFile] = useState<FileAsset | null>(null);

  useEffect(() => {
    setUsers(DB.getUsers());
    setComms(DB.getComms());
    setTracks(DB.getTracks());
    setOrg(DB.getOrg());
    setAssets(DB.getAssets());
  }, []);

  const handleSaveIdentity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newId = {
      ...identity,
      name: formData.get('name') as string,
      tagline: formData.get('tagline') as string,
      logo: formData.get('logo') as string,
      cover: formData.get('cover') as string,
    };
    updateIdentity(newId);
    notify('Identidade visual salva!', 'success');
  };

  const handleAddDept = (name: string) => {
    if (!name) return;
    const newOrg = { ...org, depts: [...org.depts, name] };
    setOrg(newOrg);
    DB.set('org', newOrg);
    notify('Departamento adicionado!', 'success');
  };

  const handleAddTrack = () => {
    const newTrack: Track = {
      name: 'Nova Trilha',
      emoji: '📚',
      sector: 'Geral',
      levels: []
    };
    const updated = [...tracks, newTrack];
    setTracks(updated);
    DB.set('tracks', updated);
    setEditingTrack(newTrack);
    notify('Trilha criada!', 'success');
  };

  const handleSaveTrack = (track: Track) => {
    const updated = tracks.map(t => t.name === editingTrack?.name ? track : t);
    setTracks(updated);
    DB.set('tracks', updated);
    setEditingTrack(null);
    notify('Trilha salva!', 'success');
  };

  const handleDeleteTrack = (name: string) => {
    const updated = tracks.filter(t => t.name !== name);
    setTracks(updated);
    DB.set('tracks', updated);
    notify('Trilha removida', 'info');
  };

  const handleAddComm = () => {
    const newComm: Communication = {
      id: 'c' + Date.now(),
      title: 'Novo Comunicado',
      body: 'Conteúdo do comunicado...',
      commType: 'info',
      priority: 'info',
      targetDept: 'Todos',
      date: new Date().toISOString(),
      author: user?.name || 'Admin'
    };
    const updated = [newComm, ...comms];
    setComms(updated);
    DB.set('comms', updated);
    setEditingComm(newComm);
    notify('Comunicado criado!', 'success');
  };

  const handleSaveComm = (comm: Communication) => {
    const updated = comms.map(c => c.id === comm.id ? comm : c);
    setComms(updated);
    DB.set('comms', updated);
    setEditingComm(null);
    notify('Comunicado salvo!', 'success');
  };

  const handleDeleteComm = (id: string) => {
    const updated = comms.filter(c => c.id !== id);
    setComms(updated);
    DB.set('comms', updated);
    notify('Comunicado removido', 'info');
  };

  const handleAddUser = () => {
    const newUser: User = {
      id: 'u' + Date.now(),
      name: 'Novo Colaborador',
      email: '',
      role: 'Colaborador',
      active: true,
      cargo: 'Vendedor',
      dept: org.depts[0] || 'Geral'
    };
    const updated = [...users, newUser];
    setUsers(updated);
    DB.set('users', updated);
    setEditingUser(newUser);
    notify('Usuário criado!', 'success');
  };

  const handleSaveUser = (u: User) => {
    const updated = users.map(user => user.id === u.id ? u : user);
    setUsers(updated);
    DB.set('users', updated);
    setEditingUser(null);
    notify('Usuário salvo!', 'success');
  };

  const handleDeleteUser = (id: string) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    DB.set('users', updated);
    notify('Usuário removido', 'info');
  };

  const handleBulkUpload = (newAssets: FileAsset[]) => {
    const updated = [...newAssets, ...assets];
    setAssets(updated);
    DB.set('assets', updated);
    notify(`${newAssets.length} arquivos importados!`, 'success');
  };

  const handleDeleteAsset = (id: string) => {
    const updated = assets.filter(a => a.id !== id);
    setAssets(updated);
    DB.set('assets', updated);
    notify('Arquivo removido', 'info');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        Object.keys(data).forEach(key => {
          localStorage.setItem(key, data[key]);
        });
        window.location.reload();
      } catch (err) {
        notify('Erro ao importar backup', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 bg-surface-subtle p-1 rounded-xl border border-border-subtle overflow-x-auto no-scrollbar">
        {[
          { id: 'visual', label: '🎨 Visual', icon: Palette },
          { id: 'org', label: '🏢 Organização', icon: Globe },
          { id: 'usuarios', label: '👤 Usuários', icon: UsersIcon },
          { id: 'comunicados', label: '📢 Comunicados', icon: MessageSquare },
          { id: 'universidade', label: '🎓 Universidade', icon: GraduationCap },
          { id: 'arquivos', label: '📁 Arquivos', icon: FileIcon },
          { id: 'backup', label: '💾 Backup', icon: Database },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id 
                ? 'bg-secondary text-white shadow-lg shadow-secondary/20' 
                : 'text-text-dim hover:text-text-primary hover:bg-surface-subtle'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-bg-card border border-border-subtle rounded-2xl p-8 shadow-sm min-h-[400px]">
        {activeTab === 'visual' && (
          <form onSubmit={handleSaveIdentity} className="space-y-6 max-w-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Identidade Visual</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Nome da Empresa</label>
                <input name="name" type="text" defaultValue={identity.name} className="w-full bg-surface-subtle border border-border-subtle rounded-xl p-3 text-sm focus:border-secondary/50 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Tagline</label>
                <input name="tagline" type="text" defaultValue={identity.tagline} className="w-full bg-surface-subtle border border-border-subtle rounded-xl p-3 text-sm focus:border-secondary/50 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest">URL do Logo</label>
                <input name="logo" type="text" defaultValue={identity.logo} className="w-full bg-surface-subtle border border-border-subtle rounded-xl p-3 text-sm focus:border-secondary/50 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-dim uppercase tracking-widest">URL da Capa</label>
                <input name="cover" type="text" defaultValue={identity.cover} className="w-full bg-surface-subtle border border-border-subtle rounded-xl p-3 text-sm focus:border-secondary/50 outline-none transition-all" />
              </div>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="px-8 py-3 bg-secondary text-white font-bold rounded-xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
                <Save className="w-4 h-4" />
                Salvar Identidade
              </button>
              <button 
                type="button"
                onClick={() => setShowUpload(true)}
                className="px-8 py-3 bg-surface-subtle text-text-primary font-bold rounded-xl border border-border-subtle hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Anexar Arquivo
              </button>
            </div>
          </form>
        )}

        {activeTab === 'org' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Departamentos</h3>
              <div className="flex gap-2">
                <input id="newDept" type="text" placeholder="Nome do departamento" className="flex-1 bg-surface-subtle border border-border-subtle rounded-xl p-3 text-sm focus:border-secondary/50 outline-none transition-all" />
                <button 
                  onClick={() => {
                    const inp = document.getElementById('newDept') as HTMLInputElement;
                    handleAddDept(inp.value);
                    inp.value = '';
                  }}
                  className="px-6 py-3 bg-secondary text-white font-bold rounded-xl hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {org.depts.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-surface-subtle border border-border-subtle rounded-xl group">
                    <span className="text-sm font-medium">{d}</span>
                    <button 
                      onClick={() => {
                        const updated = { ...org, depts: org.depts.filter((_, idx) => idx !== i) };
                        setOrg(updated);
                        DB.set('org', updated);
                      }}
                      className="text-text-dim hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'usuarios' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Gestão de Usuários</h3>
              <button onClick={handleAddUser} className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded-xl flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Novo Usuário
              </button>
            </div>

            {editingUser && (
              <div className="p-6 bg-surface-subtle border border-secondary/30 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-white">Editar Usuário</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Nome" 
                    defaultValue={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="bg-surface-subtle border border-border-subtle rounded-xl p-3 text-sm focus:border-secondary/50 outline-none"
                  />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    defaultValue={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="bg-surface-subtle border border-border-subtle rounded-xl p-3 text-sm focus:border-secondary/50 outline-none"
                  />
                  <select 
                    defaultValue={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="bg-surface-subtle border border-border-subtle rounded-xl p-3 text-sm focus:border-secondary/50 outline-none"
                  >
                    <option value="Colaborador">Colaborador</option>
                    <option value="Líder">Líder</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <select 
                    defaultValue={editingUser.dept}
                    onChange={(e) => setEditingUser({ ...editingUser, dept: e.target.value })}
                    className="bg-surface-subtle border border-border-subtle rounded-xl p-3 text-sm focus:border-secondary/50 outline-none"
                  >
                    {org.depts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSaveUser(editingUser)} className="px-6 py-2 bg-secondary text-white font-bold rounded-xl text-xs">Salvar</button>
                  <button onClick={() => setEditingUser(null)} className="px-6 py-2 bg-surface-subtle text-text-dim rounded-xl text-xs">Cancelar</button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-[10px] font-bold text-text-dim uppercase tracking-widest border-b border-border-subtle">
                  <tr>
                    <th className="pb-4 px-4">Nome</th>
                    <th className="pb-4 px-4">Email</th>
                    <th className="pb-4 px-4">Cargo</th>
                    <th className="pb-4 px-4">Depto</th>
                    <th className="pb-4 px-4">Nível</th>
                    <th className="pb-4 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {users.map(u => (
                    <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 font-bold text-white">{u.name}</td>
                      <td className="py-4 px-4 text-text-dim">{u.email}</td>
                      <td className="py-4 px-4">{u.cargo}</td>
                      <td className="py-4 px-4">{u.dept}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 bg-secondary/10 text-secondary rounded text-[10px] font-bold uppercase">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => setEditingUser(u)} className="p-1.5 text-text-dim hover:text-white"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 text-text-dim hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'comunicados' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Comunicados Internos</h3>
              <button onClick={handleAddComm} className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded-xl flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Novo Comunicado
              </button>
            </div>

            {editingComm && (
              <div className="p-6 bg-surface-subtle border border-secondary/30 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-white">Editar Comunicado</h4>
                <input 
                  type="text" 
                  placeholder="Título" 
                  defaultValue={editingComm.title}
                  onChange={(e) => setEditingComm({ ...editingComm, title: e.target.value })}
                  className="w-full bg-surface-subtle border border-border-subtle rounded-xl p-3 text-sm focus:border-secondary/50 outline-none"
                />
                <textarea 
                  placeholder="Conteúdo" 
                  defaultValue={editingComm.body}
                  onChange={(e) => setEditingComm({ ...editingComm, body: e.target.value })}
                  className="w-full bg-surface-subtle border border-border-subtle rounded-xl p-3 text-sm focus:border-secondary/50 outline-none min-h-[100px]"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleSaveComm(editingComm)} className="px-6 py-2 bg-secondary text-white font-bold rounded-xl text-xs">Salvar</button>
                  <button onClick={() => setEditingComm(null)} className="px-6 py-2 bg-surface-subtle text-text-dim rounded-xl text-xs">Cancelar</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {comms.map(c => (
                <div key={c.id} className="p-4 bg-surface-subtle border border-border-subtle rounded-xl flex items-center justify-between group">
                  <div>
                    <div className="text-sm font-bold text-white">{c.title}</div>
                    <div className="text-[10px] text-text-dim uppercase tracking-wider">{new Date(c.date).toLocaleDateString()} · {c.author}</div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => setEditingComm(c)} className="p-2 text-text-dim hover:text-white"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteComm(c.id)} className="p-2 text-text-dim hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'universidade' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Trilhas de Aprendizado</h3>
              <button onClick={handleAddTrack} className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded-xl flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nova Trilha
              </button>
            </div>

            {editingTrack && (
              <div className="p-6 bg-surface-subtle border border-secondary/30 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-white">Editar Trilha</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input 
                    type="text" 
                    placeholder="Nome" 
                    defaultValue={editingTrack.name}
                    onChange={(e) => setEditingTrack({ ...editingTrack, name: e.target.value })}
                    className="bg-surface-subtle border border-border-subtle rounded-xl p-3 text-sm focus:border-secondary/50 outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="Emoji" 
                    defaultValue={editingTrack.emoji}
                    onChange={(e) => setEditingTrack({ ...editingTrack, emoji: e.target.value })}
                    className="bg-surface-subtle border border-border-subtle rounded-xl p-3 text-sm focus:border-secondary/50 outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="Setor" 
                    defaultValue={editingTrack.sector}
                    onChange={(e) => setEditingTrack({ ...editingTrack, sector: e.target.value })}
                    className="bg-surface-subtle border border-border-subtle rounded-xl p-3 text-sm focus:border-secondary/50 outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSaveTrack(editingTrack)} className="px-6 py-2 bg-secondary text-white font-bold rounded-xl text-xs">Salvar</button>
                  <button onClick={() => setEditingTrack(null)} className="px-6 py-2 bg-surface-subtle text-text-dim rounded-xl text-xs">Cancelar</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tracks.map((t, i) => (
                <div key={i} className="p-4 bg-surface-subtle border border-border-subtle rounded-xl flex items-center gap-4 group">
                  <div className="text-2xl">{t.emoji}</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">{t.name}</div>
                    <div className="text-[10px] text-text-dim uppercase tracking-wider">{t.sector} · {t.levels.length} níveis</div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => setEditingTrack(t)} className="p-2 text-text-dim hover:text-white"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteTrack(t.name)} className="p-2 text-text-dim hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'arquivos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Repositório de Arquivos</h3>
              <button onClick={() => setShowUpload(true)} className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded-xl flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Importar Arquivos
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map(asset => (
                <div key={asset.id} className="p-4 bg-surface-subtle border border-border-subtle rounded-xl flex items-center gap-4 group">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <FileIcon className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white truncate">{asset.name}</div>
                    <div className="text-[10px] text-text-dim uppercase tracking-wider">
                      {(asset.size / 1024).toFixed(1)} KB · {new Date(asset.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => setViewingFile(asset)} className="p-1.5 text-text-dim hover:text-white" title="Visualizar">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteAsset(asset.id)} className="p-1.5 text-text-dim hover:text-red-400" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {assets.length === 0 && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-text-dim border-2 border-dashed border-border-subtle rounded-2xl">
                  <FileIcon className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm">Nenhum arquivo importado ainda.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="space-y-6 max-w-md">
            <h3 className="text-lg font-bold text-white">Backup & Dados</h3>
            <p className="text-sm text-text-secondary">Exporte ou importe todos os dados do portal em formato JSON.</p>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => {
                  const data = JSON.stringify(localStorage);
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `piper_backup_${Date.now()}.json`;
                  a.click();
                  notify('Backup exportado!', 'success');
                }}
                className="w-full py-3 bg-surface-subtle border border-border-subtle rounded-xl text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Database className="w-4 h-4" />
                Exportar Dados (JSON)
              </button>
              <div className="relative">
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button className="w-full py-3 bg-surface-subtle border border-border-subtle rounded-xl text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Importar Dados
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showUpload && (
        <BulkUpload 
          onUpload={handleBulkUpload} 
          onClose={() => setShowUpload(false)} 
        />
      )}

      {viewingFile && (
        <FileViewer 
          file={viewingFile} 
          onClose={() => setViewingFile(null)} 
        />
      )}
    </div>
  );
};
