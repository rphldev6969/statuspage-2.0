-- Cria a função para recarregar o cache do schema
CREATE OR REPLACE FUNCTION reload_schema_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Força uma atualização do cache do schema
  NOTIFY pgrst, 'reload schema';
END;
$$; 