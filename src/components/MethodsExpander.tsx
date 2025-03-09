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
  components?: Array<{
    name: string;
    visible: boolean;
    payinCountries?: string[];
    payoutCountries?: string[];
  }>;
}

const countryData: Record<string, { name: string; flag: string }> = {
  'AF': { name: 'Afeganistão', flag: '🇦🇫' },
  'ZA': { name: 'África do Sul', flag: '🇿🇦' },
  'AL': { name: 'Albânia', flag: '🇦🇱' },
  'DE': { name: 'Alemanha', flag: '🇩🇪' },
  'AD': { name: 'Andorra', flag: '🇦🇩' },
  'AO': { name: 'Angola', flag: '🇦🇴' },
  'AI': { name: 'Anguilla', flag: '🇦🇮' },
  'AQ': { name: 'Antártida', flag: '🇦🇶' },
  'AG': { name: 'Antígua e Barbuda', flag: '🇦🇬' },
  'SA': { name: 'Arábia Saudita', flag: '🇸🇦' },
  'DZ': { name: 'Argélia', flag: '🇩🇿' },
  'AR': { name: 'Argentina', flag: '🇦🇷' },
  'AM': { name: 'Armênia', flag: '🇦🇲' },
  'AW': { name: 'Aruba', flag: '🇦🇼' },
  'AU': { name: 'Austrália', flag: '🇦🇺' },
  'AT': { name: 'Áustria', flag: '🇦🇹' },
  'AZ': { name: 'Azerbaijão', flag: '🇦🇿' },
  'BS': { name: 'Bahamas', flag: '🇧🇸' },
  'BH': { name: 'Bahrein', flag: '🇧🇭' },
  'BD': { name: 'Bangladesh', flag: '🇧🇩' },
  'BB': { name: 'Barbados', flag: '🇧🇧' },
  'BE': { name: 'Bélgica', flag: '🇧🇪' },
  'BZ': { name: 'Belize', flag: '🇧🇿' },
  'BJ': { name: 'Benin', flag: '🇧🇯' },
  'BM': { name: 'Bermudas', flag: '🇧🇲' },
  'BY': { name: 'Bielorrússia', flag: '🇧🇾' },
  'BO': { name: 'Bolívia', flag: '🇧🇴' },
  'BA': { name: 'Bósnia e Herzegovina', flag: '🇧🇦' },
  'BW': { name: 'Botsuana', flag: '🇧🇼' },
  'BR': { name: 'Brasil', flag: '🇧🇷' },
  'BN': { name: 'Brunei', flag: '🇧🇳' },
  'BG': { name: 'Bulgária', flag: '🇧🇬' },
  'BF': { name: 'Burkina Faso', flag: '🇧🇫' },
  'BI': { name: 'Burundi', flag: '🇧🇮' },
  'BT': { name: 'Butão', flag: '🇧🇹' },
  'CV': { name: 'Cabo Verde', flag: '🇨🇻' },
  'CM': { name: 'Camarões', flag: '🇨🇲' },
  'KH': { name: 'Camboja', flag: '🇰🇭' },
  'CA': { name: 'Canadá', flag: '🇨🇦' },
  'QA': { name: 'Catar', flag: '🇶🇦' },
  'KZ': { name: 'Cazaquistão', flag: '🇰🇿' },
  'TD': { name: 'Chade', flag: '🇹🇩' },
  'CL': { name: 'Chile', flag: '🇨🇱' },
  'CN': { name: 'China', flag: '🇨🇳' },
  'CY': { name: 'Chipre', flag: '🇨🇾' },
  'CO': { name: 'Colômbia', flag: '🇨🇴' },
  'KM': { name: 'Comores', flag: '🇰🇲' },
  'CG': { name: 'Congo', flag: '🇨🇬' },
  'KP': { name: 'Coreia do Norte', flag: '🇰🇵' },
  'KR': { name: 'Coreia do Sul', flag: '🇰🇷' },
  'CI': { name: 'Costa do Marfim', flag: '🇨🇮' },
  'CR': { name: 'Costa Rica', flag: '🇨🇷' },
  'HR': { name: 'Croácia', flag: '🇭🇷' },
  'CU': { name: 'Cuba', flag: '🇨🇺' },
  'DK': { name: 'Dinamarca', flag: '🇩🇰' },
  'DJ': { name: 'Djibuti', flag: '🇩🇯' },
  'DM': { name: 'Dominica', flag: '🇩🇲' },
  'EG': { name: 'Egito', flag: '🇪🇬' },
  'SV': { name: 'El Salvador', flag: '🇸🇻' },
  'AE': { name: 'Emirados Árabes Unidos', flag: '🇦🇪' },
  'EC': { name: 'Equador', flag: '🇪🇨' },
  'ER': { name: 'Eritreia', flag: '🇪🇷' },
  'SK': { name: 'Eslováquia', flag: '🇸🇰' },
  'SI': { name: 'Eslovênia', flag: '🇸🇮' },
  'ES': { name: 'Espanha', flag: '🇪🇸' },
  'US': { name: 'Estados Unidos', flag: '🇺🇸' },
  'EE': { name: 'Estônia', flag: '🇪🇪' },
  'ET': { name: 'Etiópia', flag: '🇪🇹' },
  'FJ': { name: 'Fiji', flag: '🇫🇯' },
  'PH': { name: 'Filipinas', flag: '🇵🇭' },
  'FI': { name: 'Finlândia', flag: '🇫🇮' },
  'FR': { name: 'França', flag: '🇫🇷' },
  'GA': { name: 'Gabão', flag: '🇬🇦' },
  'GM': { name: 'Gâmbia', flag: '🇬🇲' },
  'GH': { name: 'Gana', flag: '🇬🇭' },
  'GE': { name: 'Geórgia', flag: '🇬🇪' },
  'GI': { name: 'Gibraltar', flag: '🇬🇮' },
  'GD': { name: 'Granada', flag: '🇬🇩' },
  'GR': { name: 'Grécia', flag: '🇬🇷' },
  'GL': { name: 'Groenlândia', flag: '🇬🇱' },
  'GP': { name: 'Guadalupe', flag: '🇬🇵' },
  'GU': { name: 'Guam', flag: '🇬🇺' },
  'GT': { name: 'Guatemala', flag: '🇬🇹' },
  'GG': { name: 'Guernsey', flag: '🇬🇬' },
  'GY': { name: 'Guiana', flag: '🇬🇾' },
  'GF': { name: 'Guiana Francesa', flag: '🇬🇫' },
  'GN': { name: 'Guiné', flag: '🇬🇳' },
  'GQ': { name: 'Guiné Equatorial', flag: '🇬🇶' },
  'GW': { name: 'Guiné-Bissau', flag: '🇬🇼' },
  'HT': { name: 'Haiti', flag: '🇭🇹' },
  'NL': { name: 'Holanda', flag: '🇳🇱' },
  'HN': { name: 'Honduras', flag: '🇭🇳' },
  'HK': { name: 'Hong Kong', flag: '🇭🇰' },
  'HU': { name: 'Hungria', flag: '🇭🇺' },
  'YE': { name: 'Iêmen', flag: '🇾🇪' },
  'IN': { name: 'Índia', flag: '🇮🇳' },
  'ID': { name: 'Indonésia', flag: '🇮🇩' },
  'IR': { name: 'Irã', flag: '🇮🇷' },
  'IQ': { name: 'Iraque', flag: '🇮🇶' },
  'IE': { name: 'Irlanda', flag: '🇮🇪' },
  'IS': { name: 'Islândia', flag: '🇮🇸' },
  'IL': { name: 'Israel', flag: '🇮🇱' },
  'IT': { name: 'Itália', flag: '🇮🇹' },
  'JM': { name: 'Jamaica', flag: '🇯🇲' },
  'JP': { name: 'Japão', flag: '🇯🇵' },
  'JE': { name: 'Jersey', flag: '🇯🇪' },
  'JO': { name: 'Jordânia', flag: '🇯🇴' },
  'KW': { name: 'Kuwait', flag: '🇰🇼' },
  'LA': { name: 'Laos', flag: '🇱🇦' },
  'LS': { name: 'Lesoto', flag: '🇱🇸' },
  'LV': { name: 'Letônia', flag: '🇱🇻' },
  'LB': { name: 'Líbano', flag: '🇱🇧' },
  'LR': { name: 'Libéria', flag: '🇱🇷' },
  'LY': { name: 'Líbia', flag: '🇱🇾' },
  'LI': { name: 'Liechtenstein', flag: '🇱🇮' },
  'LT': { name: 'Lituânia', flag: '🇱🇹' },
  'LU': { name: 'Luxemburgo', flag: '🇱🇺' },
  'MO': { name: 'Macau', flag: '🇲🇴' },
  'MK': { name: 'Macedônia do Norte', flag: '🇲🇰' },
  'MG': { name: 'Madagascar', flag: '🇲🇬' },
  'MY': { name: 'Malásia', flag: '🇲🇾' },
  'MW': { name: 'Malawi', flag: '🇲🇼' },
  'MV': { name: 'Maldivas', flag: '🇲🇻' },
  'ML': { name: 'Mali', flag: '🇲🇱' },
  'MT': { name: 'Malta', flag: '🇲🇹' },
  'MA': { name: 'Marrocos', flag: '🇲🇦' },
  'MQ': { name: 'Martinica', flag: '🇲🇶' },
  'MU': { name: 'Maurício', flag: '🇲🇺' },
  'MR': { name: 'Mauritânia', flag: '🇲🇷' },
  'YT': { name: 'Mayotte', flag: '🇾🇹' },
  'MX': { name: 'México', flag: '🇲🇽' },
  'MM': { name: 'Mianmar', flag: '🇲🇲' },
  'FM': { name: 'Micronésia', flag: '🇫🇲' },
  'MZ': { name: 'Moçambique', flag: '🇲🇿' },
  'MD': { name: 'Moldávia', flag: '🇲🇩' },
  'MC': { name: 'Mônaco', flag: '🇲🇨' },
  'MN': { name: 'Mongólia', flag: '🇲🇳' },
  'ME': { name: 'Montenegro', flag: '🇲🇪' },
  'MS': { name: 'Montserrat', flag: '🇲🇸' },
  'NA': { name: 'Namíbia', flag: '🇳🇦' },
  'NR': { name: 'Nauru', flag: '🇳🇷' },
  'NP': { name: 'Nepal', flag: '🇳🇵' },
  'NI': { name: 'Nicarágua', flag: '🇳🇮' },
  'NE': { name: 'Níger', flag: '🇳🇪' },
  'NG': { name: 'Nigéria', flag: '🇳🇬' },
  'NU': { name: 'Niue', flag: '🇳🇺' },
  'NO': { name: 'Noruega', flag: '🇳🇴' },
  'NC': { name: 'Nova Caledônia', flag: '🇳🇨' },
  'NZ': { name: 'Nova Zelândia', flag: '🇳🇿' },
  'OM': { name: 'Omã', flag: '🇴🇲' },
  'PW': { name: 'Palau', flag: '🇵🇼' },
  'PS': { name: 'Palestina', flag: '🇵🇸' },
  'PA': { name: 'Panamá', flag: '🇵🇦' },
  'PG': { name: 'Papua-Nova Guiné', flag: '🇵🇬' },
  'PK': { name: 'Paquistão', flag: '🇵🇰' },
  'PY': { name: 'Paraguai', flag: '🇵🇾' },
  'PE': { name: 'Peru', flag: '🇵🇪' },
  'PF': { name: 'Polinésia Francesa', flag: '🇵🇫' },
  'PL': { name: 'Polônia', flag: '🇵🇱' },
  'PR': { name: 'Porto Rico', flag: '🇵🇷' },
  'PT': { name: 'Portugal', flag: '🇵🇹' },
  'KE': { name: 'Quênia', flag: '🇰🇪' },
  'KG': { name: 'Quirguistão', flag: '🇰🇬' },
  'GB': { name: 'Reino Unido', flag: '🇬🇧' },
  'CF': { name: 'República Centro-Africana', flag: '🇨🇫' },
  'CD': { name: 'República Democrática do Congo', flag: '🇨🇩' },
  'DO': { name: 'República Dominicana', flag: '🇩🇴' },
  'CZ': { name: 'República Tcheca', flag: '🇨🇿' },
  'RE': { name: 'Reunião', flag: '🇷🇪' },
  'RO': { name: 'Romênia', flag: '🇷🇴' },
  'RW': { name: 'Ruanda', flag: '🇷🇼' },
  'RU': { name: 'Rússia', flag: '🇷🇺' },
  'EH': { name: 'Saara Ocidental', flag: '🇪🇭' },
  'PM': { name: 'Saint Pierre e Miquelon', flag: '🇵🇲' },
  'WS': { name: 'Samoa', flag: '🇼🇸' },
  'AS': { name: 'Samoa Americana', flag: '🇦🇸' },
  'SM': { name: 'San Marino', flag: '🇸🇲' },
  'SH': { name: 'Santa Helena', flag: '🇸🇭' },
  'LC': { name: 'Santa Lúcia', flag: '🇱🇨' },
  'BL': { name: 'São Bartolomeu', flag: '🇧🇱' },
  'KN': { name: 'São Cristóvão e Nevis', flag: '🇰🇳' },
  'MF': { name: 'São Martinho', flag: '🇲🇫' },
  'ST': { name: 'São Tomé e Príncipe', flag: '🇸🇹' },
  'VC': { name: 'São Vicente e Granadinas', flag: '🇻🇨' },
  'SC': { name: 'Seychelles', flag: '🇸🇨' },
  'SN': { name: 'Senegal', flag: '🇸🇳' },
  'SL': { name: 'Serra Leoa', flag: '🇸🇱' },
  'RS': { name: 'Sérvia', flag: '🇷🇸' },
  'SG': { name: 'Singapura', flag: '🇸🇬' },
  'SX': { name: 'Sint Maarten', flag: '🇸🇽' },
  'SY': { name: 'Síria', flag: '🇸🇾' },
  'SO': { name: 'Somália', flag: '🇸🇴' },
  'LK': { name: 'Sri Lanka', flag: '🇱🇰' },
  'SD': { name: 'Sudão', flag: '🇸🇩' },
  'SS': { name: 'Sudão do Sul', flag: '🇸🇸' },
  'SE': { name: 'Suécia', flag: '🇸🇪' },
  'CH': { name: 'Suíça', flag: '🇨🇭' },
  'SR': { name: 'Suriname', flag: '🇸🇷' },
  'SJ': { name: 'Svalbard e Jan Mayen', flag: '🇸🇯' },
  'SZ': { name: 'Suazilândia', flag: '🇸🇿' },
  'TJ': { name: 'Tajiquistão', flag: '🇹🇯' },
  'TH': { name: 'Tailândia', flag: '🇹🇭' },
  'TW': { name: 'Taiwan', flag: '🇹🇼' },
  'TZ': { name: 'Tanzânia', flag: '🇹🇿' },
  'TF': { name: 'Terras Austrais e Antárticas Francesas', flag: '🇹🇫' },
  'IO': { name: 'Território Britânico do Oceano Índico', flag: '🇮🇴' },
  'TL': { name: 'Timor-Leste', flag: '🇹🇱' },
  'TG': { name: 'Togo', flag: '🇹🇬' },
  'TK': { name: 'Tokelau', flag: '🇹🇰' },
  'TO': { name: 'Tonga', flag: '🇹🇴' },
  'TT': { name: 'Trinidad e Tobago', flag: '🇹🇹' },
  'TN': { name: 'Tunísia', flag: '🇹🇳' },
  'TM': { name: 'Turcomenistão', flag: '🇹🇲' },
  'TR': { name: 'Turquia', flag: '🇹🇷' },
  'TV': { name: 'Tuvalu', flag: '🇹🇻' },
  'UA': { name: 'Ucrânia', flag: '🇺🇦' },
  'UG': { name: 'Uganda', flag: '🇺🇬' },
  'UY': { name: 'Uruguai', flag: '🇺🇾' },
  'UZ': { name: 'Uzbequistão', flag: '🇺🇿' },
  'VU': { name: 'Vanuatu', flag: '🇻🇺' },
  'VA': { name: 'Vaticano', flag: '🇻🇦' },
  'VE': { name: 'Venezuela', flag: '🇻🇪' },
  'VN': { name: 'Vietnã', flag: '🇻🇳' },
  'WF': { name: 'Wallis e Futuna', flag: '🇼🇫' },
  'ZM': { name: 'Zâmbia', flag: '🇿🇲' },
  'ZW': { name: 'Zimbábue', flag: '🇿🇼' }
};

const MethodsExpander: React.FC<MethodsExpanderProps> = ({ 
  payinStatus = 'operational',
  payoutStatus = 'operational',
  countryStatuses = {},
  components = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'payin' | 'payout' | null>(null);

  const methodsComponent = components.find(
    (c) => c.name === 'Methods' && c.visible
  );

  if (!methodsComponent) {
    return null;
  }

  // Cria a lista de países com base nos países configurados no componente
  const countries = Object.entries(countryData).map(([code, countryInfo]) => {
    const payinCountryStatus = countryStatuses.payin?.[code];
    const payoutCountryStatus = countryStatuses.payout?.[code];

    return {
      code,
      name: countryInfo.name,
      flag: countryInfo.flag,
      status: selectedType === 'payin' ? 
        (payinCountryStatus || 'operational') : 
        (payoutCountryStatus || 'operational'),
      availableForPayin: methodsComponent.payinCountries?.includes(code) || false,
      availableForPayout: methodsComponent.payoutCountries?.includes(code) || false,
      payinStatus: payinCountryStatus || 'operational',
      payoutStatus: payoutCountryStatus || 'operational'
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

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
                <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
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
