export type DocSlug =
  | 'readme'
  | 'architecture'
  | 'code-guide'
  | 'search'
  | 'ollama'
  | 'prompts';

export interface DocEntry {
  slug: DocSlug;
  filePath: string;
  fileName: string;
  title: string;
  description: string;
}

const DOCS: Record<DocSlug, Omit<DocEntry, 'slug'>> = {
  readme: {
    filePath: 'README.md',
    fileName: 'README.md',
    title: 'README',
    description: 'High-level overview of the project, architecture, and repository guide.',
  },
  architecture: {
    filePath: 'ARCHITECTURE.md',
    fileName: 'ARCHITECTURE.md',
    title: 'Architecture',
    description:
      'Understand the overall system, the processing pipeline, and why the project is structured this way.',
  },
  'code-guide': {
    filePath: 'CODE-GUIDE.md',
    fileName: 'CODE-GUIDE.md',
    title: 'Code Guide',
    description:
      'A guided tour of the repository and where to find the code shown in the tutorial.',
  },
  search: {
    filePath: 'SEARCH.md',
    fileName: 'SEARCH.md',
    title: 'Search',
    description:
      'Learn how MongoDB Search, MongoDB Vector Search, and Hybrid Search are implemented.',
  },
  ollama: {
    filePath: 'OLLAMA.md',
    fileName: 'OLLAMA.md',
    title: 'Ollama',
    description:
      'Learn how Ollama fits into the processing pipeline and how to swap in other providers.',
  },
  prompts: {
    filePath: 'PROMPTS.md',
    fileName: 'PROMPTS.md',
    title: 'Prompts',
    description:
      'Read about the prompt engineering decisions and lessons learned while building the project.',
  },
};

/** Maps markdown filenames (and legacy paths) to doc slugs for link rewriting. */
const FILE_TO_SLUG: Record<string, DocSlug> = {
  'README.md': 'readme',
  'ARCHITECTURE.md': 'architecture',
  'CODE-GUIDE.md': 'code-guide',
  'SEARCH.md': 'search',
  'OLLAMA.md': 'ollama',
  'PROMPTS.md': 'prompts',
  'docs/PROMPTS.md': 'prompts',
};

export const DOC_SLUGS = Object.keys(DOCS) as DocSlug[];

export function getAllDocs(): DocEntry[] {
  return DOC_SLUGS.map((slug) => ({ slug, ...DOCS[slug] }));
}

export function getDocBySlug(slug: string): DocEntry | undefined {
  if (!(slug in DOCS)) return undefined;
  return { slug: slug as DocSlug, ...DOCS[slug as DocSlug] };
}

export function docHref(slug: DocSlug): string {
  return `/how-its-built/docs/${slug}`;
}

/** Rewrite relative .md links to rendered doc routes; leave external URLs unchanged. */
export function resolveDocHref(href: string): string {
  if (!href) return href;
  if (/^(https?:\/\/|mailto:)/i.test(href)) return href;

  const hashIndex = href.indexOf('#');
  const pathPart = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const hashSuffix = hashIndex >= 0 ? href.slice(hashIndex) : '';

  if (!pathPart || pathPart.startsWith('#')) return href;

  const normalized = pathPart.replace(/^\.\//, '');
  const slug = FILE_TO_SLUG[normalized];
  if (slug) return `${docHref(slug)}${hashSuffix}`;

  return href;
}

export function slugForFileName(fileName: string): DocSlug | undefined {
  return FILE_TO_SLUG[fileName];
}
