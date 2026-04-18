import Header from '@/components/Header';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface ComponentRendererProps {
  type: string;
  props: Record<string, unknown>;
}

function ComponentRenderer({ type, props }: ComponentRendererProps) {
  switch (type) {
    case 'heading':
      const HeadingTag = `h${props.level || 1}` as keyof JSX.IntrinsicElements;
      return <HeadingTag style={type === 'heading' ? { fontWeight: 'bold' } : {}}>{props.text as string}</HeadingTag>;
    case 'text':
      return <p>{props.content as string}</p>;
    case 'image':
      return <img src={props.src as string} alt={props.alt as string} style={{ maxWidth: '100%' }} />;
    case 'button':
      return <a href={props.href as string} style={{ display: 'inline-block', padding: '8px 24px', background: '#1677ff', color: '#fff', borderRadius: 4 }}>{props.text as string}</a>;
    case 'divider':
      return <hr style={{ border: 'none', borderTop: '1px solid #d9d9d9', margin: '24px 0' }} />;
    default:
      return <div>Unknown component: {type}</div>;
  }
}

export default async function PageRenderer({ params }: { params: { slug: string } }) {
  const page = await prisma.page.findUnique({
    where: { slug: params.slug, status: 'PUBLISHED' },
  });

  if (!page) {
    notFound();
  }

  const content = page.contentJson as { components?: Array<{ id: string; type: string; props: Record<string, unknown> }> } | null;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      <div style={{ padding: '120px 48px 64px', maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ fontSize: 36, marginBottom: 40, textAlign: 'center' }}>{page.title}</h1>
        {content?.components?.map((comp) => (
          <div key={comp.id} style={{ marginBottom: 24 }}>
            <ComponentRenderer type={comp.type} props={comp.props} />
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
