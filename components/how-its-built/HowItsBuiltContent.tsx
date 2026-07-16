import { Box, Heading, Link, List, Table, Text } from '@chakra-ui/react';
import { CodeSpotlight } from './CodeSpotlight';
import { Section } from './Section';

const EXAMPLE_DOC = `{
  "title": "Rocky Coastline at Sunset",
  "description": "Waves crash against dark rocks as the sun sets...",
  "summary": "A dramatic coastal scene at golden hour.",
  "tags": ["coast", "sunset", "ocean", "rocks"],
  "colors": ["#c45c26", "#1a3a5c", "#f0d080"],
  "feelings": ["serene", "dramatic"],
  "hues": ["orange", "blue"],
  "file": "coast-sunset.jpg",
  "location": { "type": "Point", "coordinates": [-122.4, 37.8, 12] },
  "prompt_debug": [
    { "model": "llama3.2-vision:11b", "version": "2.1.1", "response": "..." },
    { "model": "mistral:7b-instruct", "version": "2.1.0", "response": { "title": "..." } }
  ],
  "embedding": [0.012, -0.034, ...],
  "embedding_model": "voyage-4"
}`;

const PROCESS_CODE = `const buildImageDoc = async (imageName) => {
  const { prompt: imageInfoPrompt, response: imageInfo } =
    await generateInfoForImage(imageName, LLAMA_VISION_IMAGE_MODEL);

  const { parsed, prompt: descriptionPrompt } =
    await generateStructuredMetadata(imageInfo);

  const location = await getGPSData(imageName);

  return {
    ...parsed,
    file: imageName,
    location,
    prompt_debug: [
      { model: LLAMA_VISION_IMAGE_MODEL, version: VISION_VERSION, ... },
      { model: INSTRUCT_MODEL, version: INSTRUCT_VERSION, ... },
    ],
  };
};`;

const SEARCH_CODE = `const pipeline = [
  {
    $search: {
      index: textIndex,
      text: { query: q, path: [...ATLAS_TEXT_SEARCH_PATHS] },
    },
  },
  { $addFields: { score: { $meta: 'searchScore' } } },
  { $sort: { score: -1, _id: -1 } },
  { $limit: limit },
];`;

const HYBRID_CODE = `{
  $rankFusion: {
    input: {
      pipelines: {
        vectorPipeline: [{ $vectorSearch: { ... } }],
        fullTextPipeline: [{ $search: { ... } }, { $limit: branchLimit }],
      },
    },
    combination: {
      weights: { vectorPipeline: 0.5, fullTextPipeline: 0.5 },
    },
  },
}`;

const API_CODE = `export async function POST(req: NextRequest) {
  const { query, hybrid } = await req.json();
  const results =
    hybrid === true ? await searchImagesHybrid(query) : await searchImages(query);
  return NextResponse.json({ results: toImageArray(results) });
}`;

export function HowItsBuiltContent() {
  return (
    <Box>
      <Box mb={10}>
        <Heading size="3xl" color="white" mb={4} lineHeight="shorter">
          How it&apos;s built
        </Heading>
        <Text color="whiteAlpha.800" fontSize={{ base: 'md', md: 'lg' }} lineHeight="tall">
          AI Image Viewer turns a folder of ordinary images into a search application using
          MongoDB Search, Vector Search, Ollama, and Voyage AI. If you are evaluating my work as
          a developer, this page is the behind-the-scenes tour.
        </Text>
        <Text color="whiteAlpha.700" mt={3} fontSize="sm">
          Live demo:{' '}
          <Link href="https://images.seemongo.com" color="teal.200" target="_blank" rel="noopener">
            images.seemongo.com
          </Link>
          {' · '}
          Tutorial:{' '}
          <Link
            href="https://www.youtube.com/watch?v=yYoxQLufWYw"
            color="teal.200"
            target="_blank"
            rel="noopener"
          >
            YouTube
          </Link>
        </Text>
      </Box>

      <Section id="philosophy" title="Philosophy">
        <List.Root gap={3} pl={4}>
          <List.Item>
            <Text as="span" fontWeight="semibold" color="white">
              Solve the real problem.
            </Text>{' '}
            Ship a working search experience over a generic AI platform nobody asked for.
          </List.Item>
          <List.Item>
            <Text as="span" fontWeight="semibold" color="white">
              Complexity is a cost.
            </Text>{' '}
            One MongoDB database holds metadata, embeddings, and search indexes. No separate vector
            DB or search service.
          </List.Item>
          <List.Item>
            <Text as="span" fontWeight="semibold" color="white">
              Enrich, then search.
            </Text>{' '}
            Think of it as a data enrichment pipeline: every stage adds fields to the same document.
          </List.Item>
          <List.Item>
            <Text as="span" fontWeight="semibold" color="white">
              Search evolves in layers.
            </Text>{' '}
            Keyword search first, vector search second, hybrid fusion third. Nothing gets thrown away.
          </List.Item>
        </List.Root>
      </Section>

      <Section id="did-i-use-ai" title="Did I use AI?">
        <Text mb={4}>
          Yes. It is 2026. I used large language models on this project, and I would not pretend
          otherwise.
        </Text>
        <Text mb={4}>
          What I did not do is blindly type things into a chat box until things started to
          &quot;sorta&quot; work. I started with architecture docs and scoped vertical slices before
          writing much code, then mixed hand coding and agentic coding with thorough reviews at each
          step.
        </Text>
        <Text fontWeight="semibold" color="white" mb={2}>
          Where AI runs
        </Text>
        <List.Root gap={2} pl={4} mb={4}>
          <List.Item>
            <Text as="span" fontWeight="medium" color="white">
              Processing time (offline):
            </Text>{' '}
            Ollama vision model describes each image; an instruct model structures the JSON.
            Voyage AI generates embeddings in a separate batch step.
          </List.Item>
          <List.Item>
            <Text as="span" fontWeight="medium" color="white">
              Query time (live app):
            </Text>{' '}
            No LLM. The running application is a normal MongoDB-backed search app. Voyage is called
            only to embed the user&apos;s search query for vector/hybrid modes.
          </List.Item>
        </List.Root>
        <Text>
          The LLM is a tool in the workflow, not the workflow itself. I remain responsible for
          every architectural choice on this page.
        </Text>
      </Section>

      <Section id="stack" title="Stack">
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader color="whiteAlpha.700">Layer</Table.ColumnHeader>
              <Table.ColumnHeader color="whiteAlpha.700">Technology</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {[
              ['Frontend', 'Next.js 16, React 19, Chakra UI'],
              ['Database & Search', 'MongoDB Atlas — Search, Vector Search, $rankFusion'],
              ['Local AI (processing)', 'Ollama — llama3.2-vision + mistral instruct'],
              ['Embeddings', 'Voyage AI (voyage-4)'],
              ['Offline pipeline', 'Node.js CLI tools in tools/process/'],
            ].map(([layer, tech]) => (
              <Table.Row key={layer}>
                <Table.Cell color="white" fontWeight="medium">
                  {layer}
                </Table.Cell>
                <Table.Cell color="whiteAlpha.800">{tech}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Section>

      <Section id="architecture" title="Architecture">
        <Text mb={4}>
          Everything revolves around a single MongoDB document per image. The processing pipeline
          enriches it; the search layers read from it.
        </Text>
        <CodeSpotlight
          filePath="pipeline"
          code={`Images
   │
   ▼
Vision Model (Ollama)
   │
   ▼
Instruction Model
   │
   ▼
MongoDB Document
   ├──────────────┐
   │              │
   ▼              ▼
MongoDB Search   Voyage AI Embeddings
   │              │
   └──────┬───────┘
          ▼
     Hybrid Search ($rankFusion)
          │
          ▼
     Next.js Application`}
        />
        <Text mt={4}>
          App routes call API handlers; API handlers delegate to query functions in{' '}
          <Text as="span" fontFamily="mono" fontSize="sm" color="whiteAlpha.900">
            lib/image/queries/
          </Text>
          . Business logic stays on the server.
        </Text>
      </Section>

      <Section id="database" title="The MongoDB document">
        <Text mb={4}>
          Each image becomes one document containing structured metadata, prompt traces, optional
          GPS, and embeddings. As the application grows, the document grows with it.
        </Text>
        <CodeSpotlight filePath="images collection (trimmed example)" code={EXAMPLE_DOC} />
        <Text mt={4}>
          <Text as="span" fontWeight="semibold" color="white">
            prompt_debug
          </Text>{' '}
          stores the full prompt and response from each model call — an audit trail for every
          document. The UI hides it from the pretty JSON view, but it is always in MongoDB.
        </Text>
      </Section>

      <Section id="search-modes" title="Three search modes">
        <Text mb={4}>
          The search experience is built one layer at a time. Each mode adds capability without
          removing the last.
        </Text>
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader color="whiteAlpha.700">Mode</Table.ColumnHeader>
              <Table.ColumnHeader color="whiteAlpha.700">Example query</Table.ColumnHeader>
              <Table.ColumnHeader color="whiteAlpha.700">What it does</Table.ColumnHeader>
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
                Keyword match across title, description, summary, and tags
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell color="white" fontWeight="medium">
                Vector Search
              </Table.Cell>
              <Table.Cell color="whiteAlpha.800" fontFamily="mono" fontSize="sm">
                ocean
              </Table.Cell>
              <Table.Cell color="whiteAlpha.800">
                Semantic similarity — finds coast images even if &quot;ocean&quot; never appears
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
                $rankFusion merges keyword precision with semantic understanding
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Section>

      <Section id="code-spotlights" title="Code spotlights">
        <Text mb={2} fontWeight="semibold" color="white">
          Pipeline entry
        </Text>
        <Text mb={2} fontSize="md">
          Vision describes, instruct structures, GPS attaches, prompt_debug records everything.
        </Text>
        <CodeSpotlight filePath="tools/process/process.js" code={PROCESS_CODE} />

        <Text mb={2} mt={6} fontWeight="semibold" color="white">
          Text search
        </Text>
        <CodeSpotlight filePath="lib/image/queries/search.ts" code={SEARCH_CODE} />

        <Text mb={2} mt={6} fontWeight="semibold" color="white">
          Hybrid search
        </Text>
        <Text mb={2} fontSize="md">
          $rankFusion with 50/50 weights, then quality gates on real vector similarity.
        </Text>
        <CodeSpotlight filePath="lib/image/queries/hybrid-search.ts" code={HYBRID_CODE} />

        <Text mb={2} mt={6} fontWeight="semibold" color="white">
          Thin API route
        </Text>
        <CodeSpotlight filePath="app/api/search/route.ts" code={API_CODE} />
      </Section>

      <Section id="pipeline" title="Processing pipeline">
        <Text mb={4}>
          Rather than asking a vision model to produce the final MongoDB document directly, the
          project separates responsibilities.
        </Text>
        <List.Root gap={3} pl={4} mb={4}>
          <List.Item>
            <Text as="span" fontWeight="semibold" color="white">
              Vision model
            </Text>{' '}
            — understands the image, produces natural language (prompt v2.1.1, bans &quot;this
            image&quot; phrasing)
          </List.Item>
          <List.Item>
            <Text as="span" fontWeight="semibold" color="white">
              Instruction model
            </Text>{' '}
            — transforms prose into predictable JSON (prompt v2.1.0, hex colors only in the colors
            field)
          </List.Item>
          <List.Item>
            <Text as="span" fontWeight="semibold" color="white">
              Embeddings (separate step)
            </Text>{' '}
            — generate-embeddings.js finds docs without embeddings and writes voyage-4 vectors.
            Regenerate vectors without re-analyzing images.
          </List.Item>
        </List.Root>
        <Text>
          Prompts are versioned artifacts in{' '}
          <Text as="span" fontFamily="mono" fontSize="sm">
            tools/process/services/ai/prompts/
          </Text>
          . Changing pipeline structure beat endless prompt word-smithing.
        </Text>
      </Section>

      <Section id="funny-things" title="Funny things that happened">
        <Box mb={6}>
          <Text fontWeight="semibold" color="white" mb={2}>
            JSON5 and the missing brace
          </Text>
          <Text>
            LLMs sometimes return JSON with a missing closing brace. The parser strips preamble,
            finds the opening brace, appends a closing brace if needed, and parses with JSON5. It
            works more often than it should.
          </Text>
        </Box>
        <Box mb={6}>
          <Text fontWeight="semibold" color="white" mb={2}>
            The anti-&quot;this image&quot; crusade
          </Text>
          <Text>
            Both prompts explicitly forbid phrases like &quot;this image&quot; or &quot;the photo
            appears to be...&quot; Vision says do not include feelings or colors; instruct says
            colors only in the colors field. Small rules, big consistency gains.
          </Text>
        </Box>
        <Box mb={6}>
          <Text fontWeight="semibold" color="white" mb={2}>
            Hybrid search is smarter than naive fusion
          </Text>
          <Text>
            Vague queries often still win with weak neighbors after $rankFusion. The code runs
            parallel pipelines, applies quality gates (min similarity, gap-from-best, weak-query
            guard), and re-sorts by real vector scores. Tuned for a small catalog of ~100 images.
          </Text>
        </Box>
        <Box>
          <Text fontWeight="semibold" color="white" mb={2}>
            prompt_debug is stored but hidden
          </Text>
          <Text>
            Every document carries the full model audit trail. The DocumentModal omits prompt_debug,
            embedding, and raw from the pretty JSON view — but MongoDB has everything if you need to
            debug a bad title.
          </Text>
        </Box>
      </Section>
    </Box>
  );
}
