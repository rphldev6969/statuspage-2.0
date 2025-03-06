
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Incident } from '@/utils/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface IncidentHistoryProps {
  incidents: Incident[];
}

const IncidentHistory: React.FC<IncidentHistoryProps> = ({ incidents }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold">Incident History</h2>
      {incidents.length === 0 ? (
        <p className="text-muted-foreground">No incidents reported.</p>
      ) : (
        <div className="space-y-4">
          {incidents.map((incident) => (
            <Card key={incident.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{incident.title}</CardTitle>
                    <CardDescription>
                      {formatDistanceToNow(new Date(incident.createdAt))} ago
                    </CardDescription>
                  </div>
                  <span className={`status-badge ${
                    incident.status === 'resolved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{incident.description}</p>
                
                <div className="space-y-3 border-l-2 border-muted pl-4">
                  {incident.updates.map((update) => (
                    <div key={update.id} className="relative">
                      <div className="absolute -left-[17px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary"></div>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium text-foreground">{update.status.charAt(0).toUpperCase() + update.status.slice(1)}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {formatDistanceToNow(new Date(update.createdAt))} ago
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{update.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidentHistory;
