import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Tables } from '@/lib/supabase';

export type MaintenanceWithUpdates = Tables['maintenance'] & {
  updates: Tables['maintenance_updates'][];
};

export const useMaintenance = () => {
  const [maintenances, setMaintenances] = useState<MaintenanceWithUpdates[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchMaintenances();
  }, []);

  const fetchMaintenances = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance')
        .select(`
          *,
          updates: maintenance_updates(*)
        `)
        .order('scheduled_start', { ascending: true });

      if (error) throw error;
      setMaintenances(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createMaintenance = async (
    maintenance: Omit<Tables['maintenance'], 'id' | 'created_at' | 'updated_at'>,
    initialUpdate?: Omit<Tables['maintenance_updates'], 'id' | 'maintenance_id' | 'created_at'>
  ) => {
    try {
      const { data: newMaintenance, error: maintenanceError } = await supabase
        .from('maintenance')
        .insert([{
          ...maintenance,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (maintenanceError) throw maintenanceError;

      if (initialUpdate) {
        const { error: updateError } = await supabase
          .from('maintenance_updates')
          .insert([{
            ...initialUpdate,
            maintenance_id: newMaintenance.id,
            created_at: new Date().toISOString()
          }]);

        if (updateError) throw updateError;
      }

      await fetchMaintenances();
      return newMaintenance;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateMaintenance = async (
    id: string,
    updates: Partial<Tables['maintenance']>,
    maintenanceUpdate?: Omit<Tables['maintenance_updates'], 'id' | 'maintenance_id' | 'created_at'>
  ) => {
    try {
      const { error: maintenanceError } = await supabase
        .from('maintenance')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (maintenanceError) throw maintenanceError;

      if (maintenanceUpdate) {
        const { error: updateError } = await supabase
          .from('maintenance_updates')
          .insert([{
            ...maintenanceUpdate,
            maintenance_id: id,
            created_at: new Date().toISOString()
          }]);

        if (updateError) throw updateError;
      }

      await fetchMaintenances();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteMaintenance = async (id: string) => {
    try {
      const { error } = await supabase
        .from('maintenance')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMaintenances(maintenances.filter(m => m.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    maintenances,
    loading,
    error,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
    refetch: fetchMaintenances
  };
}; 