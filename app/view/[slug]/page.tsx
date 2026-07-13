import { Box, Heading, Image, Text, SimpleGrid } from '@chakra-ui/react';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { getImageById } from '@/lib/image/queries';
import { getModelResponseEntries } from '@/types/image';
import { extractIdFromSlug } from '@/lib/utils/slugify';
import { toImage } from '@/lib/image/utils';
import Tags from '@/components/Tags';
import Feelings from '@/components/Feelings';
import Hues from '@/components/Hues';
import Colors from '@/components/Colors';
import ViewerActions from '@/components/ViewerActions';
import { ImageNarrativeCard } from '@/components/ImageNarrativeCard';
import { hexWithAlpha } from '@/lib/utils/hex-alpha';

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
  
  const c = imageDoc.colors ?? [];
  const background = `linear-gradient(135deg, ${hexWithAlpha(c[0], '#2a3344')}, ${hexWithAlpha(c[1], '#3d4a5c')}, ${hexWithAlpha(c[2], '#4a5568')})`;

  return (
    <Box 
      minH="100vh" 
      bg={background} 
      color="white" 
      px={{ base: 2, md: 4, lg: 8 }} 
      pt={{ base: 5, md: 6 }}
      pb={{ base: 10, md: 12, lg: 14 }}
      display="flex" 
      flexDirection="column" 
      alignItems="center"
    >
      <Box
        w="100%"
        maxW={{ base: '100%', md: 'min(92vw, 90rem)' }}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Heading size="4xl" mb={{ base: 6, md: 8 }} textShadow="0 2px 8px rgba(0,0,0,0.4)" textAlign="center">
          {imageDoc.title}
        </Heading>
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
        <ImageNarrativeCard description={imageDoc.description} summary={imageDoc.summary} />
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} w="100%" maxW={{ base: '100%', md: 'min(92vw, 90rem)' }} mx="auto" mt={4}>
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
        <ViewerActions
          document={toImage(imageDoc)}
          responses={getModelResponseEntries(imageDoc)}
        />
      </Box>
    </Box>
  );
}

