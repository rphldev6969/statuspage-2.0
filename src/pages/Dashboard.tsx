
import React, { useState, useEffect } from 'react';
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
import StatusUpdateForm from '@/components/StatusUpdateForm';
import IncidentForm from '@/components/IncidentForm';
import StatusIndicator from '@/components/StatusIndicator';
import IncidentHistory from '@/components/IncidentHistory';
import { 
  SystemComponent, 
  Incident, 
  StatusType, 
  initialComponents, 
  initialIncidents, 
  getOverallStatus 
} from '@/utils/mockData';

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [components, setComponents] = useState<SystemComponent[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    // Load data from localStorage or use initial data
    const storedComponents = localStorage.getItem('components');
    const storedIncidents = localStorage.getItem('incidents');
    
    setComponents(storedComponents ? JSON.parse(storedComponents) : initialComponents);
    setIncidents(storedIncidents ? JSON.parse(storedIncidents) : initialIncidents);
  }, []);
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    if (components.length > 0) {
      localStorage.setItem('components', JSON.stringify(components));
    }
  }, [components]);
  
  useEffect(() => {
    if (incidents.length > 0) {
      localStorage.setItem('incidents', JSON.stringify(incidents));
    }
  }, [incidents]);
  
  const handleUpdateStatus = (componentId: string, newStatus: StatusType) => {
    const updatedComponents = components.map(component => 
      component.id === componentId 
        ? { ...component, status: newStatus, updatedAt: new Date().toISOString() } 
        : component
    );
    
    setComponents(updatedComponents);
    
    toast.success('Component status updated successfully', {
      description: `The status has been updated to ${newStatus}`,
    });
  };
  
  const handleCreateIncident = (incidentData: {
    title: string;
    description: string;
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    affectedComponents: string[];
    message: string;
  }) => {
    const now = new Date().toISOString();
    
    const newIncident: Incident = {
      id: Date.now().toString(),
      title: incidentData.title,
      description: incidentData.description,
      status: incidentData.status,
      createdAt: now,
      updatedAt: now,
      affectedComponents: incidentData.affectedComponents,
      updates: [
        {
          id: `${Date.now()}-1`,
          message: incidentData.message,
          status: incidentData.status,
          createdAt: now,
        }
      ]
    };
    
    setIncidents([newIncident, ...incidents]);
    
    toast.success('New incident created', {
      description: 'The incident has been added to the status page.',
    });
  };

  // If loading, show nothing yet
  if (isLoading) {
    return null;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const overallStatus = getOverallStatus(components);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      
      <main className="flex-1 container py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Current Status:</span>
            <StatusIndicator status={overallStatus} showText />
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="update-status">Update Status</TabsTrigger>
            <TabsTrigger value="incidents">Manage Incidents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8 animate-fade-in">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {components.map((component) => (
                <div
                  key={component.id}
                  className="glass-panel p-4 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{component.name}</h3>
                    <StatusIndicator status={component.status} />
                  </div>
                </div>
              ))}
            </div>
            
            <IncidentHistory incidents={incidents} />
          </TabsContent>
          
          <TabsContent value="update-status" className="animate-fade-in">
            <StatusUpdateForm 
              components={components} 
              onUpdateStatus={handleUpdateStatus} 
            />
          </TabsContent>
          
          <TabsContent value="incidents" className="animate-fade-in">
            <IncidentForm 
              components={components} 
              onCreateIncident={handleCreateIncident} 
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
