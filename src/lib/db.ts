import { Identity, User, Org, Communication, Track, FaqCategory, Playbook, OnboardingItem, Goal, PulsePost, PulseReaction, PulseComment, PulseEvent, KortexConfig, KortexUserData, FileAsset } from '../types';

const PREFIX = 'pp9_';

export const DB = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const value = localStorage.getItem(PREFIX + key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
      console.error(`Error reading key ${key} from DB`, e);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing key ${key} to DB`, e);
    }
  },

  delete(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },

  // Specific helpers
  getIdentity(): Identity {
    return this.get('identity', {
      name: 'Piper Protege',
      tagline: 'Protegendo quem protege',
      logo: '',
      cover: '',
      colorPrimary: '#01023B',
      colorSecondary: '#f9157f'
    });
  },

  getAssets(): FileAsset[] {
    return this.get('assets', []);
  },

  getUsers(): User[] {
    return this.get('users', []);
  },

  getOrg(): Org {
    return this.get('org', {
      depts: [],
      teams: [],
      roles: ['Admin', 'Líder', 'Colaborador']
    });
  },

  getComms(): Communication[] {
    return this.get('comms', []);
  },

  getTracks(): Track[] {
    return this.get('tracks', []);
  },

  getFaqCats(): FaqCategory[] {
    return this.get('faqcats', []);
  },

  getPlaybooks(): Playbook[] {
    return this.get('playbooks', []);
  },

  getOnboarding(): OnboardingItem[] {
    return this.get('onboarding', []);
  },

  getGoals(): Goal[] {
    return this.get('goals', []);
  },

  getPulsePosts(): PulsePost[] {
    return this.get('pulse_posts', []);
  },

  getPulseReactions(): Record<string, PulseReaction> {
    return this.get('pulse_reactions', {});
  },

  getPulseComments(): Record<string, PulseComment[]> {
    return this.get('pulse_comments', {});
  },

  getPulseEvents(): PulseEvent[] {
    return this.get('pulse_eventos', []);
  },

  getKortexCfg(): KortexConfig {
    return this.get('kortex_cfg', {
      apiKey: '',
      baseUrl: '',
      ativo: false,
      modo: 'manual'
    });
  }
};
