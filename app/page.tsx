export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase';
import type { BlogPost } from '@/lib/supabase';

import PageShell from '@/components/PageShell';
import RevealContent from '@/components/RevealContent';
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import VirtualMeetings from '@/components/VirtualMeetings';
import BlogSection from '@/components/BlogSection';
import DonationsSection from '@/components/DonationsSection';
import RegistroSection from '@/components/RegistroSection';
import SocialSection from '@/components/SocialSection';
import Footer from '@/components/Footer';
async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('publicado', true)
    .order('created_at', {
      ascending: false,
    })
    .limit(6);

  if (error) return [];

  return data as BlogPost[];
}

export default async function Home() {
  const blogPosts = await getBlogPosts();

  return (
    <PageShell>
    <main className="min-h-screen bg-[hsl(220,35%,6%)]">
      <Header />

      <HeroCarousel />

      <RevealContent>
        <div className="section-divider" />

        <VirtualMeetings />

        <div className="section-divider" />

        <BlogSection posts={blogPosts} />

        <DonationsSection />

        <div className="section-divider" />

        <div id="seccion-registro">
          <RegistroSection />
        </div>

        <div className="section-divider" />

        <div id="seccion-sociales">
          <SocialSection />
        </div>

        <div className="section-divider" />

        <Footer />
      </RevealContent>
    </main>
    </PageShell>
  );
}