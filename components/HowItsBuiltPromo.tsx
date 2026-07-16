import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

const GLASS_CARD = {
  bg: 'rgba(255, 255, 255, 0.18)',
  backdropFilter: 'blur(24px) saturate(180%)',
  borderWidth: '1px',
  borderColor: 'whiteAlpha.200',
  borderRadius: '2xl',
  boxShadow: '2xl',
} as const;

const TUTORIAL_EMBED_URL = 'https://www.youtube.com/embed/yYoxQLufWYw?si=icCPYPXKtVayiVVc';

export default function HowItsBuiltPromo() {
  return (
    <Box mt={10} w="100%" {...GLASS_CARD} p={{ base: 6, md: 8 }}>
      <Text
        fontSize="xs"
        letterSpacing="wider"
        textTransform="uppercase"
        color="whiteAlpha.700"
        mb={2}
      >
        MongoDB tutorial
      </Text>
      <Heading size="2xl" color="white" mb={{ base: 5, md: 6 }}>
        Project guide
      </Heading>

      <Flex
        direction={{ base: 'column', lg: 'row' }}
        gap={{ base: 6, lg: 8 }}
        align={{ base: 'stretch', lg: 'center' }}
      >
        <Box flex={1}>
          <Text color="whiteAlpha.800" lineHeight="tall" mb={6}>
            Companion to the 25-minute MongoDB tutorial. Turn a folder of images into a search
            application with keyword search, vector search, and hybrid search, and see how the
            repository is organized along the way.
          </Text>
          <Button
            asChild
            bg="whiteAlpha.200"
            color="white"
            border="1px solid"
            borderColor="whiteAlpha.300"
            borderRadius="lg"
            px={6}
            _hover={{ bg: 'whiteAlpha.300', borderColor: 'whiteAlpha.400' }}
          >
            <NextLink href="/how-its-built">Read the guide</NextLink>
          </Button>
        </Box>

        <Box
          flexShrink={0}
          w="100%"
          maxW={{ base: '100%', lg: '480px' }}
          borderRadius="xl"
          overflow="hidden"
          boxShadow="lg"
          aspectRatio="16/9"
        >
          <iframe
            src={TUTORIAL_EMBED_URL}
            title="YouTube video player"
            style={{ width: '100%', height: '100%', border: 'none' }}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </Box>
      </Flex>
    </Box>
  );
}
