// Server Component for Next.js 16 with cacheComponents & Turbopack
import OrderDetailClient from './OrderDetailClient';

export function generateStaticParams() {
  return [
    { id: 'ord_101' },
    { id: 'ord_102' },
    { id: 'ord_103' },
    { id: 'ord_104' },
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <OrderDetailClient id={id} />;
}
