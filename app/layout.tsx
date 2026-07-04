import './globals.css';
import { Poppins, JetBrains_Mono } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Cozy Café Portfolio',
  description: 'A warm, minimal, and comfortable digital space.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#F9F7F5] text-[#3E2B1E] font-sans antialiased min-h-screen selection:bg-[#E9E3DD] selection:text-[#3E2B1E]">
        {children}
      </body>
    </html>
  );
}