import type { Tables } from '@/lib/supabase';

export type StatusType = 'operational' | 'degraded' | 'outage';

export interface SystemComponent {
  id: string;
  name: string;
  description: string;
  status: StatusType;
  group: string;
  order: number;
  visible: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface IncidentUpdate {
  id: string;
  message: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  created_at: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  impact: 'none' | 'minor' | 'major' | 'critical';
  created_at: string;
  updated_at: string;
  created_by: string;
  affected_components: {
    component_id: string;
    status: StatusType;
  }[];
  methods_affected: {
    type: 'payin' | 'payout';
    country_code: string;
    status: StatusType;
  }[];
  updates: {
    id: string;
    message: string;
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    created_at: string;
  }[];
}

export interface MaintenanceUpdate {
  id: string;
  message: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  created_at: string;
}

export interface Maintenance {
  id: string;
  title: string;
  description: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  scheduled_start: string;
  scheduled_end: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updates: MaintenanceUpdate[];
}

export interface Subscription {
  id: string;
  email: string | null;
  phone: string | null;
  type: 'email' | 'sms' | 'webhook';
  webhook_url: string | null;
  components: string[] | null;
  created_at: string;
}

export interface Metric {
  id: string;
  component_id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: string;
} 