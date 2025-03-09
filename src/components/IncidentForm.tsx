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
  components: Array<SystemComponent & {
    payinCountries?: string[];
    payoutCountries?: string[];
  }>;
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

const countryData: Record<string, { name: string }> = {
  'BRA': { name: 'Brasil' },
  'ARG': { name: 'Argentina' },
  'CHL': { name: 'Chile' },
  'COL': { name: 'Colombia' },
  'MEX': { name: 'México' },
  'BOL': { name: 'Bolívia' },
  'GTM': { name: 'Guatemala' },
  'CRI': { name: 'Costa Rica' },
  'DOM': { name: 'República Dominicana' },
  'ECU': { name: 'Equador' },
  'SLV': { name: 'El Salvador' },
  'HND': { name: 'Honduras' },
  'PAN': { name: 'Panamá' },
  'PRY': { name: 'Paraguai' },
  'PER': { name: 'Peru' },
  'URY': { name: 'Uruguai' },
  'KEN': { name: 'Quênia' },
  'AL': { name: 'Albânia' },
  'AO': { name: 'Angola' },
  'DZ': { name: 'Argélia' },
  'AD': { name: 'Andorra' },
  'AE': { name: 'Emirados Árabes Unidos' },
  'AF': { name: 'Afeganistão' },
  'AG': { name: 'Antígua e Barbuda' },
  'AI': { name: 'Anguilla' },
  'AM': { name: 'Armênia' },
  'AN': { name: 'Antilhas Holandesas' },
  'AQ': { name: 'Antártida' },
  'AS': { name: 'Samoa Americana' },
  'AT': { name: 'Áustria' },
  'AU': { name: 'Austrália' },
  'AW': { name: 'Aruba' },
  'AX': { name: 'Ilhas Aland' },
  'AZ': { name: 'Azerbaijão' },
  'BA': { name: 'Bósnia e Herzegovina' },
  'BB': { name: 'Barbados' },
  'BD': { name: 'Bangladesh' },
  'BE': { name: 'Bélgica' },
  'BF': { name: 'Burkina Faso' },
  'BG': { name: 'Bulgária' },
  'BH': { name: 'Bahrein' },
  'BI': { name: 'Burundi' },
  'BJ': { name: 'Benin' },
  'BM': { name: 'Bermudas' },
  'BN': { name: 'Brunei' },
  'BO': { name: 'Bolívia' },
  'BQ': { name: 'Bonaire' },
  'BR': { name: 'Brasil' },
  'BS': { name: 'Bahamas' },
  'BT': { name: 'Butão' },
  'BV': { name: 'Ilha Bouvet' },
  'BW': { name: 'Botsuana' },
  'BY': { name: 'Bielorrússia' },
  'BZ': { name: 'Belize' },
  'CA': { name: 'Canadá' },
  'CC': { name: 'Ilhas Cocos' },
  'CD': { name: 'Congo-Kinshasa' },
  'CF': { name: 'República Centro-Africana' },
  'CG': { name: 'Congo-Brazzaville' },
  'CH': { name: 'Suíça' },
  'CI': { name: 'Costa do Marfim' },
  'CK': { name: 'Ilhas Cook' },
  'CL': { name: 'Chile' },
  'CM': { name: 'Camarões' },
  'CN': { name: 'China' },
  'CO': { name: 'Colômbia' },
  'CR': { name: 'Costa Rica' },
  'CU': { name: 'Cuba' },
  'CV': { name: 'Cabo Verde' },
  'CW': { name: 'Curaçao' },
  'CX': { name: 'Ilha Christmas' },
  'CY': { name: 'Chipre' },
  'CZ': { name: 'República Tcheca' },
  'DE': { name: 'Alemanha' },
  'DJ': { name: 'Djibuti' },
  'DK': { name: 'Dinamarca' },
  'DM': { name: 'Dominica' },
  'DO': { name: 'República Dominicana' },
  'DZ': { name: 'Argélia' },
  'EC': { name: 'Equador' },
  'EE': { name: 'Estônia' },
  'EG': { name: 'Egito' },
  'EH': { name: 'Saara Ocidental' },
  'ER': { name: 'Eritreia' },
  'ES': { name: 'Espanha' },
  'ET': { name: 'Etiópia' },
  'FI': { name: 'Finlândia' },
  'FJ': { name: 'Fiji' },
  'FK': { name: 'Ilhas Malvinas' },
  'FM': { name: 'Micronésia' },
  'FO': { name: 'Ilhas Faroe' },
  'FR': { name: 'França' },
  'GA': { name: 'Gabão' },
  'GB': { name: 'Reino Unido' },
  'GD': { name: 'Granada' },
  'GE': { name: 'Geórgia' },
  'GF': { name: 'Guiana Francesa' },
  'GG': { name: 'Guernsey' },
  'GH': { name: 'Gana' },
  'GI': { name: 'Gibraltar' },
  'GL': { name: 'Groenlândia' },
  'GM': { name: 'Gâmbia' },
  'GN': { name: 'Guiné' },
  'GP': { name: 'Guadalupe' },
  'GQ': { name: 'Guiné Equatorial' },
  'GR': { name: 'Grécia' },
  'GS': { name: 'Geórgia do Sul e Sandwich do Sul' },
  'GT': { name: 'Guatemala' },
  'GU': { name: 'Guam' },
  'GW': { name: 'Guiné-Bissau' },
  'GY': { name: 'Guiana' },
  'HK': { name: 'Hong Kong' },
  'HM': { name: 'Ilhas Heard e McDonald' },
  'HN': { name: 'Honduras' },
  'HR': { name: 'Croácia' },
  'HT': { name: 'Haiti' },
  'HU': { name: 'Hungria' },
  'ID': { name: 'Indonésia' },
  'IE': { name: 'Irlanda' },
  'IL': { name: 'Israel' },
  'IM': { name: 'Ilha de Man' },
  'IN': { name: 'Índia' },
  'IO': { name: 'Território Britânico do Oceano Índico' },
  'IQ': { name: 'Iraque' },
  'IR': { name: 'Irã' },
  'IS': { name: 'Islândia' },
  'IT': { name: 'Itália' },
  'JE': { name: 'Jersey' },
  'JM': { name: 'Jamaica' },
  'JO': { name: 'Jordânia' },
  'JP': { name: 'Japão' },
  'KE': { name: 'Quênia' },
  'KG': { name: 'Quirguistão' },
  'KH': { name: 'Camboja' },
  'KI': { name: 'Kiribati' },
  'KM': { name: 'Comores' },
  'KN': { name: 'São Cristóvão e Nevis' },
  'KP': { name: 'Coreia do Norte' },
  'KR': { name: 'Coreia do Sul' },
  'KW': { name: 'Kuwait' },
  'KY': { name: 'Ilhas Cayman' },
  'KZ': { name: 'Cazaquistão' },
  'LA': { name: 'Laos' },
  'LB': { name: 'Líbano' },
  'LC': { name: 'Santa Lúcia' },
  'LI': { name: 'Liechtenstein' },
  'LK': { name: 'Sri Lanka' },
  'LR': { name: 'Libéria' },
  'LS': { name: 'Lesoto' },
  'LT': { name: 'Lituânia' },
  'LU': { name: 'Luxemburgo' },
  'LV': { name: 'Letônia' },
  'LY': { name: 'Líbia' },
  'MA': { name: 'Marrocos' },
  'MC': { name: 'Mônaco' },
  'MD': { name: 'Moldávia' },
  'ME': { name: 'Montenegro' },
  'MF': { name: 'São Martinho' },
  'MG': { name: 'Madagascar' },
  'MH': { name: 'Ilhas Marshall' },
  'MK': { name: 'Macedônia do Norte' },
  'ML': { name: 'Mali' },
  'MM': { name: 'Mianmar' },
  'MN': { name: 'Mongólia' },
  'MO': { name: 'Macau' },
  'MP': { name: 'Ilhas Marianas do Norte' },
  'MQ': { name: 'Martinica' },
  'MR': { name: 'Mauritânia' },
  'MS': { name: 'Montserrat' },
  'MT': { name: 'Malta' },
  'MU': { name: 'Maurício' },
  'MV': { name: 'Maldivas' },
  'MW': { name: 'Malawi' },
  'MX': { name: 'México' },
  'MY': { name: 'Malásia' },
  'MZ': { name: 'Moçambique' },
  'NA': { name: 'Namíbia' },
  'NC': { name: 'Nova Caledônia' },
  'NE': { name: 'Níger' },
  'NF': { name: 'Ilha Norfolk' },
  'NG': { name: 'Nigéria' },
  'NI': { name: 'Nicarágua' },
  'NL': { name: 'Países Baixos' },
  'NO': { name: 'Noruega' },
  'NP': { name: 'Nepal' },
  'NR': { name: 'Nauru' },
  'NU': { name: 'Niue' },
  'NZ': { name: 'Nova Zelândia' },
  'OM': { name: 'Omã' },
  'PA': { name: 'Panamá' },
  'PE': { name: 'Peru' },
  'PF': { name: 'Polinésia Francesa' },
  'PG': { name: 'Papua-Nova Guiné' },
  'PH': { name: 'Filipinas' },
  'PK': { name: 'Paquistão' },
  'PL': { name: 'Polônia' },
  'PM': { name: 'São Pedro e Miquelão' },
  'PN': { name: 'Ilhas Pitcairn' },
  'PR': { name: 'Porto Rico' },
  'PS': { name: 'Palestina' },
  'PT': { name: 'Portugal' },
  'PW': { name: 'Palau' },
  'PY': { name: 'Paraguai' },
  'QA': { name: 'Catar' },
  'RE': { name: 'Reunião' },
  'RO': { name: 'Romênia' },
  'RS': { name: 'Sérvia' },
  'RU': { name: 'Rússia' },
  'RW': { name: 'Ruanda' },
  'SA': { name: 'Arábia Saudita' },
  'SB': { name: 'Ilhas Salomão' },
  'SC': { name: 'Seychelles' },
  'SD': { name: 'Sudão' },
  'SE': { name: 'Suécia' },
  'SG': { name: 'Singapura' },
  'SH': { name: 'Santa Helena' },
  'SI': { name: 'Eslovênia' },
  'SJ': { name: 'Svalbard e Jan Mayen' },
  'SK': { name: 'Eslováquia' },
  'SL': { name: 'Serra Leoa' },
  'SM': { name: 'San Marino' },
  'SN': { name: 'Senegal' },
  'SO': { name: 'Somália' },
  'SR': { name: 'Suriname' },
  'SS': { name: 'Sudão do Sul' },
  'ST': { name: 'São Tomé e Príncipe' },
  'SV': { name: 'El Salvador' },
  'SX': { name: 'Sint Maarten' },
  'SY': { name: 'Síria' },
  'SZ': { name: 'Suazilândia' },
  'TC': { name: 'Ilhas Turks e Caicos' },
  'TD': { name: 'Chade' },
  'TF': { name: 'Territórios Franceses do Sul' },
  'TG': { name: 'Togo' },
  'TH': { name: 'Tailândia' },
  'TJ': { name: 'Tajiquistão' },
  'TK': { name: 'Tokelau' },
  'TL': { name: 'Timor-Leste' },
  'TM': { name: 'Turcomenistão' },
  'TN': { name: 'Tunísia' },
  'TO': { name: 'Tonga' },
  'TR': { name: 'Turquia' },
  'TT': { name: 'Trinidad e Tobago' },
  'TV': { name: 'Tuvalu' },
  'TW': { name: 'Taiwan' },
  'TZ': { name: 'Tanzânia' },
  'UA': { name: 'Ucrânia' },
  'UG': { name: 'Uganda' },
  'UM': { name: 'Ilhas Menores Distantes dos Estados Unidos' },
  'US': { name: 'Estados Unidos' },
  'UY': { name: 'Uruguai' },
  'UZ': { name: 'Uzbequistão' },
  'VA': { name: 'Vaticano' },
  'VC': { name: 'São Vicente e Granadinas' },
  'VE': { name: 'Venezuela' },
  'VG': { name: 'Ilhas Virgens Britânicas' },
  'VI': { name: 'Ilhas Virgens Americanas' },
  'VN': { name: 'Vietnã' },
  'VU': { name: 'Vanuatu' },
  'WF': { name: 'Wallis e Futuna' },
  'WS': { name: 'Samoa' },
  'YE': { name: 'Iêmen' },
  'YT': { name: 'Mayotte' },
  'ZA': { name: 'África do Sul' },
  'ZM': { name: 'Zâmbia' },
  'ZW': { name: 'Zimbábue' }
};

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

  const methodsComponent = components.find(c => c.name === 'Methods');
  const isMethodsSelected = affectedComponents.some(comp => 
    components.find(c => c.id === comp.id)?.name === 'Methods'
  );

  console.log('Methods Component:', methodsComponent);
  console.log('Is Methods Selected:', isMethodsSelected);
  console.log('Payin Countries:', methodsComponent?.payinCountries);
  console.log('Payout Countries:', methodsComponent?.payoutCountries);

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
                .filter(component => component.visible)
                .sort((a, b) => a.order - b.order)
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
                      {methodsComponent?.payinCountries?.map((code) => {
                        const country = countryData[code];
                        if (!country) return null;
                        return (
                          <div key={code} className="flex items-center space-x-2">
                          <Checkbox
                              id={`payin-${code}`}
                              checked={selectedPayinCountries.includes(code)}
                            onCheckedChange={(checked) => {
                              setSelectedPayinCountries(prev => 
                                checked 
                                    ? [...prev, code]
                                    : prev.filter(c => c !== code)
                              );
                            }}
                          />
                            <Label htmlFor={`payin-${code}`}>{country.name}</Label>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {(methodsType === 'payout' || methodsType === 'both') && (
                  <div className="space-y-2">
                    <Label>Affected Payout Countries</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {methodsComponent?.payoutCountries?.map((code) => {
                        const country = countryData[code];
                        if (!country) return null;
                        return (
                          <div key={code} className="flex items-center space-x-2">
                          <Checkbox
                              id={`payout-${code}`}
                              checked={selectedPayoutCountries.includes(code)}
                            onCheckedChange={(checked) => {
                              setSelectedPayoutCountries(prev => 
                                checked 
                                    ? [...prev, code]
                                    : prev.filter(c => c !== code)
                              );
                            }}
                          />
                            <Label htmlFor={`payout-${code}`}>{country.name}</Label>
                        </div>
                        );
                      })}
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
