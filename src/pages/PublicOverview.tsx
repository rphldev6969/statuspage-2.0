import { Link } from 'react-router-dom';
import { useComponents } from '@/hooks/useComponents';
import { useIncidents } from '@/hooks/useIncidents';
import StatusIndicator from '@/components/StatusIndicator';
import MethodsExpander from '@/components/MethodsExpander';
import { StatusType } from '@/utils/mockData';

const PublicOverview = () => {
  const { components, loading: componentsLoading, error: componentsError } = useComponents();
  const { incidents = [], loading: incidentsLoading, error: incidentsError } = useIncidents();

  // Estado de carregamento
  if (componentsLoading || incidentsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-2xl font-bold">Carregando...</h2>
          <p className="text-muted-foreground">Aguarde enquanto carregamos as informações</p>
        </div>
      </div>
    );
  }

  // Estado de erro
  if (componentsError || incidentsError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto p-8">
          <h2 className="text-2xl font-bold mb-4">Erro ao carregar dados</h2>
          <p className="text-muted-foreground mb-4">
            {componentsError?.message || incidentsError?.message || 'Ocorreu um erro ao carregar as informações'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const visibleComponents = components.filter(c => c.visible);
  
  // Estado sem componentes
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
            {visibleComponents.map((component) => (
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