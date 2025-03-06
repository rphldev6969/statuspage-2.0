
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
  const lastUpdated = components.length > 0 
    ? new Date(Math.max(...components.map(c => new Date(c.updatedAt).getTime())))
    : new Date();

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
          <div className="inline-flex justify-center items-center gap-2 bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm border border-border">
            <span className="font-medium">Status</span>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-xs text-muted-foreground">
              Last checked {formatDistanceToNow(new Date(lastUpdated))} ago
            </span>
          </div>
          
          <h1 className="text-4xl font-bold animate-slide-up">
            System Status
          </h1>
          
          <div className="inline-flex flex-col items-center gap-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <StatusIndicator status={overallStatus} size="lg" showText className="text-lg font-medium" />
          </div>
        </section>
        
        {/* Components status section */}
        <section className="pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {components.map((component) => {
              // Skip the Website component as we'll replace it with Methods
              if (component.name === "Website") {
                return null;
              }
              
              return (
                <div
                  key={component.id}
                  className="glass-panel p-4 rounded-lg transition-all hover:shadow-md"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{component.name}</h3>
                    <StatusIndicator status={component.status} />
                  </div>
                </div>
              );
            })}
            
            {/* Add Methods Expander Component */}
            <MethodsExpander />
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
