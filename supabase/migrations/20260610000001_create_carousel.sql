CREATE TABLE IF NOT EXISTS carousel_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  cta1_label text DEFAULT 'REGISTRAR ASISTENCIA',
  cta1_href text DEFAULT '#registro',
  cta2_label text DEFAULT 'OFRENDAR',
  cta2_href text DEFAULT '#donaciones',
  orden integer NOT NULL DEFAULT 0,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;
