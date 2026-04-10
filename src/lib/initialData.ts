import { DB } from './db';

export const initData = () => {
  if (DB.getUsers().length > 0) return;

  // Initial Identity
  DB.set('identity', {
    name: 'Piper Protege',
    tagline: 'Protegendo quem protege',
    logo: '',
    cover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    colorPrimary: '#01023B',
    colorSecondary: '#f9157f'
  });

  // Initial Org
  DB.set('org', {
    depts: ['Comercial', 'Operacional', 'Financeiro', 'RH'],
    teams: ['Vendas Diretas', 'Suporte ao Cliente', 'Faturamento'],
    roles: ['Admin', 'Líder', 'Colaborador']
  });

  // Initial Admin User
  DB.set('users', [
    {
      id: 'admin',
      name: 'Administrador',
      email: 'admin@piperprotege.com',
      role: 'Admin',
      active: true,
      cargo: 'Administrador',
      dept: 'TI'
    }
  ]);

  // Initial Tracks
  DB.set('tracks', [
    {
      name: 'Cultura & Boas-vindas',
      emoji: '🚀',
      sector: 'Geral',
      levels: [
        {
          level: 'Nível 1: Introdução',
          lessons: [
            { title: 'Nossa História', type: 'text', description: 'Conheça como a Piper Protege começou.' },
            { title: 'Missão e Valores', type: 'text', description: 'O que nos move todos os dias.' }
          ]
        }
      ]
    },
    {
      name: 'Processo Comercial',
      emoji: '💰',
      sector: 'Comercial',
      levels: [
        {
          level: 'Módulo 1: Prospecção',
          lessons: [
            { title: 'Como encontrar leads', type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
            { title: 'Script de abordagem', type: 'text', description: 'Use este script para suas ligações.' }
          ]
        }
      ]
    }
  ]);

  // Initial Communications
  DB.set('comms', [
    {
      id: 'c1',
      title: 'Bem-vindos ao novo Portal!',
      body: 'Estamos lançando hoje o Piper Protege Portal. Explore todas as funcionalidades e use a Piper IA para turbinar seus resultados.',
      commType: 'info',
      priority: 'important',
      targetDept: 'Todos',
      author: 'Diretoria',
      date: new Date().toISOString()
    },
    {
      id: 'c2',
      title: 'Meta Batida - Março/2026',
      body: 'Parabéns a todo o time comercial! Batemos a meta mensal com 15% de superávit.',
      commType: 'reconhec',
      priority: 'info',
      targetDept: 'Comercial',
      author: 'Gerência Vendas',
      date: new Date().toISOString()
    }
  ]);

  // Initial FAQ
  DB.set('faqcats', [
    {
      name: 'Geral',
      emoji: '💡',
      items: [
        { q: 'Como solicito férias?', a: 'Acesse o portal do RH e preencha o formulário com 30 dias de antecedência.' },
        { q: 'Onde encontro meu holerite?', a: 'No sistema Financeiro, aba Meus Documentos.' }
      ]
    },
    {
      name: 'Comercial',
      emoji: '💰',
      items: [
        { q: 'Qual a comissão por venda?', a: 'A comissão padrão é de 5% sobre o valor líquido do contrato.' },
        { q: 'Como cadastrar um novo lead?', a: 'Use o botão "Novo Lead" no dashboard do CRM.' }
      ]
    }
  ]);

  // Initial Playbooks
  DB.set('playbooks', [
    {
      title: 'Atendimento ao Cliente',
      emoji: '📞',
      sector: 'Operacional',
      body: '1. Atenda em até 3 toques\n2. Identifique-se com nome e empresa\n3. Ouça a demanda com atenção\n4. Registre no CRM',
      resources: []
    },
    {
      title: 'Script de Vendas',
      emoji: '🎯',
      sector: 'Comercial',
      body: 'Abordagem inicial: "Olá [Nome], aqui é o [Seu Nome] da Piper Protege. Vi que você se interessou por..."',
      resources: []
    }
  ]);

  // Initial Onboarding
  DB.set('onboarding', [
    { title: 'Bem-vindo ao time!', body: 'Estamos muito felizes em ter você conosco. Este portal será seu guia.', emoji: '👋' },
    { title: 'Configure seus acessos', body: 'Fale com o TI para receber suas senhas do email e CRM.', emoji: '🔐' },
    { title: 'Conheça a Cultura', body: 'Assista ao vídeo de boas-vindas do nosso CEO na aba Identidade.', emoji: '🏢' }
  ]);

  // Initial Goals
  DB.set('goals', [
    {
      name: 'Vendas Mensais',
      type: 'Receita',
      value: 'R$ 50.000',
      period: 'Mensal',
      individual: true,
      dept: 'Comercial',
      targetUser: 'Administrador'
    },
    {
      name: 'Novos Leads',
      type: 'Prospecção',
      value: '100',
      period: 'Mensal',
      individual: true,
      dept: 'Comercial',
      targetUser: 'Administrador'
    },
    {
      name: 'Satisfação do Cliente (CSAT)',
      type: 'Qualidade',
      value: '95%',
      period: 'Trimestral',
      individual: false,
      dept: 'Todos',
      targetUser: ''
    }
  ]);
};
