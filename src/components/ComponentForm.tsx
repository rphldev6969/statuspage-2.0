import React, { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { SystemComponent } from '@/utils/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ComponentFormProps {
  onCreateComponent: (component: {
    name: string;
    description: string;
    group: string;
    order: number;
    visible: boolean;
  }) => void;
  onUpdateComponent?: (id: string, component: {
    name: string;
    description: string;
    group: string;
    visible: boolean;
  }) => void;
  onDeleteComponent?: (id: string) => void;
  editingComponent?: {
    id: string;
    name: string;
    description: string;
    group: string;
    visible: boolean;
  } | null;
  components: SystemComponent[];
}

const ComponentForm: React.FC<ComponentFormProps> = ({ 
  onCreateComponent,
  onUpdateComponent,
  onDeleteComponent,
  editingComponent,
  components
}) => {
  const [name, setName] = useState(editingComponent?.name || '');
  const [description, setDescription] = useState(editingComponent?.description || '');
  const [group, setGroup] = useState(editingComponent?.group || 'Core');
  const [visible, setVisible] = useState(editingComponent?.visible ?? true);
  
  useEffect(() => {
    if (editingComponent) {
      setName(editingComponent.name);
      setDescription(editingComponent.description);
      setGroup(editingComponent.group);
      setVisible(editingComponent.visible);
    }
  }, [editingComponent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingComponent && onUpdateComponent) {
      onUpdateComponent(editingComponent.id, {
        name,
        description,
        group,
        visible
      });
    } else {
      const nextOrder = components.length > 0 
        ? Math.max(...components.map(c => c.order)) + 1 
        : 1;
      
      onCreateComponent({
        name,
        description,
        group,
        order: nextOrder,
        visible
      });
    }
    
    // Reset form
    setName('');
    setDescription('');
    setGroup('Core');
    setVisible(true);
  };

  const handleDelete = () => {
    if (editingComponent && onDeleteComponent) {
      onDeleteComponent(editingComponent.id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingComponent ? 'Edit Component' : 'Create New Component'}</CardTitle>
        <CardDescription>
          {editingComponent ? 'Update component details' : 'Add a new component to the status page'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Component Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., API, Database, etc."
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this component does"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="group">Group</Label>
          <Select value={group} onValueChange={setGroup} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um grupo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Core">Core</SelectItem>
              <SelectItem value="Payments">Payments</SelectItem>
              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="visible"
            checked={visible}
            onCheckedChange={setVisible}
          />
          <Label htmlFor="visible">Visible in Overview</Label>
        </div>

        <CardFooter className="flex justify-between">
          {editingComponent && onDeleteComponent && (
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleDelete}
            >
              Delete Component
            </Button>
          )}
          <Button type="submit">
            {editingComponent ? 'Update Component' : 'Create Component'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ComponentForm; 