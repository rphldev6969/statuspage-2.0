
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import StatusIndicator from '@/components/StatusIndicator';
import { Button } from '@/components/ui/button';

// Define payment method types
interface PaymentMethod {
  id: string;
  name: string;
  type: 'payin' | 'payout';
  countries: Country[];
}

interface Country {
  id: string;
  code: string;
  name: string;
  status: 'operational' | 'degraded' | 'outage';
}

// Mock data for payment methods
const paymentMethods: PaymentMethod[] = [
  {
    id: 'payin',
    name: 'Payin',
    type: 'payin',
    countries: [
      { id: 'ar-payin', code: 'AR', name: 'Argentina', status: 'operational' },
      { id: 'br-payin', code: 'BR', name: 'Brazil', status: 'operational' },
      { id: 'co-payin', code: 'CO', name: 'Colombia', status: 'operational' },
      { id: 'mx-payin', code: 'MX', name: 'Mexico', status: 'operational' },
      { id: 'pe-payin', code: 'PE', name: 'Peru', status: 'operational' },
      { id: 'cl-payin', code: 'CL', name: 'Chile', status: 'operational' }
    ]
  },
  {
    id: 'payout',
    name: 'Payout',
    type: 'payout',
    countries: [
      { id: 'ar-payout', code: 'AR', name: 'Argentina', status: 'operational' },
      { id: 'br-payout', code: 'BR', name: 'Brazil', status: 'operational' },
      { id: 'co-payout', code: 'CO', name: 'Colombia', status: 'operational' },
      { id: 'mx-payout', code: 'MX', name: 'Mexico', status: 'operational' },
      { id: 'pe-payout', code: 'PE', name: 'Peru', status: 'operational' },
      { id: 'cl-payout', code: 'CL', name: 'Chile', status: 'operational' }
    ]
  }
];

const MethodsExpander: React.FC = () => {
  const [methodsExpanded, setMethodsExpanded] = useState(false);
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);

  const toggleMethods = () => {
    setMethodsExpanded(!methodsExpanded);
    if (!methodsExpanded) {
      setExpandedMethod(null); // Reset expanded method when collapsing
    }
  };

  const toggleMethod = (methodId: string) => {
    setExpandedMethod(expandedMethod === methodId ? null : methodId);
  };

  return (
    <div className="glass-panel p-4 rounded-lg col-span-1">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Methods</h3>
        <StatusIndicator status="operational" />
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMethods}
        className="w-full mt-2 justify-between bg-slate-50"
      >
        <span>View Methods</span>
        {methodsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </Button>
      
      {methodsExpanded && (
        <div className="mt-2 space-y-2 border rounded-md p-2 bg-background/50 animate-fade-in">
          {paymentMethods.map((method) => (
            <div key={method.id} className="border-b pb-2 last:border-b-0 last:pb-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleMethod(method.id)}
                className="w-full justify-between p-2 text-primary hover:bg-primary/10"
              >
                <span>{method.name}</span>
                {expandedMethod === method.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </Button>
              
              {expandedMethod === method.id && (
                <div className="pl-4 mt-2 space-y-2 animate-fade-in">
                  {method.countries.map((country) => (
                    <div key={country.id} className="flex justify-between items-center text-sm py-1">
                      <span>{country.name}</span>
                      <StatusIndicator status={country.status} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MethodsExpander;
