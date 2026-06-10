/*
  # Ministry El Renuevo - Core Tables

  1. New Tables
    - `blog_posts` - Blog/news articles
      - `id` (uuid, primary key)
      - `titulo` (text) - Post title
      - `resumen` (text) - Short summary
      - `contenido` (text) - Full content
      - `imagen_url` (text) - Cover image URL
      - `categoria` (text) - Category tag
      - `publicado` (boolean) - Published flag
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on blog_posts
    - `blog_posts`: public read for published posts; no public write
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  resumen text NOT NULL DEFAULT '',
  contenido text NOT NULL DEFAULT '',
  imagen_url text NOT NULL DEFAULT '',
  categoria text NOT NULL DEFAULT 'General',
  publicado boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published posts"
  ON blog_posts FOR SELECT
  TO anon
  USING (publicado = true);

CREATE POLICY "Authenticated can read all posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can manage posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed some sample blog posts
INSERT INTO blog_posts (titulo, resumen, contenido, imagen_url, categoria, publicado) VALUES
  ('Bienvenidos al Ministerio El Renuevo', 'Un espacio de fe, esperanza y transformación para toda la familia.', 'Contenido completo del artículo...', 'https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg', 'Mensaje', true),
  ('Servicio de Adoración del Domingo', 'Únete a nuestro poderoso servicio dominical y experimenta la presencia de Dios.', 'Contenido completo del artículo...', 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg', 'Adoración', true),
  ('Estudio Bíblico del Miércoles', 'Profundiza en la Palabra de Dios cada miércoles a las 7:00 PM.', 'Contenido completo del artículo...', 'https://images.pexels.com/photos/3394939/pexels-photo-3394939.jpeg', 'Estudio', true)
ON CONFLICT DO NOTHING;
