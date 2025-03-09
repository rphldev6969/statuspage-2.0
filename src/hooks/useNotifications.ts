import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Tables } from '@/lib/supabase';

export const useNotifications = () => {
  const [subscriptions, setSubscriptions] = useState<Tables['subscriptions'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async (subscription: {
    email?: string;
    phone?: string;
    type: 'email' | 'sms' | 'webhook';
    webhook_url?: string;
    components?: string[];
  }) => {
    try {
      // Validar os dados da inscrição
      if (subscription.type === 'email' && !subscription.email) {
        throw new Error('Email é obrigatório para inscrições por email');
      }
      if (subscription.type === 'sms' && !subscription.phone) {
        throw new Error('Telefone é obrigatório para inscrições por SMS');
      }
      if (subscription.type === 'webhook' && !subscription.webhook_url) {
        throw new Error('URL do webhook é obrigatória para inscrições por webhook');
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .insert([{
          ...subscription,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      setSubscriptions([data, ...subscriptions]);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const unsubscribe = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSubscriptions(subscriptions.filter(s => s.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateSubscription = async (id: string, updates: Partial<Tables['subscriptions']>) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setSubscriptions(subscriptions.map(s => s.id === id ? data : s));
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    subscriptions,
    loading,
    error,
    subscribe,
    unsubscribe,
    updateSubscription,
    refetch: fetchSubscriptions
  };
}; 