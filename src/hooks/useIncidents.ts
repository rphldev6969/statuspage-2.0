import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Incident } from '@/types';

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Busca os incidentes com todos os dados relacionados
      const { data: incidentsData, error: incidentsError } = await supabase
        .from('incidents')
        .select(`
          *,
          affected_components (
            component_id,
            status
          ),
          methods_affected (
            type,
            country_code,
            status
          ),
          incident_updates (
            id,
            message,
            status,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (incidentsError) {
        console.error('Erro ao buscar incidentes:', incidentsError);
        throw new Error('Erro ao carregar os incidentes');
      }

      if (!incidentsData) {
        setIncidents([]);
        return;
      }

      // Formata os incidentes
      const formattedIncidents = incidentsData.map(incident => ({
        ...incident,
        affected_components: incident.affected_components || [],
        methods_affected: incident.methods_affected || [],
        updates: (incident.incident_updates || []).sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      }));

      setIncidents(formattedIncidents);
    } catch (err) {
      console.error('Erro em fetchIncidents:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();

    // Atualiza os incidentes a cada minuto
    const interval = setInterval(fetchIncidents, 60000);
    return () => clearInterval(interval);
  }, []);

  const createIncident = async (
    incident: Omit<Tables['incidents'], 'id' | 'created_at' | 'updated_at'>,
    affectedComponents: Omit<Tables['affected_components'], 'id' | 'incident_id' | 'created_at'>[],
    methodsAffected?: Omit<Tables['methods_affected'], 'id' | 'incident_id' | 'created_at'>[],
    initialUpdate?: Omit<Tables['incident_updates'], 'id' | 'incident_id' | 'created_at'>
  ) => {
    try {
      const { data: newIncident, error: incidentError } = await supabase
        .from('incidents')
        .insert([{
          ...incident,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (incidentError) throw incidentError;

      // Adicionar componentes afetados
      if (affectedComponents.length > 0) {
        const { error: componentsError } = await supabase
          .from('affected_components')
          .insert(
            affectedComponents.map(comp => ({
              ...comp,
              incident_id: newIncident.id,
              created_at: new Date().toISOString()
            }))
          );

        if (componentsError) throw componentsError;
      }

      // Adicionar países afetados
      if (methodsAffected && methodsAffected.length > 0) {
        const { error: methodsError } = await supabase
          .from('methods_affected')
          .insert(
            methodsAffected.map(method => ({
              ...method,
              incident_id: newIncident.id,
              created_at: new Date().toISOString()
            }))
          );

        if (methodsError) throw methodsError;
      }

      // Adicionar atualização inicial
      if (initialUpdate) {
        const { error: updateError } = await supabase
          .from('incident_updates')
          .insert([{
            ...initialUpdate,
            incident_id: newIncident.id,
            created_at: new Date().toISOString()
          }]);

        if (updateError) throw updateError;
      }

      await fetchIncidents(); // Recarregar todos os incidentes
      return newIncident;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateIncident = async (
    id: string,
    updates: Partial<Tables['incidents']>,
    componentUpdates?: Omit<Tables['affected_components'], 'id' | 'incident_id' | 'created_at'>[],
    methodsUpdates?: Omit<Tables['methods_affected'], 'id' | 'incident_id' | 'created_at'>[],
    incidentUpdate?: Omit<Tables['incident_updates'], 'id' | 'incident_id' | 'created_at'>
  ) => {
    try {
      // Atualizar o incidente
      const { error: incidentError } = await supabase
        .from('incidents')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (incidentError) throw incidentError;

      // Atualizar componentes afetados
      if (componentUpdates) {
        // Primeiro, remover os registros antigos
        await supabase
          .from('affected_components')
          .delete()
          .eq('incident_id', id);

        // Depois, inserir os novos
        const { error: componentsError } = await supabase
          .from('affected_components')
          .insert(
            componentUpdates.map(comp => ({
              ...comp,
              incident_id: id,
              created_at: new Date().toISOString()
            }))
          );

        if (componentsError) throw componentsError;
      }

      // Atualizar países afetados
      if (methodsUpdates) {
        // Primeiro, remover os registros antigos
        await supabase
          .from('methods_affected')
          .delete()
          .eq('incident_id', id);

        // Depois, inserir os novos
        const { error: methodsError } = await supabase
          .from('methods_affected')
          .insert(
            methodsUpdates.map(method => ({
              ...method,
              incident_id: id,
              created_at: new Date().toISOString()
            }))
          );

        if (methodsError) throw methodsError;
      }

      // Adicionar nova atualização
      if (incidentUpdate) {
        const { error: updateError } = await supabase
          .from('incident_updates')
          .insert([{
            ...incidentUpdate,
            incident_id: id,
            created_at: new Date().toISOString()
          }]);

        if (updateError) throw updateError;
      }

      await fetchIncidents(); // Recarregar todos os incidentes
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteIncident = async (id: string) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setIncidents(incidents.filter(i => i.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    incidents,
    loading,
    error,
    createIncident,
    updateIncident,
    deleteIncident,
    refetch: fetchIncidents
  };
} 