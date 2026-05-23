'use client';

import { motion } from 'framer-motion';
import { BookOpen, Clock, Tag, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/lib/supabase';

interface BlogSectionProps {
  posts: BlogPost[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass-card rounded-2xl overflow-hidden group hover:border-gold/25 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.imagen_url}
          alt={post.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,35%,6%)]/80 to-transparent" />
        <span className="absolute top-3 left-3 bg-gold/90 text-[hsl(220,35%,6%)] text-xs font-bold px-3 py-1 rounded-full">
          {post.categoria}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-[hsl(220,15%,52%)] text-xs mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatDate(post.created_at)}</span>
          <Tag className="w-3.5 h-3.5 ml-1" />
          <span>{post.categoria}</span>
        </div>

        <h3 className="text-white font-bold text-lg mb-2 leading-tight group-hover:text-gold transition-colors">
          {post.titulo}
        </h3>
        <p className="text-[hsl(45,50%,70%)] text-sm leading-relaxed flex-1 mb-4">
          {post.resumen}
        </p>

        <button className="flex items-center gap-2 text-gold text-sm font-semibold hover:gap-3 transition-all">
          Leer más
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.article>
  );
}

export default function BlogSection({ posts }: BlogSectionProps) {
  return (
    <section id="blog" className="py-24 px-4 sm:px-6 lg:px-8 bg-[hsl(220,30%,9%)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold uppercase tracking-widest">Noticias</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Blog del Ministerio
          </h2>
          <div className="section-divider max-w-xs mx-auto mb-6" />
          <p className="text-[hsl(45,60%,75%)] text-lg max-w-2xl mx-auto">
            Mensajes inspiradores, noticias de la comunidad y reflexiones para tu caminar de fe.
          </p>
        </motion.div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-[hsl(220,15%,40%)] mx-auto mb-4" />
            <p className="text-[hsl(220,15%,52%)]">No hay publicaciones disponibles aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="border border-gold/40 text-gold font-semibold px-8 py-3 rounded-full hover:bg-gold/10 transition-colors">
            Ver todas las publicaciones
          </button>
        </motion.div>
      </div>
    </section>
  );
}
