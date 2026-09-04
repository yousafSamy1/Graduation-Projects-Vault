import './globals.css';
import BackgroundVideo from '@/components/BackgroundVideo';

export const metadata = {
  title: 'GradVault | Egyptian Russian University Graduation Projects Archive',
  description: 'AI-Powered Digital Graduation Projects Vault - Faculty of Management, Economics & Business Technology',
  keywords: ['graduation projects', 'ERU', 'Egyptian Russian University', 'search', 'AI', 'MIS', 'BA', 'Fintech'],
  openGraph: {
    title: 'GradVault | Egyptian Russian University',
    description: 'AI-Powered Digital Graduation Projects Vault',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body>
        <BackgroundVideo />
        {children}
      </body>
    </html>
  );
}
