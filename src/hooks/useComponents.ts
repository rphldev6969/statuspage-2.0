import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { StatusType } from '@/utils/mockData';
import { SystemComponent } from '@/types';

export function useComponents() {
  const [components, setComponents] = useState<SystemComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [editingComponent, setEditingComponent] = useState<{
    id: string;
    name: string;
    description: string;
    group: string;
    visible: boolean;
  } | null>(null);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Primeiro, verifica a conexão com o Supabase
      const { error: healthCheckError } = await supabase.from('components').select('count');
      if (healthCheckError) {
        console.error('Erro na verificação de conexão:', healthCheckError);
        throw new Error('Não foi possível conectar ao banco de dados');
      }

      // Busca os componentes
      const { data, error: fetchError } = await supabase
        .from('components')
        .select('*')
        .order('order', { ascending: true });

      if (fetchError) {
        console.error('Erro ao buscar componentes:', fetchError);
        throw new Error('Erro ao carregar os componentes');
      }

      if (!data) {
        console.warn('Nenhum componente encontrado');
        setComponents([]);
        return;
      }

      // Formata os componentes
      const formattedComponents = data.map(component => ({
        id: component.id,
        name: component.name,
        description: component.description || '',
        status: component.status || 'operational',
        group: component.group || '',
        order: component.order || 0,
        visible: component.visible !== false,
        updatedAt: component.updated_at,
        createdAt: component.created_at
      }));

      setComponents(formattedComponents);
    } catch (err) {
      console.error('Erro em fetchComponents:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      toast.error('Erro ao carregar componentes', {
        description: err instanceof Error ? err.message : 'Erro desconhecido'
      });
    } finally {
      setLoading(false);
    }
  };

  const createComponent = async (component: {
    name: string;
    description: string;
    group: string;
    order: number;
    visible: boolean;
  }) => {
    try {
      const { data, error } = await supabase
        .from('components')
        .insert([{
          ...component,
          status: 'operational' // Status padrão para novos componentes
        }])
        .select()
        .single();

      if (error) throw error;

      setComponents(prev => [...prev, data]);
      toast.success('Component created successfully');
    } catch (error) {
      console.error('Error creating component:', error);
      toast.error('Failed to create component');
      throw error;
    }
  };

  const updateComponent = async (id: string, updates: {
    name?: string;
    description?: string;
    group?: string;
    status?: StatusType;
    visible?: boolean;
  }) => {
    try {
      const { data, error } = await supabase
        .from('components')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setComponents(prev =>
        prev.map(comp =>
          comp.id === id ? { ...comp, ...updates } : comp
        )
      );
      toast.success('Component updated successfully');
    } catch (error) {
      console.error('Error updating component:', error);
      toast.error('Failed to update component');
      throw error;
    }
  };

  const deleteComponent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('components')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setComponents(prev => prev.filter(comp => comp.id !== id));
      toast.success('Component deleted successfully');
    } catch (error) {
      console.error('Error deleting component:', error);
      toast.error('Failed to delete component');
      throw error;
    }
  };

  const updateComponentVisibility = async (id: string, visible: boolean) => {
    try {
      const { error } = await supabase
        .from('components')
        .update({ visible })
        .eq('id', id);

      if (error) throw error;

      await fetchComponents();
    } catch (err) {
      setError(err as Error);
    }
  };

  useEffect(() => {
    fetchComponents();

    // Atualiza os componentes a cada 30 segundos
    const interval = setInterval(fetchComponents, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    components,
    loading,
    error,
    createComponent,
    updateComponent,
    deleteComponent,
    refetch: fetchComponents,
    editingComponent,
    setEditingComponent,
    updateComponentVisibility
  };
} 