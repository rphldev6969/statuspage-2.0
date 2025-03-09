import { Link } from 'react-router-dom';
import { useComponents } from '@/hooks/useComponents';
import { useIncidents } from '@/hooks/useIncidents';
import StatusIndicator from '@/components/StatusIndicator';
import MethodsExpander from '@/components/MethodsExpander';
import { StatusType } from '@/utils/mockData';

const PublicOverview = () => {
  const { components, loading: componentsLoading, error: componentsError } = useComponents();
  const { incidents = [], loading: incidentsLoading, error: incidentsError } = useIncidents();

  if (componentsLoading || incidentsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-4">Carregando...</h2>
          <p className="text-muted-foreground">Aguarde enquanto carregamos as informações</p>
        </div>
      </div>
    );
  }

  if (componentsError || incidentsError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-destructive">Erro ao carregar</h2>
          <p className="text-muted-foreground mb-4">
            {componentsError?.message || incidentsError?.message || 'Ocorreu um erro ao carregar as informações'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-sm text-primary hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const visibleComponents = components.filter(c => c.visible);
  if (!visibleComponents.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Nenhum componente disponível</h2>
          <p className="text-muted-foreground">Não há componentes para exibir no momento.</p>
        </div>
      </div>
    );
  }

  const getOverallStatus = (components: typeof visibleComponents): StatusType => {
    if (components.some(c => c.status === 'outage')) return 'outage';
    if (components.some(c => c.status === 'degraded')) return 'degraded';
    return 'operational';
  };

  const overallStatus = getOverallStatus(visibleComponents);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Status Page</h1>
          <Link 
            to="/login" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Login
          </Link>
        </div>
      </header>
      
      <main className="flex-1 container py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Status dos Serviços</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status Atual:</span>
            <StatusIndicator status={overallStatus} showText />
          </div>
        </div>

        <section className="text-center space-y-6 mb-12">          
          <h1 className="text-4xl font-bold animate-slide-up">
            Status do Sistema
          </h1>
          
          <div className="inline-flex flex-col items-center gap-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <StatusIndicator status={overallStatus} size="lg" showText className="text-lg font-medium" />
          </div>
        </section>

        <section className="pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="grid gap-6 md:grid-cols-3">
            {visibleComponents
              .filter(component => 
                ['API', 'Database', 'Merchant Panel'].includes(component.name)
              )
              .sort((a, b) => {
                const order = ['API', 'Database', 'Merchant Panel'];
                return order.indexOf(a.name) - order.indexOf(b.name);
              })
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
              countryStatuses={{
                payin: incidents.reduce((acc, incident) => {
                  if (incident.status !== 'resolved') {
                    incident.methods_affected
                      .filter(m => m.type === 'payin')
                      .forEach(method => {
                        const isOutage = incident.affected_components.some(ac => 
                          ac.component_id === '3' && 
                          ac.status === 'outage'
                        );
                        acc[method.country_code] = isOutage ? 'outage' : 'degraded';
                      });
                  }
                  return acc;
                }, {} as Record<string, StatusType>),
                payout: incidents.reduce((acc, incident) => {
                  if (incident.status !== 'resolved') {
                    incident.methods_affected
                      .filter(m => m.type === 'payout')
                      .forEach(method => {
                        const isOutage = incident.affected_components.some(ac => 
                          ac.component_id === '3' && 
                          ac.status === 'outage'
                        );
                        acc[method.country_code] = isOutage ? 'outage' : 'degraded';
                      });
                  }
                  return acc;
                }, {} as Record<string, StatusType>)
              }}
            />
          </div>
        </section>

        <section className="pt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-bold mb-6">Histórico de Incidentes</h2>
          <div className="space-y-6">
            {incidents.map(incident => (
              <div key={incident.id} className="glass-panel p-4 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{incident.title}</h3>
                    <p className="text-sm text-muted-foreground">{incident.description}</p>
                  </div>
                  <StatusIndicator status={incident.status === 'resolved' ? 'operational' : 'degraded'} />
                </div>
                <div className="space-y-2">
                  {incident.updates.map(update => (
                    <div key={update.id} className="text-sm">
                      <p className="text-muted-foreground">
                        {new Date(update.created_at).toLocaleString('pt-BR')}
                      </p>
                      <p>{update.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Status Page. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default PublicOverview; 