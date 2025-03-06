
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
import { SystemComponent } from '@/utils/mockData';

interface IncidentFormProps {
  components: SystemComponent[];
  onCreateIncident: (incident: {
    title: string;
    description: string;
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    affectedComponents: string[];
    message: string;
  }) => void;
}

const IncidentForm: React.FC<IncidentFormProps> = ({ 
  components, 
  onCreateIncident 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'investigating' | 'identified' | 'monitoring' | 'resolved'>('investigating');
  const [affectedComponents, setAffectedComponents] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onCreateIncident({
      title,
      description,
      status,
      affectedComponents,
      message
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setStatus('investigating');
    setAffectedComponents([]);
    setMessage('');
  };
  
  const handleComponentToggle = (componentId: string) => {
    setAffectedComponents(prev => 
      prev.includes(componentId)
        ? prev.filter(id => id !== componentId)
        : [...prev, componentId]
    );
  };

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
            <div className="space-y-2">
              {components.map((component) => (
                <div key={component.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`component-${component.id}`}
                    checked={affectedComponents.includes(component.id)}
                    onCheckedChange={() => handleComponentToggle(component.id)}
                  />
                  <Label
                    htmlFor={`component-${component.id}`}
                    className="cursor-pointer"
                  >
                    {component.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
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
