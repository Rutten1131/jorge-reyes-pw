import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin CMS | Jorge Reyes Loja 2026',
  description: 'Panel de administración de contenidos',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}