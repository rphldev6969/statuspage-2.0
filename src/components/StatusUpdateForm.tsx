
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SystemComponent, StatusType } from '@/utils/mockData';
import StatusIndicator from './StatusIndicator';

interface StatusUpdateFormProps {
  components: SystemComponent[];
  onUpdateStatus: (componentId: string, newStatus: StatusType) => void;
}

const StatusUpdateForm: React.FC<StatusUpdateFormProps> = ({ 
  components, 
  onUpdateStatus 
}) => {
  const [selectedComponent, setSelectedComponent] = useState<string>(components[0]?.id || '');
  const [selectedStatus, setSelectedStatus] = useState<StatusType>('operational');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedComponent) {
      onUpdateStatus(selectedComponent, selectedStatus);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update System Status</CardTitle>
        <CardDescription>
          Change the status of any system component
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="component">Select Component</Label>
            <select
              id="component"
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              {components.map((component) => (
                <option key={component.id} value={component.id}>
                  {component.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <Label>Select Status</Label>
            <RadioGroup
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as StatusType)}
              className="grid grid-cols-1 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="operational" id="operational" />
                <Label htmlFor="operational" className="flex items-center gap-2 cursor-pointer">
                  <StatusIndicator status="operational" />
                  <span>Operational</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="degraded" id="degraded" />
                <Label htmlFor="degraded" className="flex items-center gap-2 cursor-pointer">
                  <StatusIndicator status="degraded" />
                  <span>Degraded Performance</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="outage" id="outage" />
                <Label htmlFor="outage" className="flex items-center gap-2 cursor-pointer">
                  <StatusIndicator status="outage" />
                  <span>Major Outage</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Update Status</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StatusUpdateForm;
