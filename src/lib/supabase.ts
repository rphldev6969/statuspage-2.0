import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Tentando conectar ao Supabase com:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey?.length || 0
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente do Supabase não encontradas');
  throw new Error('Configuração do Supabase incompleta');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
});

// Teste de conexão inicial
void supabase.from('components').select('count', { count: 'exact' })
  .then(({ error }) => {
    if (error) {
      console.error('Erro na conexão inicial com o Supabase:', error);
    } else {
      console.log('Conexão com o Supabase estabelecida com sucesso!');
    }
  })
  .catch((error: Error) => {
    console.error('Erro ao tentar conectar com o Supabase:', error);
  });

// Tipos das tabelas do Supabase
export type Tables = {
  components: {
    id: string;
    name: string;
    description: string | null;
    status: 'operational' | 'degraded' | 'outage';
    group: string | null;
    order: number;
    created_at: string;
    updated_at: string;
  };
  incidents: {
    id: string;
    title: string;
    description: string;
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    impact: 'none' | 'minor' | 'major' | 'critical';
    created_at: string;
    updated_at: string;
    created_by: string;
  };
  incident_updates: {
    id: string;
    incident_id: string;
    message: string;
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    created_at: string;
    created_by: string;
  };
  affected_components: {
    id: string;
    incident_id: string;
    component_id: string;
    status: 'operational' | 'degraded' | 'outage';
    created_at: string;
  };
  methods_affected: {
    id: string;
    incident_id: string;
    type: 'payin' | 'payout';
    country_code: string;
    status: 'operational' | 'degraded' | 'outage';
    created_at: string;
  };
  maintenance: {
    id: string;
    title: string;
    description: string;
    status: 'scheduled' | 'in_progress' | 'completed';
    scheduled_start: string;
    scheduled_end: string;
    created_at: string;
    updated_at: string;
    created_by: string;
  };
  maintenance_updates: {
    id: string;
    maintenance_id: string;
    message: string;
    status: 'scheduled' | 'in_progress' | 'completed';
    created_at: string;
    created_by: string;
  };
  subscriptions: {
    id: string;
    email: string;
    phone: string | null;
    type: 'email' | 'sms' | 'webhook';
    webhook_url: string | null;
    components: string[] | null;
    created_at: string;
  };
  metrics: {
    id: string;
    component_id: string;
    name: string;
    value: number;
    unit: string;
    timestamp: string;
  };
}; 