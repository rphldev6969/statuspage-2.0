-- Adiciona as colunas payin_countries e payout_countries à tabela components
ALTER TABLE components
ADD COLUMN IF NOT EXISTS payin_countries text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS payout_countries text[] DEFAULT '{}'; 