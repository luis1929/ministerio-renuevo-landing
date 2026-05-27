import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    'https://envivoministerioelrenuevo.org'
  ),

  title: 'Ministerio El Renuevo',

  description:
    'Un espacio de fe, esperanza y transformación. Únete a nuestra comunidad de adoración.',

  openGraph: {
    title: 'Ministerio El Renuevo',

    description:
      'Fe, Esperanza y Transformación',

    images: [
      {
        url: 'https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
