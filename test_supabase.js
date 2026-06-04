require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  realtime: { transport: ws }
});

async function test() {
  console.log("Intentando conectar a:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  const { data, error } = await supabase.from('blog_posts').select('*');
  if (error) {
    console.error("ERROR DE SUPABASE:", error);
  } else {
    console.log("¡CONEXIÓN EXITOSA! Posts encontrados:", data.length);
  }
}
test();
