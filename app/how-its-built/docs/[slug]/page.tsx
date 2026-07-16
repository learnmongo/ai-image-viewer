import { notFound } from 'next/navigation';
import { DocPage } from '@/components/how-its-built/DocPage';
import { readDocMarkdown } from '@/lib/docs/read-markdown';
import { DOC_SLUGS, getDocBySlug } from '@/lib/docs/registry';

interface DocRouteProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return DOC_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DocRouteProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) return { title: 'Not found' };

  return {
    title: `${doc.title} | Project guide`,
    description: doc.description,
  };
}

export default async function DocRoute({ params }: DocRouteProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  const markdown = await readDocMarkdown(slug);
  if (!markdown) notFound();

  return <DocPage doc={doc} markdown={markdown} />;
}
