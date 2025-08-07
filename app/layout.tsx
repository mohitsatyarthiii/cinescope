import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { Navbar } from '../components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MovieVerse - Discover Movies & TV Series',
  description: 'Explore and discover movies and TV series from around the world with our beautiful, modern interface.',
  keywords: 'movies, tv series, cinema, entertainment, film database',
  authors: [{ name: 'MovieVerse Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <footer className="py-6 px-4 text-center text-gray-500 text-sm border-t border-gray-800">
              <div className="container mx-auto">
                <p>© {new Date().getFullYear()} CINESCOPE. All rights reserved.</p>
                <p className="mt-2">Powered by OMDb API</p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}