-- Criar tabelas
CREATE TABLE components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'operational' CHECK (status IN ('operational', 'degraded', 'outage')),
  "group" TEXT,
  "order" INTEGER NOT NULL,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT components_status_default CHECK (status = 'operational' OR status IN ('degraded', 'outage'))
);

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar o timestamp de updated_at
CREATE TRIGGER update_components_updated_at
  BEFORE UPDATE ON components
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('investigating', 'identified', 'monitoring', 'resolved')),
  impact TEXT NOT NULL CHECK (impact IN ('none', 'minor', 'major', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

CREATE TABLE incident_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('investigating', 'identified', 'monitoring', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

CREATE TABLE affected_components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('operational', 'degraded', 'outage')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE methods_affected (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('payin', 'payout')),
  country_code TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('operational', 'degraded', 'outage')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE maintenance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed')),
  scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
  scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

CREATE TABLE maintenance_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maintenance_id UUID NOT NULL REFERENCES maintenance(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Tabela de relacionamento entre subscriptions e components
CREATE TABLE subscription_components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL,
  component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(subscription_id, component_id)
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  phone TEXT,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'webhook')),
  webhook_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Políticas de segurança
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affected_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE methods_affected ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- Políticas para components
CREATE POLICY "Componentes são públicos para leitura"
  ON components FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Apenas usuários autenticados podem modificar componentes"
  ON components FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para incidents
CREATE POLICY "Incidentes são públicos para leitura"
  ON incidents FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Apenas usuários autenticados podem criar incidentes"
  ON incidents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Apenas usuários autenticados podem atualizar incidentes"
  ON incidents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para incident_updates
CREATE POLICY "Atualizações de incidentes são públicas para leitura"
  ON incident_updates FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Apenas usuários autenticados podem criar atualizações de incidentes"
  ON incident_updates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Políticas para affected_components
CREATE POLICY "Componentes afetados são públicos para leitura"
  ON affected_components FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Apenas usuários autenticados podem modificar componentes afetados"
  ON affected_components FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para methods_affected
CREATE POLICY "Métodos afetados são públicos para leitura"
  ON methods_affected FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Apenas usuários autenticados podem modificar métodos afetados"
  ON methods_affected FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para maintenance
CREATE POLICY "Manutenções são públicas para leitura"
  ON maintenance FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Apenas usuários autenticados podem criar manutenções"
  ON maintenance FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Apenas usuários autenticados podem atualizar manutenções"
  ON maintenance FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para maintenance_updates
CREATE POLICY "Atualizações de manutenção são públicas para leitura"
  ON maintenance_updates FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Apenas usuários autenticados podem criar atualizações de manutenção"
  ON maintenance_updates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Políticas para subscriptions
CREATE POLICY "Inscrições são públicas para leitura"
  ON subscriptions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Qualquer um pode criar inscrições"
  ON subscriptions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Apenas usuários autenticados podem gerenciar inscrições"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para subscription_components
CREATE POLICY "Componentes das inscrições são públicos para leitura"
  ON subscription_components FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Qualquer um pode adicionar componentes às inscrições"
  ON subscription_components FOR INSERT
  TO public
  WITH CHECK (true);

-- Políticas para metrics
CREATE POLICY "Métricas são públicas para leitura"
  ON metrics FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Apenas usuários autenticados podem criar métricas"
  ON metrics FOR INSERT
  TO authenticated
  WITH CHECK (true); 