CREATE TABLE IF NOT EXISTS eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL DEFAULT 'Evento',
  titulo text NOT NULL,
  descripcion_corta text NOT NULL DEFAULT '',
  descripcion_larga text NOT NULL DEFAULT '',
  fecha date NOT NULL,
  hora text NOT NULL DEFAULT '',
  lugar text NOT NULL DEFAULT '',
  imagen text NOT NULL DEFAULT '',
  activo boolean NOT NULL DEFAULT true,
  orden integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

GRANT ALL ON eventos TO service_role;
GRANT ALL ON eventos TO authenticated;
GRANT SELECT ON eventos TO anon;

CREATE POLICY "Anyone can read active eventos"
  ON eventos FOR SELECT
  TO anon
  USING (activo = true);

CREATE POLICY "Authenticated can read all eventos"
  ON eventos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can manage eventos"
  ON eventos FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
