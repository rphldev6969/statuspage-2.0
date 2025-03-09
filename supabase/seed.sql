-- Inserir componentes básicos com status operacional
INSERT INTO components (name, description, status, "group", "order") VALUES
  ('API', 'API principal do sistema', 'operational', 'Core', 1),
  ('Database', 'Banco de dados do sistema', 'operational', 'Core', 2),
  ('Merchant Panel', 'Painel do comerciante', 'operational', 'Core', 3),
  ('Methods', 'Métodos de pagamento', 'operational', 'Core', 4);

-- Inserir alguns países para os métodos de pagamento
INSERT INTO methods_affected (incident_id, type, country_code, status) VALUES
  ('00000000-0000-0000-0000-000000000000', 'payin', 'BRA', 'operational'),
  ('00000000-0000-0000-0000-000000000000', 'payin', 'ARG', 'operational'),
  ('00000000-0000-0000-0000-000000000000', 'payin', 'CHL', 'operational'),
  ('00000000-0000-0000-0000-000000000000', 'payin', 'COL', 'operational'),
  ('00000000-0000-0000-0000-000000000000', 'payin', 'MEX', 'operational'),
  ('00000000-0000-0000-0000-000000000000', 'payout', 'BRA', 'operational'),
  ('00000000-0000-0000-0000-000000000000', 'payout', 'ARG', 'operational'),
  ('00000000-0000-0000-0000-000000000000', 'payout', 'CHL', 'operational'),
  ('00000000-0000-0000-0000-000000000000', 'payout', 'COL', 'operational'),
  ('00000000-0000-0000-0000-000000000000', 'payout', 'MEX', 'operational'); 