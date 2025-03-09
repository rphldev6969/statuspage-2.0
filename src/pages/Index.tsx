import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import StatusIndicator from '@/components/StatusIndicator';
import IncidentHistory from '@/components/IncidentHistory';
import NavBar from '@/components/NavBar';
import MethodsExpander from '@/components/MethodsExpander';
import { 
  SystemComponent, 
  Incident, 
  initialComponents, 
  initialIncidents,
  getOverallStatus
} from '@/utils/mockData';

const Index = () => {
  const [components, setComponents] = useState<SystemComponent[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      setLoading(true);
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get components and incidents from localStorage if available, otherwise use mock data
      const storedComponents = localStorage.getItem('components');
      const storedIncidents = localStorage.getItem('incidents');
      
      setComponents(storedComponents ? JSON.parse(storedComponents) : initialComponents);
      setIncidents(storedIncidents ? JSON.parse(storedIncidents) : initialIncidents);
      
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const overallStatus = getOverallStatus(components);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-8 w-64 bg-muted rounded"></div>
            <div className="h-4 w-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      
      <main className="flex-1 container py-8 space-y-12 animate-fade-in">
        {/* Header section */}
        <section className="text-center space-y-6">          
          <h1 className="text-4xl font-bold animate-slide-up">
            System Status
          </h1>
          
          <div className="inline-flex flex-col items-center gap-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <StatusIndicator status={overallStatus} size="lg" showText className="text-lg font-medium" />
          </div>
        </section>
        
        {/* Components status section */}
        <section className="pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="grid gap-6 md:grid-cols-3">
            {components
              .filter(component => 
                component.visible && 
                !['Methods', 'Website', 'Authentication'].includes(component.name)
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
                  i.affected_components?.some(ac => 
                    ac.component_id === '3' && 
                    ac.status === 'outage'
                  ) &&
                  i.methods_affected?.some(m => m.type === 'payin')
                );
                const hasIssue = incidents.some(i => 
                  i.status !== 'resolved' && 
                  i.methods_affected?.some(m => m.type === 'payin')
                );
                return hasOutage ? 'outage' : hasIssue ? 'degraded' : 'operational';
              })()}
              payoutStatus={(() => {
                const hasOutage = incidents.some(i => 
                  i.status !== 'resolved' && 
                  i.affected_components?.some(ac => 
                    ac.component_id === '3' && 
                    ac.status === 'outage'
                  ) &&
                  i.methods_affected?.some(m => m.type === 'payout')
                );
                const hasIssue = incidents.some(i => 
                  i.status !== 'resolved' && 
                  i.methods_affected?.some(m => m.type === 'payout')
                );
                return hasOutage ? 'outage' : hasIssue ? 'degraded' : 'operational';
              })()}
              components={components}
              countryStatuses={{
                payin: incidents.reduce((acc, incident) => {
                  if (incident.status !== 'resolved') {
                    incident.methods_affected
                      ?.filter(m => m.type === 'payin')
                      .forEach(method => {
                        const isOutage = incident.affected_components?.some(ac => 
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
                      ?.filter(m => m.type === 'payout')
                      .forEach(method => {
                        const isOutage = incident.affected_components?.some(ac => 
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
        
        {/* Incident history section */}
        <section className="pt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <IncidentHistory incidents={incidents} />
        </section>
      </main>
    </div>
  );
};

export default Index;
