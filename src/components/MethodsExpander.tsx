import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import StatusIndicator from './StatusIndicator';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { StatusType } from '@/utils/mockData';

interface Country {
  code: string;
  name: string;
  flag: string;
  status: StatusType;
  availableForPayin: boolean;
  availableForPayout: boolean;
  payinStatus: StatusType;
  payoutStatus: StatusType;
}

interface MethodsExpanderProps {
  payinStatus?: StatusType;
  payoutStatus?: StatusType;
  countryStatuses?: {
    payin?: Record<string, StatusType>;
    payout?: Record<string, StatusType>;
  };
}

const defaultCountries: Country[] = [
  { 
    code: 'BRA', 
    name: 'Brasil', 
    flag: '🇧🇷', 
    status: 'operational',
    availableForPayin: true,
    availableForPayout: true,
    payinStatus: 'operational',
    payoutStatus: 'operational'
  },
  { 
    code: 'ARG', 
    name: 'Argentina', 
    flag: '🇦🇷', 
    status: 'operational',
    availableForPayin: true,
    availableForPayout: true,
    payinStatus: 'operational',
    payoutStatus: 'operational'
  },
  { 
    code: 'CHL', 
    name: 'Chile', 
    flag: '🇨🇱', 
    status: 'operational',
    availableForPayin: true,
    availableForPayout: true,
    payinStatus: 'operational',
    payoutStatus: 'operational'
  },
  { 
    code: 'COL', 
    name: 'Colombia', 
    flag: '🇨🇴', 
    status: 'operational',
    availableForPayin: true,
    availableForPayout: true,
    payinStatus: 'operational',
    payoutStatus: 'operational'
  },
  { 
    code: 'MEX', 
    name: 'México', 
    flag: '🇲🇽', 
    status: 'operational',
    availableForPayin: true,
    availableForPayout: true,
    payinStatus: 'operational',
    payoutStatus: 'operational'
  },
  { 
    code: 'BOL', 
    name: 'Bolívia', 
    flag: '🇧🇴', 
    status: 'operational',
    availableForPayin: true,
    availableForPayout: true,
    payinStatus: 'operational',
    payoutStatus: 'operational'
  },
  { 
    code: 'GTM', 
    name: 'Guatemala', 
    flag: '🇬🇹', 
    status: 'operational',
    availableForPayin: true,
    availableForPayout: true,
    payinStatus: 'operational',
    payoutStatus: 'operational'
  },
  { 
    code: 'CRI', 
    name: 'Costa Rica', 
    flag: '🇨🇷', 
    status: 'operational',
    availableForPayin: false,
    availableForPayout: true,
    payinStatus: 'operational',
    payoutStatus: 'operational'
  },
  { 
    code: 'DOM', 
    name: 'República Dominicana', 
    flag: '🇩🇴', 
    status: 'operational',
    availableForPayin: false,
    availableForPayout: true,
    payinStatus: 'operational',
    payoutStatus: 'operational'
  },
  { 
    code: 'ECU', 
    name: 'Equador', 
    flag: '🇪🇨', 
    status: 'operational',
    availableForPayin: false,
    availableForPayout: true,
    payinStatus: 'operational',
    payoutStatus: 'operational'
  },
  { 
    code: 'SLV', 
    name: 'El Salvador', 
    flag: '🇸🇻', 
    status: 'operational',
    availableForPayin: false,
    availableForPayout: true,
    payinStatus: 'operational',
    payoutStatus: 'operational'
  },
  { 
    code: 'HND', 
    name: 'Honduras', 
    flag: '🇭🇳', 
    status: 'operational',
    availableForPayin: false,
    availableForPayout: true,
    payinStatus: 'operational',
    payoutStatus: 'operational'
  },
  { 
    code: 'PAN', 
    name: 'Panamá', 
    flag: '🇵🇦', 
    status: 'operational',
    availableForPayin: false,
    availableForPayout: true,
    payinStatus: 'operational',
    payoutStatus: 'operational'
  },
  { 
    code: 'PRY', 
    name: 'Paraguai', 
    flag: '🇵🇾', 
    status: 'operational',
    availableForPayin: false,
    availableForPayout: true,
    payinStatus: 'operational',
    payoutStatus: 'operational'
  },
  { 
    code: 'PER', 
    name: 'Peru', 
    flag: '🇵🇪', 
    status: 'operational',
    availableForPayin: false,
    availableForPayout: true,
    payinStatus: 'operational',
    payoutStatus: 'operational'
  },
  { 
    code: 'URY', 
    name: 'Uruguai', 
    flag: '🇺🇾', 
    status: 'operational',
    availableForPayin: false,
    availableForPayout: true,
    payinStatus: 'operational',
    payoutStatus: 'operational'
  },
  { 
    code: 'KEN', 
    name: 'Quênia', 
    flag: '🇰🇪', 
    status: 'operational',
    availableForPayin: false,
    availableForPayout: true,
    payinStatus: 'operational',
    payoutStatus: 'operational'
  }
];

const MethodsExpander: React.FC<MethodsExpanderProps> = ({ 
  payinStatus = 'operational',
  payoutStatus = 'operational',
  countryStatuses = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'payin' | 'payout' | null>(null);

  // Atualiza os status dos países com base nos incidentes
  const countries = defaultCountries.map(country => {
    const payinCountryStatus = countryStatuses.payin?.[country.code];
    const payoutCountryStatus = countryStatuses.payout?.[country.code];

    return {
      ...country,
      payinStatus: payinCountryStatus || country.payinStatus,
      payoutStatus: payoutCountryStatus || country.payoutStatus,
      status: selectedType === 'payin' ? 
        (payinCountryStatus || country.payinStatus) : 
        (payoutCountryStatus || country.payoutStatus)
    };
  });

  const methodsComponent = components.find(
    (c) => c.name === 'Methods' && c.visible
  );

  return (
    <div className="col-span-3">
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Methods</h3>
          <StatusIndicator status={selectedType === 'payin' ? payinStatus : payoutStatus} />
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between mt-2">
              View Methods
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="glass-panel p-4 rounded-lg transition-all hover:shadow-md">
                <div className="flex justify-between items-center">
                  <Button
                    variant={selectedType === 'payin' ? 'default' : 'ghost'}
                    onClick={() => setSelectedType('payin')}
                    className="w-full justify-between"
                  >
                    <span>Payin</span>
                    <StatusIndicator status={payinStatus} />
                  </Button>
                </div>
              </div>
              <div className="glass-panel p-4 rounded-lg transition-all hover:shadow-md">
                <div className="flex justify-between items-center">
                  <Button
                    variant={selectedType === 'payout' ? 'default' : 'ghost'}
                    onClick={() => setSelectedType('payout')}
                    className="w-full justify-between"
                  >
                    <span>Payout</span>
                    <StatusIndicator status={payoutStatus} />
                  </Button>
                </div>
              </div>
            </div>

            {selectedType && (
              <div className="mt-4 space-y-2 border rounded-lg p-4">
                <h4 className="font-medium mb-2">
                  {selectedType === 'payin' ? 'Payin Countries' : 'Payout Countries'}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {countries
                    .filter(country => selectedType === 'payin' ? country.availableForPayin : country.availableForPayout)
                    .map((country) => (
                      <div
                        key={country.code}
                        className="glass-panel p-4 rounded-lg transition-all hover:shadow-md"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-lg w-8 h-8 rounded-full flex items-center justify-center bg-secondary overflow-hidden">
                              {country.flag}
                            </span>
                            <span>{country.name}</span>
                          </div>
                          <StatusIndicator 
                            status={selectedType === 'payin' ? country.payinStatus : country.payoutStatus} 
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default MethodsExpander;
