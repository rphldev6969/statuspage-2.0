export type Database = {
  public: {
    Tables: {
      components: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          status: 'operational' | 'degraded' | 'outage';
          group: string | null;
          order: number;
          visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          status?: 'operational' | 'degraded' | 'outage';
          group?: string | null;
          order: number;
          visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          status?: 'operational' | 'degraded' | 'outage';
          group?: string | null;
          order?: number;
          visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      incidents: {
        Row: {
          id: string;
          title: string;
          description: string;
          status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
          impact: 'none' | 'minor' | 'major' | 'critical';
          created_at: string;
          updated_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
          impact: 'none' | 'minor' | 'major' | 'critical';
          created_at?: string;
          updated_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          status?: 'investigating' | 'identified' | 'monitoring' | 'resolved';
          impact?: 'none' | 'minor' | 'major' | 'critical';
          created_at?: string;
          updated_at?: string;
          created_by?: string;
        };
      };
    };
  };
}; 