import clientPromise from '@/lib/mongo';
import { Box, Heading, Image, Stack, Text, Wrap, Badge, SimpleGrid } from '@chakra-ui/react';
import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';

// Extended type to match your data
interface RawModelResponse {
  model: string;
  response: string;
}

type ImageDoc = {
  _id: { $oid: string };
  title: string;
  description: string;
  summary: string;
  feelings?: string[];
  hues?: string[];
  colors: string[];
  tags?: string[];
  raw?: RawModelResponse[];
};

export default async function ImagePage({ params }: { params: { id: string } }) {
  const id = params.id;

  const client = await clientPromise;
  const db = client.db('view_vector');
  const collection = db.collection('images');

  const doc = await collection.findOne({ _id: new ObjectId(id) });
  if (!doc) return notFound();

  const imageDoc = doc as unknown as ImageDoc;

  // Always use id for the file name
  const fileName = `${id}.jpg`;
  const localImagePath = path.join(process.cwd(), 'public', 'resources', fileName);
  const fileExists = fs.existsSync(localImagePath);
  if (!fileExists) return notFound();

  // Dynamic background gradient
  const background = `linear-gradient(135deg, ${imageDoc.colors?.[0] || '#222'}cc, ${imageDoc.colors?.[1] || '#444'}cc, ${imageDoc.colors?.[2] || '#666'}cc)`;

  // Helper for color swatches
  const ColorSwatch = ({ color }: { color: string }) => (
    <Box w="24px" h="24px" borderRadius="full" bg={color} border="2px solid white" boxShadow="md" title={color} />
  );

  return (
    <Box minH="100vh" bg={background} color="white" px={[2, 4, 8]} py={[4, 8, 12]} display="flex" flexDirection="column" alignItems="center">
      <Box
        w="100%"
        maxW={['100vw', '75vw']}
        mt={[2, 6, 10]}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Heading size="4xl" mb={2} textShadow="0 2px 8px rgba(0,0,0,0.4)" textAlign="center">
          {imageDoc.title}
        </Heading>
        {imageDoc.description && (
          <Text fontSize={["md", "lg"]} mb={4} color="whiteAlpha.900" textShadow="0 1px 4px rgba(0,0,0,0.3)" textAlign="center">
            {imageDoc.description}
          </Text>
        )}
        <Image
          src={`/resources/${fileName}`}
          alt={imageDoc.title}
          width="100%"
          height="auto"
          maxW="100%"
          maxH="75vh"
          rounded="2xl"
          boxShadow="2xl"
          title={imageDoc.title}
          mx="auto"
          my={0}
          mb={6}
        />
        <Box
          bg="blackAlpha.600"
          p={[3, 5]}
          borderRadius="md"
          borderWidth="1px"
          borderColor="whiteAlpha.300"
          boxShadow="md"
          w="100%"
          maxW={['100vw', '75vw']}
          mx="auto"
        >
          <Text fontSize={["md", "lg"]}>{imageDoc.summary}</Text>
        </Box>
        {/* Info section as four columns */}
        <SimpleGrid columns={[1, 2, 4]} gap={6} w="100%" maxW={['100vw', '75vw']} mx="auto" mt={4}>
          <Box>
            <Text fontWeight="bold" mb={1} fontSize="sm">Tags</Text>
            <Wrap>
              {imageDoc.tags && imageDoc.tags.length > 0 ? imageDoc.tags.map((tag) => (
                <Badge key={tag} colorScheme="whiteAlpha" px={2} py={1} borderRadius="md" fontSize="sm">{tag}</Badge>
              )) : <Text fontSize="sm" color="whiteAlpha.700">None</Text>}
            </Wrap>
          </Box>
          <Box>
            <Text fontWeight="bold" mb={1} fontSize="sm">Feelings</Text>
            <Wrap>
              {imageDoc.feelings && imageDoc.feelings.length > 0 ? imageDoc.feelings.map((feeling) => (
                <Badge key={feeling} colorScheme="yellow" px={2} py={1} borderRadius="md" fontSize="sm">{feeling}</Badge>
              )) : <Text fontSize="sm" color="whiteAlpha.700">None</Text>}
            </Wrap>
          </Box>
          <Box>
            <Text fontWeight="bold" mb={1} fontSize="sm">Hues</Text>
            <Wrap>
              {imageDoc.hues && imageDoc.hues.length > 0 ? imageDoc.hues.map((hue) => (
                <Badge key={hue} colorScheme="purple" px={2} py={1} borderRadius="md" fontSize="sm">{hue}</Badge>
              )) : <Text fontSize="sm" color="whiteAlpha.700">None</Text>}
            </Wrap>
          </Box>
          <Box>
            <Text fontWeight="bold" mb={1} fontSize="sm">Colors</Text>
            <Wrap>
              {imageDoc.colors && imageDoc.colors.length > 0 ? imageDoc.colors.map((color) => (
                <ColorSwatch key={color} color={color} />
              )) : <Text fontSize="sm" color="whiteAlpha.700">None</Text>}
            </Wrap>
          </Box>
        </SimpleGrid>
        {/* Raw model responses */}
        {imageDoc.raw && imageDoc.raw.length > 0 && (
          <Box mt={8} w="100%" maxW={['100vw', '75vw']}>
            {/* Divider replacement */}
            <Box mb={4} h="1px" bg="whiteAlpha.400" w="100%" />
            <Heading size="md" mb={2} fontWeight="bold">Model Responses</Heading>
            <Stack gap={4}>
              {imageDoc.raw.map((r, i) => (
                <Box key={i} bg="whiteAlpha.200" p={4} borderRadius="md" boxShadow="sm">
                  <Text fontSize="sm" color="whiteAlpha.800" fontWeight="bold" mb={1}>{r.model}</Text>
                  <Text fontSize="sm" color="whiteAlpha.900" whiteSpace="pre-line">{r.response}</Text>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}

