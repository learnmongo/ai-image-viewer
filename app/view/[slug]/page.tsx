import { Box, Heading, Image, Text, SimpleGrid } from '@chakra-ui/react';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { getImageById } from '@/lib/image/queries';
import { extractIdFromSlug } from '@/lib/utils/slugify';
import { toImage } from '@/lib/image/serialize';
import Tags from '@/components/Tags';
import Feelings from '@/components/Feelings';
import Hues from '@/components/Hues';
import Colors from '@/components/Colors';
import ViewerActions from '@/components/ViewerActions';

interface ViewPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ViewPage({ params }: ViewPageProps) {
  const { slug } = await params;
  const id = extractIdFromSlug(slug);
  const imageDoc = await getImageById(id);
  
  if (!imageDoc) return notFound();
  
  const fileName = `${id}.jpg`;
  const localImagePath = path.join(process.cwd(), 'public', 'resources', fileName);
  const fileExists = fs.existsSync(localImagePath);
  
  if (!fileExists) return notFound();
  
  const background = `linear-gradient(135deg, ${imageDoc.colors?.[0] || '#222'}cc, ${imageDoc.colors?.[1] || '#444'}cc, ${imageDoc.colors?.[2] || '#666'}cc)`;

  return (
    <Box 
      minH="100vh" 
      bg={background} 
      color="white" 
      px={{ base: 2, md: 4, lg: 8 }} 
      py={14} 
      display="flex" 
      flexDirection="column" 
      alignItems="center"
    >
      <Box
        w="100%"
        maxW={{ base: '100vw', md: '75vw' }}
        mt={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Heading size="4xl" mb={2} textShadow="0 2px 8px rgba(0,0,0,0.4)" textAlign="center">
          {imageDoc.title}
        </Heading>
        {imageDoc.description && (
          <Text 
            fontSize={{ base: "md", md: "lg" }} 
            mb={4} 
            color="whiteAlpha.900" 
            textShadow="0 1px 4px rgba(0,0,0,0.3)" 
            textAlign="center"
          >
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
          p={{ base: 3, md: 5 }}
          borderRadius="md"
          borderWidth="1px"
          borderColor="whiteAlpha.300"
          boxShadow="md"
          w="100%"
          maxW={{ base: '100vw', md: '75vw' }}
          mx="auto"
        >
          <Text fontSize={{ base: "md", md: "lg" }}>{imageDoc.summary}</Text>
        </Box>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} w="100%" maxW={{ base: '100vw', md: '75vw' }} mx="auto" mt={4}>
          <Box>
            <Text fontWeight="bold" mb={1} fontSize="sm">Tags</Text>
            {imageDoc.tags && imageDoc.tags.length > 0 ? (
              <Tags tags={imageDoc.tags} size="sm" />
            ) : (
              <Text fontSize="sm" color="whiteAlpha.700">None</Text>
            )}
          </Box>
          <Box>
            <Text fontWeight="bold" mb={1} fontSize="sm">Feelings</Text>
            {imageDoc.feelings && imageDoc.feelings.length > 0 ? (
              <Feelings feelings={imageDoc.feelings} size="sm" />
            ) : (
              <Text fontSize="sm" color="whiteAlpha.700">None</Text>
            )}
          </Box>
          <Box>
            <Text fontWeight="bold" mb={1} fontSize="sm">Hues</Text>
            {imageDoc.hues && imageDoc.hues.length > 0 ? (
              <Hues hues={imageDoc.hues} size="sm" />
            ) : (
              <Text fontSize="sm" color="whiteAlpha.700">None</Text>
            )}
          </Box>
          <Box>
            <Text fontWeight="bold" mb={1} fontSize="sm">Colors</Text>
            {imageDoc.colors && imageDoc.colors.length > 0 ? (
              <Colors colors={imageDoc.colors} size="md" />
            ) : (
              <Text fontSize="sm" color="whiteAlpha.700">None</Text>
            )}
          </Box>
        </SimpleGrid>
        <ViewerActions document={toImage(imageDoc)} responses={imageDoc.raw ?? []} />
      </Box>
    </Box>
  );
}

