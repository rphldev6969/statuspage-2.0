import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { SystemComponent, StatusType } from '@/utils/mockData';
import StatusIndicator from './StatusIndicator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AffectedComponent {
  id: string;
  status: StatusType;
  payinCountries?: string[];
  payoutCountries?: string[];
}

interface IncidentFormProps {
  components: SystemComponent[];
  onCreateIncident: (incident: {
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
  }) => void;
}

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

const IncidentForm: React.FC<IncidentFormProps> = ({ 
  components, 
  onCreateIncident 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'investigating' | 'identified' | 'monitoring' | 'resolved'>('investigating');
  const [affectedComponents, setAffectedComponents] = useState<AffectedComponent[]>([]);
  const [message, setMessage] = useState('');
  const [selectedPayinCountries, setSelectedPayinCountries] = useState<string[]>([]);
  const [selectedPayoutCountries, setSelectedPayoutCountries] = useState<string[]>([]);
  const [methodsType, setMethodsType] = useState<'payin' | 'payout' | 'both'>('both');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const componentStatuses: Record<string, StatusType> = {};
    affectedComponents.forEach(comp => {
      componentStatuses[comp.id] = comp.status;
    });

    const methodsAffected = affectedComponents.find(comp => 
      components.find(c => c.id === comp.id)?.name === 'Methods'
    ) ? {
      payin: methodsType !== 'payout' ? selectedPayinCountries : undefined,
      payout: methodsType !== 'payin' ? selectedPayoutCountries : undefined
    } : undefined;
    
    onCreateIncident({
      title,
      description,
      status,
      affectedComponents: affectedComponents.map(comp => comp.id),
      message,
      componentStatuses,
      methodsAffected
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setStatus('investigating');
    setAffectedComponents([]);
    setMessage('');
    setSelectedPayinCountries([]);
    setSelectedPayoutCountries([]);
    setMethodsType('both');
  };
  
  const handleComponentToggle = (component: SystemComponent) => {
    setAffectedComponents(prev => {
      const exists = prev.find(comp => comp.id === component.id);
      if (exists) {
        return prev.filter(comp => comp.id !== component.id);
      }
      return [...prev, { id: component.id, status: 'degraded' }];
    });
  };

  const handleComponentStatusChange = (componentId: string, newStatus: StatusType) => {
    setAffectedComponents(prev => 
      prev.map(comp => 
        comp.id === componentId 
          ? { ...comp, status: newStatus }
          : comp
      )
    );
  };

  const isMethodsSelected = affectedComponents.some(comp => 
    components.find(c => c.id === comp.id)?.name === 'Methods'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Incident</CardTitle>
        <CardDescription>
          Report a new incident or scheduled maintenance
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Incident Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., API Performance Degradation"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the incident and its impact"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Current Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="investigating">Investigating</option>
              <option value="identified">Identified</option>
              <option value="monitoring">Monitoring</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          <div className="space-y-4">
            <Label>Affected Components</Label>
            <div className="space-y-4">
              {components
                .filter(component => 
                  ['API', 'Database', 'Merchant Panel', 'Methods'].includes(component.name)
                )
                .sort((a, b) => {
                  const order = ['API', 'Database', 'Merchant Panel', 'Methods'];
                  return order.indexOf(a.name) - order.indexOf(b.name);
                })
                .map((component) => {
                const isSelected = affectedComponents.some(comp => comp.id === component.id);
                const componentData = affectedComponents.find(comp => comp.id === component.id);
                
                return (
                  <div key={component.id} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`component-${component.id}`}
                        checked={isSelected}
                        onCheckedChange={() => handleComponentToggle(component)}
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
                        <Label className="mb-2 block">Component Status</Label>
                        <RadioGroup
                          value={componentData?.status || 'degraded'}
                          onValueChange={(value) => handleComponentStatusChange(component.id, value as StatusType)}
                          className="grid grid-cols-1 gap-2"
                        >
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

          {isMethodsSelected && (
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
            <Label htmlFor="message">Update Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide details about what you're doing to resolve the incident"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Create Incident</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default IncidentForm;
