import { Box, Heading, Link, List, Table, Text } from '@chakra-ui/react';
import { CodeSpotlight } from './CodeSpotlight';
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

const DEEPER_GUIDES = [
  {
    file: 'ARCHITECTURE.md',
    summary:
      'Understand the overall system, the processing pipeline step by step, and why the project is structured this way.',
  },
  {
    file: 'CODE-GUIDE.md',
    summary:
      'A guided tour of the repository. Find the code shown in each section of the tutorial.',
  },
  {
    file: 'SEARCH.md',
    summary:
      'How MongoDB Search, Vector Search, and Hybrid Search are implemented in the query layer.',
  },
  {
    file: 'OLLAMA.md',
    summary:
      'How Ollama fits into the processing pipeline and how to swap in other model providers.',
  },
  {
    file: 'PROMPTS.md',
    summary:
      'Prompt engineering decisions, versioning, and lessons learned while building the pipeline.',
  },
];

export function HowItsBuiltContent() {
  return (
    <Box>
      <Box mb={10}>
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
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader color="whiteAlpha.700">Step</Table.ColumnHeader>
              <Table.ColumnHeader color="whiteAlpha.700">Try searching</Table.ColumnHeader>
              <Table.ColumnHeader color="whiteAlpha.700">What happens</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell color="white" fontWeight="medium">
                MongoDB Search
              </Table.Cell>
              <Table.Cell color="whiteAlpha.800" fontFamily="mono" fontSize="sm">
                beach
              </Table.Cell>
              <Table.Cell color="whiteAlpha.800">
                Keyword match across titles, descriptions, summaries, tags, and other metadata
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell color="white" fontWeight="medium">
                MongoDB Vector Search
              </Table.Cell>
              <Table.Cell color="whiteAlpha.800" fontFamily="mono" fontSize="sm">
                ocean
              </Table.Cell>
              <Table.Cell color="whiteAlpha.800">
                Finds relevant images by meaning, even when the exact word never appears in a
                document
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell color="white" fontWeight="medium">
                Hybrid Search
              </Table.Cell>
              <Table.Cell color="whiteAlpha.800" fontFamily="mono" fontSize="sm">
                wild flying animals
              </Table.Cell>
              <Table.Cell color="whiteAlpha.800">
                MongoDB Search and Vector Search combined with $rankFusion for keyword precision
                plus semantic understanding
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
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
        <Table.Root size="sm" variant="outline" mb={6}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader color="whiteAlpha.700">Location</Table.ColumnHeader>
              <Table.ColumnHeader color="whiteAlpha.700">Purpose</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {[
              ['tools/process/', 'Image processing pipeline, Ollama integration, metadata generation, and embedding tools'],
              ['lib/image/queries/', 'MongoDB aggregation pipelines for Search, Vector Search, and Hybrid Search'],
              ['app/api/', 'API routes connecting the frontend to MongoDB'],
              ['app/', 'Next.js application and user interface'],
            ].map(([location, purpose]) => (
              <Table.Row key={location}>
                <Table.Cell color="white" fontFamily="mono" fontSize="sm" fontWeight="medium">
                  {location}
                </Table.Cell>
                <Table.Cell color="whiteAlpha.800">{purpose}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <Text fontWeight="semibold" color="white" mb={2}>
          Suggested reading order
        </Text>
        <List.Root gap={2} pl={4} fontSize="sm">
          {[
            'README.md',
            'ARCHITECTURE.md',
            'tools/process/',
            'MongoDB documents',
            'generate-embeddings.js',
            'lib/image/queries/',
            'SEARCH.md',
            'OLLAMA.md',
            'PROMPTS.md',
          ].map((item) => (
            <List.Item key={item} color="whiteAlpha.800">
              {item}
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
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader color="whiteAlpha.700">Video section</Table.ColumnHeader>
              <Table.ColumnHeader color="whiteAlpha.700">Timestamp</Table.ColumnHeader>
              <Table.ColumnHeader color="whiteAlpha.700">Repository</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {[
              ['System architecture & local LLM processing', '2:05', 'ARCHITECTURE.md'],
              ['Generating structured metadata JSON', '3:19', 'tools/process/'],
              ['Image processing', '4:44', 'tools/process/'],
              ['Setting up traditional text search', '8:33', 'SEARCH.md, lib/image/queries/'],
              ['Creating a vector search index', '13:09', 'generate-embeddings.js'],
              ['Implementing hybrid search with rank fusion', '20:25', 'lib/image/queries/'],
            ].map(([section, time, repo]) => (
              <Table.Row key={section}>
                <Table.Cell color="whiteAlpha.800">{section}</Table.Cell>
                <Table.Cell color="whiteAlpha.700" fontFamily="mono" fontSize="sm" whiteSpace="nowrap">
                  {time}
                </Table.Cell>
                <Table.Cell color="white" fontFamily="mono" fontSize="sm">
                  {repo}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Section>

      <Section id="go-deeper" title="Go deeper">
        <Text mb={4}>
          The README gives you the high-level overview. These documents take a deeper look at
          individual parts of the project.
        </Text>
        {DEEPER_GUIDES.map(({ file, summary }) => (
          <Box
            key={file}
            mb={4}
            p={4}
            borderRadius="lg"
            bg="rgba(0, 0, 0, 0.2)"
            borderWidth="1px"
            borderColor="whiteAlpha.100"
          >
            <Text fontWeight="semibold" color="white" fontFamily="mono" fontSize="sm" mb={1}>
              {file}
            </Text>
            <Text fontSize="md" color="whiteAlpha.800">
              {summary}
            </Text>
          </Box>
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
