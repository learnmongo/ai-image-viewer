'use client';

import { Box, Heading, Link, List, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { GLASS_CARD, GLASS_CARD_NESTED } from '@/components/glass-styles';
import { docHref, DocSlug, slugForFileName } from '@/lib/docs/registry';
import { CodeSpotlight } from './CodeSpotlight';
import {
  GlassTable,
  GlassTableBody,
  GlassTableCell,
  GlassTableColumnHeader,
  GlassTableHeader,
  GlassTableRow,
} from './GlassTable';
import { Section } from './Section';

const ARCHITECTURE_DIAGRAM = `Images
   │
   ▼
Vision Model (Ollama)
   │
   ▼
Structured Metadata
   │
   ▼
MongoDB Documents
   ├── MongoDB Search
   └── Vector Embeddings
            │
            ▼
       Hybrid Search
            │
            ▼
      Next.js Application`;

const DEEPER_GUIDES: { slug: DocSlug; file: string; summary: string }[] = [
  {
    slug: 'architecture',
    file: 'ARCHITECTURE.md',
    summary:
      'Understand the overall system, the processing pipeline, and why the project is structured this way.',
  },
  {
    slug: 'code-guide',
    file: 'CODE-GUIDE.md',
    summary:
      'A guided tour of the repository and where to find the code shown in the tutorial.',
  },
  {
    slug: 'search',
    file: 'SEARCH.md',
    summary:
      'Learn how MongoDB Search, MongoDB Vector Search, and Hybrid Search are implemented.',
  },
  {
    slug: 'ollama',
    file: 'OLLAMA.md',
    summary:
      'Learn how Ollama fits into the processing pipeline and how to swap in other providers.',
  },
  {
    slug: 'prompts',
    file: 'PROMPTS.md',
    summary:
      'Read about the prompt engineering decisions and lessons learned while building the project.',
  },
];

const READING_ORDER = [
  'README.md',
  'ARCHITECTURE.md',
  'tools/process/',
  'MongoDB documents',
  'generate-embeddings.js',
  'lib/image/queries/',
  'SEARCH.md',
  'OLLAMA.md',
  'PROMPTS.md',
] as const;

function DocReadingLink({ item }: { item: string }) {
  const slug = slugForFileName(item);
  if (!slug) {
    return (
      <Text as="span" color="whiteAlpha.800">
        {item}
      </Text>
    );
  }
  return (
    <Link as={NextLink} href={docHref(slug)} color="teal.200" _hover={{ color: 'teal.100' }}>
      {item}
    </Link>
  );
}

function RepoCell({ repo }: { repo: string }) {
  const parts = repo.split(',').map((p) => p.trim());
  return (
    <Text as="span" fontFamily="mono" fontSize="sm">
      {parts.map((part, i) => {
        const slug = slugForFileName(part);
        return (
          <Text as="span" key={part}>
            {i > 0 && ', '}
            {slug ? (
              <Link as={NextLink} href={docHref(slug)} color="teal.200" _hover={{ color: 'teal.100' }}>
                {part}
              </Link>
            ) : (
              <Text as="span" color="white">
                {part}
              </Text>
            )}
          </Text>
        );
      })}
    </Text>
  );
}

export function HowItsBuiltContent() {
  return (
    <Box w="100%" minW={0} maxW="100%" overflowWrap="anywhere">
      <Box mb={10} {...GLASS_CARD} p={{ base: 5, md: 7 }}>
        <Heading size="3xl" color="white" mb={4} lineHeight="shorter">
          Project guide
        </Heading>
        <Text color="whiteAlpha.800" fontSize={{ base: 'md', md: 'lg' }} lineHeight="tall">
          This repository accompanies the MongoDB tutorial on building an AI-powered image search
          application. If you watched the video, or you are about to, this page summarizes how the
          repo is organized and what each layer of search does.
        </Text>
      </Box>

      <Section id="start-here" title="Start here">
        <Text mb={4}>
          Most operating systems still rely heavily on filenames when searching images. Once your
          collection grows into hundreds or thousands of photos, finding exactly what you are looking
          for becomes surprisingly difficult.
        </Text>
        <Text mb={4}>
          This project explores a different approach. Instead of searching filenames, a vision model
          understands each image, generates structured metadata, stores everything in MongoDB, and
          layers increasingly capable search techniques on top of that data.
        </Text>
        <Text mb={2} fontWeight="semibold" color="white">
          Helpful links
        </Text>
        <List.Root gap={2} pl={4}>
          <List.Item>
            Read README:{' '}
            <Link as={NextLink} href={docHref('readme')} color="teal.200" _hover={{ color: 'teal.100' }}>
              README.md
            </Link>
          </List.Item>
          <List.Item>
            Live example:{' '}
            <Link href="https://images.seemongo.com" color="teal.200" target="_blank" rel="noopener">
              images.seemongo.com
            </Link>
          </List.Item>
          <List.Item>
            Tutorial video:{' '}
            <Link
              href="https://www.youtube.com/watch?v=yYoxQLufWYw"
              color="teal.200"
              target="_blank"
              rel="noopener"
            >
              Building an AI-Powered Image Search Application with MongoDB
            </Link>
          </List.Item>
          <List.Item>
            Source code:{' '}
            <Link
              href="https://github.com/learnmongo/ai-image-viewer"
              color="teal.200"
              target="_blank"
              rel="noopener"
            >
              github.com/learnmongo/ai-image-viewer
            </Link>
          </List.Item>
        </List.Root>
        <Text mt={4} color="whiteAlpha.700" fontSize="sm">
          Built with MongoDB Search, MongoDB Vector Search, Ollama, Voyage AI, and Next.js.
        </Text>
      </Section>

      <Section id="what-youll-build" title="What you'll build">
        <Text mb={4}>
          Starting with nothing more than a folder of images, you build a search application capable
          of understanding what is actually inside each image. The search experience grows one layer
          at a time.
        </Text>
        <GlassTable>
          <GlassTableHeader>
            <GlassTableRow>
              <GlassTableColumnHeader>Step</GlassTableColumnHeader>
              <GlassTableColumnHeader>Try searching</GlassTableColumnHeader>
              <GlassTableColumnHeader>What happens</GlassTableColumnHeader>
            </GlassTableRow>
          </GlassTableHeader>
          <GlassTableBody>
            <GlassTableRow>
              <GlassTableCell color="white" fontWeight="medium">
                MongoDB Search
              </GlassTableCell>
              <GlassTableCell fontFamily="mono">beach</GlassTableCell>
              <GlassTableCell>
                Keyword match across titles, descriptions, summaries, tags, and other metadata
              </GlassTableCell>
            </GlassTableRow>
            <GlassTableRow>
              <GlassTableCell color="white" fontWeight="medium">
                MongoDB Vector Search
              </GlassTableCell>
              <GlassTableCell fontFamily="mono">ocean</GlassTableCell>
              <GlassTableCell>
                Finds relevant images by meaning, even when the exact word never appears in a
                document
              </GlassTableCell>
            </GlassTableRow>
            <GlassTableRow>
              <GlassTableCell color="white" fontWeight="medium">
                Hybrid Search
              </GlassTableCell>
              <GlassTableCell fontFamily="mono">wild flying animals</GlassTableCell>
              <GlassTableCell>
                MongoDB Search and Vector Search combined with $rankFusion for keyword precision
                plus semantic understanding
              </GlassTableCell>
            </GlassTableRow>
          </GlassTableBody>
        </GlassTable>
      </Section>

      <Section id="architecture" title="Architecture">
        <Text mb={4}>
          One of the goals of this project was to keep the overall architecture simple. Everything
          revolves around a single MongoDB document per image.
        </Text>
        <CodeSpotlight filePath="high-level pipeline" code={ARCHITECTURE_DIAGRAM} />
        <Text mt={4}>
          Rather than introducing multiple databases or external search systems, MongoDB becomes the
          central source of truth. Metadata, embeddings, and search indexes all live together. That
          simplicity is one of the best parts of this architecture.
        </Text>
      </Section>

      <Section id="why-its-built" title="Why it's built this way">
        <Text mb={4}>
          As the project grew, a few design decisions ended up making a big difference.
        </Text>
        <List.Root gap={4} pl={4}>
          <List.Item>
            <Text as="span" fontWeight="semibold" color="white">
              Two LLMs are better than one.
            </Text>{' '}
            The vision model focuses on understanding the image. A second instruction model
            transforms that understanding into structured JSON. Prompts are easier to iterate on and
            documents are more consistent.
          </List.Item>
          <List.Item>
            <Text as="span" fontWeight="semibold" color="white">
              Embeddings are generated separately.
            </Text>{' '}
            They can be regenerated later without analyzing every image again, and experimenting with
            different embedding models is much easier.
          </List.Item>
          <List.Item>
            <Text as="span" fontWeight="semibold" color="white">
              Everything lives in one MongoDB document.
            </Text>{' '}
            Titles, descriptions, tags, colors, feelings, prompt history, model information,
            embeddings, and location data. The document grows as the application grows.
          </List.Item>
          <List.Item>
            <Text as="span" fontWeight="semibold" color="white">
              Hybrid search gives you the best of both worlds.
            </Text>{' '}
            Keyword search is precise. Vector search understands meaning. Hybrid search combines
            both, which is the experience many real-world applications need.
          </List.Item>
        </List.Root>
      </Section>

      <Section id="repo-guide" title="Repository guide">
        <Text mb={4}>
          If you are exploring the code after watching the video, these are the best places to start.
        </Text>
        <GlassTable mb={6}>
          <GlassTableHeader>
            <GlassTableRow>
              <GlassTableColumnHeader>Location</GlassTableColumnHeader>
              <GlassTableColumnHeader>Purpose</GlassTableColumnHeader>
            </GlassTableRow>
          </GlassTableHeader>
          <GlassTableBody>
            {[
              ['tools/process/', 'Image processing pipeline, Ollama integration, metadata generation, and embedding tools'],
              ['lib/image/queries/', 'MongoDB aggregation pipelines for Search, Vector Search, and Hybrid Search'],
              ['app/api/', 'API routes connecting the frontend to MongoDB'],
              ['app/', 'Next.js application and user interface'],
            ].map(([location, purpose]) => (
              <GlassTableRow key={location}>
                <GlassTableCell color="white" fontFamily="mono" fontWeight="medium">
                  {location}
                </GlassTableCell>
                <GlassTableCell>{purpose}</GlassTableCell>
              </GlassTableRow>
            ))}
          </GlassTableBody>
        </GlassTable>
        <Text fontWeight="semibold" color="white" mb={2}>
          Suggested reading order
        </Text>
        <List.Root gap={2} pl={4} fontSize="sm">
          {READING_ORDER.map((item) => (
            <List.Item key={item}>
              <DocReadingLink item={item} />
            </List.Item>
          ))}
        </List.Root>
        <Text mt={4} color="whiteAlpha.700" fontSize="sm">
          That order mirrors the tutorial and builds the project one concept at a time.
        </Text>
      </Section>

      <Section id="video-guide" title="Video guide">
        <Text mb={4}>
          These sections map directly to the repository. Timestamps point to where each topic appears
          in the tutorial.
        </Text>
        <GlassTable>
          <GlassTableHeader>
            <GlassTableRow>
              <GlassTableColumnHeader>Video section</GlassTableColumnHeader>
              <GlassTableColumnHeader>Timestamp</GlassTableColumnHeader>
              <GlassTableColumnHeader>Repository</GlassTableColumnHeader>
            </GlassTableRow>
          </GlassTableHeader>
          <GlassTableBody>
            {[
              ['System architecture & local LLM processing', '2:05', 'ARCHITECTURE.md'],
              ['Generating structured metadata JSON', '3:19', 'tools/process/'],
              ['Image processing', '4:44', 'tools/process/'],
              ['Setting up traditional text search', '8:33', 'SEARCH.md, lib/image/queries/'],
              ['Creating a vector search index', '13:09', 'generate-embeddings.js'],
              ['Implementing hybrid search with rank fusion', '20:25', 'lib/image/queries/'],
            ].map(([section, time, repo]) => (
              <GlassTableRow key={section}>
                <GlassTableCell>{section}</GlassTableCell>
                <GlassTableCell color="whiteAlpha.700" fontFamily="mono" whiteSpace="nowrap">
                  {time}
                </GlassTableCell>
                <GlassTableCell>
                  <RepoCell repo={repo} />
                </GlassTableCell>
              </GlassTableRow>
            ))}
          </GlassTableBody>
        </GlassTable>
      </Section>

      <Section id="go-deeper" title="Go deeper">
        <Text mb={4}>
          The README gives you the high-level overview. These documents take a deeper look at
          individual parts of the project.
        </Text>
        {DEEPER_GUIDES.map(({ slug, file, summary }) => (
          <Link
            key={file}
            as={NextLink}
            href={docHref(slug)}
            display="block"
            mb={4}
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
          >
            <Box
              p={4}
              {...GLASS_CARD_NESTED}
              transition="border-color 0.2s ease"
              _hover={{ borderColor: 'whiteAlpha.300' }}
            >
              <Text fontWeight="semibold" color="white" fontFamily="mono" fontSize="sm" mb={1}>
                {file}
              </Text>
              <Text fontSize="md" color="whiteAlpha.800" mb={2}>
                {summary}
              </Text>
              <Text fontSize="sm" color="teal.200" fontWeight="medium">
                Read guide →
              </Text>
            </Box>
          </Link>
        ))}
      </Section>

      <Section id="where-next" title="Where to go next">
        <Text mb={4}>
          Image search is really just the beginning. The same architecture can be applied to many
          other types of data.
        </Text>
        <List.Root gap={2} pl={4} mb={4}>
          {[
            'Documents',
            'Knowledge bases',
            'Product catalogs',
            'Support tickets',
            'Internal tools',
            'Retrieval-Augmented Generation (RAG)',
            'Recommendation systems',
          ].map((item) => (
            <List.Item key={item} color="whiteAlpha.800">
              {item}
            </List.Item>
          ))}
        </List.Root>
        <Text>
          Once your data has been enriched with AI and stored in MongoDB, you can continue building
          on top of it without introducing additional systems. That is what makes this pattern so
          powerful.
        </Text>
        <Text mt={4} color="whiteAlpha.700" fontSize="sm">
          Learn more:{' '}
          <Link href="https://learnmongo.com" color="teal.200" target="_blank" rel="noopener">
            learnmongo.com
          </Link>
        </Text>
      </Section>
    </Box>
  );
}
