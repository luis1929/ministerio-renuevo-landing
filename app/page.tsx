import { supabase } from '@/lib/supabase';
import type { BlogPost } from '@/lib/supabase';
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import RadioSection from '@/components/RadioSection';
import RegistrationSection from '@/components/RegistrationSection';
import VirtualMeetings from '@/components/VirtualMeetings';
import BlogSection from '@/components/BlogSection';
import DonationsSection from '@/components/DonationsSection';
import SocialSection from '@/components/SocialSection';
import SocialHub from '@/components/SocialHub';
import Footer from '@/components/Footer';

async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('publicado', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) return [];
  return data as BlogPost[];
}

export default async function Home() {
  const blogPosts = await getBlogPosts();

  return (
    <main className="min-h-screen bg-[hsl(220,35%,6%)]">
      <Header />
      <HeroCarousel />

      <div className="section-divider" />

      <RadioSection />

      <div className="section-divider" />

      <VirtualMeetings />

      <div className="section-divider" />

      <BlogSection posts={blogPosts} />

      <div className="section-divider" />

      <RegistrationSection />

      <div className="section-divider" />

      <DonationsSection />

      <div className="section-divider" />

      <SocialSection />

      <div className="section-divider" />

      <SocialHub />

      <Footer />
    </main>
  );
}
