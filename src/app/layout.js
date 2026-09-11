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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        />
        <link rel="preconnect" href="https://nfjpofapewvvngxeqlfy.supabase.co" />
        <link rel="dns-prefetch" href="https://nfjpofapewvvngxeqlfy.supabase.co" />
        <link rel="dns-prefetch" href="https://api.openai.com" />
      </head>
      <body>
        <BackgroundVideo />
        {children}
      </body>
    </html>
  );
}
