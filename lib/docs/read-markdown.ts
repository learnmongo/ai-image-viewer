import { readFile } from 'fs/promises';
import path from 'path';
import { DocSlug, getDocBySlug } from './registry';

const DOC_FILES: Record<DocSlug, string> = {
  readme: 'README.md',
  architecture: 'ARCHITECTURE.md',
  'code-guide': 'CODE-GUIDE.md',
  search: 'SEARCH.md',
  ollama: 'OLLAMA.md',
  prompts: 'PROMPTS.md',
};

export async function readDocMarkdown(slug: string): Promise<string | null> {
  const doc = getDocBySlug(slug);
  if (!doc || !(slug in DOC_FILES)) return null;

  const absolutePath = path.join(
    /* turbopackIgnore: true */ process.cwd(),
    DOC_FILES[slug as DocSlug],
  );
  return readFile(absolutePath, 'utf8');
}
