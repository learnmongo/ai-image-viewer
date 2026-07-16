import { Box, Flex } from '@chakra-ui/react';
import { HowItsBuiltContent } from './HowItsBuiltContent';
import { TableOfContents, TocItem } from './TableOfContents';

const TOC_ITEMS: TocItem[] = [
  { id: 'start-here', label: 'Start here' },
  { id: 'what-youll-build', label: "What you'll build" },
  { id: 'architecture', label: 'Architecture' },
  { id: 'why-its-built', label: "Why it's built this way" },
  { id: 'repo-guide', label: 'Repository guide' },
  { id: 'video-guide', label: 'Video guide' },
  { id: 'go-deeper', label: 'Go deeper' },
  { id: 'where-next', label: 'Where to go next' },
];

const PAGE_BACKGROUND =
  'linear-gradient(155deg, #04060a 0%, #0a0f18 28%, #0d1524 52%, #080c14 78%, #05070c 100%)';

export function HowItsBuiltPage() {
  return (
    <Box
      minH="100vh"
      bg={PAGE_BACKGROUND}
      color="white"
      px={{ base: 3, md: 6, lg: 8 }}
      pt={{ base: 5, md: 6 }}
      pb={{ base: 8, md: 12 }}
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          'radial-gradient(ellipse 80% 60% at 15% 40%, rgba(30, 41, 59, 0.45) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 88% 75%, rgba(15, 23, 42, 0.4) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <Flex
        position="relative"
        zIndex={1}
        maxW="1100px"
        mx="auto"
        gap={{ base: 0, lg: 10 }}
        align="flex-start"
        direction={{ base: 'column', lg: 'row' }}
      >
        <TableOfContents items={TOC_ITEMS} />
        <Box flex={1} minW={0} maxW={{ lg: '720px' }}>
          <HowItsBuiltContent />
        </Box>
      </Flex>
    </Box>
  );
}
