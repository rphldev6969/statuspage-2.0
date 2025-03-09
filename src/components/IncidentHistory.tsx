import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Incident, SystemComponent, StatusType } from '@/utils/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import StatusIndicator from './StatusIndicator';

interface ComponentUpdate {
  id: string;
  status: StatusType;
}

interface IncidentHistoryProps {
  incidents: Incident[];
  components: SystemComponent[];
  onUpdateIncident?: (incidentId: string, update: {
    message: string;
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    componentUpdates: ComponentUpdate[];
    methodsAffected?: {
      payin?: string[];
      payout?: string[];
    };
  }) => void;
}

const IncidentHistory: React.FC<IncidentHistoryProps> = ({ incidents, components, onUpdateIncident }) => {
  const { isAuthenticated } = useAuth();
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateStatus, setUpdateStatus] = useState<'investigating' | 'identified' | 'monitoring' | 'resolved'>('monitoring');
  const [selectedComponents, setSelectedComponents] = useState<ComponentUpdate[]>([]);
  const [selectedPayinCountries, setSelectedPayinCountries] = useState<string[]>([]);
  const [selectedPayoutCountries, setSelectedPayoutCountries] = useState<string[]>([]);
  const [methodsType, setMethodsType] = useState<'payin' | 'payout' | 'both'>('both');

  const handleComponentSelect = (component: SystemComponent, checked: boolean) => {
    if (checked) {
      setSelectedComponents(prev => [...prev, { id: component.id, status: 'degraded' }]);
    } else {
      setSelectedComponents(prev => prev.filter(c => c.id !== component.id));
    }
  };

  const handleComponentStatusChange = (componentId: string, status: StatusType) => {
    setSelectedComponents(prev => 
      prev.map(comp => 
        comp.id === componentId 
          ? { ...comp, status }
          : comp
      )
    );
  };

  const handleSubmitUpdate = (incidentId: string) => {
    if (onUpdateIncident && updateMessage.trim()) {
      const methodsComponent = components.find(c => c.name === 'Methods');
      const isMethodsSelected = selectedComponents.some(comp => comp.id === methodsComponent?.id);

      onUpdateIncident(incidentId, {
        message: updateMessage,
        status: updateStatus,
        componentUpdates: selectedComponents,
        methodsAffected: isMethodsSelected ? {
          ...(methodsType === 'payin' || methodsType === 'both' ? { payin: selectedPayinCountries } : {}),
          ...(methodsType === 'payout' || methodsType === 'both' ? { payout: selectedPayoutCountries } : {})
        } : undefined
      });

      setUpdateMessage('');
      setUpdateStatus('monitoring');
      setSelectedComponents([]);
      setSelectedPayinCountries([]);
      setSelectedPayoutCountries([]);
      setMethodsType('both');
      setSelectedIncident(null);
    }
  };

  const handleOpenDialog = (incident: Incident) => {
    setSelectedIncident(incident.id);
    // Pré-seleciona os componentes afetados do incidente
    setSelectedComponents(
      incident.affectedComponents.map(componentId => {
        const component = components.find(c => c.id === componentId);
        return {
          id: componentId,
          status: incident.componentStatuses?.[componentId] || component?.status || 'degraded'
        };
      })
    );
    // Pré-seleciona os países afetados
    if (incident.methodsAffected?.payin) {
      setSelectedPayinCountries(incident.methodsAffected.payin);
    }
    if (incident.methodsAffected?.payout) {
      setSelectedPayoutCountries(incident.methodsAffected.payout);
    }
    if (incident.methodsAffected?.payin && incident.methodsAffected?.payout) {
      setMethodsType('both');
    } else if (incident.methodsAffected?.payin) {
      setMethodsType('payin');
    } else if (incident.methodsAffected?.payout) {
      setMethodsType('payout');
    }
  };

  const countries = [
    { code: 'BRA', name: 'Brasil' },
    { code: 'ARG', name: 'Argentina' },
    { code: 'CHL', name: 'Chile' },
    { code: 'COL', name: 'Colombia' },
    { code: 'MEX', name: 'México' },
    { code: 'BOL', name: 'Bolívia' },
    { code: 'GTM', name: 'Guatemala' },
    { code: 'CRI', name: 'Costa Rica' },
    { code: 'DOM', name: 'República Dominicana' },
    { code: 'ECU', name: 'Equador' },
    { code: 'SLV', name: 'El Salvador' },
    { code: 'HND', name: 'Honduras' },
    { code: 'PAN', name: 'Panamá' },
    { code: 'PRY', name: 'Paraguai' },
    { code: 'PER', name: 'Peru' },
    { code: 'URY', name: 'Uruguai' },
    { code: 'KEN', name: 'Quênia' }
  ];

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
                  <div className="flex items-center gap-2">
                    {isAuthenticated && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenDialog(incident)}
                          >
                            Post Update
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Post Incident Update</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <Select
                                value={updateStatus}
                                onValueChange={(value: any) => setUpdateStatus(value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="investigating">Investigating</SelectItem>
                                  <SelectItem value="identified">Identified</SelectItem>
                                  <SelectItem value="monitoring">Monitoring</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Affected Components</Label>
                              <div className="border rounded-lg p-4 space-y-4">
                                {components.map((component) => {
                                  const isSelected = selectedComponents.some(c => c.id === component.id);
                                  const componentData = selectedComponents.find(c => c.id === component.id);
                                  
                                  return (
                                    <div key={component.id} className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`component-${component.id}`}
                                          checked={isSelected}
                                          onCheckedChange={(checked) => handleComponentSelect(component, checked as boolean)}
                                        />
                                        <Label
                                          htmlFor={`component-${component.id}`}
                                          className="cursor-pointer"
                                        >
                                          {component.name}
                                        </Label>
                                      </div>
                                      
                                      {isSelected && (
                                        <div className="ml-6 mt-2">
                                          <RadioGroup
                                            value={componentData?.status || 'degraded'}
                                            onValueChange={(value) => handleComponentStatusChange(component.id, value as StatusType)}
                                            className="grid grid-cols-1 gap-2"
                                          >
                                            <div className="flex items-center space-x-2">
                                              <RadioGroupItem value="operational" id={`${component.id}-operational`} />
                                              <Label htmlFor={`${component.id}-operational`} className="flex items-center gap-2 cursor-pointer">
                                                <StatusIndicator status="operational" />
                                                <span>Operational</span>
                                              </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <RadioGroupItem value="degraded" id={`${component.id}-degraded`} />
                                              <Label htmlFor={`${component.id}-degraded`} className="flex items-center gap-2 cursor-pointer">
                                                <StatusIndicator status="degraded" />
                                                <span>Degraded Performance</span>
                                              </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <RadioGroupItem value="outage" id={`${component.id}-outage`} />
                                              <Label htmlFor={`${component.id}-outage`} className="flex items-center gap-2 cursor-pointer">
                                                <StatusIndicator status="outage" />
                                                <span>Major Outage</span>
                                              </Label>
                                            </div>
                                          </RadioGroup>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {selectedComponents.some(comp => components.find(c => c.id === comp.id)?.name === 'Methods') && (
                              <div className="space-y-4 border rounded-lg p-4">
                                <Label>Methods Configuration</Label>
                                <div className="space-y-4">
                                  <div>
                                    <Label className="mb-2 block">Affected Type</Label>
                                    <RadioGroup
                                      value={methodsType}
                                      onValueChange={(value) => setMethodsType(value as 'payin' | 'payout' | 'both')}
                                      className="grid grid-cols-3 gap-4"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="payin" id="type-payin" />
                                        <Label htmlFor="type-payin">Payin Only</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="payout" id="type-payout" />
                                        <Label htmlFor="type-payout">Payout Only</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="both" id="type-both" />
                                        <Label htmlFor="type-both">Both</Label>
                                      </div>
                                    </RadioGroup>
                                  </div>

                                  {(methodsType === 'payin' || methodsType === 'both') && (
                                    <div className="space-y-2">
                                      <Label>Affected Payin Countries</Label>
                                      <div className="grid grid-cols-2 gap-2">
                                        {countries.filter(c => ['BRA', 'ARG', 'CHL', 'COL', 'MEX', 'BOL', 'GTM'].includes(c.code)).map((country) => (
                                          <div key={country.code} className="flex items-center space-x-2">
                                            <Checkbox
                                              id={`payin-${country.code}`}
                                              checked={selectedPayinCountries.includes(country.code)}
                                              onCheckedChange={(checked) => {
                                                setSelectedPayinCountries(prev => 
                                                  checked 
                                                    ? [...prev, country.code]
                                                    : prev.filter(code => code !== country.code)
                                                );
                                              }}
                                            />
                                            <Label htmlFor={`payin-${country.code}`}>{country.name}</Label>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {(methodsType === 'payout' || methodsType === 'both') && (
                                    <div className="space-y-2">
                                      <Label>Affected Payout Countries</Label>
                                      <div className="grid grid-cols-2 gap-2">
                                        {countries.map((country) => (
                                          <div key={country.code} className="flex items-center space-x-2">
                                            <Checkbox
                                              id={`payout-${country.code}`}
                                              checked={selectedPayoutCountries.includes(country.code)}
                                              onCheckedChange={(checked) => {
                                                setSelectedPayoutCountries(prev => 
                                                  checked 
                                                    ? [...prev, country.code]
                                                    : prev.filter(code => code !== country.code)
                                                );
                                              }}
                                            />
                                            <Label htmlFor={`payout-${country.code}`}>{country.name}</Label>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="space-y-2">
                              <Label>Update Message</Label>
                              <Textarea
                                value={updateMessage}
                                onChange={(e) => setUpdateMessage(e.target.value)}
                                placeholder="Provide details about the current status..."
                                rows={4}
                              />
                            </div>
                            <Button 
                              className="w-full" 
                              onClick={() => handleSubmitUpdate(incident.id)}
                            >
                              Post Update
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    <span className={`status-badge ${
                      incident.status === 'resolved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{incident.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Affected Components:</h4>
                  <div className="flex flex-wrap gap-2">
                    {incident.affectedComponents.map(componentId => {
                      const component = components.find(c => c.id === componentId);
                      if (!component) return null;
                      return (
                        <div key={componentId} className="flex items-center gap-2 bg-secondary rounded-lg px-2 py-1">
                          <span>{component.name}</span>
                          <StatusIndicator status={incident.componentStatuses?.[componentId] || component.status} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {incident.methodsAffected && (
                  <div className="mb-4">
                    {incident.methodsAffected.payin && (
                      <div className="mb-2">
                        <h4 className="text-sm font-medium">Affected Payin Countries:</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {incident.methodsAffected.payin.map(code => {
                            const country = countries.find(c => c.code === code);
                            return country ? (
                              <span key={code} className="bg-secondary rounded-lg px-2 py-1 text-sm">
                                {country.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                    {incident.methodsAffected.payout && (
                      <div>
                        <h4 className="text-sm font-medium">Affected Payout Countries:</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {incident.methodsAffected.payout.map(code => {
                            const country = countries.find(c => c.code === code);
                            return country ? (
                              <span key={code} className="bg-secondary rounded-lg px-2 py-1 text-sm">
                                {country.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="space-y-3 border-l-2 border-muted pl-4">
                  {incident.updates.map((update) => (
                    <div key={update.id} className="relative">
                      <div className="absolute -left-[17px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary"></div>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium text-foreground">
                            {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
                          </span>
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
