import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Tables } from '@/lib/supabase';

export const useMetrics = (componentId?: string) => {
  const [metrics, setMetrics] = useState<Tables['metrics'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, [componentId]);

  const fetchMetrics = async () => {
    try {
      let query = supabase
        .from('metrics')
        .select('*')
        .order('timestamp', { ascending: false });

      if (componentId) {
        query = query.eq('component_id', componentId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMetrics(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createMetric = async (metric: Omit<Tables['metrics'], 'id' | 'timestamp'>) => {
    try {
      const { data, error } = await supabase
        .from('metrics')
        .insert([{
          ...metric,
          timestamp: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      setMetrics([data, ...metrics]);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteMetric = async (id: string) => {
    try {
      const { error } = await supabase
        .from('metrics')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMetrics(metrics.filter(m => m.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    metrics,
    loading,
    error,
    createMetric,
    deleteMetric,
    refetch: fetchMetrics
  };
}; 