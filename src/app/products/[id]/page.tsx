// Server Component for Next.js 16 with cacheComponents & Turbopack
import EditProductClient from './EditProductClient';

export function generateStaticParams() {
  return [
    { id: 'prod_1' },
    { id: 'prod_2' },
    { id: 'prod_3' },
    { id: 'prod_4' },
    { id: 'prod_5' },
    { id: 'prod_6' },
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  return <EditProductClient id={id} />;
}
