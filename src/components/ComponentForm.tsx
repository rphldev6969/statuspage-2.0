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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogClose } from "@/components/ui/dialog";

const defaultCountries = [
  { code: 'AF', name: 'Afeganistão' },
  { code: 'ZA', name: 'África do Sul' },
  { code: 'AL', name: 'Albânia' },
  { code: 'DE', name: 'Alemanha' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AG', name: 'Antígua e Barbuda' },
  { code: 'SA', name: 'Arábia Saudita' },
  { code: 'DZ', name: 'Argélia' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armênia' },
  { code: 'AU', name: 'Austrália' },
  { code: 'AT', name: 'Áustria' },
  { code: 'AZ', name: 'Azerbaijão' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BH', name: 'Bahrein' },
  { code: 'BE', name: 'Bélgica' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BY', name: 'Bielorrússia' },
  { code: 'BO', name: 'Bolívia' },
  { code: 'BA', name: 'Bósnia e Herzegovina' },
  { code: 'BW', name: 'Botsuana' },
  { code: 'BR', name: 'Brasil' },
  { code: 'BN', name: 'Brunei' },
  { code: 'BG', name: 'Bulgária' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'BT', name: 'Butão' },
  { code: 'CV', name: 'Cabo Verde' },
  { code: 'CM', name: 'Camarões' },
  { code: 'KH', name: 'Camboja' },
  { code: 'CA', name: 'Canadá' },
  { code: 'QA', name: 'Catar' },
  { code: 'KZ', name: 'Cazaquistão' },
  { code: 'TD', name: 'Chade' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CY', name: 'Chipre' },
  { code: 'CO', name: 'Colômbia' },
  { code: 'KM', name: 'Comores' },
  { code: 'CG', name: 'Congo' },
  { code: 'KP', name: 'Coreia do Norte' },
  { code: 'KR', name: 'Coreia do Sul' },
  { code: 'CI', name: 'Costa do Marfim' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'HR', name: 'Croácia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'DK', name: 'Dinamarca' },
  { code: 'DJ', name: 'Djibuti' },
  { code: 'DM', name: 'Dominica' },
  { code: 'EG', name: 'Egito' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'AE', name: 'Emirados Árabes Unidos' },
  { code: 'EC', name: 'Equador' },
  { code: 'ER', name: 'Eritreia' },
  { code: 'SK', name: 'Eslováquia' },
  { code: 'SI', name: 'Eslovênia' },
  { code: 'ES', name: 'Espanha' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'EE', name: 'Estônia' },
  { code: 'ET', name: 'Etiópia' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'PH', name: 'Filipinas' },
  { code: 'FI', name: 'Finlândia' },
  { code: 'FR', name: 'França' },
  { code: 'GA', name: 'Gabão' },
  { code: 'GM', name: 'Gâmbia' },
  { code: 'GH', name: 'Gana' },
  { code: 'GE', name: 'Geórgia' },
  { code: 'GD', name: 'Granada' },
  { code: 'GR', name: 'Grécia' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GY', name: 'Guiana' },
  { code: 'GN', name: 'Guiné' },
  { code: 'GQ', name: 'Guiné Equatorial' },
  { code: 'GW', name: 'Guiné-Bissau' },
  { code: 'HT', name: 'Haiti' },
  { code: 'NL', name: 'Holanda' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HU', name: 'Hungria' },
  { code: 'YE', name: 'Iêmen' },
  { code: 'IN', name: 'Índia' },
  { code: 'ID', name: 'Indonésia' },
  { code: 'IQ', name: 'Iraque' },
  { code: 'IR', name: 'Irã' },
  { code: 'IE', name: 'Irlanda' },
  { code: 'IS', name: 'Islândia' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Itália' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japão' },
  { code: 'JO', name: 'Jordânia' },
  { code: 'KE', name: 'Quênia' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'LA', name: 'Laos' },
  { code: 'LS', name: 'Lesoto' },
  { code: 'LV', name: 'Letônia' },
  { code: 'LB', name: 'Líbano' },
  { code: 'LR', name: 'Libéria' },
  { code: 'LY', name: 'Líbia' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lituânia' },
  { code: 'LU', name: 'Luxemburgo' },
  { code: 'MK', name: 'Macedônia do Norte' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MY', name: 'Malásia' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MV', name: 'Maldivas' },
  { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' },
  { code: 'MA', name: 'Marrocos' },
  { code: 'MU', name: 'Maurício' },
  { code: 'MR', name: 'Mauritânia' },
  { code: 'MX', name: 'México' },
  { code: 'MM', name: 'Mianmar' },
  { code: 'FM', name: 'Micronésia' },
  { code: 'MZ', name: 'Moçambique' },
  { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Mônaco' },
  { code: 'MN', name: 'Mongólia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'NA', name: 'Namíbia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NI', name: 'Nicarágua' },
  { code: 'NE', name: 'Níger' },
  { code: 'NG', name: 'Nigéria' },
  { code: 'NO', name: 'Noruega' },
  { code: 'NZ', name: 'Nova Zelândia' },
  { code: 'OM', name: 'Omã' },
  { code: 'PW', name: 'Palau' },
  { code: 'PA', name: 'Panamá' },
  { code: 'PG', name: 'Papua-Nova Guiné' },
  { code: 'PK', name: 'Paquistão' },
  { code: 'PY', name: 'Paraguai' },
  { code: 'PE', name: 'Peru' },
  { code: 'PL', name: 'Polônia' },
  { code: 'PT', name: 'Portugal' },
  { code: 'KG', name: 'Quirguistão' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'CF', name: 'República Centro-Africana' },
  { code: 'CD', name: 'República Democrática do Congo' },
  { code: 'DO', name: 'República Dominicana' },
  { code: 'CZ', name: 'República Tcheca' },
  { code: 'RO', name: 'Romênia' },
  { code: 'RW', name: 'Ruanda' },
  { code: 'RU', name: 'Rússia' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' },
  { code: 'LC', name: 'Santa Lúcia' },
  { code: 'ST', name: 'São Tomé e Príncipe' },
  { code: 'SN', name: 'Senegal' },
  { code: 'SL', name: 'Serra Leoa' },
  { code: 'RS', name: 'Sérvia' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SG', name: 'Singapura' },
  { code: 'SY', name: 'Síria' },
  { code: 'SO', name: 'Somália' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudão' },
  { code: 'SS', name: 'Sudão do Sul' },
  { code: 'SE', name: 'Suécia' },
  { code: 'CH', name: 'Suíça' },
  { code: 'SR', name: 'Suriname' },
  { code: 'TH', name: 'Tailândia' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajiquistão' },
  { code: 'TZ', name: 'Tanzânia' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad e Tobago' },
  { code: 'TN', name: 'Tunísia' },
  { code: 'TM', name: 'Turcomenistão' },
  { code: 'TR', name: 'Turquia' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'UA', name: 'Ucrânia' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UY', name: 'Uruguai' },
  { code: 'UZ', name: 'Uzbequistão' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnã' },
  { code: 'ZM', name: 'Zâmbia' },
  { code: 'ZW', name: 'Zimbábue' }
].sort((a, b) => a.name.localeCompare(b.name));

interface ComponentFormProps {
  onCreateComponent: (component: {
    name: string;
    description: string;
    group: string;
    order: number;
    visible: boolean;
    payinCountries?: string[];
    payoutCountries?: string[];
  }) => void;
  onUpdateComponent?: (id: string, component: {
    name: string;
    description: string;
    group: string;
    visible: boolean;
    payinCountries?: string[];
    payoutCountries?: string[];
  }) => void;
  onDeleteComponent?: (id: string) => void;
  onClose: () => void;
  editingComponent?: {
    id: string;
    name: string;
    description: string;
    group: string;
    visible: boolean;
    payinCountries?: string[];
    payoutCountries?: string[];
  } | null;
  components: SystemComponent[];
}

const ComponentForm: React.FC<ComponentFormProps> = ({ 
  onCreateComponent,
  onUpdateComponent,
  onDeleteComponent,
  onClose,
  editingComponent,
  components
}) => {
  const [name, setName] = useState(editingComponent?.name || '');
  const [description, setDescription] = useState(editingComponent?.description || '');
  const [group, setGroup] = useState(editingComponent?.group || 'Core');
  const [visible, setVisible] = useState(editingComponent?.visible ?? true);
  const [payinCountries, setPayinCountries] = useState<string[]>([]);
  const [payoutCountries, setPayoutCountries] = useState<string[]>([]);
  const [searchPayin, setSearchPayin] = useState('');
  const [searchPayout, setSearchPayout] = useState('');
  const [countries, setCountries] = useState(defaultCountries);
  
  useEffect(() => {
    if (editingComponent) {
      setName(editingComponent.name);
      setDescription(editingComponent.description);
      setGroup(editingComponent.group);
      setVisible(editingComponent.visible);
      
      // Garante que os arrays de países existam e não sejam null
      const payin = editingComponent.payinCountries || [];
      const payout = editingComponent.payoutCountries || [];

      console.log('Payin countries from DB:', payin);
      console.log('Payout countries from DB:', payout);

      // Atualiza os estados com os países do banco
      setPayinCountries(payin);
      setPayoutCountries(payout);
    } else {
      // Reset do formulário quando não há componente sendo editado
      setName('');
      setDescription('');
      setGroup('Core');
      setVisible(true);
      setPayinCountries([]);
      setPayoutCountries([]);
    }
  }, [editingComponent]);

  // Efeito para atualizar a lista de países quando os países selecionados mudarem
  useEffect(() => {
    const newCountries = [...defaultCountries];
    const existingCodes = new Set(newCountries.map(c => c.code));

    // Adiciona países de payin que não existem na lista
    payinCountries.forEach(code => {
      if (!existingCodes.has(code)) {
        const countryName = defaultCountries.find(c => c.code === code)?.name || code;
        newCountries.push({ code, name: countryName });
        existingCodes.add(code);
      }
    });

    // Adiciona países de payout que não existem na lista
    payoutCountries.forEach(code => {
      if (!existingCodes.has(code)) {
        const countryName = defaultCountries.find(c => c.code === code)?.name || code;
        newCountries.push({ code, name: countryName });
        existingCodes.add(code);
      }
    });

    setCountries(newCountries.sort((a, b) => a.name.localeCompare(b.name)));
  }, [payinCountries, payoutCountries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const componentData = {
        name,
        description,
        group,
        visible,
        ...(name === 'Methods' && {
          payinCountries,
          payoutCountries
        })
      };

      if (editingComponent && onUpdateComponent) {
        await onUpdateComponent(editingComponent.id, componentData);
      } else {
        const nextOrder = components.length > 0 
          ? Math.max(...components.map(c => c.order || 0)) + 1 
          : 1;
        
        await onCreateComponent({
          ...componentData,
          order: nextOrder,
        });
      }

      // Fecha o modal usando a função onClose
      onClose();
    } catch (error) {
      console.error('Erro ao salvar componente:', error);
    }
  };

  const handleDelete = () => {
    if (editingComponent && onDeleteComponent) {
      onDeleteComponent(editingComponent.id);
    }
  };

  const isMethodsComponent = name === 'Methods';

  return (
    <Card className="max-h-[85vh] overflow-y-auto">
      <CardHeader className="sticky top-0 z-10 bg-background">
        <CardTitle>{editingComponent ? 'Edit Component' : 'Create New Component'}</CardTitle>
        <CardDescription>
          {editingComponent ? 'Update component details' : 'Add a new component to the status page'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Componente</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: API, Database, etc."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o que este componente faz"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="group">Grupo</Label>
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
            <Label htmlFor="visible">Visível na Visão Geral</Label>
          </div>

          {isMethodsComponent && (
            <div className="space-y-4 border rounded-lg p-4">
              <Label>Methods Configuration</Label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Payin Countries</Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="Procurar país..."
                      value={searchPayin}
                      onChange={(e) => setSearchPayin(e.target.value)}
                    />
                    <div className="flex gap-2 mb-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPayinCountries(countries.map(c => c.code))}
                      >
                        Selecionar Todos
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPayinCountries([])}
                      >
                        Limpar
                      </Button>
                    </div>
                    <Card className="p-0">
                      <ScrollArea className="h-[200px] w-full">
                        <div className="p-4 space-y-2">
                          {countries
                            .filter(country => 
                              country.name.toLowerCase().includes(searchPayin.toLowerCase()) ||
                              country.code.toLowerCase().includes(searchPayin.toLowerCase())
                            )
                            .map((country) => (
                              <div key={country.code} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`payin-${country.code}`}
                                  checked={payinCountries.includes(country.code)}
                                  onChange={() => {
                                    setPayinCountries(prev =>
                                      prev.includes(country.code)
                                        ? prev.filter(code => code !== country.code)
                                        : [...prev, country.code]
                                    );
                                  }}
                                  className="h-4 w-4"
                                />
                                <label htmlFor={`payin-${country.code}`} className="text-sm">
                                  {country.name}
                                </label>
                              </div>
                            ))}
                        </div>
                      </ScrollArea>
                    </Card>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        {payinCountries.length} países selecionados
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Payout Countries</Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="Procurar país..."
                      value={searchPayout}
                      onChange={(e) => setSearchPayout(e.target.value)}
                    />
                    <div className="flex gap-2 mb-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPayoutCountries(countries.map(c => c.code))}
                      >
                        Selecionar Todos
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPayoutCountries([])}
                      >
                        Limpar
                      </Button>
                    </div>
                    <Card className="p-0">
                      <ScrollArea className="h-[200px] w-full">
                        <div className="p-4 space-y-2">
                          {countries
                            .filter(country => 
                              country.name.toLowerCase().includes(searchPayout.toLowerCase()) ||
                              country.code.toLowerCase().includes(searchPayout.toLowerCase())
                            )
                            .map((country) => (
                              <div key={country.code} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`payout-${country.code}`}
                                  checked={payoutCountries.includes(country.code)}
                                  onChange={() => {
                                    setPayoutCountries(prev =>
                                      prev.includes(country.code)
                                        ? prev.filter(code => code !== country.code)
                                        : [...prev, country.code]
                                    );
                                  }}
                                  className="h-4 w-4"
                                />
                                <label htmlFor={`payout-${country.code}`} className="text-sm">
                                  {country.name}
                                </label>
                              </div>
                            ))}
                        </div>
                      </ScrollArea>
                    </Card>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        {payoutCountries.length} países selecionados
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-background p-4 border-t">
          <div className="flex justify-end gap-2">
            {editingComponent && (
              <DialogClose asChild>
                <Button 
                  type="button"
                  variant="outline"
                >
                  Cancelar
                </Button>
              </DialogClose>
            )}
            <Button type="submit">
              {editingComponent ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default ComponentForm; 