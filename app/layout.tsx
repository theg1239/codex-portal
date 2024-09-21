import { ReactNode } from 'react';
import '../globals.css';
import { VT323 } from 'next/font/google';
import SessionProviderWrapper from '../components/SessionProviderWrapper';
import AuthWrapper from '../components/AuthWrapper';

const vt323 = VT323({ weight: '400', subsets: ['latin'] });

export const metadata = {
  title: 'Codex Cryptum',
  description: 'A cybersecurity hackathon workshop',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${vt323.className} bg-black text-green-500 flex flex-col h-full relative`}>
        <SessionProviderWrapper>
          <AuthWrapper>
            <div className="flex-grow relative z-0">{children}</div>
          </AuthWrapper>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
