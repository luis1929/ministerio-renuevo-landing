'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { Share2, Heart, Users } from 'lucide-react';

// Inicializamos la conexión (asegúrese de tener sus variables en .env)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SocialHub() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('publicado', true);
      
      if (data) setPosts(data);
    }
    fetchPosts();
  }, []);

  return (
    <section id="social" className="py-24 px-4 bg-[hsl(220,30%,8%)]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-16">Blog del Ministerio</h2>
        
        {/* Aquí pintamos los datos de la base de datos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {posts.map((post) => (
            <motion.div key={post.id} className="bg-white/5 p-6 rounded-xl border border-gold/20">
              <h4 className="text-white font-bold mb-2">{post.titulo}</h4>
              <p className="text-gray-400 text-sm">{post.resumen}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}