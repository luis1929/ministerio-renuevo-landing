CREATE TABLE IF NOT EXISTS donaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metodo text NOT NULL,
  valor text NOT NULL,
  icono text NOT NULL DEFAULT 'generic',
  activo boolean NOT NULL DEFAULT true,
  orden integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE donaciones ENABLE ROW LEVEL SECURITY;

GRANT ALL ON donaciones TO service_role;
GRANT ALL ON donaciones TO authenticated;
GRANT SELECT ON donaciones TO anon;

CREATE POLICY "Anyone can read active donaciones"
  ON donaciones FOR SELECT
  TO anon
  USING (activo = true);

CREATE POLICY "Authenticated can read all donaciones"
  ON donaciones FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can manage donaciones"
  ON donaciones FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
