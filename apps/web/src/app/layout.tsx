import type { Metadata } from 'next';
import { Manrope, Public_Sans } from 'next/font/google';
import { CartProvider } from '@/context/cart-context';
import { AuthProvider } from '@/context/auth-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ThemeScript } from '@/components/theme-script';
import './globals.css';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
});

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Prescription Lifeline Pharmacy',
  description:
    'Genuine medicines, vitamins, personal care and telepharmacy — delivered fast across Nigeria by a licensed pharmacy team.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${publicSans.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink antialiased">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
