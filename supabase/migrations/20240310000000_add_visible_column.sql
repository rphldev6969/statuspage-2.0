-- Adiciona a coluna visible à tabela components
ALTER TABLE components
ADD COLUMN visible BOOLEAN DEFAULT true;

-- Atualiza os registros existentes para terem visible = true
UPDATE components
SET visible = true
WHERE visible IS NULL; 