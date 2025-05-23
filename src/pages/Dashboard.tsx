import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/NavBar';
import IncidentForm from '@/components/IncidentForm';
import StatusIndicator from '@/components/StatusIndicator';
import IncidentHistory from '@/components/IncidentHistory';
import { StatusType } from '@/utils/mockData';
import MethodsExpander from '@/components/MethodsExpander';
import { useComponents } from '@/hooks/useComponents';
import { useIncidents } from '@/hooks/useIncidents';
import { useMaintenance } from '@/hooks/useMaintenance';
import ComponentForm from '@/components/ComponentForm';
import { supabase } from '@/lib/supabase';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Edit2, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComponentUpdate {
  id: string;
  status: StatusType;
}

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { components, loading: componentsLoading, createComponent, updateComponent, deleteComponent, editingComponent, setEditingComponent } = useComponents();
  const { incidents, loading: incidentsLoading, createIncident, updateIncident } = useIncidents();
  const { maintenances, loading: maintenanceLoading } = useMaintenance();
  const [activeTab, setActiveTab] = useState('overview');
  
  const handleCreateIncident = async (incidentData: {
    title: string;
    description: string;
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    affectedComponents: string[];
    message: string;
    componentStatuses: Record<string, StatusType>;
    methodsAffected?: {
      payin?: string[];
      payout?: string[];
    };
  }) => {
    try {
      // Criar o incidente com os componentes afetados
      await createIncident(
        {
          title: incidentData.title,
          description: incidentData.description,
          status: incidentData.status,
          impact: 'major', // Você pode adicionar um campo para isso no formulário
          created_by: 'system' // Você pode pegar isso do contexto de autenticação
        },
        Object.entries(incidentData.componentStatuses).map(([componentId, status]) => ({
          component_id: componentId,
          status
        })),
        [
          ...(incidentData.methodsAffected?.payin?.map(country => ({
            type: 'payin' as const,
            country_code: country,
            status: incidentData.componentStatuses['3'] || 'degraded'
          })) || []),
          ...(incidentData.methodsAffected?.payout?.map(country => ({
            type: 'payout' as const,
            country_code: country,
            status: incidentData.componentStatuses['3'] || 'degraded'
          })) || [])
        ],
        {
          message: incidentData.message,
          status: incidentData.status,
          created_by: 'system' // Você pode pegar isso do contexto de autenticação
        }
      );

      toast.success('Novo incidente criado', {
        description: 'O incidente foi adicionado à página de status.',
      });
    } catch (error) {
      toast.error('Erro ao criar incidente', {
        description: 'Ocorreu um erro ao tentar criar o incidente.',
      });
    }
  };

  const handleUpdateIncident = async (incidentId: string, update: {
    message: string;
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    componentUpdates: ComponentUpdate[];
    methodsAffected?: {
      payin?: string[];
      payout?: string[];
    };
  }) => {
    try {
      await updateIncident(
        incidentId,
        { status: update.status },
        update.componentUpdates.map(comp => ({
          component_id: comp.id,
          status: comp.status
        })),
        [
          ...(update.methodsAffected?.payin?.map(country => ({
            type: 'payin' as const,
            country_code: country,
            status: update.componentUpdates.find(c => c.id === '3')?.status || 'degraded'
          })) || []),
          ...(update.methodsAffected?.payout?.map(country => ({
            type: 'payout' as const,
            country_code: country,
            status: update.componentUpdates.find(c => c.id === '3')?.status || 'degraded'
          })) || [])
        ],
        {
          message: update.message,
          status: update.status,
          created_by: 'system' // Você pode pegar isso do contexto de autenticação
        }
      );

      toast.success('Incidente atualizado', {
        description: 'O incidente foi atualizado com sucesso.',
      });
    } catch (error) {
      toast.error('Erro ao atualizar incidente', {
        description: 'Ocorreu um erro ao tentar atualizar o incidente.',
      });
    }
  };

  // Se estiver carregando, não mostra nada ainda
  if (isLoading || componentsLoading || incidentsLoading || maintenanceLoading) {
    return null;
  }
  
  // Redireciona para login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/dashboard' }} replace />;
  }
  
  const getOverallStatus = (components: typeof components): StatusType => {
    if (components.some(c => c.status === 'outage')) return 'outage';
    if (components.some(c => c.status === 'degraded')) return 'degraded';
    return 'operational';
  };

  const overallStatus = getOverallStatus(components);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      
      <main className="flex-1 container py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Agent Panel</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Current Status:</span>
            <StatusIndicator status={overallStatus} showText />
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="incidents">Manage Incidents</TabsTrigger>
            <TabsTrigger value="components">Manage Components</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="animate-fade-in">
            <section className="text-center space-y-6 mb-12">          
              <h1 className="text-4xl font-bold animate-slide-up">
                System Status
              </h1>
              
              <div className="inline-flex flex-col items-center gap-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <StatusIndicator status={overallStatus} size="lg" showText className="text-lg font-medium" />
              </div>
            </section>

            <section className="pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="grid gap-6 md:grid-cols-3">
                {components
                  .filter(component => 
                    component.visible && 
                    component.name !== 'Methods'
                  )
                  .sort((a, b) => a.order - b.order)
                  .map((component) => (
                    <div
                      key={component.id}
                      className="glass-panel p-4 rounded-lg transition-all hover:shadow-md"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{component.name}</h3>
                        <StatusIndicator status={component.status} />
                      </div>
                    </div>
                  ))}
                <MethodsExpander 
                  payinStatus={(() => {
                    const hasOutage = incidents.some(i => 
                      i.status !== 'resolved' && 
                      i.affected_components.some(ac => 
                        ac.component_id === '3' && 
                        ac.status === 'outage'
                      ) &&
                      i.methods_affected.some(m => m.type === 'payin')
                    );
                    const hasIssue = incidents.some(i => 
                      i.status !== 'resolved' && 
                      i.methods_affected.some(m => m.type === 'payin')
                    );
                    return hasOutage ? 'outage' : hasIssue ? 'degraded' : 'operational';
                  })()}
                  payoutStatus={(() => {
                    const hasOutage = incidents.some(i => 
                      i.status !== 'resolved' && 
                      i.affected_components.some(ac => 
                        ac.component_id === '3' && 
                        ac.status === 'outage'
                      ) &&
                      i.methods_affected.some(m => m.type === 'payout')
                    );
                    const hasIssue = incidents.some(i => 
                      i.status !== 'resolved' && 
                      i.methods_affected.some(m => m.type === 'payout')
                    );
                    return hasOutage ? 'outage' : hasIssue ? 'degraded' : 'operational';
                  })()}
                  components={components}
                  countryStatuses={{
                    payin: incidents
                      .filter(i => i.status !== 'resolved')
                      .reduce((acc, incident) => {
                        incident.methods_affected
                          .filter(m => m.type === 'payin')
                          .forEach(m => {
                            // Se já existe um status mais grave, mantém
                            if (acc[m.country_code] === 'outage') return;
                            if (acc[m.country_code] === 'degraded' && m.status !== 'outage') return;
                            acc[m.country_code] = m.status;
                          });
                        return acc;
                      }, {} as Record<string, StatusType>),
                    payout: incidents
                      .filter(i => i.status !== 'resolved')
                      .reduce((acc, incident) => {
                        incident.methods_affected
                          .filter(m => m.type === 'payout')
                          .forEach(m => {
                            // Se já existe um status mais grave, mantém
                            if (acc[m.country_code] === 'outage') return;
                            if (acc[m.country_code] === 'degraded' && m.status !== 'outage') return;
                            acc[m.country_code] = m.status;
                          });
                        return acc;
                      }, {} as Record<string, StatusType>)
                  }}
                />
              </div>
            </section>

            <section className="pt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <IncidentHistory 
                incidents={incidents.map(incident => ({
                  id: incident.id,
                  title: incident.title,
                  description: incident.description,
                  status: incident.status,
                  createdAt: incident.created_at,
                  updatedAt: incident.updated_at,
                  affectedComponents: incident.affected_components.map(ac => ac.component_id),
                  componentStatuses: incident.affected_components.reduce((acc, ac) => ({
                    ...acc,
                    [ac.component_id]: ac.status
                  }), {}),
                  methodsAffected: {
                    payin: incident.methods_affected
                      .filter(m => m.type === 'payin')
                      .map(m => m.country_code),
                    payout: incident.methods_affected
                      .filter(m => m.type === 'payout')
                      .map(m => m.country_code)
                  },
                  updates: incident.updates.map(update => ({
                    id: update.id,
                    message: update.message,
                    status: update.status,
                    createdAt: update.created_at
                  }))
                }))}
                components={components}
                onUpdateIncident={handleUpdateIncident}
              />
            </section>
          </TabsContent>
          
          <TabsContent value="incidents" className="animate-fade-in">
            <IncidentForm 
              components={components.map(component => ({
                ...component,
                description: component.description || '',
                group: component.group || '',
                order: component.order || 0,
                visible: component.visible !== false,
                payinCountries: component.payinCountries || [],
                payoutCountries: component.payoutCountries || []
              }))}
              onCreateIncident={handleCreateIncident} 
            />
          </TabsContent>

          <TabsContent value="components" className="animate-fade-in">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gerenciar Componentes</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Novo Componente
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Novo Componente</DialogTitle>
                      <DialogDescription>
                        Adicione um novo componente à página de status
                      </DialogDescription>
                    </DialogHeader>
                    <ComponentForm 
                      components={components}
                      onCreateComponent={createComponent}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {components
                  .sort((a, b) => a.order - b.order)
                  .map((component) => (
                    <div
                      key={component.id}
                      className="glass-panel p-4 rounded-lg transition-all hover:shadow-md"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{component.name}</h3>
                            {!component.visible && (
                              <span className="text-xs text-muted-foreground">(Hidden)</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{component.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                              {component.group}
                            </span>
                            <StatusIndicator status={component.status} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Editar Componente</DialogTitle>
                                <DialogDescription>
                                  Atualize os detalhes do componente
                                </DialogDescription>
                              </DialogHeader>
                              <ComponentForm 
                                components={components}
                                onCreateComponent={createComponent}
                                onUpdateComponent={updateComponent}
                                onDeleteComponent={deleteComponent}
                                editingComponent={{
                                  id: component.id,
                                  name: component.name,
                                  description: component.description,
                                  group: component.group,
                                  visible: component.visible
                                }}
                              />
                            </DialogContent>
                          </Dialog>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Excluir Componente</DialogTitle>
                                <DialogDescription>
                                  Tem certeza que deseja excluir este componente? Esta ação não pode ser desfeita.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-end gap-2 mt-4">
                                <DialogClose asChild>
                                  <Button variant="outline">Cancelar</Button>
                                </DialogClose>
                                <Button 
                                  variant="destructive"
                                  onClick={() => {
                                    deleteComponent(component.id);
                                    const closeButton = document.querySelector('[aria-label="Fechar"]');
                                    if (closeButton instanceof HTMLElement) {
                                      closeButton.click();
                                    }
                                  }}
                                >
                                  Excluir
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
