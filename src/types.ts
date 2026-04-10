export type UserRole = 'Admin' | 'Líder' | 'Colaborador';

export interface User {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  phone?: string;
  cargo?: string;
  role: UserRole;
  dept?: string;
  team?: string;
  photo?: string;
  active: boolean;
}

export interface Identity {
  name: string;
  tagline: string;
  logo: string;
  cover: string;
  colorPrimary: string;
  colorSecondary: string;
}

export interface Org {
  depts: string[];
  teams: string[];
  roles: string[];
  teamsByDept?: Record<string, string[]>;
}

export interface Communication {
  id: string;
  title: string;
  body: string;
  commType: 'info' | 'update' | 'aviso' | 'reconhec' | 'evento';
  priority: 'info' | 'important' | 'urgent';
  targetDept: string;
  author: string;
  date: string;
  htmlUrl?: string;
  htmlName?: string;
  critico?: boolean;
}

export interface Lesson {
  title: string;
  type: 'video' | 'image' | 'pdf' | 'slides' | 'podcast' | 'link' | 'text' | 'html';
  url: string;
  duration?: string;
  description?: string;
}

export interface Level {
  level: string;
  lessons: Lesson[];
  challenge?: string;
  task?: string;
  badge?: string;
}

export interface Track {
  name: string;
  emoji: string;
  sector: string;
  levels: Level[];
}

export interface FaqItem {
  q: string;
  a: string;
  example?: string;
  htmlUrl?: string;
  htmlName?: string;
}

export interface FaqCategory {
  name: string;
  emoji?: string;
  items: FaqItem[];
}

export interface PlaybookResource {
  title: string;
  type: string;
  url: string;
}

export interface Playbook {
  title: string;
  emoji: string;
  sector: string;
  body: string;
  resources: PlaybookResource[];
}

export interface OnboardingItem {
  title: string;
  body: string;
  emoji?: string;
  link?: string;
  htmlUrl?: string;
  htmlName?: string;
}

export interface Goal {
  name: string;
  type: string;
  value: string;
  period: string;
  individual: boolean;
  dept: string;
  targetUser: string;
}

export interface PulsePost {
  id: string;
  userId: string;
  user: string;
  photo?: string | null;
  cargo: string;
  dept: string;
  text: string;
  type: 'resultado' | 'aprendizado' | 'reconhecimento' | 'cultura' | 'system' | 'conquista';
  time: number;
  imageData?: string | null;
  trainingLink?: string;
}

export interface PulseReaction {
  likes: string[];
  rockets: string[];
}

export interface PulseComment {
  user: string;
  photo?: string | null;
  text: string;
  time: number;
  userId: string;
}

export interface PulseEvent {
  id: string;
  title: string;
  date: string;
  hora: string;
  tipo: 'treinamento' | 'reuniao' | 'prazo' | 'evento' | 'outro';
  local: string;
  desc: string;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  points: number;
}

export interface Mission {
  id: string;
  icon: string;
  title: string;
  desc: string;
  xp: number;
  type: string;
  target: number;
  progress?: number;
  done?: boolean;
}

export interface KortexConfig {
  apiKey: string;
  baseUrl: string;
  ativo: boolean;
  modo: 'manual' | 'api';
}

export interface KortexUserData {
  atendimentos: number;
  resolvidos: number;
  pendentes: number;
  tma: string;
  csat: number | null;
  conversao: number | null;
  receita: string;
  periodo: string;
  ultimaSync: number | null;
}

export interface FileAsset {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // Base64
  category?: string;
  uploadedAt: string;
}
